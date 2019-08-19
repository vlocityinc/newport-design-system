import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const startElementGuid = 'guid0';
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
export const accountSObjectCollectionVariableGuid = 'guid13';
export const actionCallElementGuid = 'guid14';
export const outcomeGuid = 'guid15';
export const decisionGuid = 'guid16';
export const caseSObjectCollectionVariableGuid = 'guid17';
export const stringConstantGuid = 'guid18';
export const textTemplateGuid = 'guid19';
export const waitEventGuid = 'guid20';
export const apexSampleVariableGuid = 'guid21';
export const apexSampleCollectionVariableGuid = 'guid22';
export const lookupRecordAutomaticOutputGuid = 'guid23';
export const lookupRecordOutputReferenceGuid = 'guid24';
export const lookupRecordCollectionAutomaticOutputGuid = 'guid25';
export const emailScreenFieldAutomaticOutputGuid = 'guid26';
export const emailScreenFieldGuid = 'guid27';
export const actionCallAutomaticAutomaticOutputGuid = 'guid28';

export const assignmentElementName = 'assignment1';
export const numberVariableDevName = 'numVar1';
export const currencyVariableDevName = 'currencyVar1';
export const stringVariableDevName = 'strVar1';
export const accountSObjectVariableDevName = 'accVar1';
export const stringCollectionVariable1DevName = 'collStrVar1';
export const stringCollectionVariable2DevName = 'collStrVar2';
export const stringConstantDevName = 'conVar1';
export const choiceDevName = 'numberChoice';
const dateVariableDevName = 'dateVar1';
export const stageDevName = 'stage1';
export const stageOrderNumber = 12;
export const stageCollectionOrderNumber = 14;
export const stageCollectionDevName = 'stageCollectionVar1';
export const accountSObjectCollectionVariableDevName = 'accCollectionVar1';
export const actionCallElementDevName = 'actionCall1';
export const outcomeDevName = 'outcome1';
export const decisionDevName = 'decision1';
export const caseSObjectCollectionVariableDevName = 'caseCollectionVar1';
export const textTemplateDevName = 'textTemplate1';
export const waitEventDevName = 'waitEvent1';
export const apexSampleVariableDevName = 'apexVariable1';
export const apexSampleCollectionVariableDevName = 'apexCollectionVariable1';
export const lookupRecordAutomaticOutputDevName = 'lookupRecord1';
export const lookupRecordOutputReferenceDevName = 'lookupRecord2';
export const lookupRecordCollectionAutomaticOutputDevName = 'lookupRecord3';
export const emailScreenFieldAutomaticOutputDevName =
    'emailScreenFieldAutomatic';
export const emailScreenFieldDevName = 'emailScreenField';
export const actionCallAutomaticAutomaticOutputDevName = 'actionCallAutomatic';

export const numberDataType = 'Number';
export const sobjectDataType = 'SObject';
export const stringDataType = 'String';
export const currencyDataType = 'Currency';
const dateDataType = 'Date';
const apexDataType = 'Apex';

const choiceElementType = ELEMENT_TYPE.CHOICE;
const stageElementType = ELEMENT_TYPE.STAGE;

const apexClass = 'apexClass';
export const account = 'Account';
export const caseObjectType = 'Case';
export const choiceLabel = 'Choice 1';
export const variable = ELEMENT_TYPE.VARIABLE;
export const constant = ELEMENT_TYPE.CONSTANT;
export const assignment = ELEMENT_TYPE.ASSIGNMENT;
export const actionCall = ELEMENT_TYPE.ACTION_CALL;
export const outcome = ELEMENT_TYPE.OUTCOME;
export const formula = ELEMENT_TYPE.FORMULA;
export const textTemplate = ELEMENT_TYPE.TEXT_TEMPLATE;
export const waitEvent = ELEMENT_TYPE.WAIT_EVENT;
export const decision = ELEMENT_TYPE.DECISION;

export const properties = {
    lastInlineResourcePosition: null
};

