import {
    normalizeRHS,
    populateLhsStateForField,
    getResourceByUniqueIdentifier,
    getFerovInfoAndErrorFromEvent,
    checkExpressionForDeletedElem,
    EXPRESSION_PROPERTY_TYPE,
} from '../resourceUtils';
import * as store from "mock/storeData";
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from "builder_platform_interaction/systemLib";
import { addCurlyBraces, format } from "builder_platform_interaction/commonUtils";
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { mutateFieldToComboboxShape } from '../menuDataGenerator';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/commonUtils', () => {
    return {
        addCurlyBraces: require.requireActual('builder_platform_interaction/commonUtils').addCurlyBraces,
        removeCurlyBraces: require.requireActual('builder_platform_interaction/commonUtils').removeCurlyBraces,
        isObject: require.requireActual('builder_platform_interaction/commonUtils').isObject,
        format: jest.fn(),
    };
});
const anError = 'an error';
format.mockImplementation(() => {
    return anError;
});

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

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getDataType: require.requireActual('builder_platform_interaction/ruleLib').getDataType,
        elementToParam: jest.fn(),
    };
});

jest.mock('../menuDataGenerator', () => {
    return {
        mutateFlowResourceToComboboxShape: require.requireActual('../menuDataGenerator').mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: jest.fn(),
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
    it('should not throw an exception if the user does not have access to the SObject in a merge field', () => {
        getFieldsForEntity.mockReturnValueOnce(undefined);
        const field = ".Name";
        const normalizedRHS = normalizeRHS(store.accountSObjectVariableGuid + field);
        expect(normalizedRHS.itemOrDisplayText).toBe('guid2.Name');
    });
    it('should not throw an exception if the user does not have access to the SObject field in a merge field', () => {
        getFieldsForEntity.mockReturnValueOnce(['Name1']);
        const field = ".Name";
        const normalizedRHS = normalizeRHS(store.accountSObjectVariableGuid + field);
        expect(normalizedRHS.itemOrDisplayText).toBe('guid2.Name');
    });
});

describe('populate LHS state for field', () => {
    it('should populate lhs state if user has access to the entity and field', () => {
        mutateFieldToComboboxShape.mockReturnValueOnce('formattedField');
        const lhsState = populateLhsStateForField({'Name':{}}, 'Name', 'Account', true);
        expect(lhsState.value).toBe('formattedField');
        expect(mutateFieldToComboboxShape).toHaveBeenCalledWith({}, 'Account',
                true, true);
    });
    it('should not throw an exception if the user does not have access to the SObject', () => {
        const lhsState = populateLhsStateForField(undefined, 'Name');
        expect(lhsState.value).toBeUndefined();
    });
    it('should not throw an exception if the user does not have access to the SObject field', () => {
        const lhsState = populateLhsStateForField({'BillingAddress':{}}, 'Name');
        expect(lhsState.value).toBeUndefined();
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

describe('checkExpressionForDeletedElem', () => {
    const deletedGuids = new Map().set(store.numberVariableGuid, true);
    it('catches deleted guid on LHS', () => {
        const expression = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                value: store.numberVariableGuid,
            },
        };
        checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
        const updatedValues = expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE];
        expect(updatedValues.value).toEqual(addCurlyBraces(store.elements[store.numberVariableGuid].name));
        expect(updatedValues.error).toEqual(anError);
    });
    it('catches deleted guid on RHS', () => {
        const expression = {
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                value: store.numberVariableGuid,
            },
        };
        checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
        const updatedValues = expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE];
        expect(updatedValues.value).toEqual(addCurlyBraces(store.elements[store.numberVariableGuid].name));
        expect(updatedValues.error).toEqual(anError);
    });
});
