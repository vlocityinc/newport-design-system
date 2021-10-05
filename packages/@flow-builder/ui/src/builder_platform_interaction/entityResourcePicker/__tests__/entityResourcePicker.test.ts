// @ts-nocheck
import { createElement } from 'lwc';
import {
    apexClassesMenuDataSelector,
    getEntitiesMenuData,
    getEventTypesMenuDataRunTime,
    getEventTypesMenuDataManagedSetup
} from 'builder_platform_interaction/expressionUtils';
import { ComboboxStateChangedEvent, ItemSelectedEvent } from 'builder_platform_interaction/events';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import EntityResourcePicker from '../entityResourcePicker';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/baseResourcePicker', () =>
    require('builder_platform_interaction_mocks/baseResourcePicker')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const setupComponentUnderTest = (...props) => {
    const element = createElement('builder_platform_interaction-entity-resource-picker', {
        is: EntityResourcePicker
    });

    Object.assign(element, ...props);
    setDocumentBodyChildren(element);
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
        getEventTypesMenuDataRunTime: jest.fn(),
        getEventTypesMenuDataManagedSetup: jest.fn()
    };
});

describe('entity-resource-picker', () => {
    let props;
    beforeEach(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        props = {
            crudFilterType: 'TEST_FILTER',
            comboboxConfig: {}
        };
        getEntitiesMenuData.mockReturnValueOnce(entityMenuData);
    });
    afterEach(() => {
        Store.resetStore();
    });
    it('contains one base resource picker', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker).toBeDefined();
    });

    it('retrieves entity menu data on initial load', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(1);
        expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
        expect(getEntitiesMenuData).toHaveBeenCalledWith(props.crudFilterType);
        expect(baseResourcePicker.fullMenuData).toEqual(entityMenuData);
        expect(getEventTypesMenuDataRunTime).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataManagedSetup).not.toHaveBeenCalled();
    });

    it('retrieves entity menu data when changing crud filter type', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const newFilter = 'NEW_FILTER';
        Object.assign(entityResourcePicker, { crudFilterType: newFilter });
        await ticks(1);
        expect(getEntitiesMenuData).toHaveBeenCalledTimes(2);
        expect(getEntitiesMenuData).toHaveBeenCalledWith(newFilter);
        expect(getEventTypesMenuDataRunTime).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataManagedSetup).not.toHaveBeenCalled();
    });

    it('sets the value to the existing display text on initial load when it cannot be found in menu data', async () => {
        props.value = 'some object user does not have acess to';
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        expect(entityResourcePicker.value).toEqual(props.value);
    });

    it('sets the combobox config object of the base resource picker', async () => {
        props.comboboxConfig = {
            label: 'test label'
        };
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig).toEqual(props.comboboxConfig);
    });

    it('sets the error through the combobox config', async () => {
        props.comboboxConfig = { errorMessage: 'fooError' };
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.errorMessage).toEqual(props.comboboxConfig.errorMessage);
    });

    it('sets the value of the base resource picker as a string', async () => {
        props.value = entityMenuData[1].value;
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.value.displayText).toEqual(entityMenuData[1].displayText);
    });

    it('sets the value of the base resource picker as an item', async () => {
        props.value = entityMenuData[1];
        const entityResourcePicker = setupComponentUnderTest(props);
        await ticks(1);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.value).toEqual(props.value);
    });

    it('handles onitemselected event and changes value to event payload', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(new ItemSelectedEvent(itemPayload));
        await ticks(1);
        expect(entityResourcePicker.value).toEqual(itemPayload);
    });

    it('handles comboboxstatechanged event and changes value to event payload with item', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);

        const itemPayload = { value: 'foo' };
        baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(itemPayload));
        await ticks(1);
        expect(entityResourcePicker.value).toEqual(itemPayload);
    });

    it('handles comboboxstatechanged event and changes value to event payload with displayText', async () => {
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);

        const displayText = 'foo';
        baseResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(undefined, displayText));
        await ticks(1);
        expect(entityResourcePicker.value).toEqual(displayText);
    });

    it('retrieves event runtime menu data on initial load', async () => {
        getEventTypesMenuDataRunTime.mockReturnValueOnce(eventTypesMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.EVENT;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(1);
        expect(getEventTypesMenuDataRunTime).toHaveBeenCalledTimes(1);
        expect(getEntitiesMenuData).not.toHaveBeenCalled();
        expect(apexClassesMenuDataSelector).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataManagedSetup).not.toHaveBeenCalled();
        expect(baseResourcePicker.fullMenuData).toEqual(eventTypesMenuData);
    });

    it('retrieves event managed setup menu data on initial load', async () => {
        getEventTypesMenuDataManagedSetup.mockReturnValueOnce(eventTypesMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.MANAGED_SETUP_EVENT;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(1);
        expect(getEventTypesMenuDataManagedSetup).toHaveBeenCalledTimes(1);
        expect(getEntitiesMenuData).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataRunTime).not.toHaveBeenCalled();
        expect(apexClassesMenuDataSelector).not.toHaveBeenCalled();
        expect(baseResourcePicker.fullMenuData).toEqual(eventTypesMenuData);
    });

    it('retrieves apex type menu data on initial load', async () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(1);
        expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
        expect(getEntitiesMenuData).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataRunTime).not.toHaveBeenCalled();
        expect(getEventTypesMenuDataManagedSetup).not.toHaveBeenCalled();
        expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
    });

    it('retrieves new set of menu data when mode changes', async () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(2);
        expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
        expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
        entityResourcePicker.mode = EntityResourcePicker.ENTITY_MODE.SOBJECT;
        await ticks(1);
        expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
        expect(baseResourcePicker.fullMenuData).toEqual(entityMenuData);
    });

    it('displays spinner while apex types menu data is loading and then hides it once menu data is available', async () => {
        apexClassesMenuDataSelector.mockReturnValueOnce(undefined);
        props.mode = EntityResourcePicker.ENTITY_MODE.APEX;
        const entityResourcePicker = setupComponentUnderTest(props);
        const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        await ticks(2);
        expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(1);
        expect(baseResourcePicker.showActivityIndicator).toEqual(true);
        expect(baseResourcePicker.fullMenuData).toEqual([]);
        apexClassesMenuDataSelector.mockReturnValueOnce(apexClassMenuData);
        const listeners = Store.getListeners();
        listeners[0]();
        await ticks(1);
        expect(apexClassesMenuDataSelector).toHaveBeenCalledTimes(2);
        expect(baseResourcePicker.showActivityIndicator).toEqual(false);
        expect(baseResourcePicker.fullMenuData).toEqual(apexClassMenuData);
    });

    describe('default placeholder text for mode', () => {
        beforeEach(() => {
            apexClassesMenuDataSelector.mockReturnValueOnce(undefined);
        });
        it('uses apex type detault placeholder text when in the apex mode', async () => {
            const entityResourcePicker = setupComponentUnderTest(props, {
                mode: EntityResourcePicker.ENTITY_MODE.APEX
            });
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            await ticks(1);
            expect(baseResourcePicker.placeholder).toEqual('FlowBuilderVariableConstantEditor.apexPickerPlaceholder');
        });
        it('uses apex types detault placeholder text when in the sobject mode', async () => {
            const entityResourcePicker = setupComponentUnderTest(props, {
                mode: EntityResourcePicker.ENTITY_MODE.SOBJECT
            });
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            await ticks(1);
            expect(baseResourcePicker.placeholder).toEqual('FlowBuilderRecordEditor.objectPlaceholder');
        });
        it('uses event typs detault placeholder text when in the event mode', async () => {
            const entityResourcePicker = setupComponentUnderTest(props, {
                mode: EntityResourcePicker.ENTITY_MODE.EVENT
            });
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            await ticks(1);
            expect(baseResourcePicker.placeholder).toEqual('FlowBuilderWaitEditor.selectEventLabel');
        });
        it("uses config's placehoder text, if supplied", async () => {
            const entityResourcePicker = setupComponentUnderTest(props, {
                mode: EntityResourcePicker.ENTITY_MODE.EVENT,
                comboboxConfig: {
                    placeholder: 'abc'
                }
            });
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
            await ticks(1);
            expect(baseResourcePicker.placeholder).toEqual('abc');
        });
    });

    describe('ui', () => {
        it('should focus on base-resource-picker when the entity-resource-picker calls focus', () => {
            const entityResourcePicker = setupComponentUnderTest(props);
            const baseResourcePicker = entityResourcePicker.shadowRoot.querySelector(
                'builder_platform_interaction-base-resource-picker'
            );
            baseResourcePicker.focus = jest.fn();

            entityResourcePicker.focus();
            expect(baseResourcePicker.focus).toHaveBeenCalled();
        });
    });
});
