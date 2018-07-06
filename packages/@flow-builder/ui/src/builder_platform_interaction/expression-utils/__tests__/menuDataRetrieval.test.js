import { getElementsForMenuData, normalizeLHS } from '../menuDataRetrieval';
import { numberParamCanBeField } from 'mock-rule-service';
import * as store from 'mock-store-data';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import * as selectorsMock from 'builder_platform_interaction-selectors';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

const collectionVariable = 'COLLECTION ' + store.variable;
const sobjectVariable = 'SOBJECT ' + store.variable;
const sobjectCollectionVariable = 'SOBJECT ' + collectionVariable;

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

const sampleParamTypes = {
    Number : [numberParamCanBeField],
};

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
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
        expect(menuData[2].label).toBe(store.variable);
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
        }, sampleParamTypes);
        expect(allowedVariables).toHaveLength(1);
        expect(allowedVariables[0].items).toHaveLength(1);
        expect(allowedVariables[0].items[0].displayText).toBe(addCurlyBraces(store.numberVariableDevName));
    });
    it('should preserve devName in text & value field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.text).toBe(store.numberVariableDevName);
        expect(copiedElement.displayText).toBe(addCurlyBraces(store.numberVariableDevName));
    });
    it('should set subText to objectType for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.account);
    });
    it('should set subText to label if there is a label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.choiceGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.choiceLabel);
    });
    it('should set subText to dataType if no objectType or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.numberDataType);
    });
    it('should have New Resource as first element', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const allowedVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleParamTypes, true);
        expect(allowedVariables).toHaveLength(2);
        expect(allowedVariables[0].text).toBe('FlowBuilderExpressionUtils.newResourceLabel');
        expect(allowedVariables[0].value).toBe('%%NewResource%%');
    });
    it('should be able to include sobjects when only primitives are valid', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const primitivesWithObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleParamTypes, false, true);
        expect(primitivesWithObjects).toHaveLength(1);
        const primitivesNoObjects = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        }, sampleParamTypes, false, false);
        expect(primitivesNoObjects).toHaveLength(0);
    });
    it('should have only sobject variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectVariableGuid);
    });
    it('should have only sobject collection variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectCollectionVariableGuid]]));
        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.RECORD_LOOKUP, sObjectSelector: true});
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
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
    });
    it('should have dataType populated for number variable', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.dataType).toBe(store.numberDataType);
        expect(copiedElement.objectType).toBeNull();
    });
    it('should have dataType and objectType populated for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const copiedElement = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
        expect(copiedElement.objectType).toBe('Account');
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
    });

    // TODO: write tests for gettings category once we switch to using labels
});

describe('LHS retrieval', () => {
    it('should handle the case when LHS is guid', () => {
        const normalizedElement = normalizeLHS(store.numberVariableGuid);
        expect(normalizedElement.item.displayText).toBe('{!' + store.numberVariableDevName + '}');
        expect(normalizedElement.parameter.collection).toBe(false);
        expect(normalizedElement.parameter.dataType).toBe(numberParamCanBeField.dataType);
        expect(normalizedElement.parameter.elementType).toBe(store.variable);
    });
});

