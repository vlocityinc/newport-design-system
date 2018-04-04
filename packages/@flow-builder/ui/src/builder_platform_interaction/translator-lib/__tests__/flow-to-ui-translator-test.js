import {convertElement, convertElements, translateFlowToUIModel} from '../flow-to-ui-translator';
import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';
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

describe('Flow To UI Translator', () => {
    it('Converts a single element from Flow to UI', () => {
        const converted = convertElement(ASSIGNMENT_1, ELEMENT_TYPE.ASSIGNMENT, true);

        expect(converted.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
        expect(isUid(converted.guid)).toBeTruthy();
        expect(converted.isCanvasElement).toBeTruthy();
        expect(converted.config).toBeDefined();

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
            const converted = convertElements(deepCopy([DECISION]), ELEMENT_TYPE.DECISION, true);

            let convertedDecision;
            converted.forEach(element => {
                if (element.elementType === ELEMENT_TYPE.DECISION) {
                    convertedDecision = element;
                }
            });

            expect(convertedDecision.outcomeReferences).toHaveLength(2);
        });
    });

    describe('action calls', () => {
        it('Converts Flow to UI', () => {
            const sampleFlow = cleanFlowSample();
            const uiFlow = translateFlowToUIModel(sampleFlow);

            expect(uiFlow).toBeTruthy();
            expect(Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.ACTION_CALL)).toHaveLength(2);
            expect(Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.APEX_CALL)).toHaveLength(1);
        });
    });

    it('Converts Elements from Flow to UI', () => {
        const converted = convertElements(deepCopy(ASSIGNMENTS), ELEMENT_TYPE.ASSIGNMENT, true);

        expect(Object.keys(converted)).toHaveLength(ASSIGNMENTS.length);

        converted.forEach(element => {
            expect(element.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
            expect(element.guid).toBeDefined();
            expect(element.isCanvasElement).toBeTruthy();
            expect(element.config).toBeDefined();
        });
    });

    it('Does Full Conversion', () => {
        const sampleFlow = cleanFlowSample();
        const uiFlow = translateFlowToUIModel(sampleFlow);

        expect(uiFlow).toBeTruthy();
    });
});
