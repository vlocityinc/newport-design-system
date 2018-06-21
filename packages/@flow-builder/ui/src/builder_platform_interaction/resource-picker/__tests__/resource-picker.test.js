import ResourcePicker from '../resource-picker';
import { createElement } from 'engine';
import { getRulesForContext, getRHSTypes, PARAM_PROPERTY } from 'builder_platform_interaction-rule-lib';
import {
    getElementsForMenuData,
    filterMatches,
    getEntitiesMenuData,
    RESOURCE_PICKER_MODE,
} from 'builder_platform_interaction-expression-utils';
import { ComboboxStateChangedEvent, FilterMatchesEvent } from 'builder_platform_interaction-events';

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-resource-picker', {
        is: ResourcePicker,
    });

    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const selectors = {
    COMBOBOX: 'builder_platform_interaction-combobox',
};

const ferovMenuData = ['ferovMenuData'];
const entityMenuData = [{items: [{value:'entityMenuData', displayText: 'entity menu data'}]}];
const filteredMenuData = ['filteredMenuData'];

const { DATA_TYPE, IS_COLLECTION, ELEMENT_TYPE } = PARAM_PROPERTY;

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction-rule-lib').PARAM_PROPERTY,
        getRulesForContext: jest.fn().mockReturnValue([]).mockName('getRulesForContext'),
        getRHSTypes: jest.fn().mockReturnValue({}).mockName('getRHSTypes')
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        RESOURCE_PICKER_MODE: require.requireActual('builder_platform_interaction-expression-utils').RESOURCE_PICKER_MODE,
        getElementsForMenuData: jest.fn().mockReturnValue(['ferovMenuData']).mockName('getElementsForMenuData'),
        getEntitiesMenuData: jest.fn().mockReturnValue([{items: [{value:'entityMenuData', displayText: 'entity menu data'}]}]).mockName('getEntitiesMenuData'),
        filterMatches: jest.fn().mockReturnValue(['filteredMenuData']).mockName('filterMatches'),
    };
});

describe('resource-picker', () => {
    it('contains one inner flow combobox', () => {
        const resourcePicker = setupComponentUnderTest();
        return Promise.resolve().then(() => {
            const flowCombobox = resourcePicker.querySelector(selectors.COMBOBOX);
            expect(flowCombobox).toBeDefined();
        });
    });

    it('does not populate menu data without a mode', () => {
        setupComponentUnderTest();
        return Promise.resolve().then(() => {
            expect(getRulesForContext).not.toHaveBeenCalled();
            expect(getEntitiesMenuData).not.toHaveBeenCalled();
        });
    });

    describe('ferov mode', () => {
        const props = {
            mode: RESOURCE_PICKER_MODE.FEROV_MODE,
            elementType: 'Variable',
            elementDataType: 'Number',
            elementIsCollection: false,
        };

        let elemParam = {};

        const ferovMenuDataAssertions = (times) => {
            expect(getRulesForContext).toHaveBeenCalledTimes(times);
            expect(getRulesForContext).toHaveBeenLastCalledWith({elementType: elemParam[ELEMENT_TYPE]});
            expect(getRHSTypes).toHaveBeenCalledTimes(times);
            expect(getRHSTypes).toHaveBeenLastCalledWith(elemParam[ELEMENT_TYPE], elemParam, 'Assign', expect.any(Array));
            expect(getElementsForMenuData).toHaveBeenCalledTimes(times);
            expect(getElementsForMenuData).toHaveBeenLastCalledWith({elementType: elemParam[ELEMENT_TYPE]}, expect.any(Object), false);
        };

        beforeEach(() => {
            elemParam = {
                [DATA_TYPE]: props.elementDataType,
                [IS_COLLECTION]: props.elementIsCollection,
                [ELEMENT_TYPE]: props.elementType,
            };
        });

        it('uses rule service and expression utils to retrieve ferov data', () => {
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                ferovMenuDataAssertions(1);
            });
        });

        it('populates combobox with ferov data when in ferov mode', () => {
            const resourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const flowCombobox = resourcePicker.querySelector(selectors.COMBOBOX);
                expect(flowCombobox.menuData).toEqual(ferovMenuData);
            });
        });

        it('re-populates menu data when changing element data type', () => {
            const resourcePicker = setupComponentUnderTest(props);
            resourcePicker.elementDataType = 'String';
            elemParam[DATA_TYPE] = 'String';
            return Promise.resolve().then(() => {
                ferovMenuDataAssertions(2);
            });
        });

        it('re-populates menu data when changing element is collection', () => {
            const resourcePicker = setupComponentUnderTest(props);
            resourcePicker.elementIsCollection = true;
            elemParam[IS_COLLECTION] = true;
            return Promise.resolve().then(() => {
                ferovMenuDataAssertions(2);
            });
        });

        it('re-populates menu data when changing element type', () => {
            const resourcePicker = setupComponentUnderTest(props);
            resourcePicker.elementType = 'RecordCreate';
            elemParam[ELEMENT_TYPE] = 'RecordCreate';
            return Promise.resolve().then(() => {
                ferovMenuDataAssertions(2);
            });
        });
    });

    describe('entity mode', () => {
        const props = {
            mode: RESOURCE_PICKER_MODE.ENTITY_MODE,
            crudFilterType: 'TEST_FILTER',
        };
        it('uses expression utils to retrieve entity data', () => {
            setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                expect(getEntitiesMenuData).toHaveBeenCalledTimes(1);
                expect(getEntitiesMenuData).toHaveBeenCalledWith(props.crudFilterType);
            });
        });

        it('populates combobox with entity data when in entity mode', () => {
            const resourcePicker = setupComponentUnderTest(props);
            return Promise.resolve().then(() => {
                const flowCombobox = resourcePicker.querySelector(selectors.COMBOBOX);
                expect(flowCombobox.menuData).toEqual(entityMenuData);
            });
        });
    });

    describe('event handlers', () => {
        it('handles the filter menu data event', () => {
            const resourcePicker = setupComponentUnderTest({mode: RESOURCE_PICKER_MODE.ENTITY_MODE});
            const flowCombobox = resourcePicker.querySelector(selectors.COMBOBOX);
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue'));
            return Promise.resolve().then(() => {
                expect(filterMatches).toHaveBeenCalled();
                expect(flowCombobox.menuData).toEqual(filteredMenuData);
            });
        });

        it('handles the combobox value changed event', () => {
            const resourcePicker = setupComponentUnderTest({mode: RESOURCE_PICKER_MODE.ENTITY_MODE, initialItem: 'entityMenuData'});
            const flowCombobox = resourcePicker.querySelector(selectors.COMBOBOX);
            flowCombobox.dispatchEvent(new ComboboxStateChangedEvent({value: 'someValue', displayText: 'someValue'}));
            return Promise.resolve().then(() => {
                expect(flowCombobox.value).toEqual({value: 'someValue', displayText: 'someValue'});
            });
        });
    });
});