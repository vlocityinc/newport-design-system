import { getElementsForMenuData, getEntitiesMenuData } from '../menuDataRetrieval';
import { normalizeLHS } from '../resourceUtils';
import { numberParamCanBeField, stringParam, booleanParam } from 'mock-rule-service';
import * as store from 'mock-store-data';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import * as selectorsMock from 'builder_platform_interaction-selectors';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getAllEntities } from 'builder_platform_interaction-sobject-lib';
import { GLOBAL_CONSTANTS as gcLabels, GLOBAL_CONSTANT_OBJECTS as gcObjects } from 'builder_platform_interaction-system-lib';
import { LABELS } from '../expression-utils-labels';
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';

const collectionVariable = LABELS.collectionVariablePluralLabel.toUpperCase();
const sobjectVariable = LABELS.sObjectVariablePluralLabel.toUpperCase();
const sobjectCollectionVariable = LABELS.sObjectCollectionVariablePluralLabel.toUpperCase();

/*
    Desired format output from getElementsForMenuData
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
};

const sampleStringParamTypes = {
    String : [stringParam],
};

const sampleBooleanParamTypes = {
    Boolean : [booleanParam],
};

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName, callback) => {
            callback(require.requireActual('mock-server-entity-data').mockAccountFieldWithPicklist);
        }),
        getAllEntities: jest.fn().mockImplementation(() => {
            return require.requireActual('mock-server-entity-data').mockEntities;
        }),
        ENTITY_TYPE: require.requireActual('builder_platform_interaction-sobject-lib').ENTITY_TYPE,
    };
});


jest.mock('builder_platform_interaction-selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
        readableElementsSelector: jest.fn(),
    };
});

function addCurlyBraces(value) {
    return '{!' + value + '}';
}

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
        jest.mock('builder_platform_interaction-rule-lib', () => {
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
    it('should set subText to dataType if no objectType or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.numberDataType);
        selectorsMock.writableElementsSelector.mockClear();
    });
    // TODO Uncomment when we get to W-5164547
    // it('should have New Resource as first element', () => {
    //     selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
    //     const allowedVariables = getElementsForMenuData({
    //         elementType: ELEMENT_TYPE.ASSIGNMENT,
    //         shouldBeWritable: true
    //     }, sampleNumberParamTypes, true);
    //     expect(allowedVariables).toHaveLength(2);
    //     expect(allowedVariables[0].text).toBe('FlowBuilderExpressionUtils.newResourceLabel');
    //     expect(allowedVariables[0].value).toBe('%%NewResource%%');
    //     selectorsMock.writableElementsSelector.mockClear();
    // });
    it('should be able to include sobjects non-collection var when only primitives are valid', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]);
        const primitivesWithObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes, false, true);
        expect(primitivesWithObjects).toHaveLength(1);
        const primitivesNoObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleNumberParamTypes, false, false);
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
        expect(menuData).toHaveLength(2);
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectVariableGuid);
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
            const complexGuid = store.accountSObjectVariableGuid + '.AccountSource';
            const lhs = normalizeLHS(complexGuid);
            // configuration for menu data retrieval
            const allowedParamTypes = null;
            const includeNewResource = false;
            const allowSObjectForFields = false;
            const disableHasNext = false;
            const activePicklistValues = lhs.activePicklistValues;

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
                return require.requireActual('mock-server-entity-data').mockEntitiesWithNoLabel;
            });
            const entityApiName = 'AcceptedEventRelation';
            const entitiesMenuData = getEntitiesMenuData();
            expect(entitiesMenuData).toBeDefined();
            expect(entitiesMenuData[0].displayText).toEqual(entityApiName);
            expect(entitiesMenuData[0].text).toEqual(entityApiName);
            expect(entitiesMenuData[0].subText).toEqual(entityApiName);
        });
    });
    // TODO: write tests for gettings category once we switch to using labels
});


