import {translateUIModelToFlow} from '../ui-to-flow-translator';

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
        }
    },
    'properties': {
        'label': 'bestFlowLabel',
        'interviewLabel': 'decision {!$Flow.CurrentDateTime}',
        'processType': 'AutoLaunchedFlow',
        'fullName': 'bestFlow'
    },
    'variables': ['VARIABLE_4', 'VARIABLE_5'],
    'canvasElements': ['ASSIGNMENT_0', 'DECISION_3'],
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
});
