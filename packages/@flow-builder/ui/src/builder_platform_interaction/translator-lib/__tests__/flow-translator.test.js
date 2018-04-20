import { translateFlowToUIModel } from '../flow-to-ui-translator';
import { translateUIModelToFlow } from '../ui-to-flow-translator';
import { deepCopy, isPlainObject } from 'builder_platform_interaction-store-lib';

// Fetchable from browser xhr
export const sampleFlow = {
    "createdById": "005xx000001Sv6KAAS",
    "createdDate": "2018-01-26T16:59:43.000+0000",
    "definitionId": "300xx00000002beAAA",
    "fieldsToNull": [],
    "fullName": "screenFlow-1",
    "id": "301xx000000000BAAQ",
    "lastModifiedById": "005xx000001Sv6KAAS",
    "lastModifiedDate": "2018-01-26T16:59:51.000+0000",
    "manageableState": "unmanaged",
    "masterLabel": "screenFlow",
    "metadata": {
        "actionCalls": [
            {
                "actionName": "Case.LogACall",
                "actionType": "quickAction",
                "connector": {
                    "processMetadataValues": [],
                    "targetReference": "postToChatter"
                },
                "inputParameters": [
                    {
                        "name": "contextId",
                        "processMetadataValues": []
                    }
                ],
                "label": "logACall",
                "locationX": 212,
                "locationY": 115,
                "name": "logACall",
                "outputParameters": [],
                "processMetadataValues": []
            },
            {
                "actionName": "chatterPost",
                "actionType": "chatterPost",
                "connector": {
                    "processMetadataValues": [],
                    "targetReference": "lookUpAccountAnnotation"
                },
                "inputParameters": [
                    {
                        "name": "subjectNameOrId",
                        "processMetadataValues": []
                    },
                    {
                        "name": "text",
                        "processMetadataValues": []
                    }
                ],
                "label": "postToChatter",
                "locationX": 194,
                "locationY": 272,
                "name": "postToChatter",
                "outputParameters": [],
                "processMetadataValues": []
            },
            {
                "actionName": "lookUpAccountAnnotation",
                "actionType": "apex",
                "connector": {
                    "processMetadataValues": [],
                    "targetReference": "lookUpAccountPlugin"
                },
                "inputParameters": [],
                "label": "lookUpAccountAnnotation",
                "locationX": 422,
                "locationY": 105,
                "name": "lookUpAccountAnnotation",
                "outputParameters": [],
                "processMetadataValues": []
            }
        ],
        "apexPluginCalls": [
            {
                "apexClass": "lookUpAccountPlugin",
                "inputParameters": [
                    {
                        "name": "name",
                        "processMetadataValues": []
                    }
                ],
                "label": "lookUpAccountPlugin",
                "locationX": 627,
                "locationY": 98,
                "name": "lookUpAccountPlugin",
                "outputParameters": [],
                "processMetadataValues": []
            }
        ],
        "assignments": [{
            "assignmentItems": [{
                "assignToReference": "var",
                "operator": "Assign",
                "processMetadataValues": [],
                "value": {
                    "elementReference": "var"
                }
            }],
            "connector": {
                "processMetadataValues": [],
                "targetReference": "Second_Assignment"
            },
            "label": "Assignment",
            "locationX": 482,
            "locationY": 130,
            "name": "Assignment",
            "processMetadataValues": []
        }, {
            "assignmentItems": [{
                "assignToReference": "num2",
                "operator": "Add",
                "processMetadataValues": [],
                "value": {
                    "elementReference": "num1"
                }
            }],
            "connector": {
                "processMetadataValues": [],
                "targetReference": "DecisionNode"
            },
            "label": "Second Assignment",
            "locationX": 530,
            "locationY": 254,
            "name": "Second_Assignment",
            "processMetadataValues": []
        }],
        "decisions": [{
            "defaultConnector": {
                "processMetadataValues": [],
                "targetReference": "Screen"
            },
            "defaultConnectorLabel": "DefaultOutcome",
            "label": "DecisionNode",
            "locationX": 272,
            "locationY": 265,
            "name": "DecisionNode",
            "processMetadataValues": [],
            "rules": [{
                "conditionLogic": "and",
                "conditions": [{
                    "leftValueReference": "num1",
                    "operator": "EqualTo",
                    "processMetadataValues": [],
                    "rightValue": {
                        "elementReference": "num2"
                    }
                }],
                "connector": {
                    "processMetadataValues": [],
                    "targetReference": "Assignment"
                },
                "label": "Outcome1",
                "name": "Outcome1",
                "processMetadataValues": []
            }]
        }],
        "interviewLabel": "screenFlow {!$Flow.CurrentDateTime}",
        "label": "screenFlow",
        "processMetadataValues": [],
        "processType": "Flow",
        "screens": [{
            "allowBack": true,
            "allowFinish": true,
            "allowPause": true,
            "connector": {
                "processMetadataValues": [],
                "targetReference": "Assignment"
            },
            "fields": [],
            "label": "Screen",
            "locationX": 276,
            "locationY": 130,
            "name": "Screen",
            "processMetadataValues": [],
            "rules": [],
            "showFooter": true,
            "showHeader": true
        }],
        "startElementReference": "Screen",
        "variables": [{
            "dataType": "Number",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "num1",
            "processMetadataValues": [],
            "scale": 2
        }, {
            "dataType": "Number",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "num2",
            "processMetadataValues": [],
            "scale": 2,
            "value": {
                "numberValue": 5.0
            }
        }, {
            "dataType": "String",
            "isCollection": false,
            "isInput": false,
            "isOutput": false,
            "name": "var",
            "processMetadataValues": [],
            "scale": 0
        }],
        "waits": []
    },
    "processType": "Flow",
    "status": "Draft",
    "versionNumber": 1
};

