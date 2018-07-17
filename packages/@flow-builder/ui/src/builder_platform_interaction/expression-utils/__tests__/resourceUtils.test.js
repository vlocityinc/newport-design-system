import { normalizeLHS, normalizeRHS, getResourceByUniqueIdentifier } from '../resourceUtils';
import { numberParamCanBeField } from 'mock-rule-service';
import * as store from 'mock-store-data';
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from 'builder_platform_interaction-system-lib';

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
    };
});

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName, callback) => {
            callback(require.requireActual('mock-server-entity-data').mockAccountFieldWithPicklist);
        }),
    };
});

describe('LHS normalize', () => {
    it('should handle the case when LHS is guid', () => {
        const normalizedElement = normalizeLHS(store.numberVariableGuid);
        expect(normalizedElement.item.displayText).toBe('{!' + store.numberVariableDevName + '}');
        expect(normalizedElement.parameter.collection).toBe(false);
        expect(normalizedElement.parameter.dataType).toBe(numberParamCanBeField.dataType);
        expect(normalizedElement.parameter.elementType).toBe(store.variable);
    });

    it('should store active picklist values when LHS is picklist field', () => {
        const complexGuid = store.accountSObjectVariableGuid + '.AccountSource';
        const normalizedElement = normalizeLHS(complexGuid);
        expect(normalizedElement.activePicklistValues).toBeDefined();
        expect(normalizedElement.activePicklistValues).toEqual(expect.any(Array));
    });
});

describe('RHS normalize', () => {
    it('should match an rhs value with a picklist api name to a menu item', () => {
        const complexGuid = store.accountSObjectVariableGuid + '.AccountSource';
        const lhs = normalizeLHS(complexGuid);
        const rhsApiValue = 'AccountSource';
        normalizeRHS(rhsApiValue, lhs)
            .then((rhs) => {
                expect(rhs.itemOrDisplayText).toBeDefined();
                expect(rhs.itemOrDisplayText).toEqual(rhsApiValue);
            });
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
