import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { getEntitiesMenuData, getEventTypesMenuData } from 'builder_platform_interaction/expressionUtils';
import { ComboboxStateChangedEvent, ItemSelectedEvent } from 'builder_platform_interaction/events';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import EntityResourcePicker from '../entityResourcePicker';

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-entity-resource-picker', {
        is: EntityResourcePicker,
    });

    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const entityMenuData = [{value:'entityMenuData', displayText: 'entity menu data'}, {value: 'testValue', displayText: 'test display text'}];
const eventTypesMenuData = [{value:'PlatformEvent1', displayText: 'platform event 1'}, {value: 'testValue', displayText: 'test display text'}];

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getEntitiesMenuData: jest.fn(),
        getEventTypesMenuData: jest.fn(),
    };
});

describe('entity-resource-picker', () => {
    let props;

    beforeEach(() => {
        props = {
            crudFilterType: 'TEST_FILTER',
            comboboxConfig: {},
        };
        getEntitiesMenuData.mockReturnValueOnce(entityMenuData);
    });

    it('contains one base resource picker', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker).toBeDefined();
        });
    });

    it('retrieves entity menu data on initial load', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
        return Promise.resolve().then(() => {
            expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
            expect(getEntitiesMenuData).toHaveBeenCalledWith(props.crudFilterType);
            expect(baseResourcePicker.fullMenuData).toEqual(entityMenuData);
            expect(getEventTypesMenuData).not.toHaveBeenCalled();
        });
    });

    it('retrieves entity menu data when changing crud filter type', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const newFilter = 'NEW_FILTER';
        Object.assign(entityResourcePicker, { crudFilterType: newFilter});
        return Promise.resolve().then(() => {
            expect(getEntitiesMenuData).toHaveBeenCalledTimes(2);
            expect(getEntitiesMenuData).toHaveBeenCalledWith(newFilter);
            expect(getEventTypesMenuData).not.toHaveBeenCalled();
        });
    });

    it('sets the value to the existing display text on initial load when it cannot be found in menu data', () => {
        props.value = 'some object user does not have acess to';
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(props.value);
        });
    });

    it('sets the combobox config object of the base resource picker', () => {
        props.comboboxConfig = {
            label: 'test label'
        };
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
        });
    });

    it('sets the error through the combobox config', () => {
        props.comboboxConfig = { errorMessage: 'fooError' };
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.errorMessage).toEqual(props.comboboxConfig.errorMessage);
        });
    });

    it('sets the value of the base resource picker as a string', () => {
        props.value = entityMenuData[1].value;
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.value.displayText).toEqual(entityMenuData[1].displayText);
        });
    });

    it('sets the value of the base resource picker as an item', () => {
        props.value = entityMenuData[1];
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });

    it('handles onitemselected event and changes value to event payload', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(new ItemSelectedEvent(itemPayload));
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(itemPayload);
        });
    });

    it('handles comboboxstatechanged event and changes value to event payload with item', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(itemPayload));
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(itemPayload);
        });
    });

    it('handles comboboxstatechanged event and changes value to event payload with displayText', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);

        const displayText = 'foo';
        baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(undefined, displayText));
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(displayText);
        });
    });

    it('retrieves event type menu data on initial load', () => {
        getEventTypesMenuData.mockReturnValueOnce(eventTypesMenuData);
        props.isEventMode = true;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = getShadowRoot(entityResourcePicker).querySelector(BaseResourcePicker.SELECTOR);
        return Promise.resolve().then(() => {
            expect(getEventTypesMenuData).toHaveBeenCalledTimes(1);
            expect(getEntitiesMenuData).not.toHaveBeenCalled();
            expect(baseResourcePicker.fullMenuData).toEqual(eventTypesMenuData);
        });
    });
});