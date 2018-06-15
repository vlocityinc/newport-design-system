export const numberVariableGuid = 'guid1';
export const accountSObjectVariableGuid = 'guid2';
export const stringCollectionVariable1Guid = 'guid3';
export const stringCollectionVariable2Guid = 'guid4';
export const choiceGuid = 'guid5';
export const dateVariableGuid = 'guid6';
export const stageGuid = 'guid7';
export const stageCollectionGuid = 'guid8';
export const dateCollectionVariableGuid = 'guid9';
export const stringVariableGuid = 'guid10';
export const currencyVariableGuid = 'guid11';
export const assignmentElementGuid = 'guid12';

export const assignmentElementName = 'assignment1';
export const numberVariableDevName = 'numVar1';
export const currencyVariableDevName = 'currencyVar1';
export const stringVariableDevName = 'strVar1';
export const accountSObjectVariableDevName = 'accVar1';
export const stringCollectionVariable1DevName = 'collStrVar1';
export const stringCollectionVariable2DevName = 'collStrVar2';
export const choiceDevName = 'numberChoice';
const dateVariableDevName = 'dateVar1';

export const numberDataType = 'Number';
export const sobjectDataType = 'SObject';
export const stringDataType = 'String';
export const currencyDataType = 'Currency';
const dateDataType = 'Date';

const choiceElementType = 'CHOICE';
const stageElementType = 'STAGE';

export const account = 'Account';
export const choiceLabel = 'Choice 1';
export const variable = 'VARIABLE';
export const assignment = 'ASSIGNMENT';

export const elements = {
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
        objectType: null,
    },
    [stringVariableGuid]: {
        dataType: stringDataType,
        description: 'random description',
        elementType: variable,
        guid: stringVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: stringVariableDevName,
        objectType: null,
        value: {
            stringValue: 'fooDefault',
        },
    },
    [currencyVariableGuid]: {
        dataType: currencyDataType,
        description: 'random description',
        elementType: variable,
        guid: currencyVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: currencyVariableDevName,
        scale: 2,
        objectType: null,
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
        objectType: account,
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
        objectType: null,
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
        objectType: null,
    },
    [choiceGuid]: {
        dataType: numberDataType,
        description: '',
        elementType: choiceElementType,
        guid: choiceGuid,
        isCanvasElement: false,
        name: choiceDevName,
        label: choiceLabel,
    },
    [dateVariableGuid]: {
        dataType: dateDataType,
        description: '',
        elementType: variable,
        guid: dateVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        name: dateVariableDevName,
        objectType: null,
    },
    [dateCollectionVariableGuid]: {
        dataType: dateDataType,
        description: '',
        elementType: variable,
        guid: dateVariableGuid,
        isCanvasElement: false,
        isCollection: true,
        name: dateVariableDevName,
        objectType: null,
    },
    [stageCollectionGuid]: {
        // haven't filled in more of this because we don't have this in our store yet- add as needed except for dataType
        // dataType is weird, if we find ourselves needing it we need to raise it and handle it properly
        elementType: stageElementType,
        isCollection: true,
    },
    [stageGuid]: {
        // haven't filled in more of this because we don't have this in our store yet- add as needed except for dataType
        // dataType is weird, if we find ourselves needing it we need to raise it and handle it properly
        elementType: stageElementType,
        isCollection: false,
    },
    [assignmentElementGuid]: {
        assignmentItems: [{
            assignToReference: stringVariableGuid,
            operator: "Assign",
            processMetadataValues: [],
            value: {elementReference: numberVariableGuid},
        }],
        config: {isSelected: false},
        connectorCount: 0,
        elementType: assignment,
        guid: assignmentElementGuid,
        isCanvasElement: true,
        label: assignmentElementName,
        locationX: 379,
        locationY: 149,
        maxConnections: 1,
        name: assignmentElementName,
    },
};

export const variableGuids = [numberVariableGuid, accountSObjectVariableGuid, stringCollectionVariable1Guid,
    stringCollectionVariable2Guid, choiceGuid, dateVariableGuid, stageGuid];

export const hydratedElements = {
    [stringVariableGuid]: {
        dataType: { value: stringDataType, error: null },
        description: 'random description',
        elementType: { value: variable, error: null},
        guid: numberVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: { value: numberVariableDevName, error: 'Invalid name.' },
        objectType: null,
        value: {
            stringValue: 'fooDefault',
        },
    }
};

