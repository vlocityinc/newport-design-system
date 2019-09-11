import { retrieveResourceComplexTypeFields } from '../complexTypeLib';
import * as store from 'mock/storeData';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { mockCarApexTypeProperties } from 'mock/apexTypesData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { chatterPostActionParameters as mockChatterPostActionParameters } from 'serverData/GetInvocableActionParameters/chatterPostActionParameters.json';

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

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        getParametersForInvocableAction: jest
            .fn()
            .mockImplementation(() => mockChatterPostActionParameters)
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
});
