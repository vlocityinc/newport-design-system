import { getElementsForMenuData } from '../menuDataRetrieval';
import { normalizeLHS, normalizeRHS } from '../resourceUtils';
import { numberParamCanBeField } from 'mock-rule-service';
import * as store from 'mock-store-data';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import * as selectorsMock from 'builder_platform_interaction-selectors';

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

describe('LHS retrieval', () => {
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

describe('RHS retrieval', () => {
    beforeEach(() => {
        selectorsMock.writableElementsSelector.mockClear();
    });
    it('should have active picklist values in menu data when LHS is picklist field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.accountSObjectVariableGuid]]);
        const complexGuid = store.accountSObjectVariableGuid + '.AccountSource';
        const lhs = normalizeLHS(complexGuid);
        // configuration for menu data retrieval
        const allowedParamTypes = null;
        const includeNewResource = false;
        const allowSObjectForFields = false;
        const disableHasNext = false;
        const activePicklistValues = lhs.activePicklistValues;

        const menuData = getElementsForMenuData({elementType: ELEMENT_TYPE.ASSIGNMENT, shouldBeWritable: true}, allowedParamTypes, includeNewResource, allowSObjectForFields, disableHasNext, activePicklistValues);
        const picklistLabel = 'Picklist Values';
        expect(menuData).toContainEqual(expect.objectContaining({label:  picklistLabel}));
        expect(menuData).toContainEqual(expect.objectContaining({items: expect.any(Array)}));
    });

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
