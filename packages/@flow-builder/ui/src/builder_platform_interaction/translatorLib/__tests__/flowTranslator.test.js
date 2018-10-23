import { translateFlowToUIModel } from "../flowToUiTranslator";
import { translateUIModelToFlow } from "../uiToFlowTranslator";
import { flowWithVariables } from './flowTestData/flowWithVariablesTestData';
import { flowWithAssignments } from "./flowTestData/flowWithAssignmentsTestData";
import { deepCopy, Store } from "builder_platform_interaction/storeLib";
import { flowCollectionServicesDemo } from './flowTestData/flowCollectionServicesDemo';
import { reducer } from 'builder_platform_interaction/reducers';
import { updateFlow } from 'builder_platform_interaction/actions';

// we want to use the real implementation (and we cannot use unmock ...)
jest.mock('builder_platform_interaction/storeLib', () => {
    return require.requireActual('../../storeLib/storeLib.js');
});

/**
 * Modify the expected object. This can be used when we have an expected object that is not exactly what we want.
 *
 * @param {Object} given the given
 * @param {Object} expected the expected object we want to modify
 * @param {Function} callback the function called for each property. This function can modify the expected object.
 */
export const modifyExpected = (given, expected, callback, path = '') => {
    if (given == null || expected == null) {
        return expected;
    }
    if (Array.isArray(given) && Array.isArray(expected)) {
        const length = given.length >= expected.length ? given.length : expected.length;
        for (let i = 0; i < length; i++) {
            modifyExpected(i < given.length ? given[i] : undefined, i < expected.length ? expected[i] : undefined, callback, path + `[${i}]`);
        }
    } else if (typeof given === 'object' && typeof expected === 'object') {
        for (const key in given) {
            if (Object.prototype.hasOwnProperty.call(given, key)) {
                const newPath = path + (path.length > 0 ? '.' : '') + key;
                callback(given, expected, key, given[key], expected[key], newPath);
                modifyExpected(given[key], expected[key], callback, newPath);
            }
        }
        for (const key in expected) {
            if (Object.prototype.hasOwnProperty.call(expected, key)) {
                if (!Object.prototype.hasOwnProperty.call(given, key)) {
                    const newPath = path + (path.length > 0 ? '.' : '') + key;
                    callback(given, expected, key, given[key], expected[key], newPath);
                    modifyExpected(given[key], expected[key], callback, newPath);
                }
            }
        }
    }
    return expected;
};

const isEmpty = (value) => value === "" || value == null || (Array.isArray(value) && value.length === 0);

const and = (callbacks) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    for (const callback of callbacks) {
        callback(givenElement, expectedElement, key, givenValue, expectedValue, path);
    }
};

const ignoreEmptyFields = (givenElement, expectedElement, key, givenValue, expectedValue) => {
    if (expectedElement) {
        if (isEmpty(givenValue) && expectedValue === undefined) {
            expectedElement[key] = givenValue;
        } else if (isEmpty(expectedValue) && givenValue === undefined) {
            delete expectedElement[key];
        }
    }
};

const ignoreIfNotInGiven = (paths) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    if (expectedElement) {
        if (isEmpty(givenValue) && paths.includes(path)) {
            delete expectedElement[key];
        }
    }
};

const ignoreIfNotInExpected = (paths) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    if (expectedElement) {
        if (isEmpty(expectedValue) && paths.includes(path)) {
            if (!Object.prototype.hasOwnProperty.call(expectedElement, key)) {
                delete expectedElement[key];
            } else {
                expectedElement[key] = givenValue;
            }
        }
    }
};

const stringifyExpectedNumberValue = (givenElement, expectedElement, key, givenValue, expectedValue) => {
    if (expectedElement && key === 'numberValue' && typeof expectedValue == 'number') {
        expectedElement[key] = expectedValue.toString();
    }
};

const isFlowScreenFieldElement = (element) => element.fieldType != null && element.helpText != null;

const ignoreIsVisibleForFlowScreenField = (givenElement, expectedElement, key) => {
    if (isFlowScreenFieldElement(givenElement) && key === 'isVisible') {
        delete expectedElement.isVisible;
    }
};

const replaceDateToDateJson = (givenElement, expectedElement, key, givenValue, expectedValue) => {
    if (expectedElement && key === 'dateTimeValue' && typeof expectedValue == 'string') {
        expectedElement[key] = new Date(expectedValue).toJSON();
    }
};

const getExpectedFlowMetadata = (uiFlow, flowFromMetadataAPI) => {
    const ignoredIfNotInGiven = ['createdById', 'createdDate', 'definitionId', 'id', 'lastModifiedById',
        'lastModifiedDate', 'manageableState', 'masterLabel', 'processType', 'status', 'metadata.isTemplate'];
    const ignoredIfNotInExpected = ['metadata.processMetadataValues'];
    // stringifyExpectedNumberValue : why do we have a string instead of a number in numberValue ?
    return modifyExpected(uiFlow, deepCopy(flowFromMetadataAPI),
        and([ignoreEmptyFields, ignoreIfNotInGiven(ignoredIfNotInGiven),
             ignoreIfNotInExpected(ignoredIfNotInExpected), stringifyExpectedNumberValue,
             ignoreIsVisibleForFlowScreenField, replaceDateToDateJson]));
};

describe('Getting flow metadata, calling flow-to-ui translation and calling ui-to-flow', () => {
    let store;
    beforeEach(() => {
        store = Store.getStore(reducer);
    });
    it('for variables should return same object', () => {
        const expectedFlowMetadataForVariables = flowWithVariables.metadata.variables;
        const uiFlow = translateFlowToUIModel(flowWithVariables);
        store.dispatch(updateFlow(uiFlow));
        const actualFlowMetadataForVariables = translateUIModelToFlow(uiFlow).metadata.variables;
        expect(actualFlowMetadataForVariables).toMatchObject(expectedFlowMetadataForVariables);
    });
    it('for assignments should return same object', () => {
        const expectedFlowMetadataForAssignments = flowWithAssignments.metadata.assignments;
        const uiFlow = translateFlowToUIModel(flowWithAssignments);
        store.dispatch(updateFlow(uiFlow));
        const actualFlowMetadataForAssignments = translateUIModelToFlow(uiFlow).metadata.assignments;
        expect(actualFlowMetadataForAssignments).toMatchObject(expectedFlowMetadataForAssignments);
    });
    it('returns the same metadata for a sample flow', () => {
        // TODO : we want to use a flow that have all possible elements
        const uiFlow = translateFlowToUIModel(flowCollectionServicesDemo);
        store.dispatch(updateFlow(uiFlow));
        const newMetadataFlow = translateUIModelToFlow(uiFlow);
        const expected = getExpectedFlowMetadata(newMetadataFlow, flowCollectionServicesDemo);
        expect(newMetadataFlow).toEqual(expected);
    });
});