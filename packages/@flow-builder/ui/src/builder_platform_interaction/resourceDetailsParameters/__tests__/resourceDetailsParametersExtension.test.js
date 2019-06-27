import { LIGHTNING_COMPONENT_PARAMETERS_RETRIEVAL_CONFIGURATION } from '../resourceDetailsParametersExtension';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { emailScreenFieldAutomaticOutputGuid } from 'mock/storeData';

const elementConfig =
    LIGHTNING_COMPONENT_PARAMETERS_RETRIEVAL_CONFIGURATION[
        ELEMENT_TYPE.SCREEN_FIELD
    ];

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/flowExtensionLib', () => ({
    describeExtension: jest.fn(() =>
        Promise.resolve(mockFlowRuntimeEmailFlowExtensionDescription)
    )
}));

describe('resource-details-parameters-extension', () => {
    const callback = jest.fn();
    describe('fetchExtensionOutputParameters', () => {
        const fetchExtensionOutputParameters = elementConfig.fetch;
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resourceGuid: "$resourceGuid"', ({ resourceGuid }) => {
            fetchExtensionOutputParameters(resourceGuid, callback);
            return Promise.resolve().then(() =>
                expect(callback).toHaveBeenCalledWith(
                    [],
                    `No resource found for GUID: ${resourceGuid}`
                )
            );
        });
        test('Existing resourceGuid', () => {
            fetchExtensionOutputParameters(
                emailScreenFieldAutomaticOutputGuid,
                callback
            );
            return Promise.resolve().then(() =>
                expect(callback).not.toHaveBeenCalledWith(
                    [],
                    expect.any(String)
                )
            );
        });
    });
    describe('mapperExtensionOutputParameter', () => {
        const mapperExtensionOutputParameter = elementConfig.mapper;
        test.each`
            rawParameter
            ${null}
            ${undefined}
            ${{}}
        `('Invalid rawParameter: "$rawParameter"', ({ rawParameter }) => {
            const actualResult = mapperExtensionOutputParameter(rawParameter);
            expect(actualResult).toEqual({});
        });
    });
});
