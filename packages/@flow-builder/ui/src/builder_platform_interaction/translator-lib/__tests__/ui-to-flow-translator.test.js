import {translateUIModelToFlow} from '../ui-to-flow-translator';
import { PROCESS_METADATA_VALUES } from 'builder_platform_interaction-flow-metadata';

const UI_MODEL = {
    'elements': {
        'ASSIGNMENT_0': {
            'assignmentItems': [{
                'assignToReference': 'VARIABLE_4',
                'operator': 'Assign',
                'processMetadataValues': [],
                'value': {'stringValue': '2'}
            }],
            'label': 'a1',
            'locationX': 173,
            'locationY': 188,
            'name': 'a1',
            'processMetadataValues': [],
            'elementType': 'ASSIGNMENT',
            'isCanvasElement': true,
            'config': {'isSelected': false},
            'maxConnections': 1,
            'connectorCount': 0,
            'guid': 'ASSIGNMENT_0'
        },
        'OUTCOME_1': {
            'conditionLogic': 'and',
            'conditions': [{
                'leftValueReference': '$Flow.ActiveStages',
                'operator': 'Contains',
                'processMetadataValues': [],
                'rightValue': {'elementReference': 'VARIABLE_4'}
            }, {
                'leftValueReference': 'VARIABLE_4',
                'operator': 'EqualTo',
                'processMetadataValues': [],
                'rightValue': {'stringValue': '2'}
            }, {
                'leftValueReference': 'VARIABLE_5',
                'operator': 'EqualTo',
                'processMetadataValues': [],
                'rightValue': {'stringValue': '43'}
            }],
            'label': 'o1',
            'name': 'o1',
            'processMetadataValues': [],
            'elementType': 'OUTCOME',
            'isCanvasElement': false,
            'guid': 'OUTCOME_1'
        },
        'OUTCOME_2': {
            'conditionLogic': 'and',
            'conditions': [{
                'leftValueReference': 'OUTCOME_1',
                'operator': 'EqualTo',
                'processMetadataValues': [],
                'rightValue': {'elementReference': 'OUTCOME_1'}
            }],
            'label': 'o2',
            'name': 'o2',
            'processMetadataValues': [],
            'elementType': 'OUTCOME',
            'isCanvasElement': false,
            'guid': 'OUTCOME_2'
        },
        'DECISION_3': {
            'defaultConnectorLabel': '[Default Outcome]',
            'label': 'd',
            'locationX': 354,
            'locationY': 168,
            'name': 'd',
            'processMetadataValues': [],
            'elementType': 'DECISION',
            'isCanvasElement': true,
            'config': {'isSelected': false},
            'maxConnections': 1,
            'connectorCount': 0,
            'outcomeReferences': [{'outcomeReference': 'OUTCOME_1'}, {'outcomeReference': 'OUTCOME_2'}],
            'guid': 'DECISION_3'
        },
        'VARIABLE_4': {
            'dataType': 'String',
            'isCollection': false,
            'isInput': false,
            'isOutput': false,
            'name': 'v1',
            'processMetadataValues': [],
            'scale': 0,
            'value': {'stringValue': 'test'},
            'elementType': 'VARIABLE',
            'isCanvasElement': false,
            'guid': 'VARIABLE_4'
        },
        'VARIABLE_5': {
            'dataType': 'String',
            'isCollection': false,
            'isInput': false,
            'isOutput': false,
            'name': 'v2',
            'processMetadataValues': [],
            'scale': 0,
            'elementType': 'VARIABLE',
            'isCanvasElement': false,
            'guid': 'VARIABLE_5'
        },
        "ACTIONCALL_6": {
            "actionName": "Case.LogACall",
            "actionType": "quickAction",
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
            "processMetadataValues": [],
            "elementType": "ACTION_CALL",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 0,
            "guid": "ACTIONCALL_6"
        },
        "APEXCALL_7": {
            "actionName": "lookUpAccountAnnotation",
            "actionType": "apex",
            "inputParameters": [],
            "label": "lookUpAccountAnnotation",
            "locationX": 422,
            "locationY": 105,
            "name": "lookUpAccountAnnotation",
            "outputParameters": [],
            "processMetadataValues": [],
            "elementType": "APEX_CALL",
            "isCanvasElement": true,
            "config": {
                "isSelected": false
            },
            "maxConnections": 1,
            "connectorCount": 0,
            "guid": "APEXCALL_7"
        },
        "FORMULA_8": {
            "dataType": "Number",
            "expression": "2+2",
            "name": "myFormula",
            "processMetadataValues": [],
            "scale": 2,
            "elementType": "FORMULA",
            "guid": "FORMULA_8",
            "isCanvasElement": false
        }
    },
    'properties': {
        'label': 'bestFlowLabel',
        'interviewLabel': 'decision {!$Flow.CurrentDateTime}',
        'processType': 'AutoLaunchedFlow',
        'fullName': 'bestFlow'
    },
    'canvasElements': ['ASSIGNMENT_0', 'DECISION_3', 'ACTIONCALL_6', 'APEXCALL_7'],
    'connectors': []
};


describe('UI to Flow Translator', () => {
    it('includes fullName', () => {
        const flow = translateUIModelToFlow(UI_MODEL);

        expect(flow.fullName).toEqual('bestFlow');
    });

    it('translates assignments', () => {
        const flow = translateUIModelToFlow(UI_MODEL);

        expect(flow.metadata.assignments).toHaveLength(1);
        expect(flow.metadata.assignments[0].assignmentItems[0].assignToReference).toEqual('v1');
    });

    it('translates decisions', () => {
        const flow = translateUIModelToFlow(UI_MODEL);
        const decision = flow.metadata.decisions[0];

        expect(flow.metadata.decisions).toHaveLength(1);

        expect(decision.rules).toHaveLength(2);
        expect(decision.rules[0].name).toEqual('o1');
        expect(decision.rules[1].name)  .toEqual('o2');
    });

    it('translates action calls', () => {
        const flow = translateUIModelToFlow(UI_MODEL);

        expect(flow.metadata.actionCalls).toHaveLength(2);
    });

    it('adds BuilderType to processMetadataValues', () => {
        const flow = translateUIModelToFlow(UI_MODEL);
        expect(flow.metadata.processMetadataValues).toEqual(PROCESS_METADATA_VALUES);
    });

    it('translates formulas', () => {
        const flow = translateUIModelToFlow(UI_MODEL);

        expect(flow.metadata.formulas).toHaveLength(1);
    });
});
