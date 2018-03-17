import { getElementsForMenuData, copyFields } from '../menuDataRetrieval';
import { numberParam } from 'mock-rule-service';
import * as store from 'mock-store-data';

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

const someVariableGuids = [store.numberVariableGuid, store.accountSObjectVariableGuid, store.stringCollectionVariable1Guid, store.stringCollectionVariable2Guid];

const sampleParamTypes = {
    Number : [numberParam],
};

describe('Menu data retrieval', () => {
    it('should sort alphabetically by category', () => {
        const menuData = getElementsForMenuData(store.elements, someVariableGuids);
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[2].label).toBe(store.variable);
    });
    it('should sort alphabetically within category', () => {
        const collectionVariables = getElementsForMenuData(store.elements, someVariableGuids)[0];
        expect(collectionVariables.items.length).toBe(2);
        expect(collectionVariables.items[0].text).toBe(store.stringCollectionVariable1DevName);
        expect(collectionVariables.items[1].text).toBe(store.stringCollectionVariable2DevName);
    });
    it('should filter by allowed types', () => {
        jest.mock('builder_platform_interaction-rule-lib', () => {
            return {
                isMatch : jest.fn().mockImplementationOnce(() => true).mockImplementationOnce(() => false),
            };
        });
        const allowedVariables = getElementsForMenuData(store.elements, [store.numberVariableGuid, store.stringCollectionVariable1Guid], sampleParamTypes);
        expect(allowedVariables.length).toBe(1);
        expect(allowedVariables[0].items.length).toBe(1);
        expect(allowedVariables[0].items[0].value).toBe(store.numberVariableDevName);
    });
});

describe('copying elements into combobox shape', () => {
    it('should preserve devName in text & value field', () => {
        const copiedElement = copyFields(store.elements[store.numberVariableGuid]);
        expect(copiedElement.text).toBe(store.numberVariableDevName);
        expect(copiedElement.value).toBe(store.numberVariableDevName);
    });
    it('should set subText to objectType for sObject var', () => {
        const copiedElement = copyFields(store.elements[store.accountSObjectVariableGuid]);
        expect(copiedElement.subText).toBe(store.account);
    });
    it('should set subText to label if there is a label', () => {
        const copiedElement = copyFields(store.elements[store.choiceGuid]);
        expect(copiedElement.subText).toBe(store.choiceLabel);
    });
    it('should set subText to dataType if no objectType or label', () => {
        const copiedElement = copyFields(store.elements[store.numberVariableGuid]);
        expect(copiedElement.subText).toBe(store.numberDataType);
    });
    // TODO: write tests for getting category once we switch to using labels
});
