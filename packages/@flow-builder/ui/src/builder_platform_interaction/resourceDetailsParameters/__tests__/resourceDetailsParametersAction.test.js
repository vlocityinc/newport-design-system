import ResourceDetailsParametersActionConfig from '../resourceDetailsParametersAction';
import { mockSubmitForApprovalActionParameters } from 'mock/calloutData';
import { emailScreenFieldAutomaticOutput } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/invocableActionLib', () => ({
    fetchParametersForInvocableAction: jest.fn(() =>
        Promise.resolve(mockSubmitForApprovalActionParameters)
    )
}));

describe('resource-details-parameters-action', () => {
    const callback = jest.fn();
    describe('fetchActionOutputParameters', () => {
        const fetchActionOutputFetchFunc = ResourceDetailsParametersActionConfig.fetch();
        test.each`
            resourceGuid
            ${null}
            ${undefined}
            ${''}
            ${'GUID_NOT_IN_STORE'}
        `('Invalid resourceGuid: "$resourceGuid"', ({ resourceGuid }) => {
            fetchActionOutputFetchFunc(resourceGuid, callback);
            return Promise.resolve().then(() =>
                expect(callback).toHaveBeenCalledWith(
                    [],
                    `No resource found for GUID: ${resourceGuid}`
                )
            );
        });
        test('Existing resourceGuid', () => {
            fetchActionOutputFetchFunc(
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
            label => {
                actualResult = mapperExtensionOutputMapFunc(
                    getParameterWithLabel(label)
                );
                expect(actualResult).toMatchObject({
                    label: parameterName,
                    apiName: parameterName
                });
            }
        );

        test('Priority given to label over parameter name fallback', () => {
            const parameterLabel = 'parameterLabel';
            actualResult = mapperExtensionOutputMapFunc({
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