// Server side sends down more fields than we expect/need
// this list should be trimmed down
const EXTRA_FIELDS = ["createdById",
    "createdDate",
    "definitionId",
    "fieldsToNull",
    "id",
    "lastModifiedById",
    "lastModifiedDate",
    "manageableState",
    "masterLabel",
    "processType",
    "status"
];

// Only a small subset of elements are enabled right now
// this list should be trimmed down and eventually removed
//
// This list can be deleted soonish if we find no issues with the minimal translation support
export const FUTURE_ELEMENTS = [
    "screens",
    "choices",
    "constants",
    "dynamicChoiceSets",
    "formulas",
    "loops",
    "processMetadataValues",
    "recordCreates",
    "recordDeletes",
    "recordLookups",
    "recordUpdates",
    "stages",
    "startElementReference",
    "steps",
    "textTemplates",
    "waits"];


// The database/server provide many fields that aren't yet used/supported by the client
// in order to get a clean comparison of before and after it's best to strip out this extra
// data
//
// The field processMetadataValues appears throughout the metadats but is only used by
// process builder ( any possibly other builders )
const cleanData = (object) => {
    if (Array.isArray(object)) {
        object.forEach(element => {
            cleanData(element);
        });
    } else if (isPlainObject(object)) {
        Object.keys(object).forEach(objectKey => {
            const value = object[objectKey];
            if (objectKey === 'processMetadataValues') {
                delete object[objectKey];
            }
            cleanData(value);
        });
    }
};


// The database/server provide many fields that aren't yet used/supported by the client
// in order to get a clean comparison of before and after it's best to strip out this extra
// data
//
// Since the translator also modifies the data without creating a copy we need to create a
// deep copy of the data in order to reuse it and compare it reliably
export const cleanFlowSample = function () {
    const flow = deepCopy(sampleFlow);
    cleanData(flow);

    EXTRA_FIELDS.forEach(field => {
        delete flow[field];
    });
    FUTURE_ELEMENTS.forEach(key => {
        // added in limited support for all elements to make testing easier, which was then removed
        delete flow.metadata[key];
    });
    return flow;
};

describe('Flow Translator', () => {
    it('Converts Losslessly', () => {
        const uiFlow = translateFlowToUIModel(cleanFlowSample());
        const flow = translateUIModelToFlow(uiFlow);
        const cleanFlow = cleanFlowSample();
        expect(flow.metadata).toEqual(cleanFlow.metadata);
        expect(flow.fullName).toEqual(cleanFlow.fullName);
    });
});
