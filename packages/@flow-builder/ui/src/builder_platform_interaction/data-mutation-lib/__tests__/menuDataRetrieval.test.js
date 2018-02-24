import { getElementsForMenuData, copyFields } from '../menuDataRetrieval';

const numberVariableGuid = 'guid1';
const accountSObjectVariableGuid = 'guid2';
const stringCollectionVariable1Guid = 'guid3';
const stringCollectionVariable2Guid = 'guid4';
const choiceGuid = 'guid5';

const numberVariableDevName = 'numVar1';
const accountSObjectVariableDevName = 'accVar1';
const stringCollectionVariable1DevName = 'collStrVar1';
const stringCollectionVariable2DevName = 'collStrVar2';
const choiceDevName = 'numberChoice';

const numberDataType = 'Number';
const sobjectDataType = 'SObject';
const stringDataType = 'String';

const account = 'Account';
const choiceLabel = 'Choice 1';
const variable = 'VARIABLE';
const collectionVariable = 'COLLECTION ' + variable;
const sobjectVariable = 'SOBJECT ' + variable;

const elements = {
    [numberVariableGuid]: {
        dataType: numberDataType,
        description: '',
        elementType: variable,
        guid: numberVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: numberVariableDevName,
        objectType: null
    },
    [accountSObjectVariableGuid]: {
        dataType: sobjectDataType,
        description: '',
        elementType: variable,
        guid: accountSObjectVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: accountSObjectVariableDevName,
        objectType: account
    },
    [stringCollectionVariable1Guid]: {
        dataType: stringDataType,
        description: '',
        elementType: variable,
        guid: stringCollectionVariable1Guid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: stringCollectionVariable1DevName,
        objectType: null
    },
    [stringCollectionVariable2Guid]: {
        dataType: stringDataType,
        description: '',
        elementType: variable,
        guid: stringCollectionVariable2Guid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: stringCollectionVariable2DevName,
        objectType: null
    },
    [choiceGuid]: {
        dataType: numberDataType,
        description: '',
        elementType: 'CHOICE',
        guid: choiceGuid,
        isCanvasElement: false,
        name: choiceDevName,
        label: choiceLabel
    }
};

const variableGuids = [numberVariableGuid, accountSObjectVariableGuid, stringCollectionVariable1Guid, stringCollectionVariable2Guid];

/*
    Desired format output
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

describe('Menu data retrieval', () => {
    it('should sort alphabetically by category', () => {
        const menuData = getElementsForMenuData(elements, variableGuids);
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[2].label).toBe(variable);
    });
    it('should sort alphabetically within category', () => {
        const collectionVariables = getElementsForMenuData(elements, variableGuids)[0];
        expect(collectionVariables.items.length).toBe(2);
        expect(collectionVariables.items[0].text).toBe(stringCollectionVariable1DevName);
        expect(collectionVariables.items[1].text).toBe(stringCollectionVariable2DevName);
    });
});

describe('copying elements into combobox shape', () => {
    it('should preserve guid and devName in fields combobox expects', () => {
        const copiedElement = copyFields(elements[numberVariableGuid]);
        expect(copiedElement.guid).toBe(numberVariableGuid);
        expect(copiedElement.text).toBe(numberVariableDevName);
        expect(copiedElement.value).toBe(numberVariableDevName);
    });
    it('should set subText to objectType for sObject var', () => {
        const copiedElement = copyFields(elements[accountSObjectVariableGuid]);
        expect(copiedElement.subText).toBe(account);
    });
    it('should set subText to label if there is a label', () => {
        const copiedElement = copyFields(elements[choiceGuid]);
        expect(copiedElement.subText).toBe(choiceLabel);
    });
    it('should set subText to dataType if no objectType or label', () => {
        const copiedElement = copyFields(elements[numberVariableGuid]);
        expect(copiedElement.subText).toBe(numberDataType);
    });
    // TODO: write tests for getting category once we switch to using labels
});