import {
    normalizeFEROV,
    populateLhsStateForField,
    getResourceByUniqueIdentifier,
    getFerovInfoAndErrorFromEvent,
    checkExpressionForDeletedElem,
    EXPRESSION_PROPERTY_TYPE,
    setScreenElement
} from '../resourceUtils';
import * as store from 'mock/storeData';
import {
    addCurlyBraces,
    format
} from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { getMenuItemForField } from '../menuDataGenerator';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import { setSystemVariables } from '../../../../jest-modules/builder_platform_interaction/systemLib/systemLib';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import {
    GLOBAL_CONSTANTS,
    GLOBAL_CONSTANT_OBJECTS,
    SYSTEM_VARIABLE_PREFIX
} from '../../systemLib/systemLib';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields as mockUserFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields as mockFeedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { mockScreenElement } from 'mock/calloutData';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);
jest.mock('builder_platform_interaction/commonUtils', () => {
    const actual = require.requireActual('../../commonUtils/commonUtils.js');
    return {
        addCurlyBraces: actual.addCurlyBraces,
        removeCurlyBraces: actual.removeCurlyBraces,
        isObject: actual.isObject,
        format: jest.fn()
    };
});
const account = 'Account';
const anError = 'an error';

format.mockImplementation(() => {
    return anError;
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn()
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation(entityName => {
            if (entityName === 'Account') {
                return mockAccountFields;
            } else if (entityName === 'User') {
                return mockUserFields;
            } else if (entityName === 'FeedItem') {
                return mockFeedItemFields;
            }
            return undefined;
        })
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        getDataType: actual.getDataType,
        elementToParam: jest.fn()
    };
});

jest.mock('../menuDataGenerator', () => {
    const actual = require.requireActual('../menuDataGenerator');
    return {
        mutateFlowResourceToComboboxShape:
            actual.mutateFlowResourceToComboboxShape,
        getMenuItemForField: jest.fn(),
        getMenuItemsForField: actual.getMenuItemsForField
    };
});

