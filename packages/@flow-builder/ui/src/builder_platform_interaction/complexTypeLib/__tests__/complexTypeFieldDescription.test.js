import {
    retrieveResourceComplexTypeFields,
    isAutomaticOutputElementWithoutChildren
} from '../complexTypeLib';
import * as store from 'mock/storeData';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { mockCarApexTypeProperties } from 'mock/apexTypesData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { chatterPostActionParameters as mockChatterPostActionParameters } from 'serverData/GetInvocableActionParameters/chatterPostActionParameters.json';
import { logACallActionParameters as mockLogACallActionParameters } from 'serverData/GetInvocableActionParameters/logACallActionParameters.json';
import { getParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest
            .fn()
            .mockImplementation(() => mockAccountFields)
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

const mockImplementationForGetParametersForInvocableAction = ({
    actionName,
    actionType
}) => {
    const key = `${actionType}-${actionName}`;
    switch (key) {
        case 'chatterPost-chatterPost':
            return mockChatterPostActionParameters;
        case 'quickAction-Case.LogACall':
            return mockLogACallActionParameters;
        default:
            return undefined;
    }
};

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        getParametersForInvocableAction: jest
            .fn()
            .mockImplementation(({ actionName, actionType }) =>
                mockImplementationForGetParametersForInvocableAction({
                    actionName,
                    actionType
                })
            )
    };
});

describe('complexTypeFieldDescription', () => {
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
            const fields = retrieveResourceComplexTypeFields(
                store.accountSObjectVariable
            );
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns properties for apex class when element data type is Apex', () => {
            const fields = retrieveResourceComplexTypeFields(
                store.apexSampleVariable
            );
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('returns extension parameters when element data type is LIGHTNING_COMPONENT_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(
                store.emailScreenFieldAutomaticOutput
            );
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
        it('return action parameters when element data type is ACTION_OUTPUT', () => {
            const fields = retrieveResourceComplexTypeFields(
                store.actionCallAutomaticOutput
            );
            expectFieldsAreComplexTypeFieldDescriptions(fields);
        });
    });
    describe('isAutomaticOutputElementWithoutChildren', () => {
        describe('For action elements', () => {
            afterEach(() => {
                getParametersForInvocableAction.mockImplementation(
                    ({ actionName, actionType }) =>
                        mockImplementationForGetParametersForInvocableAction({
                            actionName,
                            actionType
                        })
                );
            });
            it('returns true for an action element in automatic output mode that has no children', () => {
                expect(
                    isAutomaticOutputElementWithoutChildren(
                        store.caseLogACallAutomatic
                    )
                ).toBe(true);
            });
            it('returns false for an action if action parameters have not been loaded yet', () => {
                getParametersForInvocableAction.mockImplementation(
                    () => undefined
                );
                expect(
                    isAutomaticOutputElementWithoutChildren(
                        store.caseLogACallAutomatic
                    )
                ).toBe(false);
            });
            it('returns false for an action element in automatic mode that has children', () => {
                expect(
                    isAutomaticOutputElementWithoutChildren(
                        store.actionCallAutomaticOutput
                    )
                ).toBe(false);
            });
        });
        describe('For LC screen fields', () => {
            afterEach(() => {
                getCachedExtension.mockImplementation(
                    () => mockFlowRuntimeEmailFlowExtensionDescription
                );
            });
            // Currently, LC screen fields always have outputs
            it('returns false for a screen field in automatic mode that has children', () => {
                expect(
                    isAutomaticOutputElementWithoutChildren(
                        store.emailScreenFieldAutomaticOutput
                    )
                ).toBe(false);
            });
            it('returns false for a screen field in automatic mode for which properties have not been loaded yet', () => {
                getCachedExtension.mockImplementation(() => undefined);
                expect(
                    isAutomaticOutputElementWithoutChildren(
                        store.emailScreenFieldAutomaticOutput
                    )
                ).toBe(false);
            });
        });
    });
});
