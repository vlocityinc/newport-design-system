// @ts-nocheck
import {
    retrieveResourceComplexTypeFields,
    isAutomaticOutputElementWithoutChildren,
    getAutomaticOutputParameters
} from '../complexTypeLib';
import * as store from 'mock/storeData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { setNotLoadedAction } from 'builder_platform_interaction_mocks/invocableActionLib';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { expectFieldsAreComplexTypeFieldDescriptions } from 'builder_platform_interaction/builderTestUtils';
import { getStringFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getStringFromApexActionDetails.json';
import { flowWithActiveAndLatest as mockFlowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    getFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFields)
}));

jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);

jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

jest.mock('builder_platform_interaction/subflowsLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/subflowsLib');
    return {
        getActiveOrLatestFlowOutputVariables: jest.fn().mockImplementation(flowName => {
            if (flowName === 'flowWithActiveAndLatest') {
                return actual.getActiveOrLatestInputOutputVariables(mockFlowWithActiveAndLatest).outputVariables;
            }
            return undefined;
        })
    };
});

describe('complexTypeFieldDescription', () => {
    beforeAll(() => {
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        setApexClasses(null);
    });
    describe('retrieveResourceComplexTypeFields', () => {
        it('returns fields for entity when element data type is SObject', () => {
            const fields = retrieveResourceComplexTypeFields(store.accountSObjectVariable);
            expect(fields).toBe(mockAccountFields);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns properties for apex class when element data type is Apex', () => {
            const fields = retrieveResourceComplexTypeFields(store.apexCarVariable);
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns extension parameters when element data type is LIGHTNING_COMPONENT_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(store.emailScreenFieldAutomaticOutput);
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('uses concrete types specified in dynamic type mappings for generically typed parameters of LIGHTNING_COMPONENT_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(store.lookupScreenField);
            expect(getCachedExtension).toBeCalledWith(
                'c:lookup',
                expect.arrayContaining([
                    {
                        typeName: 'T',
                        typeValue: 'Asset'
                    }
                ])
            );
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns action output parameters when element data type is ACTION_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(store.actionCallAutomaticOutput);
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns action output parameters (including apex types) when element data type is ACTION_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(store.apexCallApexTypeAutomaticOutput);
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns entity fields for action single anonymous automatic SObject output', () => {
            const fields = retrieveResourceComplexTypeFields(store.apexCallAutomaticAnonymousAccountOutput);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
            expect(fields).toEqual(mockAccountFields);
        });
        it('returns undefined for action single anonymous automatic primitive output', () => {
            const fields = retrieveResourceComplexTypeFields(store.apexCallAutomaticAnonymousStringOutput);
            expect(fields).toBeUndefined();
        });
        it('returns subflow output variables where element data type is SUBFLOW_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(store.subflowAutomaticOutput);
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
    });
    describe('isAutomaticOutputElementWithoutChildren', () => {
        describe('For action elements', () => {
            afterEach(() => {
                setNotLoadedAction();
            });
            it('returns true for an action element in automatic output mode that has no children', () => {
                expect(isAutomaticOutputElementWithoutChildren(store.caseLogACallAutomatic)).toBe(true);
            });
            it('returns undefined for an action if action parameters have not been loaded yet', () => {
                setNotLoadedAction(store.caseLogACallAutomatic);
                expect(isAutomaticOutputElementWithoutChildren(store.caseLogACallAutomatic)).toBeUndefined();
            });
            it('returns false for an action element in automatic mode that has children', () => {
                expect(isAutomaticOutputElementWithoutChildren(store.actionCallAutomaticOutput)).toBe(false);
            });
            it('returns false for an action with manual output', () => {
                expect(isAutomaticOutputElementWithoutChildren(store.apexCallManualAccountOutput)).toBe(false);
            });
        });
        describe('For LC screen fields', () => {
            // Currently, LC screen fields always have outputs
            it('returns false for a screen field in automatic mode that has children', () => {
                expect(isAutomaticOutputElementWithoutChildren(store.emailScreenFieldAutomaticOutput)).toBe(false);
            });
            it('returns undefined for a screen field in automatic mode for which properties have not been loaded yet', () => {
                getCachedExtension.mockImplementationOnce(() => undefined);
                expect(isAutomaticOutputElementWithoutChildren(store.emailScreenFieldAutomaticOutput)).toBeUndefined();
            });
        });
    });
    describe('getAutomaticOutputParameters', () => {
        it('returns LC screen field automatic output parameters', () => {
            const result = getAutomaticOutputParameters(store.emailScreenFieldAutomaticOutput);

            expect(result.length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(result);
        });
        it('returns LC screen field automatic output parameters with concrete types', () => {
            const fields = getAutomaticOutputParameters(store.lookupScreenField);
            expect(getCachedExtension).toBeCalledWith(
                'c:lookup',
                expect.arrayContaining([
                    {
                        typeName: 'T',
                        typeValue: 'Asset'
                    }
                ])
            );
            expect(Object.keys(fields).length).toBeGreaterThan(0);
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns apex call automatic output parameters', () => {
            const result = getAutomaticOutputParameters(store.apexCallStringAutomaticOutput);
            const expectedOutputParameters = getStringFromApexActionDetails.parameters.filter(
                parameter => parameter.isOutput === true
            );

            expect(result).toStrictEqual(expectedOutputParameters);
        });
        it('does not return apex call with manual output', () => {
            const result = getAutomaticOutputParameters(store.apexCallManualAccountOutput);

            expect(result).toBeUndefined();
        });
    });
});
