import {
    normalizeFEROV,
    populateLhsStateForField,
    getResourceByUniqueIdentifier,
    getFerovInfoAndErrorFromEvent,
    checkExpressionForDeletedElem,
    EXPRESSION_PROPERTY_TYPE,
    retrieveResourceComplexTypeFields
} from '../resourceUtils';
import * as store from 'mock/storeData';
import {
    addCurlyBraces,
    format
} from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { mutateFieldToComboboxShape } from '../menuDataGenerator';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import { setSystemVariables } from '../../../../jest-modules/builder_platform_interaction/systemLib/systemLib';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import {
    GLOBAL_CONSTANTS,
    GLOBAL_CONSTANT_OBJECTS,
    SYSTEM_VARIABLE_PREFIX
} from '../../systemLib/systemLib';
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { mockCarApexTypeProperties } from 'mock/apexTypesData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';

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
        getFieldsForEntity: jest
            .fn()
            .mockImplementation(() => mockAccountFields)
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getDataType: require.requireActual('../../ruleLib/ruleLib.js')
            .getDataType,
        elementToParam: jest.fn()
    };
});

jest.mock('../menuDataGenerator', () => {
    return {
        mutateFlowResourceToComboboxShape: require.requireActual(
            '../menuDataGenerator'
        ).mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: jest.fn()
    };
});

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        getPropertiesForClass: jest
            .fn()
            .mockName('getPropertiesForClass')
            .mockImplementation(() => mockCarApexTypeProperties)
    };
});

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return {
        getCachedExtension: jest
            .fn()
            .mockImplementation(
                () => mockFlowRuntimeEmailFlowExtensionDescription
            )
    };
});

describe('RHS normalize', () => {
    it('should match an rhs value with a picklist api name to a menu item', () => {
        const rhsApiValue = 'AccountSource';
        const rhs = normalizeFEROV(rhsApiValue);
        expect(rhs.itemOrDisplayText).toBeDefined();
        expect(rhs.itemOrDisplayText).toEqual(rhsApiValue);
    });
    it('should handle values that traverse more than two levels by cleaning display value, but not passing item', () => {
        const fieldTraversal = '.Owner.Id';
        const normalizedRHS = normalizeFEROV(
            store.accountSObjectVariableGuid + fieldTraversal
        );
        expect(normalizedRHS.itemOrDisplayText).toEqual(
            addCurlyBraces(
                store.elements[store.accountSObjectVariableGuid].name +
                    fieldTraversal
            )
        );
    });
    it('should not throw an exception if the user does not have access to the SObject in a merge field', () => {
        getFieldsForEntity.mockReturnValueOnce(undefined);
        const field = '.Name';
        const normalizedRHS = normalizeFEROV(
            store.accountSObjectVariableGuid + field
        );
        expect(normalizedRHS.itemOrDisplayText).toBe(
            addCurlyBraces(store.accountSObjectVariableDevName + field)
        );
    });
    it('should not throw an exception if the user does not have access to the SObject field in a merge field', () => {
        getFieldsForEntity.mockImplementationOnce(entityName => {
            return entityName === account ? ['Name1'] : undefined;
        });
        const field = '.Name';
        const normalizedRHS = normalizeFEROV(
            store.accountSObjectVariableGuid + field
        );
        expect(normalizedRHS.itemOrDisplayText).toBe(
            addCurlyBraces(store.accountSObjectVariableDevName + field)
        );
    });
    it('should normalize Apex fields', () => {
        const fieldName = 'Name';
        const output = 'result';
        const storeElement = store.elements[store.apexSampleVariableGuid];
        mutateFieldToComboboxShape.mockReturnValueOnce(output);
        getPropertiesForClass.mockImplementationOnce(className => {
            if (className === storeElement.subtype) {
                return {
                    [fieldName]: {
                        apiName: store.apexSampleVariableDevName
                    }
                };
            }
            return undefined;
        });
        const normalizedRHS = normalizeFEROV(
            `${store.apexSampleVariableGuid}.${fieldName}`
        );
        expect(normalizedRHS.itemOrDisplayText).toBe(output);
    });
});

describe('populate LHS state for field', () => {
    it('should populate lhs state if user has access to the entity and field', () => {
        mutateFieldToComboboxShape.mockReturnValueOnce('formattedField');
        const lhsState = populateLhsStateForField(
            { Name: {} },
            'Name',
            account,
            true
        );
        expect(lhsState.value).toBe('formattedField');
        expect(mutateFieldToComboboxShape).toHaveBeenCalledWith(
            {},
            account,
            true,
            true
        );
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
            getResourceByUniqueIdentifier(store.accountSObjectVariableGuid)
        ).toEqual(store.elements[store.accountSObjectVariableGuid]);
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
            detail: { item: badMenuItem, displayText: badMenuItem.displayText }
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
            item: { value: store.numberVariableGuid },
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
    const deletedGuids = new Map().set(store.numberVariableGuid, true);
    it('catches deleted guid on LHS', () => {
        const expression = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                value: store.numberVariableGuid
            }
        };
        checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
        const updatedValues =
            expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE];
        expect(updatedValues.value).toEqual(
            addCurlyBraces(store.elements[store.numberVariableGuid].name)
        );
        expect(updatedValues.error).toEqual(anError);
    });
    it('catches deleted guid on RHS', () => {
        const expression = {
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                value: store.numberVariableGuid
            }
        };
        checkExpressionForDeletedElem(deletedGuids, expression, 'DECISION');
        const updatedValues =
            expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE];
        expect(updatedValues.value).toEqual(
            addCurlyBraces(store.elements[store.numberVariableGuid].name)
        );
        expect(updatedValues.error).toEqual(anError);
    });
});
describe('retrieveResourceComplexTypeFields', () => {
    const expectComplexTypeFieldDescription = field => {
        // need a dataType and apiName. isCollection and label optional
        expect(field.dataType).toBeDefined();
        expect(field.apiName).toBeDefined();
    };
    const expectFieldsAreComplexTypeFieldDescriptions = fields => {
        for (const fieldName in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
                const field = fields[fieldName];
                expectComplexTypeFieldDescription(field);
            }
        }
    };
    it('returns fields for entity when element data type is SObject', () => {
        const element = store.elements[store.accountSObjectVariableGuid];
        const fields = retrieveResourceComplexTypeFields(element);
        expectFieldsAreComplexTypeFieldDescriptions(fields);
    });
    it('returns properties for apex class when element data type is Apex', () => {
        const element = store.elements[store.apexSampleVariableGuid];
        const fields = retrieveResourceComplexTypeFields(element);
        expectFieldsAreComplexTypeFieldDescriptions(fields);
    });
    it('returns extension parameters when element data type is LIGHTNING_COMPONENT_OUTPUT', () => {
        const element =
            store.elements[store.emailScreenFieldAutomaticOutputGuid];
        const fields = retrieveResourceComplexTypeFields(element);
        expectFieldsAreComplexTypeFieldDescriptions(fields);
    });
});
