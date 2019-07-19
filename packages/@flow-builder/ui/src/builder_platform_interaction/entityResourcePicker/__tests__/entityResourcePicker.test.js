import { createElement } from 'lwc';
import {
    apexClassesMenuDataSelector,
    getEntitiesMenuData,
    getEventTypesMenuData
} from 'builder_platform_interaction/expressionUtils';
import {
    ComboboxStateChangedEvent,
    ItemSelectedEvent
} from 'builder_platform_interaction/events';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker/';
import EntityResourcePicker from '../entityResourcePicker';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/baseResourcePicker', () =>
    require('../../../../jest-modules/builder_platform_interaction/baseResourcePicker/baseResourcePicker.js')
);

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const setupComponentUnderTest = props => {
    const element = createElement(
        'builder_platform_interaction-entity-resource-picker',
        {
            is: EntityResourcePicker
        }
    );

    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const apexClassMenuData = [
    { value: 'apexClassMenuData', displayText: 'entity menu data' },
    { value: 'testValue', displayText: 'test display text' }
];
const entityMenuData = [
    { value: 'entityMenuData', displayText: 'entity menu data' },
    { value: 'testValue', displayText: 'test display text' }
];
const eventTypesMenuData = [
    { value: 'PlatformEvent1', displayText: 'platform event 1' },
    { value: 'testValue', displayText: 'test display text' }
];

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        apexClassesMenuDataSelector: jest.fn(),
        getEntitiesMenuData: jest.fn(),
        getEventTypesMenuData: jest.fn()
    };
});


describe('entity-resource-picker', () => {
    let props;

    beforeEach(() => {
        props = {
            crudFilterType: 'TEST_FILTER',
            comboboxConfig: {}
        };
        getEntitiesMenuData.mockReturnValueOnce(entityMenuData);
    });

    it('contains one base resource picker', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            expect(baseResourcePicker).toBeDefined();
        });
    });

    it('retrieves entity menu data on initial load', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );
        return Promise.resolve().then(() => {
            expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
            expect(getEntitiesMenuData).toHaveBeenCalledWith(
                props.crudFilterType
            );
            expect(baseResourcePicker.fullMenuData).toEqual(entityMenuData);
            expect(getEventTypesMenuData).not.toHaveBeenCalled();
        });
    });

    it('retrieves entity menu data when changing crud filter type', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const newFilter = 'NEW_FILTER';
        Object.assign(entityResourcePicker, { crudFilterType: newFilter });
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
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            expect(baseResourcePicker.comboboxConfig).toEqual(
                props.comboboxConfig
            );
        });
    });

    it('sets the error through the combobox config', () => {
        props.comboboxConfig = { errorMessage: 'fooError' };
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            expect(baseResourcePicker.errorMessage).toEqual(
                props.comboboxConfig.errorMessage
            );
        });
    });

    it('sets the value of the base resource picker as a string', () => {
        props.value = entityMenuData[1].value;
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            expect(baseResourcePicker.value.displayText).toEqual(
                entityMenuData[1].displayText
            );
        });
    });

    it('sets the value of the base resource picker as an item', () => {
        props.value = entityMenuData[1];
        const entityResourcePicker = setupComponentUnderTest(props);
        return Promise.resolve().then(() => {
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                BaseResourcePicker.SELECTOR
            );
            expect(baseResourcePicker.value).toEqual(props.value);
        });
    });

    it('handles onitemselected event and changes value to event payload', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(new ItemSelectedEvent(itemPayload));
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(itemPayload);
        });
    });

    it('handles comboboxstatechanged event and changes value to event payload with item', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(
            new ComboboxStateChangedEvent(itemPayload)
        );
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(itemPayload);
        });
    });

    it('handles comboboxstatechanged event and changes value to event payload with displayText', () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );

        const displayText = 'foo';
        baseResourcePicker.dispatchEvent(
            new ComboboxStateChangedEvent(undefined, displayText)
        );
        return Promise.resolve().then(() => {
            expect(entityResourcePicker.value).toEqual(displayText);
        });
    });

    it('retrieves event type menu data on initial load', () => {
        getEventTypesMenuData.mockReturnValueOnce(eventTypesMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.EVENT;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );
        return Promise.resolve().then(() => {
            expect(getEventTypesMenuData).toHaveBeenCalledTimes(1);
            expect(getEntitiesMenuData).not.toHaveBeenCalled();
            expect(apexClassesMenuDataSelector).not.toHaveBeenCalled();
            expect(baseResourcePicker.fullMenuData).toEqual(eventTypesMenuData);
        });
    });

    it('retrieves apex type menu data on initial load', () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );
        return Promise.resolve().then(() => {
            expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
            expect(getEntitiesMenuData).not.toHaveBeenCalled();
            expect(getEventTypesMenuData).not.toHaveBeenCalled();
            expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
        });
    });

    it('retrieves new set of menu data when mode changes', () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );
        return Promise.resolve().then(() => {
            expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
            expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
            entityResourcePicker.mode =
                EntityResourcePicker.ENTITY_MODE.SOBJECT;
            return Promise.resolve().then(() => {
                expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
                expect(baseResourcePicker.fullMenuData).toEqual(entityMenuData);
            });
        });
    });

    it('displays spinner while apex types menu data is loading and then hides it once menu data is available', () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(undefined);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
            BaseResourcePicker.SELECTOR
        );
        return Promise.resolve().then(() => {
            expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
            expect(baseResourcePicker.showActivityIndicator).toEqual(true);
            expect(baseResourcePicker.fullMenuData).toEqual([]);
            apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
            const listeners = Store.getListeners();
            listeners[0]();
            return Promise.resolve().then(() => {
                expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(2);
                expect(baseResourcePicker.showActivityIndicator).toEqual(false);
                expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
            });
        });
    });
});