describe('ResourceUtils', () => {
    describe('normalizeFEROV', () => {
        beforeAll(() => {
            setApexClasses(apexTypesForFlow);
        });
        afterAll(() => {
            setApexClasses(null);
        });
        it('should match an rhs value with a picklist api name to a menu item', () => {
            const rhsApiValue = 'AccountSource';
            const rhs = normalizeFEROV(rhsApiValue);
            expect(rhs.itemOrDisplayText).toBeDefined();
            expect(rhs.itemOrDisplayText).toEqual(rhsApiValue);
        });
        it('should normalize an SObject variable', () => {
            const normalizedFEROV = normalizeFEROV(
                store.accountSObjectVariable.guid
            );
            expect(normalizedFEROV).toMatchObject({
                itemOrDisplayText: {
                    dataType: 'SObject',
                    displayText: '{!accountSObjectVariable}'
                }
            });
        });
        it('should handle values that traverse more than two levels for sobject variables', () => {
            const fieldTraversal = '.Owner.Id';
            const normalizedFEROV = normalizeFEROV(
                store.accountSObjectVariable.guid + fieldTraversal
            );
            expect(normalizedFEROV).toMatchObject({
                itemOrDisplayText: {
                    dataType: 'String',
                    displayText: '{!accountSObjectVariable.Owner.Id}',
                    parent: {
                        dataType: 'SObject',
                        displayText: '{!accountSObjectVariable.Owner}',
                        hasNext: true,
                        parent: {
                            dataType: 'SObject',
                            displayText: '{!accountSObjectVariable}',
                            hasNext: true
                        }
                    }
                },
                fields: {
                    UserType: {},
                    Id: {}
                }
            });
        });
        it('should not throw an exception if the user does not have access to the SObject in a merge field', () => {
            getFieldsForEntity.mockReturnValueOnce(undefined);
            const field = '.Name';
            const normalizedFEROV = normalizeFEROV(
                store.accountSObjectVariable.guid + field
            );
            expect(normalizedFEROV.itemOrDisplayText).toBe(
                addCurlyBraces(store.accountSObjectVariable.name + field)
            );
        });
        it('should not throw an exception if the user does not have access to the SObject field in a merge field', () => {
            getFieldsForEntity.mockImplementationOnce(entityName => {
                return entityName === account ? ['Name1'] : undefined;
            });
            const field = '.Name';
            const normalizedFEROV = normalizeFEROV(
                store.accountSObjectVariable.guid + field
            );
            expect(normalizedFEROV.itemOrDisplayText).toBe(
                addCurlyBraces(store.accountSObjectVariable.name + field)
            );
        });
        it('should normalize Apex fields', () => {
            const normalizedFEROV = normalizeFEROV(
                `${store.apexCarVariable.guid}.model`
            );
            expect(normalizedFEROV).toMatchObject({
                itemOrDisplayText: {
                    dataType: 'String',
                    displayText: '{!apexCarVariable.model}',
                    parent: {
                        dataType: 'Apex',
                        displayText: '{!apexCarVariable}'
                    }
                },
                fields: {
                    model: {},
                    wheel: {}
                }
            });
        });
    });

    describe('populate LHS state for field', () => {
        it('should populate lhs state if user has access to the entity and field', () => {
            getMenuItemForField.mockReturnValueOnce('formattedField');
            const lhsState = populateLhsStateForField(
                { Name: {} },
                'Name',
                account,
                true
            );
            expect(lhsState.value).toBe('formattedField');
            expect(getMenuItemForField).toHaveBeenCalledWith({}, account, {
                showAsFieldReference: true,
                showSubText: true
            });
        });
        it('should not throw an exception if the user does not have access to the SObject', () => {
            const lhsState = populateLhsStateForField(undefined, 'Name');
            expect(lhsState.value).toBeUndefined();
        });
        it('should not throw an exception if the user does not have access to the SObject field', () => {
            const lhsState = populateLhsStateForField(
                { BillingAddress: {} },
                'Name'
            );
            expect(lhsState.value).toBeUndefined();
        });
    });

    describe('resource retrieval', () => {
        it('getResourceByUniqueIdentifier should return element by guid', () => {
            expect(
                getResourceByUniqueIdentifier(store.accountSObjectVariable.guid)
            ).toEqual(store.accountSObjectVariable);
        });
        const constants = [
            GLOBAL_CONSTANTS.EMPTY_STRING,
            GLOBAL_CONSTANTS.BOOLEAN_TRUE,
            GLOBAL_CONSTANTS.BOOLEAN_FALSE
        ];
        for (let i = 0; i < 3; i++) {
            it(`should retrieve ${constants[i]} by label`, () => {
                expect(getResourceByUniqueIdentifier(constants[i])).toEqual(
                    GLOBAL_CONSTANT_OBJECTS[constants[i]]
                );
            });
        }
        it('getResourceByUniqueIdentifier should return element by guid from local storage for an uncommitted resource', () => {
            setScreenElement(mockScreenElement);
            const retrievedResource = getResourceByUniqueIdentifier(
                'e1b88c4a-1a78-42d2-8057-93e2401bbdd4'
            );
            expect(retrievedResource.name.value).toEqual('dt1');
            setScreenElement(undefined);
        });
    });

    describe('getFerovInfoAndErrorFromEvent', () => {
        let badMenuItem;

        beforeEach(() => {
            badMenuItem = {
                value: 'invalidIdentifier',
                displayText: '{!invalidIdentifier}'
            };
        });
        it('returns an object with value and dataType properties', () => {
            const result = getFerovInfoAndErrorFromEvent({ detail: {} });
            expect(result).toHaveProperty('value');
            expect(result).toHaveProperty('dataType');
        });

        it('uses the literal data type when not given display text', () => {
            const mockDataType = 'sfdcDataType';
            const result = getFerovInfoAndErrorFromEvent(
                { detail: {} },
                mockDataType
            );
            expect(result.dataType).toEqual(mockDataType);
        });

        it('uses the displayText as value when given display text', () => {
            const displayText = 'foo';
            const result = getFerovInfoAndErrorFromEvent(
                { detail: { displayText: 'foo' } },
                undefined
            );
            expect(result.value).toEqual(displayText);
        });
        it('sets an error when given an invalid resource identifier', () => {
            const { error } = getFerovInfoAndErrorFromEvent({
                detail: { item: badMenuItem }
            });
            expect(error).toEqual(genericErrorMessage);
        });
        it('uses display text as value when given an invalid resource identifier', () => {
            const { value } = getFerovInfoAndErrorFromEvent({
                detail: {
                    item: badMenuItem,
                    displayText: badMenuItem.displayText
                }
            });
            expect(value).toEqual(badMenuItem.displayText);
        });
        it('uses literal data type when given an invalid resource identifier', () => {
            const literalDataType = 'sfdcDataType';
            const { dataType } = getFerovInfoAndErrorFromEvent(
                { detail: { item: badMenuItem } },
                literalDataType
            );
            expect(dataType).toEqual(literalDataType);
        });
        it('gets the ferov data type when given a menu item', () => {
            const mockItem = {
                item: { value: store.numberVariable.guid },
                displayText: '{!fooValue}'
            };
            const result = getFerovInfoAndErrorFromEvent({ detail: mockItem });
            expect(result.dataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
        });
        it('returns an error if the item reference is invalid', () => {
            const invalid = 'invalid';
            const result = getFerovInfoAndErrorFromEvent({
                detail: { item: { value: invalid }, displayText: invalid }
            });
            expect(result.error).toBeTruthy();
        });
        it('returns ferov data type of REFERENCE when the display text is a merge field', () => {
            const displayText = '{!someMergeField}';
            const { dataType } = getFerovInfoAndErrorFromEvent({
                detail: { displayText, isMergeField: true }
            });
            expect(dataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
        });
        it('uses the literal data type when given display text that is not a merge field', () => {
            const displayText = 'some display text';
            const mockDataType = 'sfdcDataType';
            const { dataType } = getFerovInfoAndErrorFromEvent(
                { detail: { displayText, isMergeField: false } },
                mockDataType
            );
            expect(dataType).toEqual(mockDataType);
        });
        it('treats global constants as elements but gives them a non reference data type', () => {
            const mockMenuItem = {
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
                displayText: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}'
            };
            const { value, dataType, error } = getFerovInfoAndErrorFromEvent({
                detail: { item: mockMenuItem }
            });
            expect(value).toEqual(mockMenuItem.value);
            expect(dataType).toEqual(FEROV_DATA_TYPE.BOOLEAN);
            expect(error).toBeUndefined();
        });
        it('treats system variables as elements and gives them a reference data type', () => {
            setSystemVariables(systemVariables);
            const mockMenuItem = {
                value: SYSTEM_VARIABLE_PREFIX + '.CurrentDateTime',
                displayText: '{!' + SYSTEM_VARIABLE_PREFIX + '.CurrentDateTime}'
            };
            const { value, dataType, error } = getFerovInfoAndErrorFromEvent({
                detail: {
                    item: mockMenuItem,
                    displayText: mockMenuItem.displayText
                }
            });
            expect(value).toEqual(mockMenuItem.value);
            expect(dataType).toEqual(FEROV_DATA_TYPE.REFERENCE);
            expect(error).toBeUndefined();
        });
    });

    describe('checkExpressionForDeletedElem', () => {
        const deletedGuids = new Map().set(store.numberVariable.guid, true);
        it('catches deleted guid on LHS', () => {
            const expression = {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                    value: store.numberVariable.guid
                }
            };
            checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
            const updatedValues =
                expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE];
            expect(updatedValues.value).toEqual(
                addCurlyBraces(store.numberVariable.name)
            );
            expect(updatedValues.error).toEqual(anError);
        });
        it('catches deleted guid on RHS', () => {
            const expression = {
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                    value: store.numberVariable.guid
                }
            };
            checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
            const updatedValues =
                expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE];
            expect(updatedValues.value).toEqual(
                addCurlyBraces(store.numberVariable.name)
            );
            expect(updatedValues.error).toEqual(anError);
        });
    });
});
