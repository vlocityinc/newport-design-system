import ResourceDetailsParametersActionConfig from '../resourceDetailsParametersAction';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { emailScreenFieldAutomaticOutput } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/flowExtensionLib', () => ({
    describeExtension: jest.fn(() =>
        Promise.resolve(mockFlowRuntimeEmailFlowExtensionDescription)
    )
}));

describe('resource-details-parameters-action', () => {
    const callback = jest.fn();
    describe('fetchActionOutputParameters', () => {
        const fetchActionOutputFectFunc = ResourceDetailsParametersActionConfig.fetch();
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resourceGuid: "$resourceGuid"', ({ resourceGuid }) => {
            fetchActionOutputFectFunc(resourceGuid, callback);
            return Promise.resolve().then(() =>
                expect(callback).toHaveBeenCalledWith(
                    [],
                    `No resource found for GUID: ${resourceGuid}`
                )
            );
        });
        test('Existing resourceGuid', () => {
            fetchActionOutputFectFunc(
                emailScreenFieldAutomaticOutput.guid,
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
    describe('mapperActionOutputParameter', () => {
        const mapperExtensionOutputMapFunc = ResourceDetailsParametersActionConfig.map();
        test.each`
            rawParameter
            ${null}
            ${undefined}
            ${{}}
        `('Invalid rawParameter: "$rawParameter"', ({ rawParameter }) => {
            const actualResult = mapperExtensionOutputMapFunc(rawParameter);
            expect(actualResult).toEqual({});
        });
    });
});
