// @ts-nocheck
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { emailScreenFieldAutomaticOutput, flowWithAllElementsUIModel } from 'mock/storeData';
import { flowExtensionDetails as mockFlowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import ResourceDetailsParametersExtensionConfig from '../resourceDetailsParametersExtension';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/flowExtensionLib');
    return {
        describeExtension: jest.fn(() =>
            Promise.resolve(
                actual.createExtensionDescription('flowruntime:email', mockFlowExtensionDetails['flowruntime:email'])
            )
        )
    };
});

describe('resource-details-parameters-extension', () => {
    const callback = jest.fn();
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('fetchExtensionOutputParameters', () => {
        const fetchExtensionOutputFetchFunc = ResourceDetailsParametersExtensionConfig.fetch();
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resourceGuid: "$resourceGuid"', async ({ resourceGuid }) => {
            fetchExtensionOutputFetchFunc(resourceGuid, callback);
            await ticks(1);
            expect(callback).toHaveBeenCalledWith([], `No resource found for GUID: ${resourceGuid}`);
        });
        test('Existing resourceGuid', async () => {
            fetchExtensionOutputFetchFunc(emailScreenFieldAutomaticOutput.guid, callback);
            await ticks(1);
            expect(callback).not.toHaveBeenCalledWith([], expect.any(String));
        });
    });
    describe('mapperExtensionOutputParameter', () => {
        const mapperExtensionOutputMapFunc = ResourceDetailsParametersExtensionConfig.map();
        const parameterName = 'myParameterName';
        const getParameterWithLabel = (srcObject) => ({
            label: srcObject.label,
            apiName: parameterName
        });
        let actualResult;
        test.each`
            rawParameter
            ${null}
            ${undefined}
        `('Invalid rawParameter: "$rawParameter"', ({ rawParameter }) => {
            actualResult = mapperExtensionOutputMapFunc(rawParameter);
            expect(actualResult).toEqual({});
        });

        test.each`
            label
            ${null}
            ${undefined}
            ${''}
        `(
            '(Incorrect "final" parameter label (initial raw label: "$label") should fallback to parameter name',
            (label) => {
                actualResult = mapperExtensionOutputMapFunc(getParameterWithLabel(label));
                expect(actualResult).toMatchObject({
                    label: parameterName,
                    apiName: parameterName
                });
            }
        );
    });
});
