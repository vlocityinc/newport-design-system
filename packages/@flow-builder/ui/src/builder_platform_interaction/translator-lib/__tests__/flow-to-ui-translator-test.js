import { convertElement, convertElements, swapDevNamesToGuids, translateFlowToUIModel } from '../flow-to-ui-translator';
import { ELEMENT_TYPE } from "builder_platform_interaction-constant";
import { deepCopy } from "builder_platform_interaction-store-lib";
import { cleanFlowSample } from "./flow-translator.test";

function isUid(potential, prefix) {
    prefix = String(prefix || '').replace(/[^a-zA-Z]/g, '') || 'uid';
    return new RegExp(prefix + '_\\d+');
}


const ASSIGNMENT_1 = {
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
};
const ASSIGNMENT_2 = {
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
};

const ASSIGNMENTS = [ASSIGNMENT_1, ASSIGNMENT_2];

const ASSIGNMENT_TYPE = 'assignment';
const IS_CANVAS = true;

describe('Flow To UI Translator', () => {
    it('Converts a single element from Flow to UI', () => {
        const converted = convertElement(ASSIGNMENT_1, ELEMENT_TYPE.ASSIGNMENT, IS_CANVAS);

        expect(converted.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
        expect(converted.isCanvasElement).toBeTruthy();

        expect(converted.config).toBeDefined();
        expect(converted.connector.config).toBeDefined();
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

    it('converts dev names to uids', () => {
        const nameToGuid = {swapMe:'swapMe_12'};
        const object = {items:[{first:{targetReference:'swapMe'}}]};
        swapDevNamesToGuids(nameToGuid, object);

        expect(object.items[0].first.targetReference).toEqual('swapMe_12');
    });

    it('Does Full Conversion', () => {
        const sampleFlow = cleanFlowSample();
        const uiFlow = translateFlowToUIModel(sampleFlow);

        // expect(uiFlow.elements.keys.length).toBe
        expect(uiFlow).toBeTruthy();
    });
});
