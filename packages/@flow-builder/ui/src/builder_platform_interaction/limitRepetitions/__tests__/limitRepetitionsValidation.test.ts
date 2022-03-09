import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_PROPS } from 'builder_platform_interaction/limitRepetitionsLib';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getRules, limitRepetitionsValidation } from '../limitRepetitionsValidation';

/**
 * Executing jest test｀
 * yarn jest packages/@flow-builder/ui/src/builder_platform_interaction/limitRepetitions/__tests__/limitRepetitionsValidation.test.ts
 */

jest.mock('builder_platform_interaction/processTypeLib');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const DEFAULT_STATE = {
    state: {
        inputRecommendations: { value: 'getRecommendations', error: null },
        recordId: { value: 'recordId', error: null },
        withinDays: { value: 90, error: null },
        maxResponses: { value: 1, error: null },
        responseTypeToLimit: { value: 'ALL', error: null }
    }
};

const createComponentUnderTest = async (overrideOptions?) =>
    createComponent(INTERACTION_COMPONENTS_SELECTORS.LIMIT_REPETITIONS, DEFAULT_STATE, overrideOptions);

const validate = (state) => {
    const rules = getRules(state);
    return getErrorsFromHydratedElement(limitRepetitionsValidation.validateAll(state, rules));
};

describe('Limit Repetition Validation', () => {
    let limitRepetitionCmp;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        isLookupTraversalSupported.mockImplementation(() => true);
    });

    afterAll(() => {
        Store.resetStore();
    });

    describe('validation', () => {
        beforeEach(async () => {
            limitRepetitionCmp = await createComponentUnderTest();
        });

        it('should pass input validation', async () => {
            await ticks(1);
            const errors = validate(limitRepetitionCmp.state);
            expect(errors).toHaveLength(0);
        });

        describe('inputRecommendations Validation', () => {
            it('should catch error with empty inputRecommendations', () => {
                const invalidInput = { inputRecommendations: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.inputRecommendations.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if inputRecommendations is undefined', () => {
                const invalidInput = { inputRecommendations: { value: undefined, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.inputRecommendations.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });
        });

        describe('responseTypeToLimit Validation', () => {
            it('should catch error with empty responseTypeToLimit', () => {
                const invalidInput = { responseTypeToLimit: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.responseTypeToLimit.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if responseTypeToLimit is undefined', () => {
                const invalidInput = { responseTypeToLimit: { value: undefined, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.responseTypeToLimit.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });
        });

        describe('withinDays Validation', () => {
            it('should catch error with empty withinDays', () => {
                const invalidInput = { withinDays: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.withinDays.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if withinDays is less than 1', () => {
                const invalidInput = { withinDays: { value: 0, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.withinDays.name,
                    errorString: 'FlowBuilderValidation.shouldBeInRange'
                });
            });

            it('should catch error if withinDays is not a number', () => {
                const invalidInput = { withinDays: { value: 'test', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.withinDays.name,
                    errorString: 'FlowBuilderValidation.mustBeAValidNumber'
                });
            });
        });

        describe('maxResponses Validation', () => {
            it('should catch error with empty maxResponses', () => {
                const invalidInput = { maxResponses: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxResponses.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if maxResponses is less than 1', () => {
                const invalidInput = { maxResponses: { value: 0, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxResponses.name,
                    errorString: 'FlowBuilderValidation.shouldBeInRange'
                });
            });

            it('should catch error if maxResponses is not a number', () => {
                const invalidInput = { maxResponses: { value: 'test', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxResponses.name,
                    errorString: 'FlowBuilderValidation.mustBeAValidNumber'
                });
            });
        });
    });
});