export const elements = {
    [startElementGuid]: {
        guid: startElementGuid,
        elementType: ELEMENT_TYPE.START_ELEMENT,
        label: 'Start',
        locationX: 50,
        locationY: 50,
        isCanvasElement: true,
        config: {
            isSelected: false
        },
        maxConnections: 1,
        connectorCount: 0
    },
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
        subtype: null
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
        subtype: null,
        value: {
            stringValue: 'fooDefault'
        }
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
        subtype: null
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
        subtype: account
    },
    [accountSObjectCollectionVariableGuid]: {
        dataType: sobjectDataType,
        description: '',
        elementType: variable,
        guid: accountSObjectCollectionVariableGuid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: accountSObjectCollectionVariableDevName,
        subtype: account
    },
    [caseSObjectCollectionVariableGuid]: {
        dataType: sobjectDataType,
        description: '',
        elementType: variable,
        guid: caseSObjectCollectionVariableGuid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: caseSObjectCollectionVariableDevName,
        subtype: caseObjectType
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
        subtype: null
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
        subtype: null
    },
    [choiceGuid]: {
        dataType: numberDataType,
        description: '',
        elementType: choiceElementType,
        guid: choiceGuid,
        isCanvasElement: false,
        name: choiceDevName,
        label: choiceLabel
    },
    [dateVariableGuid]: {
        dataType: dateDataType,
        description: '',
        elementType: variable,
        guid: dateVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        name: dateVariableDevName,
        subtype: null
    },
    [dateCollectionVariableGuid]: {
        dataType: dateDataType,
        description: '',
        elementType: variable,
        guid: dateCollectionVariableGuid,
        isCanvasElement: false,
        isCollection: true,
        name: dateVariableDevName,
        subtype: null
    },
    [stageCollectionGuid]: {
        elementType: stageElementType,
        guid: stageCollectionGuid,
        isActive: true,
        name: stageCollectionDevName,
        label: stageCollectionDevName,
        stageOrder: stageCollectionOrderNumber,
        description: ''
    },
    [stageGuid]: {
        elementType: stageElementType,
        guid: stageGuid,
        isActive: false,
        name: stageDevName,
        label: stageDevName,
        stageOrder: stageOrderNumber,
        description: ''
    },
    [assignmentElementGuid]: {
        assignmentItems: [
            {
                assignToReference: stringVariableGuid,
                operator: 'Assign',
                processMetadataValues: [],
                value: { elementReference: numberVariableGuid }
            }
        ],
        config: { isSelected: false },
        connectorCount: 0,
        elementType: assignment,
        guid: assignmentElementGuid,
        isCanvasElement: true,
        label: assignmentElementName,
        locationX: 379,
        locationY: 149,
        maxConnections: 1,
        name: assignmentElementName
    },
    [actionCallElementGuid]: {
        actionName: 'LogACall',
        actionType: 'quickAction',
        inputParameters: [],
        label: actionCallElementDevName,
        locationX: 592,
        locationY: 586,
        name: actionCallElementDevName,
        outputParameters: [],
        processMetadataValues: [],
        elementType: actionCall,
        guid: actionCallElementGuid,
        isCanvasElement: true,
        config: { isSelected: false },
        availableConnections: [],
        connectorCount: 2,
        maxConnections: 2,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value
    },
    [outcomeGuid]: {
        conditionLogic: 'and',
        conditions: [
            {
                leftValueReference: stringVariableDevName,
                operator: 'EqualTo',
                processMetadataValues: [],
                rightValue: {
                    stringValue: 'text'
                }
            }
        ],
        label: outcomeDevName,
        name: outcomeDevName,
        processMetadataValues: [],
        dataType: 'Boolean',
        elementType: outcome,
        guid: outcomeGuid,
        isCanvasElement: false
    },
    [decisionGuid]: {
        defaultConnectorLabel: '[Default Outcome]',
        label: decisionDevName,
        locationX: 275,
        locationY: 413,
        name: decisionDevName,
        processMetadataValues: [],
        elementType: decision,
        guid: decisionGuid,
        isCanvasElement: true,
        config: { isSelected: false },
        outcomeReferences: [
            {
                outcomeReference: outcomeGuid
            }
        ],
        availableConnections: [
            {
                type: 'REGULAR',
                childReference: outcomeGuid
            },
            {
                type: 'DEFAULT'
            }
        ],
        connectorCount: 0,
        maxConnections: 2
    },
    [waitEventGuid]: {
        conditionLogic: 'and',
        conditions: [
            {
                leftValueReference: stringVariableDevName,
                operator: 'EqualTo',
                processMetadataValues: [],
                rightValue: {
                    stringValue: 'text'
                }
            }
        ],
        label: waitEventDevName,
        name: waitEventDevName,
        processMetadataValues: [],
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        elementType: waitEvent,
        eventType: 'AlarmEvent',
        guid: waitEventGuid,
        isCanvasElement: false,
        inputParameters: [],
        outputParameters: []
    },
    [textTemplateGuid]: {
        description: 'text template random description',
        elementType: textTemplate,
        guid: textTemplateGuid,
        isCanvasElement: false,
        name: textTemplateDevName,
        text: 'Hello {!World}',
        dataType: FLOW_DATA_TYPE.STRING.value
    },
    [apexSampleVariableGuid]: {
        dataType: apexDataType,
        description: '',
        elementType: variable,
        guid: apexSampleVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: apexSampleVariableDevName,
        subtype: apexClass
    },
    [apexSampleCollectionVariableGuid]: {
        dataType: apexDataType,
        description: '',
        elementType: variable,
        guid: apexSampleCollectionVariableGuid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: apexSampleCollectionVariableDevName,
        subtype: apexClass
    },
    [lookupRecordAutomaticOutputGuid]: {
        guid: lookupRecordAutomaticOutputGuid,
        name: lookupRecordAutomaticOutputDevName,
        description: '',
        label: lookupRecordAutomaticOutputDevName,
        locationX: 226,
        locationY: 232,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false },
        object: 'Account',
        numberRecordsToStore: 'firstRecord',
        filterType: 'none',
        filters: [],
        queriedFields: [],
        sortOrder: 'NotSorted',
        sortField: '',
        maxConnections: 2,
        availableConnections: [{ type: 'REGULAR' }, { type: 'FAULT' }],
        elementType: 'RecordQuery',
        storeOutputAutomatically: true,
        dataType: FLOW_DATA_TYPE.SOBJECT.value,
        subtype: 'Account',
        isCollection: false
    },
    [lookupRecordOutputReferenceGuid]: {
        guid: lookupRecordOutputReferenceGuid,
        name: lookupRecordOutputReferenceDevName,
        description: '',
        label: lookupRecordOutputReferenceDevName,
        locationX: 226,
        locationY: 232,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false },
        object: 'Account',
        numberRecordsToStore: 'firstRecord',
        filterType: 'none',
        filters: [],
        queriedFields: [],
        sortOrder: 'NotSorted',
        sortField: '',
        maxConnections: 2,
        availableConnections: [{ type: 'REGULAR' }, { type: 'FAULT' }],
        elementType: 'RecordQuery',
        outputReference: accountSObjectVariableDevName,
        storeOutputAutomatically: false,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value
    },
    [lookupRecordCollectionAutomaticOutputGuid]: {
        guid: lookupRecordCollectionAutomaticOutputGuid,
        name: lookupRecordCollectionAutomaticOutputDevName,
        description: '',
        label: lookupRecordCollectionAutomaticOutputDevName,
        locationX: 226,
        locationY: 232,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false },
        object: 'Account',
        numberRecordsToStore: 'allRecords',
        filterType: 'none',
        filters: [],
        queriedFields: [],
        sortOrder: 'NotSorted',
        sortField: '',
        maxConnections: 2,
        availableConnections: [{ type: 'REGULAR' }, { type: 'FAULT' }],
        elementType: 'RecordQuery',
        storeOutputAutomatically: true,
        dataType: FLOW_DATA_TYPE.SOBJECT.value,
        subtype: 'Account',
        isCollection: true
    },
    [emailScreenFieldAutomaticOutputGuid]: {
        guid: emailScreenFieldAutomaticOutputGuid,
        name: emailScreenFieldAutomaticOutputDevName,
        choiceReferences: [],
        dataType: 'LightningComponentOutput',
        defaultValue: '',
        defaultValueIndex: '5d457ada-a9de-41b0-8225-847942f4f69b',
        validationRule: {
            formulaExpression: null,
            errorMessage: null
        },
        extensionName: 'flowruntime:email',
        fieldType: 'ComponentInstance',
        fieldText: '',
        helpText: '',
        inputParameters: [
            {
                rowIndex: '9950e933-80b8-4352-b1d1-3c186f502765',
                name: 'placeholder',
                value: 'your email address',
                valueDataType: 'String'
            }
        ],
        isNewField: false,
        isRequired: true,
        outputParameters: [],
        scale: '0',
        type: {
            name: 'flowruntime:email',
            fieldType: 'ComponentInstance',
            label: 'flowruntime:email',
            icon: 'standard:lightning_component',
            source: 'local'
        },
        elementType: 'SCREEN_FIELD',
        visibilityRule: {
            conditionLogic: 'no_conditions',
            conditions: []
        },
        storeOutputAutomatically: true
    },
    [emailScreenFieldGuid]: {
        guid: emailScreenFieldGuid,
        name: emailScreenFieldDevName,
        choiceReferences: [],
        defaultValue: '',
        defaultValueIndex: '7e851e43-3a62-4ac4-bd9c-ccf350440902',
        validationRule: {
            formulaExpression: null,
            errorMessage: null
        },
        extensionName: 'flowruntime:email',
        fieldType: 'ComponentInstance',
        fieldText: '',
        helpText: '',
        inputParameters: [
            {
                rowIndex: '61da689d-ece8-447a-9da2-88f863fc0e2e',
                name: 'placeholder',
                value: 'your email address',
                valueDataType: 'String'
            }
        ],
        isNewField: false,
        isRequired: true,
        outputParameters: [],
        scale: '0',
        type: {
            name: 'flowruntime:email',
            fieldType: 'ComponentInstance',
            label: 'flowruntime:email',
            icon: 'standard:lightning_component',
            source: 'local'
        },
        elementType: 'SCREEN_FIELD',
        visibilityRule: {
            conditionLogic: 'no_conditions',
            conditions: []
        },
        storeOutputAutomatically: false
    },
    [actionCallAutomaticAutomaticOutputGuid]: {
        guid: actionCallAutomaticAutomaticOutputGuid,
        name: actionCallAutomaticAutomaticOutputDevName,
        description: '',
        label: actionCallAutomaticAutomaticOutputDevName,
        locationX: 442,
        locationY: 256,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false
        },
        actionType: 'chatterPost',
        actionName: 'chatterPost',
        inputParameters: [
            {
                rowIndex: 'e9a2f94b-276a-4183-86ac-3ae6a5593e0b',
                name: 'text',
                value: 'This is my message',
                valueDataType: 'String'
            },
            {
                rowIndex: '517619c9-0e3d-4584-80c3-45b7c3625a0b',
                name: 'subjectNameOrId',
                value: 'jsmith@salesforce.com',
                valueDataType: 'String'
            }
        ],
        outputParameters: [],
        availableConnections: [
            {
                type: 'REGULAR'
            },
            {
                type: 'FAULT'
            }
        ],
        maxConnections: 2,
        elementType: 'ActionCall',
        dataType: 'ActionOutput',
        storeOutputAutomatically: true
    }
};

