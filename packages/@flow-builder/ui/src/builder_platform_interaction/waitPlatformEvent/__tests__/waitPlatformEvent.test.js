import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitPlatformEvent from '../waitPlatformEvent';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

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
        let parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);

        // output parameter item is not present initially
        expect(parameterItem).toBeNull();

        const itemPayload = { objectType: 'foo__e' };
        eventTypePicker.dispatchEvent(new ComboboxStateChangedEvent(itemPayload));
        return Promise.resolve().then(() => {
            parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);
            expect(parameterItem).toBeTruthy();
            expect(parameterItem.item).toBeTruthy();
            expect(parameterItem.item.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
            expect(parameterItem.item.objectType).toBe('foo__e');
            expect(parameterItem.elementType).toBe(ELEMENT_TYPE.WAIT);
        });
    });
});
