import {convertElement, convertElements, translateFlowToUIModel} from '../flow-to-ui-translator';
import {ELEMENT_TYPE} from 'builder_platform_interaction-constant';
import {deepCopy} from 'builder_platform_interaction-store-lib';
import {cleanFlowSample} from './flow-translator.test';

function isUid(potential, prefix) {
    prefix = String(prefix || '').replace(/[^a-zA-Z]/g, '') || 'uid';
    return new RegExp(prefix + '_\\d+');
}


const ASSIGNMENT_1 = {
    'assignmentItems': [{
        'assignToReference': 'var',
        'operator': 'Assign',
        'processMetadataValues': [],
        'value': {
            'elementReference': 'var'
        }
    }],
    'connector': {
        'processMetadataValues': [],
        'targetReference': 'Second_Assignment'
    },
    'label': 'Assignment',
    'locationX': 482,
    'locationY': 130,
    'name': 'Assignment',
    'processMetadataValues': []
};
const ASSIGNMENT_2 = {
    'assignmentItems': [{
        'assignToReference': 'num2',
        'operator': 'Add',
        'processMetadataValues': [],
        'value': {
            'elementReference': 'num1'
        }
    }],
    'connector': {
        'processMetadataValues': [],
        'targetReference': 'DecisionNode'
    },
    'label': 'Second Assignment',
    'locationX': 530,
    'locationY': 254,
    'name': 'Second_Assignment',
    'processMetadataValues': []
};

const DECISION = {
    'defaultConnectorLabel': '[Default Outcome]',
    'label': 'd',
    'locationX': 354,
    'locationY': 168,
    'name': 'd',
    'processMetadataValues': [],
    'rules': [{
        'conditionLogic': 'and',
        'conditions': [{
            'leftValueReference': '$Flow.ActiveStages',
            'operator': 'Contains',
            'processMetadataValues': [],
            'rightValue': {'elementReference': 'v1'}
        }, {
            'leftValueReference': 'v1',
            'operator': 'EqualTo',
            'processMetadataValues': [],
            'rightValue': {'stringValue': '2'}
        }, {
            'leftValueReference': 'v2',
            'operator': 'EqualTo',
            'processMetadataValues': [],
            'rightValue': {'stringValue': '43'}
        }],
        'label': 'o1',
        'name': 'o1',
        'processMetadataValues': []
    }, {
        'conditionLogic': 'and',
        'conditions': [{
            'leftValueReference': 'o1',
            'operator': 'EqualTo',
            'processMetadataValues': [],
            'rightValue': {'elementReference': 'o1'}
        }],
        'label': 'o2',
        'name': 'o2',
        'processMetadataValues': []
    }]
};

const ASSIGNMENTS = [ASSIGNMENT_1, ASSIGNMENT_2];

const ASSIGNMENT_TYPE = 'assignment';
const IS_CANVAS = true;

describe('Flow To UI Translator', () => {
    it('sets maxConnections from node config', () => {
        const mockElementConfig = {
            maxConnections: 5
        };

        const elementConfig = require.requireActual('builder_platform_interaction-element-config');
        elementConfig.getConfigForElementType = jest.fn().mockReturnValue(mockElementConfig);

        const converted = convertElement(ASSIGNMENT_1, ELEMENT_TYPE.ASSIGNMENT, IS_CANVAS);

        expect(converted.maxConnections).toEqual(mockElementConfig.maxConnections);
    });

    it('sets connector count to 0 if no connector', () => {
        const converted = convertElement(DECISION, ELEMENT_TYPE.DECISION, IS_CANVAS);

        expect(converted.connectorCount).toEqual(0);
    });

    it('sets connector count to 1 if connector present', () => {
        const converted = convertElement(ASSIGNMENT_1, ELEMENT_TYPE.ASSIGNMENT, IS_CANVAS);

        expect(converted.connectorCount).toEqual(1);
    });

    it('Converts a single element from Flow to UI', () => {
        const converted = convertElement(ASSIGNMENT_1, ELEMENT_TYPE.ASSIGNMENT, IS_CANVAS);

        expect(converted.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
        expect(converted.isCanvasElement).toBeTruthy();

        expect(converted.config).toBeDefined();
        expect(converted.connector.config).toBeDefined();

        // TODO: test other attributes set
    });

    describe('decision', () => {
        it('Converts Flow to UI', () => {
            const converted = convertElement(DECISION, ELEMENT_TYPE.DECISION, true);

            expect(converted.elementType).toEqual(ELEMENT_TYPE.DECISION);
            expect(converted.isCanvasElement).toBeTruthy();

            expect(converted.config).toBeDefined();
        });

        it('Converts outcome Flow to UI', () => {
            const converted = convertElement(DECISION.rules[0], ELEMENT_TYPE.OUTCOME, false);

            expect(converted.elementType).toEqual(ELEMENT_TYPE.OUTCOME);
            expect(converted.isCanvasElement).toBeFalsy();
        });

        it('Converts rules to outcomeReferences', () => {
            const nameToGuid = {};
            const converted = convertElements(nameToGuid, deepCopy([DECISION]), ELEMENT_TYPE.DECISION, true);
            const decisionKey = nameToGuid.d;

            const convertedDecision = converted[decisionKey];

            expect(convertedDecision.outcomeReferences).toHaveLength(2);
        });
    });

    it('Converts Elements from Flow to UI', () => {
        const nameToGuid = {};
        const converted = convertElements(nameToGuid, deepCopy(ASSIGNMENTS), ASSIGNMENT_TYPE, IS_CANVAS);

        expect(Object.keys(converted)).toHaveLength(ASSIGNMENTS.length);

        const assignmentKey = nameToGuid.Assignment;
        const convertedAssignment = converted[assignmentKey];

        expect(convertedAssignment.guid).toEqual(assignmentKey);
        expect(isUid(convertedAssignment.guid)).toBeTruthy();
    });

    it('Does Full Conversion', () => {
        const sampleFlow = cleanFlowSample();
        const uiFlow = translateFlowToUIModel(sampleFlow);

        expect(uiFlow).toBeTruthy();
    });
});
