import { getElementsForMenuData, normalizeLHS } from '../menuDataRetrieval';
import { numberParam } from 'mock-rule-service';
import * as store from 'mock-store-data';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import * as selectorsMock from 'builder_platform_interaction-selectors';

const collectionVariable = 'COLLECTION ' + store.variable;
const sobjectVariable = 'SOBJECT ' + store.variable;

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
    Number : [numberParam],
};

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
    };
});

function addCurlyBraces(value) {
    return '{!' + value + '}';
}

describe('Menu data retrieval', () => {
    it('should sort alphabetically by category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid], store.elements[store.accountSObjectVariableGuid],
            store.elements[store.stringCollectionVariable1Guid], store.elements[store.stringCollectionVariable2Guid], store.elements[store.dateVariableGuid]]);
        const menuData = getElementsForMenuData({ element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true});
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[2].label).toBe(store.variable);
    });
    it('should sort alphabetically within category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.stringCollectionVariable1Guid], store.elements[store.stringCollectionVariable2Guid]]);
        const collectionVariables = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true })[0];
        expect(collectionVariables.items).toHaveLength(2);
        expect(collectionVariables.items[0].text).toBe(store.stringCollectionVariable1DevName);
        expect(collectionVariables.items[1].text).toBe(store.stringCollectionVariable2DevName);
    });
    it('should filter by allowed types', () => {
        jest.mock('builder_platform_interaction-rule-lib', () => {
            return {
                isMatch : jest.fn().mockImplementationOnce(() => true).mockImplementationOnce(() => false),
            };
        });
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid], store.elements[store.stringCollectionVariable1Guid]]);
        const allowedVariables = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true}, sampleParamTypes);
        expect(allowedVariables).toHaveLength(1);
        expect(allowedVariables[0].items).toHaveLength(1);
        expect(allowedVariables[0].items[0].displayText).toBe(addCurlyBraces(store.numberVariableDevName));
    });
    it('should preserve devName in text & value field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.text).toBe(store.numberVariableDevName);
        expect(copiedElement.displayText).toBe(addCurlyBraces(store.numberVariableDevName));
    });
    it('should set subText to objectType for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const copiedElement = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.subText).toBe(store.account);
    });
    it('should set subText to label if there is a label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.choiceGuid]]);
        const copiedElement = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.subText).toBe(store.choiceLabel);
    });
    it('should set subText to dataType if no objectType or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const copiedElement = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true})[0].items[0];
        expect(copiedElement.subText).toBe(store.numberDataType);
    });
    it('should have New Resource as first element', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.numberVariableGuid]]);
        const allowedVariables = getElementsForMenuData({element: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true}, sampleParamTypes, true);
        expect(allowedVariables).toHaveLength(2);
        expect(allowedVariables[0].text).toBe('New Resource');
        expect(allowedVariables[0].value).toBe('%%NewResource%%');
    });
    // TODO: write tests for gettings category once we switch to using labels
});
describe('LHS retrieval', () => {
    it('should handle the case when LHS is guid', () => {
        const normalizedElement = normalizeLHS(store.numberVariableGuid);
        expect(normalizedElement.item.displayText).toBe('{!' + store.numberVariableDevName + '}');
        expect(normalizedElement.parameter.collection).toBe(false);
        expect(normalizedElement.parameter.dataType).toBe(numberParam.dataType);
        expect(normalizedElement.parameter.elementType).toBe(store.variable);
    });
});

