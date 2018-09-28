import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { PaletteItemChevronClickedEvent } from 'builder_platform_interaction/events';
import Palette from 'builder_platform_interaction/palette';
import { LABELS } from '../paletteLabels';

const createComponentUnderTest = (data, detailsButton) => {
    const el = createElement('builder_platform_interaction-palette', {
        is: Palette
    });
    el.data = data;
    el.detailsButton = detailsButton;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    chevron: 'lightning-button-icon',
    row: 'tr',
    text: 'div.slds-truncate'
};

// TODO: Later on we may expose an attribute that lets us specify which
// sections are initially collapsed. When we have that we should be able to
// separate collapse and expand tests.
const verifyToggle = (palette, selector) => {
    const toggle = getShadowRoot(palette).querySelector(selector);

    // Collapses the first section.
    toggle.click();
    return Promise.resolve().then(() => {
        let rows = getShadowRoot(palette).querySelectorAll('tr');
        expect(rows).toHaveLength(1);

        // Expands the first section.
        toggle.click();
        return Promise.resolve().then(() => {
            rows = getShadowRoot(palette).querySelectorAll('tr');
            expect(rows).toHaveLength(3);
        });
    });
};

describe('Palette', () => {
    describe('section toggle', () => {
        const ELEMENT_DATA = [
            {
                "guid": "myGuid1",
                "label": "myLabel",
                "_children": [
                    {
                        "elementType": "Variable",
                        "guid": "myGuid2",
                        "label": "myLabel",
                        "iconName": "myIconName"
                    },
                    {
                        "elementType": "Variable",
                        "guid": "myGuid3",
                        "label": "myLabel",
                        "iconName": "myIconName"
                    }
                ]
            }
        ];

        // TODO: Temporary assertion count until we can initialize sections as
        // collapsed.
        beforeEach(() => {
            expect.assertions(2);
        });

        it('collapses an expands a palette section using the chevron', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA);
            verifyToggle(palette, selectors.chevron);
        });

        it('collapses and expands a palette section by clicking the section text', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA);
            verifyToggle(palette, selectors.text);
        });

        it('collapses and expands a palette section by clicking on the row', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA);
            verifyToggle(palette, selectors.row);
        });
    });

    describe('resource details', () => {
        const ELEMENT_DATA = [
            {
                "elementType": "Variable",
                "guid": "myGuid1",
                "label": "myLabel",
                "iconName": "myIconName"
            }
        ];

        it('checks that there is no chevron button when detailsButton is false', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA);
            return Promise.resolve().then(() => {
                const chevron = getShadowRoot(palette).querySelector(selectors.chevron);
                expect(chevron).toBeNull();
            });
        });

        it('checks that there is a chevron button when detailsButton is true', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA, "true");
            return Promise.resolve().then(() => {
                const chevron = getShadowRoot(palette).querySelector(selectors.chevron);
                expect(chevron).not.toBeNull();
                expect(chevron.iconName).toEqual('utility:chevronright');
                expect(chevron.alternativeText).toEqual(LABELS.detailsText);
            });
        });

        it('clicks the chevron to dispatch a PaletteItemChevronClickedEvent with the guid and iconName', () => {
            const palette = createComponentUnderTest(ELEMENT_DATA, "true");
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                palette.addEventListener(PaletteItemChevronClickedEvent.EVENT_NAME, eventCallback);
                const chevron = getShadowRoot(palette).querySelector(selectors.chevron);
                chevron.click();

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        elementGUID: ELEMENT_DATA[0].guid,
                        iconName: ELEMENT_DATA[0].iconName
                    }
                });
            });
        });
    });
});