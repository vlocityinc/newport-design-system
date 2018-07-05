import { createElement } from 'engine';
import { PaletteItemChevronClickedEvent } from 'builder_platform_interaction-events';
import PaletteItem from 'builder_platform_interaction-palette-item';
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-palette-item', {
        is: PaletteItem
    });
    el.detailsButton = true;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningButtonIcon: 'lightning-button-icon'
};


const getRightChevronButtonIcon = (paletteItemComponent) => {
    const lightningButtonIcon = getShadowRoot(paletteItemComponent).querySelectorAll(selectors.lightningButtonIcon);
    return lightningButtonIcon[0];
};


describe('Palette-Item', () => {
    let recordPaletteItemComponent;
    let rightChevron;
    beforeEach(() => {
        recordPaletteItemComponent = createComponentUnderTest();
        rightChevron = getRightChevronButtonIcon(recordPaletteItemComponent);
    });

    it('checks the default rendering state of the right chevron', () => {
        return Promise.resolve().then(() => {
            expect(rightChevron.iconName).toEqual('utility:chevronright');
        });
    });

    it('when a resource is clicked should dispatch PaletteItemChevronClickedEvent with the element guid', () => {
        const eventCallback = jest.fn();
        recordPaletteItemComponent.addEventListener(PaletteItemChevronClickedEvent.EVENT_NAME, eventCallback);

        const paletteItemRightChevronClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', 'VARIABLE_1', 'LABEL', 'ICON_NAME', 'VARIABLE_DESCRIPTION');
        getShadowRoot(recordPaletteItemComponent).querySelector(selectors.lightningButtonIcon).dispatchEvent(paletteItemRightChevronClickedEvent);
        return Promise.resolve().then(() => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    elementType: 'VARIABLE',
                    elementGUID: 'VARIABLE_1',
                    label: 'LABEL',
                    iconName: 'ICON_NAME',
                    description: 'VARIABLE_DESCRIPTION'
                }
            });
        });
    });
});