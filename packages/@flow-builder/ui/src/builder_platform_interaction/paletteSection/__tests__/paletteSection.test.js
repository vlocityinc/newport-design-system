import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { PaletteSectionToggleEvent } from "builder_platform_interaction/events";
import PaletteSection from "builder_platform_interaction/paletteSection";
import { LABELS } from "../paletteSectionLabels";

const createComponentUnderTest = (sectionKey, label, expanded, itemCount, detailsButton, showItemCount) => {
    const el = createElement('builder_platform_interaction-palette-section', {
        is: PaletteSection
    });
    el.sectionKey = sectionKey;
    el.label = label;
    el.expanded = expanded;
    el.itemCount = itemCount;
    el.detailsButton = detailsButton;
    el.showItemCount = showItemCount;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    chevron: 'lightning-button-icon',
    labelCell: 'th',
    spacerCell: 'td',
    text: 'div.slds-truncate'
};

function verifySectionToggle(paletteSection, selector) {
    const sectionKey = paletteSection.sectionKey;
    const expanded = paletteSection.expanded;

    const eventCallback = jest.fn();
    paletteSection.addEventListener(PaletteSectionToggleEvent.EVENT_NAME, eventCallback);
    const el = getShadowRoot(paletteSection).querySelector(selector);
    el.click();

    expect(eventCallback).toHaveBeenCalled();
    expect(eventCallback.mock.calls[0][0]).toMatchObject({
        detail: {
            sectionKey,
            expanded: !expanded
        }
    });
}

describe('PaletteSection', () => {
    const sectionKey = 'mySectionKey';
    const label = 'myLabel';

    describe('text', () => {
        const itemCount = 3;

        it('displays the item count in the text when showItemCount is enabled', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, true, itemCount, true, 'true');
            return Promise.resolve().then(() => {
                const el = getShadowRoot(paletteSection).querySelector(selectors.text);
                expect(el.textContent).toEqual(expect.stringContaining(itemCount.toString()));
            });
        });

        it('does not display the item count in the text when showItemCount is disabled', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, true, itemCount, true, 'false');
            return Promise.resolve().then(() => {
                const el = getShadowRoot(paletteSection).querySelector(selectors.text);
                expect(el.textContent).toMatch(label);
            });
        });
    });

    describe('chevron alternative-text', () => {
        it('has collapse alternative text for the chevron when expanded', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, true);
            return Promise.resolve().then(() => {
                const el = getShadowRoot(paletteSection).querySelector(selectors.chevron);
                expect(el.alternativeText).toEqual(expect.stringContaining(LABELS.palleteSectionToggleCollapseText));
            });
        });

        it('has expand alternative text for the chevron when collapsed', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, false);
            return Promise.resolve().then(() => {
                const el = getShadowRoot(paletteSection).querySelector(selectors.chevron);
                expect(el.alternativeText).toEqual(expect.stringContaining(LABELS.palleteSectionToggleExpandText));
            });
        });
    });

    describe('section toggle', () => {
        it('fires the PaletteSectionToggleEvent to collapse the section when the chevron is clicked', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, true);
            return Promise.resolve().then(() => {
                verifySectionToggle(paletteSection, selectors.labelCell);
            });
        });

        it('fires the PaletteSectionToggleEvent to expand the section when the chevron is clicked', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, false);
            return Promise.resolve().then(() => {
                verifySectionToggle(paletteSection, selectors.labelCell);
            });
        });

        it('fires the PaletteSectionToggleEvent to collapse the section when the spacer cell is clicked', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, true, 1, true);
            return Promise.resolve().then(() => {
                verifySectionToggle(paletteSection, selectors.spacerCell);
            });
        });

        it('fires the PaletteSectionToggleEvent to expand the section when the spacer cell is clicked', () => {
            const paletteSection = createComponentUnderTest(sectionKey, label, false, 1, true);
            return Promise.resolve().then(() => {
                verifySectionToggle(paletteSection, selectors.spacerCell);
            });
        });
    });
});