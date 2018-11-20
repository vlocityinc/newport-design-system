import { getElementsForMenuData, getEntitiesMenuData, getStoreElements, filterAndMutateMenuData,
    getEventTypesMenuData } from '../menuDataRetrieval';
import { numberParamCanBeField, stringParam, booleanParam } from 'mock/ruleService';
import * as store from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as selectorsMock from 'builder_platform_interaction/selectors';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getAllEntities } from 'builder_platform_interaction/sobjectLib';
import { GLOBAL_CONSTANTS as gcLabels, GLOBAL_CONSTANT_OBJECTS as gcObjects } from 'builder_platform_interaction/systemLib';
import { LABELS } from '../expressionUtilsLabels';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';
import { platformEvent1ApiName, platformEvent1Label } from 'mock/eventTypesData';
import { getEventTypes } from 'builder_platform_interaction/sobjectLib';

const collectionVariable = LABELS.collectionVariablePluralLabel.toUpperCase();
const sobjectVariable = LABELS.sObjectVariablePluralLabel.toUpperCase();
const sobjectCollectionVariable = LABELS.sObjectCollectionVariablePluralLabel.toUpperCase();

/*
    Desired format output from getStoreElements
    [
        {
         label: "Collection Variable",
         items: [{collStrVar1}, {collStrVar2}]
        },
        {
         label: "SObject Variable",
         items: [{accVar1}]
        },
        {
         label: "Variable",
         items: [{numVar1}]
        },
        ...
    ]
 */

const sampleNumberParamTypes = {
    Number : [numberParamCanBeField],
    canBeSobjectField: true,
};

const sampleStringParamTypes = {
    String : [stringParam],
};

const sampleBooleanParamTypes = {
    Boolean : [booleanParam],
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName, callback) => {
            callback(require.requireActual('mock/serverEntityData').mockAccountFieldWithPicklist);
        }),
        getAllEntities: jest.fn().mockImplementation(() => {
            return require.requireActual('mock/serverEntityData').mockEntities;
        }),
        getEventTypes: jest.fn().mockImplementation(() => {
            return require.requireActual('mock/eventTypesData').mockEventTypes;
        }),
        ENTITY_TYPE: require.requireActual('builder_platform_interaction/sobjectLib').ENTITY_TYPE,
    };
});


jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
        readableElementsSelector: jest.fn(),
    };
});

