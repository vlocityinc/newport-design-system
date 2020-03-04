import ResourceDetailsParametersActionConfig from '../resourceDetailsParametersAction';
import { mockSubmitForApprovalActionParameters } from 'mock/calloutData';
import { emailScreenFieldAutomaticOutput } from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/invocableActionLib', () => ({
    fetchDetailsForInvocableAction: jest.fn(() => Promise.resolve(mockSubmitForApprovalActionParameters))
}));

describe('resource-details-parameters-action', () => {
    const callback = jest.fn();
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('fetchActionOutputParameters', () => {
        const fetchActionOutputFetchFunc = ResourceDetailsParametersActionConfig.fetch();
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resourceGuid: "$resourceGuid"', async ({ resourceGuid }) => {
            fetchActionOutputFetchFunc(resourceGuid, callback);
            await ticks(1);
            expect(callback).toHaveBeenCalledWith([], `No resource found for GUID: ${resourceGuid}`);
        });
        test('Existing resourceGuid', async () => {
            fetchActionOutputFetchFunc(emailScreenFieldAutomaticOutput.guid, callback);
            await ticks(1);
            expect(callback).not.toHaveBeenCalledWith([], expect.any(String));
        });
    });
    describe('mapperActionOutputParameter', () => {
        const mapperActionOutputMapFunc = ResourceDetailsParametersActionConfig.map();
        const parameterName = 'myParameterName';
        const getParameterWithLabel = srcObject => ({
            label: srcObject.label,
            name: parameterName
        });
        let actualResult;
        test.each`
            rawParameter
            ${null}
            ${undefined}
            ${{}}
        `('Invalid rawParameter: "$rawParameter"', ({ rawParameter }) => {
            actualResult = mapperActionOutputMapFunc(rawParameter);
            expect(actualResult).toEqual({});
        });

        test.each`
            label
            ${null}
            ${undefined}
            ${''}
        `(
            '(Incorrect "final" parameter label (initial raw label: "$label") should fallback to parameter name',
            label => {
                actualResult = mapperActionOutputMapFunc(getParameterWithLabel(label));
                expect(actualResult).toMatchObject({
                    label: parameterName,
                    apiName: parameterName
                });
            }
        );

        test('Priority given to label over parameter name fallback', () => {
            const parameterLabel = 'parameterLabel';
            actualResult = mapperActionOutputMapFunc({
                label: parameterLabel,
                name: parameterName
            });
            expect(actualResult).toMatchObject({
                label: parameterLabel,
                apiName: parameterName
            });
        });
    });
});
