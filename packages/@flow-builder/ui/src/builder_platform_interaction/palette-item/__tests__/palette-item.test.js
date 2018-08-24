import { createElement } from 'lwc';
import { PaletteItemChevronClickedEvent, PaletteItemClickedEvent } from 'builder_platform_interaction-events';
import PaletteItem from 'builder_platform_interaction-palette-item';
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from '../palette-item-labels';

const DESCRIPTION = 'myDescription';
const ELEMENT_TYPE = 'myElementType';
const GUID = 'myGuid';
const LABEL = 'myLabel';
const ICON_SIZE = 'myIconSize';

const createComponentUnderTest = (detailsButton, iconName) => {
    const el = createElement('builder_platform_interaction-palette-item', {
        is: PaletteItem
    });
    el.description = DESCRIPTION;
    el.elementType = ELEMENT_TYPE;
    el.guid = GUID;
    el.iconName = iconName;
    el.label = LABEL;
    el.iconSize = ICON_SIZE;
    el.detailsButton = detailsButton;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningButtonIcon: 'lightning-button-icon',
    lightningIcon: 'lightning-icon',
    link: 'a'
};


describe('PaletteItem', () => {
    describe('details button', () => {
        it('checks that there is no details button when detailsButton is false', () => {
            const paletteItem = createComponentUnderTest(false);
            return Promise.resolve().then(() => {
                const rightChevron = getShadowRoot(paletteItem).querySelector(selectors.lightningButtonIcon);
                expect(rightChevron).toBeNull();
            });
        });

        it('checks that there is a details button when detailsButton is true', () => {
            const paletteItem = createComponentUnderTest(true);
            return Promise.resolve().then(() => {
                const rightChevron = getShadowRoot(paletteItem).querySelector(selectors.lightningButtonIcon);
                expect(rightChevron).not.toBeNull();
                expect(rightChevron.iconName).toEqual('utility:chevronright');
                expect(rightChevron.alternativeText).toEqual(LABELS.detailsText);
            });
        });

        it('clicks the chevron to dispatch a PaletteItemChevronClickedEvent with the elementType, guid, label, iconName, and description', () => {
            const iconName = 'myIconName';
            const paletteItem = createComponentUnderTest(true, iconName);
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                paletteItem.addEventListener(PaletteItemChevronClickedEvent.EVENT_NAME, eventCallback);
                const chevron = getShadowRoot(paletteItem).querySelector(selectors.lightningButtonIcon);
                chevron.click();

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        elementType: ELEMENT_TYPE,
                        elementGUID: GUID,
                        label: LABEL,
                        iconName,
                        description: DESCRIPTION
                    }
                });
            });
        });
    });

    describe('link', () => {
        it('clicks the link to dispatch a PaletteItemClickedEvent with the elementType and guid', () => {
            const paletteItem = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                paletteItem.addEventListener(PaletteItemClickedEvent.EVENT_NAME, eventCallback);
                const link = getShadowRoot(paletteItem).querySelector(selectors.link);
                link.click();

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        elementType: ELEMENT_TYPE,
                        guid: GUID
                    }
                });
            });
        });
    });

    describe('icon', () => {
        it('does not show an icon when the iconName is undefined', () => {
            const paletteItem = createComponentUnderTest(true, undefined);
            return Promise.resolve().then(() => {
                const icon = getShadowRoot(paletteItem).querySelector(selectors.lightningIcon);
                expect(icon).toBeNull();
            });
        });

        it('does not show an icon when the iconName is null', () => {
            const paletteItem = createComponentUnderTest(true, null);
            return Promise.resolve().then(() => {
                const icon = getShadowRoot(paletteItem).querySelector(selectors.lightningIcon);
                expect(icon).toBeNull();
            });
        });

        it('does not show an icon when the iconName is empty', () => {
            const paletteItem = createComponentUnderTest(true, '');
            return Promise.resolve().then(() => {
                const icon = getShadowRoot(paletteItem).querySelector(selectors.lightningIcon);
                expect(icon).toBeNull();
            });
        });

        it('shows an icon when the iconName is non-empty', () => {
            const iconName = 'myIconName';
            const paletteItem = createComponentUnderTest(true, iconName);
            return Promise.resolve().then(() => {
                const icon = getShadowRoot(paletteItem).querySelector(selectors.lightningIcon);
                expect(icon).not.toBeNull();
                expect(icon.iconName).toEqual(iconName);
                expect(icon.size).toEqual(ICON_SIZE);
                expect(icon.alternativeText).toEqual(LABEL);
            });
        });
    });
});