import { convertElement, convertElements, translateFlowToUIModel } from "../flowToUiTranslator";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { deepCopy } from "builder_platform_interaction/storeLib";
import { cleanFlowSample } from "./flowTranslator.test";

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

    describe('Header', () => {
        it('Flow Properties', () => {
            const sampleFlow = cleanFlowSample();
            const uiFlow = translateFlowToUIModel(sampleFlow);

            expect(uiFlow.properties.fullName).toEqual('screenFlow-1');
            expect(uiFlow.properties.versionNumber).toEqual(1);
        });
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
        let uiFlow;
        beforeAll(() => {
            const sampleFlow = cleanFlowSample();
            uiFlow = translateFlowToUIModel(sampleFlow);
        });
        it('are translated to UI elements', () => {
            const actionCallElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.ACTION_CALL);
            const apexCallElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.APEX_CALL);
            expect(actionCallElements).toHaveLength(2);
            expect(apexCallElements).toHaveLength(1);
        });
        it('are canvas elements in UI model', () => {
            const actionCallElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.ACTION_CALL);
            const apexCallElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.APEX_CALL);
            expect(uiFlow.canvasElements).toEqual(expect.arrayContaining([...actionCallElements, ...apexCallElements].map(element => element.guid)));
        });
    });

    describe('formulas', () => {
        let uiFlow;
        beforeAll(() => {
            const sampleFlow = cleanFlowSample();
            uiFlow = translateFlowToUIModel(sampleFlow);
        });
        it('are translated to UI elements', () => {
            const formulaElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.FORMULA);
            expect(formulaElements).toHaveLength(1);
        });
        it('are not canvas elements in UI model', () => {
            const formulaElements = Object.values(uiFlow.elements).filter(element => element.elementType === ELEMENT_TYPE.FORMULA);
            const formulaGuids = formulaElements.map(element => element.guid);
            expect(uiFlow.canvasElements.some(guid => formulaGuids.indexOf(guid) >= 0)).toBe(false);
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
