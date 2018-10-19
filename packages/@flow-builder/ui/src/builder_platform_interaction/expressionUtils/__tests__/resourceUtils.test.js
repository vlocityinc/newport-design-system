import {
    normalizeRHS,
    getResourceByUniqueIdentifier,
    getFerovInfoFromComboboxItem,
} from '../resourceUtils';
import * as store from "mock/storeData";
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from "builder_platform_interaction/systemLib";
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

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

// TODO W-5528544: Move these tests to outputResourcePicker if needed
/* describe('LHS normalize', () => {
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
}); */

describe('RHS normalize', () => {
    it('should match an rhs value with a picklist api name to a menu item', () => {
        const rhsApiValue = 'AccountSource';
        normalizeRHS(rhsApiValue)
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

describe('getFerovInfoFromComboboxItem', () => {
    it('returns an object with value and dataType properties', () => {
        const result = getFerovInfoFromComboboxItem();
        expect(result).toHaveProperty('value');
        expect(result).toHaveProperty('dataType');
    });

    it('uses the literal data type when given display text', () => {
        const mockDataType = 'sfdcDataType';
        const result = getFerovInfoFromComboboxItem(undefined, undefined, mockDataType);
        expect(result.dataType).toEqual(mockDataType);
    });

    it('uses the displayText as value when given display text', () => {
        const displayText = 'foo';
        const result = getFerovInfoFromComboboxItem(undefined, 'foo', undefined);
        expect(result.value).toEqual(displayText);
    });

    it('uses the displayText as value when given a menu item', () => {
        const mockItem = { value: 'fooValue', displayText: 'fooDisplayText' };
        const result = getFerovInfoFromComboboxItem(mockItem);
        expect(result.value).toEqual(mockItem.displayText);
    });

    it('gets the ferov data type when given a menu item', () => {
        const mockItem = { value: 'fooValue', displayText: '{!fooValue}' };
        const result = getFerovInfoFromComboboxItem(mockItem);
        expect(result.dataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
    });
});
