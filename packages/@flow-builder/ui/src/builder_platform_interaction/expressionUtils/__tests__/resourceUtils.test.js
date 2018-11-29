import {
    normalizeRHS,
    getResourceByUniqueIdentifier,
    getFerovInfoAndErrorFromEvent,
} from '../resourceUtils';
import * as store from "mock/storeData";
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from "builder_platform_interaction/systemLib";
import { addCurlyBraces } from "builder_platform_interaction/commonUtils";
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName, callback) => {
            callback(require.requireActual('mock/serverEntityData').mockAccountFieldWithPicklist);
        }),
    };
});

describe('RHS normalize', () => {
    it('should match an rhs value with a picklist api name to a menu item', () => {
        const rhsApiValue = 'AccountSource';
        const rhs = normalizeRHS(rhsApiValue);
        expect(rhs.itemOrDisplayText).toBeDefined();
        expect(rhs.itemOrDisplayText).toEqual(rhsApiValue);
    });
    it('should handle values that traverse more than two levels by cleaning display value, but not passing item', () => {
        const fieldTraversal = ".Owner.Id";
        const normalizedRHS = normalizeRHS(store.accountSObjectVariableGuid + fieldTraversal);
        expect(normalizedRHS.itemOrDisplayText).toEqual(addCurlyBraces(store.elements[store.accountSObjectVariableGuid].name + fieldTraversal));
    });
});

describe('resource retrieval', () => {
    it('getResourceByUniqueIdentifier should return element by guid', () => {
        expect(getResourceByUniqueIdentifier(store.accountSObjectVariableGuid)).toEqual(store.elements[store.accountSObjectVariableGuid]);
    });
    const constants = [GLOBAL_CONSTANTS.EMPTY_STRING, GLOBAL_CONSTANTS.BOOLEAN_TRUE, GLOBAL_CONSTANTS.BOOLEAN_FALSE];
    for (let i = 0; i < 3; i++) {
        it(`should retrieve ${constants[i]} by label`, () => {
            expect(getResourceByUniqueIdentifier(constants[i])).toEqual(GLOBAL_CONSTANT_OBJECTS[constants[i]]);
        });
    }
});

describe('getFerovInfoAndErrorFromEvent', () => {
    it('returns an object with value and dataType properties', () => {
        const result = getFerovInfoAndErrorFromEvent({ detail: {}});
        expect(result).toHaveProperty('value');
        expect(result).toHaveProperty('dataType');
    });

    it('uses the literal data type when not given display text', () => {
        const mockDataType = 'sfdcDataType';
        const result = getFerovInfoAndErrorFromEvent({ detail: {} }, mockDataType);
        expect(result.dataType).toEqual(mockDataType);
    });

    it('uses the displayText as value when given display text', () => {
        const displayText = 'foo';
        const result = getFerovInfoAndErrorFromEvent({ detail: { displayText: 'foo' } }, undefined);
        expect(result.value).toEqual(displayText);
    });

    it('uses the displayText as value when given a menu item', () => {
        const mockItem = { value: 'fooValue', displayText: 'fooDisplayText' };
        const result = getFerovInfoAndErrorFromEvent({ detail: mockItem });
        expect(result.value).toEqual(mockItem.displayText);
    });

    it('gets the ferov data type when given a menu item', () => {
        const mockItem = { item: { value: store.numberVariableGuid }, displayText: '{!fooValue}' };
        const result = getFerovInfoAndErrorFromEvent({ detail: mockItem });
        expect(result.dataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });
    it('returns an error if the item reference is invalid', () => {
        const invalid = 'invalid';
        const result = getFerovInfoAndErrorFromEvent({detail: {item: {value: invalid}, displayText: invalid}});
        expect(result.error).toBeTruthy();
    });
});
