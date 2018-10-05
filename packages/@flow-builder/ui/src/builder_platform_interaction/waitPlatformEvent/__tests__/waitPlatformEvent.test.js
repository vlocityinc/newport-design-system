import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitPlatformEvent from '../waitPlatformEvent';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';

const SELECTORS = {
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    PARAMETER_ITEM: 'builder_platform_interaction-parameter-item',
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-wait-platform-event', {
        is: WaitPlatformEvent,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

describe('wait-platform-event', () => {
    it('shows parameter output only after platform event is populated', () => {
        const waitPlatformEventElement = setupComponentUnderTest();
        const eventTypePicker = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
        const parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);

        // output parameter item is not present initially
        expect(parameterItem).toBeNull();

        const itemPayload = { value: 'foo' };
        eventTypePicker.dispatchEvent(new ComboboxStateChangedEvent(itemPayload));
        return Promise.resolve().then(() => {
            expect(parameterItem).toBeDefined();
        });
    });
});