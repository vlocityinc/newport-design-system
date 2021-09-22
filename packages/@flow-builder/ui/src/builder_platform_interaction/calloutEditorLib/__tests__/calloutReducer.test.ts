// @ts-nocheck
import {
    mergeWithInputOutputParameters,
    mergeWithInputOutputVariables,
    updateParameterItemByProperty,
    deleteParameterItemByProperty,
    removeUnsetParametersByProperty
} from '../calloutEditorLib';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { actionCallAutomaticOutput, emailAlertOnAccount, subflowAutomaticOutput } from 'mock/storeData';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';

describe('mergeWithInputOutputParameters', () => {
    it('sets "storeOutputAutomatically" from true to false if no output parameters', () => {
        const currentState = {
            ...emailAlertOnAccount,
            storeOutputAutomatically: true
        };
        const newState = mergeWithInputOutputParameters(currentState, []);
        expect(newState.storeOutputAutomatically).toBe(false);
    });

    it('keeps "storeOutputAutomatically" set to false if no output parameters', () => {
        const currentState = {
            ...emailAlertOnAccount
        };
        expect(currentState.storeOutputAutomatically).toBe(false);
        const newState = mergeWithInputOutputParameters(currentState, []);
        expect(newState.storeOutputAutomatically).toBe(false);
    });

    it('keeps "storeOutputAutomatically" set to true if output parameters present', () => {
        const currentState = {
            ...actionCallAutomaticOutput
        };
        const newState = mergeWithInputOutputParameters(currentState, chatterPostActionDetails.parameters);
        expect(newState.storeOutputAutomatically).toBe(true);
    });
});

describe('mergeWithInputOutputVariables', () => {
    it('sets "storeOutputAutomatically" from true to false for subflow if no output parameters', () => {
        const currentState = {
            ...subflowAutomaticOutput,
            storeOutputAutomatically: true
        };
        const newState = mergeWithInputOutputVariables(currentState, []);
        expect(newState.storeOutputAutomatically).toBe(false);
    });
});

let currentParam;

describe('updateParameterItemByProperty', () => {
    beforeEach(() => {
        currentParam = {
            rowIndex: '54aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'v1',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
    });
    it('updates an inputs param', () => {
        // Arrange
        const paramsProp = 'inputs';
        const updatedParam = updateProperties(currentParam, { value: 'v2' });
        const otherParam = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'irrelevant',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [currentParam, otherParam]
        };

        // Act
        const newState = updateParameterItemByProperty(currentState, updatedParam, paramsProp);

        // Assert
        expect(newState[paramsProp][0].value.value).toStrictEqual('v2');
        expect(newState[paramsProp[1]]).toStrictEqual(currentState[paramsProp[1]]);
    });

    it('updates an output param', () => {
        // Arrange
        const paramsProp = 'outputs';
        currentParam = updateProperties(currentParam, {
            value: { value: 'v1', error: null },
            valueDataType: { value: 'String', error: null },
            isInput: false
        });
        const updatedParam = updateProperties(currentParam, { value: 'v2' });
        const otherParam = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'irrelevant',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [currentParam, otherParam]
        };

        // Act
        const newState = updateParameterItemByProperty(currentState, updatedParam, paramsProp);

        // Assert
        expect(newState[paramsProp][0].value.value).toStrictEqual('v2');
        expect(newState[paramsProp[1]]).toStrictEqual(currentState[paramsProp[1]]);
    });

    it('updates an output param to value = null when updated with an empty string', () => {
        // Arrange
        const paramsProp = 'outputs';
        currentParam = updateProperties(currentParam, {
            isInput: false
        });
        const updatedParam = updateProperties(currentParam, { value: '' });
        const otherParam = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'irrelevant',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [currentParam, otherParam]
        };

        // Act
        const newState = updateParameterItemByProperty(currentState, updatedParam, paramsProp);

        // Assert
        expect(newState[paramsProp][0].value.value).toStrictEqual(null);
        expect(newState[paramsProp[1]]).toStrictEqual(currentState[paramsProp[1]]);
    });
});

describe('deleteParameterItemByProperty', () => {
    beforeEach(() => {
        currentParam = {
            rowIndex: '54aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'v1',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
    });
    it('deletes an inputs param', () => {
        // Arrange
        const paramsProp = 'inputs';
        const otherParam = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'irrelevant',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [currentParam, otherParam]
        };

        // Act
        const newState = deleteParameterItemByProperty(currentState, currentParam, paramsProp);

        // Assert
        expect(newState[paramsProp]).toHaveLength(1);
        expect(newState[paramsProp][0]).toBe(otherParam);
    });

    it('deletes an output param', () => {
        // Arrange
        const paramsProp = 'outputs';
        currentParam = updateProperties(currentParam, {
            isInput: false
        });
        const otherParam = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'irrelevant',
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [currentParam, otherParam]
        };

        // Act
        const newState = deleteParameterItemByProperty(currentState, currentParam, paramsProp);

        // Assert
        expect(newState[paramsProp]).toHaveLength(1);
        expect(newState[paramsProp][0]).toBe(otherParam);
    });
});

describe('removeUnsetParametersByProperty', () => {
    it('removes all parameters with a null value for a given property on an object', () => {
        // Arrange
        const paramsProp = 'params';
        const p1 = {
            rowIndex: '54aae715-8881-4a52-b7a9-25c385d1482q',
            value: 'something',
            valueDataType: 'String',
            error: null,
            isInput: false
        };
        const p2 = {
            rowIndex: '14aae715-8881-4a52-b7a9-25c385d1482q',
            value: null,
            valueDataType: 'String',
            error: null,
            isInput: true
        };
        const currentState = {
            [paramsProp]: [p1, p2]
        };

        // Act
        const newState = removeUnsetParametersByProperty(currentState, paramsProp);

        // Assert
        expect(newState[paramsProp].length).toStrictEqual(1);
        expect(newState[paramsProp][0]).toBe(p1);
    });
});
