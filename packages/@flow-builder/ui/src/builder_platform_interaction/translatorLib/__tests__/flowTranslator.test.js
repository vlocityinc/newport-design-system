import { readonly } from 'lwc';
import { translateFlowToUIModel } from "../flowToUiTranslator";
import { translateUIModelToFlow } from "../uiToFlowTranslator";
import { flowWithVariables } from 'mock/flows/flowWithVariables';
import { flowWithAssignments } from "mock/flows/flowWithAssignments";
import { deepCopy, Store } from "builder_platform_interaction/storeLib";
import { flowCollectionServicesDemo } from 'mock/flows/flowCollectionServicesDemo';
import { reducer } from 'builder_platform_interaction/reducers';
import { updateFlow } from 'builder_platform_interaction/actions';
import { flowLegalNameChange } from 'mock/flows/flowLegalNameChange';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';

expect.extend(deepFindMatchers);

const SAMPLE_FLOWS = [flowLegalNameChange, flowCollectionServicesDemo, flowWithVariables, flowWithAssignments];

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
export const modifyExpected = (given, expected, callback, path = []) => {
    if (given == null || expected == null) {
        return expected;
    }
    given = readonly(given);
    if (Array.isArray(given) && Array.isArray(expected)) {
        const length = given.length >= expected.length ? given.length : expected.length;
        for (let i = 0; i < length; i++) {
            modifyExpected(i < given.length ? given[i] : undefined, i < expected.length ? expected[i] : undefined, callback, [...path, i]);
        }
    } else if (typeof given === 'object' && typeof expected === 'object') {
        for (const key in given) {
            if (Object.prototype.hasOwnProperty.call(given, key)) {
                const newPath = [...path, key];
                callback(given, expected, key, given[key], expected[key], newPath);
                modifyExpected(given[key], expected[key], callback, newPath);
            }
        }
        for (const key in expected) {
            if (Object.prototype.hasOwnProperty.call(expected, key)) {
                if (!Object.prototype.hasOwnProperty.call(given, key)) {
                    const newPath = [...path, key];
                    callback(given, expected, key, given[key], expected[key], newPath);
                    modifyExpected(given[key], expected[key], callback, newPath);
                }
            }
        }
    }
    return expected;
};

const isEmpty = (value) => value === "" || value == null || (Array.isArray(value) && value.length === 0);

const all = (callbacks) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
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

/**
 * Test if path1 is the same path than path2
 * @param {string[]} path1 first path
 * @param {string[]} path2 second path
 * @returns {boolean} true if path1 is same path than path2
 */
const isSamePath = (path1, path2) => {
    let i = path1.length;
    if (i !== path2.length) {
        return false;
    }
    while (i--) {
        if (path1[i] !== path2[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Test if a path is included in a given array of paths
 * @param {string[][]} paths array of paths
 * @param {string[]} path path
 * @returns {boolean} true if path is included in paths
 */
const isPathIncluded = (paths, path) => {
    return paths.find(pathFromArray => isSamePath(pathFromArray, path)) !== undefined;
};

const ignoreIfNotInGiven = (paths) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    if (expectedElement) {
        if (isEmpty(givenValue) && isPathIncluded(paths, path)) {
            delete expectedElement[key];
        }
    }
};

const ignoreIfNotInExpected = (paths) => (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    if (expectedElement) {
        if (isEmpty(expectedValue) && isPathIncluded(paths, path)) {
            if (!Object.prototype.hasOwnProperty.call(expectedElement, key)) {
                delete expectedElement[key];
            } else {
                expectedElement[key] = givenValue;
            }
        }
    }
};

const stringifyExpectedNumberValue = (givenElement, expectedElement, key, givenValue, expectedValue) => {
    if (expectedElement && (key === 'numberValue' || key === 'limit') && typeof expectedValue == 'number') {
        expectedElement[key] = expectedValue.toString();
    }
};

const ignoreIfDefaultValue = (givenElement, expectedElement, key, givenValue, expectedValue, path) => {
    if (!isEmpty(givenValue)) {
        return;
    }
    // default value is 0 for limit
    if (key === 'limit' && expectedValue === 0 && path[path.length - 3] === 'dynamicChoiceSets') {
        delete expectedElement.limit;
    }
    // isVisible is "Reserved for future use"
    if (key === 'isVisible' && expectedValue === false && path[path.length - 3] === 'fields') {
        delete expectedElement.isVisible;
    }
};

const getExpectedFlowMetadata = (uiFlow, flowFromMetadataAPI) => {
    const ignoredIfNotInGiven = [['createdById'], ['createdDate'], ['definitionId'], ['id'], ['lastModifiedById'],
        ['lastModifiedDate'], ['manageableState'], ['masterLabel'], ['processType'], ['status'], ['metadata', 'isTemplate']];
    const ignoredIfNotInExpected = [['metadata', 'processMetadataValues']];
    // TODO W-5583918 stringifyExpectedNumberValue : it would be better to have a number instead of a string
    return modifyExpected(uiFlow, deepCopy(flowFromMetadataAPI),
        all([ignoreEmptyFields, ignoreIfNotInGiven(ignoredIfNotInGiven),
             ignoreIfNotInExpected(ignoredIfNotInExpected), stringifyExpectedNumberValue,
             ignoreIfDefaultValue]));
};

describe('Getting flow metadata, calling flow-to-ui translation and calling ui-to-flow', () => {
    let store;
    beforeEach(() => {
        store = Store.getStore(reducer);
    });
    SAMPLE_FLOWS.forEach(metadataFlow => {
        it(`returns the same metadata for sample flow ${metadataFlow.fullName}`, () => {
            const uiFlow = translateFlowToUIModel(metadataFlow);
            expect(uiFlow).toHaveNoCommonMutableObjectWith(metadataFlow);
            store.dispatch(updateFlow(uiFlow));
            const newMetadataFlow = translateUIModelToFlow(uiFlow);
            const expected = getExpectedFlowMetadata(newMetadataFlow, metadataFlow);
            expect(newMetadataFlow).toEqual(expected);
        });
    });
});