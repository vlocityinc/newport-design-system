// @ts-nocheck
import { createComponent, ticks } from 'builder_platform_interaction/builderTestUtils';
import { MOCK_ELEMENT_PALETTE_ITEM, MOCK_ELEMENT_PALETTE_ITEM_2, MOCK_RESOURCE_PALETTE_ITEM } from 'mock/paletteData';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const DEFAULT_OPTIONS = {
    data: [MOCK_ELEMENT_PALETTE_ITEM, MOCK_RESOURCE_PALETTE_ITEM],
    detailsButton: false,
    showLocatorIcon: false,
    itemsDraggable: true
};

const createComponentUnderTest = async (overrideOptions) =>
    createComponent('builder_platform_interaction-palette', DEFAULT_OPTIONS, overrideOptions);

const selectors = {
    paletteSection: 'builder_platform_interaction-palette-section',
    accordion: 'lightning-accordion',
    accordionSection: 'lightning-accordion-section'
};

function verifySection(accordionSection, expected) {
    expect(accordionSection.label).toEqual(expected.label);

    const paletteSection = accordionSection.querySelector(selectors.paletteSection);
    expect(paletteSection).not.toBeNull();

    expect(paletteSection.section).toEqual(expected);
}

function getActiveSections(palette) {
    return palette.shadowRoot.querySelector(selectors.accordion).activeSectionName;
}

describe('Palette', () => {
    let palette;

    beforeEach(async () => {
        palette = await createComponentUnderTest();
    });

    it('all sections are opened initially', () => {
        expect(getActiveSections(palette)).toHaveLength(2);
    });

    it('new sections are opened by default', async () => {
        palette.data = [MOCK_ELEMENT_PALETTE_ITEM, MOCK_RESOURCE_PALETTE_ITEM, MOCK_ELEMENT_PALETTE_ITEM_2];
        await ticks(1);
        expect(palette.shadowRoot.querySelector(selectors.accordion).activeSectionName).toEqual([
            'FlowBuilderElementConfig.screenPluralLabel',
            'FlowBuilderElementConfig.sObjectPluralLabel',
            'FlowBuilderElementConfig.decisionPluralLabel'
        ]);
    });

    it('has correct sections', () => {
        const accordionSections = palette.shadowRoot.querySelectorAll(selectors.accordionSection);
        expect(accordionSections).toHaveLength(2);

        verifySection(accordionSections[0], {
            ...MOCK_ELEMENT_PALETTE_ITEM,
            guid: 'FlowBuilderElementConfig.screenPluralLabel',
            label: 'FlowBuilderElementConfig.screenPluralLabel (1)'
        });

        verifySection(accordionSections[1], {
            ...MOCK_RESOURCE_PALETTE_ITEM,
            guid: 'FlowBuilderElementConfig.sObjectPluralLabel',
            label: 'FlowBuilderElementConfig.sObjectPluralLabel (2)'
        });
    });

    it('options are applied correctly', async () => {
        const options = {
            ...DEFAULT_OPTIONS,

            iconSize: 'small',
            detailsButton: true,
            showLocatorIcon: true,
            itemsDraggable: true
        };
        palette = await createComponentUnderTest(options);

        palette.shadowRoot.querySelectorAll(selectors.paletteSection).forEach((section) => {
            expect(section.iconSize).toEqual(options.iconSize);
            expect(section.itemsDraggable).toEqual(options.itemsDraggable);
            expect(section.detailsButton).toEqual(options.showResourceDetails);
            expect(section.showLocatorIcon).toEqual(options.enableLocator);
        });
    });

    it('section toggling', async () => {
        const accordion = palette.shadowRoot.querySelector(selectors.accordion);

        accordion.dispatchEvent(
            new CustomEvent('sectiontoggle', {
                detail: {
                    openSections: []
                }
            })
        );

        await ticks(1);
        expect(getActiveSections(palette)).toEqual([]);

        accordion.dispatchEvent(
            new CustomEvent('sectiontoggle', {
                detail: {
                    openSections: ['FlowBuilderElementConfig.sObjectPluralLabel']
                }
            })
        );

        await ticks(1);
        expect(getActiveSections(palette)).toEqual(['FlowBuilderElementConfig.sObjectPluralLabel']);
    });
});