export const variableGuids = [
    numberVariableGuid,
    accountSObjectVariableGuid,
    stringCollectionVariable1Guid,
    stringCollectionVariable2Guid,
    choiceGuid,
    dateVariableGuid,
    stageGuid,
    apexSampleVariableGuid
];

export const hydratedElements = {
    [stringVariableGuid]: {
        dataType: { value: stringDataType, error: null },
        description: 'random description',
        elementType: { value: variable, error: null },
        guid: numberVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: { value: numberVariableDevName, error: 'Invalid name.' },
        subtype: null,
        value: {
            stringValue: 'fooDefault'
        }
    }
};

export const mutatedVariablesAndConstants = {
    [stringVariableGuid]: {
        dataType: { value: stringDataType, error: null },
        description: 'random description',
        elementType: variable,
        guid: stringVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: { value: stringVariableDevName, error: null },
        subtype: { value: null, error: null },
        defaultValue: {
            value: 'fooDefault',
            error: null
        }
    },
    [numberVariableGuid]: {
        dataType: { value: numberDataType, error: null },
        description: '',
        elementType: variable,
        guid: numberVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: numberVariableDevName,
        subtype: { value: null, error: null },
        defaultValue: {
            value: 45,
            error: null
        }
    },
    [dateVariableGuid]: {
        dataType: { value: dateDataType, error: null },
        description: '',
        elementType: variable,
        guid: dateVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        name: dateVariableDevName,
        subtype: { value: null, error: null },
        defaultValue: {
            value: '10/24/1995',
            error: null
        }
    },
    [stringCollectionVariable1Guid]: {
        dataType: { value: stringDataType, error: null },
        description: '',
        elementType: variable,
        guid: stringCollectionVariable1Guid,
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: stringCollectionVariable1DevName,
        subtype: { value: null, error: null },
        defaultValue: {
            value: null,
            error: null
        }
    },
    [accountSObjectVariableGuid]: {
        dataType: { value: sobjectDataType, error: null },
        description: '',
        elementType: variable,
        guid: accountSObjectVariableGuid,
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: accountSObjectVariableDevName,
        subtype: { value: account, error: null },
        defaultValue: {
            value: null,
            error: null
        }
    },
    [stringConstantGuid]: {
        dataType: { value: stringDataType, error: null },
        description: 'random description',
        elementType: constant,
        guid: stringConstantGuid,
        isCanvasElement: false,
        name: { value: stringConstantDevName, error: null },
        defaultValue: {
            value: 'fooDefault',
            error: null
        }
    }
};

export const textTemplates = {
    [textTemplateGuid]: {
        description: 'text template random description',
        elementType: textTemplate,
        guid: textTemplateGuid,
        isCanvasElement: false,
        name: { value: textTemplateDevName, error: null },
        text: { value: 'Hello {!World}', error: null },
        dataType: FLOW_DATA_TYPE.STRING.value
    }
};