describe('Menu data retrieval', () => {
    it('should sort alphabetically by category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid], store.elements[store.accountSObjectVariableGuid],
            store.elements[store.stringCollectionVariable1Guid], store.elements[store.stringCollectionVariable2Guid], store.elements[store.dateVariableGuid]]);
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true});
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[2].label).toBe(variablePluralLabel.toUpperCase());
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should sort alphabetically within category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.stringCollectionVariable1Guid], store.elements[store.stringCollectionVariable2Guid]]);
        const collectionVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0];
        expect(collectionVariables.items).toHaveLength(2);
        expect(collectionVariables.items[0].text).toBe(store.stringCollectionVariable1DevName);
        expect(collectionVariables.items[1].text).toBe(store.stringCollectionVariable2DevName);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should filter by allowed types', () => {
        jest.mock('builder_platform_interaction/ruleLib', () => {
            return {
                isMatch: jest.fn().mockImplementationOnce(() => true).mockImplementationOnce(() => false),
            };
        });
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid], store.elements[store.stringCollectionVariable1Guid]]);
        const allowedVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes);
        expect(allowedVariables).toHaveLength(1);
        expect(allowedVariables[0].items).toHaveLength(1);
        expect(allowedVariables[0].items[0].displayText).toBe(addCurlyBraces(store.numberVariableDevName));
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should preserve devName in text & value field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.text).toBe(store.numberVariableDevName);
        expect(copiedElement.displayText).toBe(addCurlyBraces(store.numberVariableDevName));
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should set subText to objectType for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.account);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should set subText to label if there is a label', () => {
        selectorsMock.readableElementsSelector.mockReturnValue([store.elements[store.outcomeGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.DECISION,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.outcomeDevName);
        selectorsMock.readableElementsSelector.mockClear();
    });
    it('should set subText to dataType label if no objectType or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
        selectorsMock.writableElementsSelector.mockClear();
    });

    it('should have New Resource as first element', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const allowedVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes, true);
        expect(allowedVariables).toHaveLength(2);
        expect(allowedVariables[0].text).toBe('FlowBuilderExpressionUtils.newResourceLabel');
        expect(allowedVariables[0].value).toBe('%%NewResource%%');
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should include sobjects non-collection var when fields are allowed', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]);
        const primitivesWithObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes, false, true, false);
        expect(primitivesWithObjects).toHaveLength(1);
        const primitivesNoObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes, false, true, true);
        expect(primitivesNoObjects).toHaveLength(0);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have only sobject variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectVariableGuid);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have only sobject collection variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectCollectionVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have one sobject variable and one sobject collection variable', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true});
        // TODO: W-5624868 when getElementsForMenuData is removed, this test should pass showSystemVariables = false so that menuData only expects length 2
        expect(menuData).toHaveLength(3);
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectVariableGuid);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have only sobject variables (record Update)', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_UPDATE, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectVariableGuid);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have only sobject collection variables  (record Update)', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectCollectionVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_UPDATE, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have dataType populated for number variable', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.dataType).toBe(store.numberDataType);
        expect(copiedElement.objectType).toBeNull();
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have dataType and objectType populated for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const copiedElement = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
        expect(copiedElement.objectType).toBe('Account');
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have the iconName and iconSize populated', () => {
        selectorsMock.writableElementsSelector.mockReturnValueOnce([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.iconName).toBe(FLOW_DATA_TYPE.NUMBER.utilityIconName);
        expect(copiedElement.iconSize).toBe('xx-small');
    });

    describe('disableHasNext', () => {
        it('should set hasNext to false for all menu items when true', () => {
            selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]));
            const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true},
                null, false, false, true);

            expect(menuData[0].items[0].hasNext).toBeFalsy();
            expect(menuData[1].items[0].hasNext).toBeFalsy();
        });

        it('should not manipulate hasNext for all menu items when false', () => {
            selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]));
            const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true},
                null, false, false);

            expect(menuData[0].items[0].hasNext).toBeFalsy();
            expect(menuData[1].items[0].hasNext).toBeTruthy();
        });
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockClear();
    });
    describe('RHS menuData', () => {
        it('should have active picklist values in menu data when LHS is picklist field', () => {
            selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
            // configuration for menu data retrieval
            const allowedParamTypes = null;
            const includeNewResource = false;
            const allowSObjectForFields = false;
            const disableHasNext = false;
            const activePicklistValues = ['pick1', 'pick2'];

            const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true}, allowedParamTypes, includeNewResource, allowSObjectForFields, disableHasNext, activePicklistValues);
            const picklistLabel = 'Picklist Values';
            expect(menuData).toContainEqual(expect.objectContaining({label:  picklistLabel}));
            expect(menuData).toContainEqual(expect.objectContaining({items: expect.any(Array)}));
            selectorsMock.writableElementsSelector.mockClear();
        });
    });
    describe('global constants', () => {
        it('empty string should show in menuData when allowed', () => {
            // all global constants returned from selector
            selectorsMock.readableElementsSelector.mockReturnValue([gcObjects[gcLabels.BOOLEAN_FALSE], gcObjects[gcLabels.BOOLEAN_TRUE], gcObjects[gcLabels.EMPTY_STRING]]);

            // only pass a string param for allowedParamTypes
            const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT}, sampleStringParamTypes);

            // only the empty string global constant is added to the menu data
            expect(menuData).toContainEqual(expect.objectContaining({label: LABELS.globalConstantCategory}));
            expect(menuData).toContainEqual(expect.objectContaining({items: expect.any(Array)}));
            expect(menuData[0].items).toHaveLength(1);
            selectorsMock.readableElementsSelector.mockClear();
        });
        it('true and false should show in menuData when allowed', () => {
            // all global constants returned from selector
            selectorsMock.readableElementsSelector.mockReturnValue([gcObjects[gcLabels.BOOLEAN_FALSE], gcObjects[gcLabels.BOOLEAN_TRUE], gcObjects[gcLabels.EMPTY_STRING]]);

            // only pass a boolean param for allowedParamTypes
            const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT}, sampleBooleanParamTypes);

            // only the boolean global constant is added to the menu data
            expect(menuData).toContainEqual(expect.objectContaining({label: LABELS.globalConstantCategory}));
            expect(menuData).toContainEqual(expect.objectContaining({items: expect.any(Array)}));
            expect(menuData[0].items).toHaveLength(2);
            selectorsMock.readableElementsSelector.mockClear();
        });
    });
    describe('entities menu data', () => {
        it('uses api name for null label', () => {
            getAllEntities.mockImplementationOnce(() => {
                return require.requireActual('mock/serverEntityData').mockEntitiesWithNoLabel;
            });
            const entityApiName = 'AcceptedEventRelation';
            const entitiesMenuData = getEntitiesMenuData();
            expect(entitiesMenuData).toBeDefined();
            expect(entitiesMenuData[0].displayText).toEqual(entityApiName);
            expect(entitiesMenuData[0].text).toEqual(entityApiName);
            expect(entitiesMenuData[0].subText).toEqual(entityApiName);
        });
    });

    describe('get store elements', () => {
        // TODO: W-5470931 more tests for getStoreElements
        it('returns elements based on element type', () => {
            selectorsMock.readableElementsSelector.mockReturnValue([store.elements[store.outcomeGuid]]);
            const menuData = getStoreElements(jest.fn(), { elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: false });
            expect(menuData).toHaveLength(1);
        });
    });

    describe('Filter and mutate menu data', () => {
        it('filters using allowed param and returns in format combobox expects', () => {
            const menuData = filterAndMutateMenuData([store.elements[store.numberVariableGuid], store.elements[store.dateVariableGuid]], sampleNumberParamTypes);
            expect(menuData).toHaveLength(1);
            expect(menuData[0].items).toHaveLength(1);
            const element = menuData[0].items[0];
            expect(element.value).toBe(store.numberVariableGuid);
            expect(element.text).toBe(store.numberVariableDevName);
            expect(element.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
            expect(element.displayText).toBe(addCurlyBraces(store.numberVariableDevName));
        });
    });

    describe('Event types menu data', () => {
        it('uses cache to fetch the data', () => {
            getEventTypesMenuData();
            const eventTypesMenuData = getEventTypesMenuData();
            expect(getEventTypes).toHaveBeenCalledTimes(1);
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
        });

        it('fetches and formats data', () => {
            const eventTypesMenuData = getEventTypesMenuData();
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
            expect(eventTypesMenuData[0].displayText).toEqual(platformEvent1Label);
            expect(eventTypesMenuData[0].text).toEqual(platformEvent1Label);
            expect(eventTypesMenuData[0].subText).toEqual(platformEvent1ApiName);
            expect(eventTypesMenuData[0].dataType).toEqual('SObject');
            expect(eventTypesMenuData[0].objectType).toEqual(platformEvent1ApiName);
        });
    });
    // TODO: write tests for gettings category once we switch to using labels
});