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

jest.mock('builder_platform_interaction/processTypeLib');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const DEFAULT_STATE = {
    state: {
        inputOffers: { value: 'getRecommendations', error: null },
        recordId: { value: 'recordId', error: null },
        lookBackDays: { value: 90, error: null },
        maxReaction: { value: 1, error: null },
        reactionType: { value: 'ALL', error: null }
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

        describe('inputOffers Validation', () => {
            it('should catch error with empty inputOffers', () => {
                const invalidInput = { inputOffers: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.inputOffers.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if inputOffers is undefined', () => {
                const invalidInput = { inputOffers: { value: undefined, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.inputOffers.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });
        });

        describe('reactionType Validation', () => {
            it('should catch error with empty reactionType', () => {
                const invalidInput = { reactionType: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.reactionType.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if reactionType is undefined', () => {
                const invalidInput = { reactionType: { value: undefined, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.reactionType.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });
        });

        describe('lookBackDays Validation', () => {
            it('should catch error with empty lookBackDays', () => {
                const invalidInput = { lookBackDays: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.lookBackDays.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if lookBackDays is less than 1', () => {
                const invalidInput = { lookBackDays: { value: 0, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.lookBackDays.name,
                    errorString: 'FlowBuilderValidation.shouldBeInRange'
                });
            });

            it('should catch error if lookBackDays is not a number', () => {
                const invalidInput = { lookBackDays: { value: 'test', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.lookBackDays.name,
                    errorString: 'FlowBuilderValidation.mustBeAValidNumber'
                });
            });
        });

        describe('lookBackDays maxReaction', () => {
            it('should catch error with empty maxReaction', () => {
                const invalidInput = { maxReaction: { value: '', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxReaction.name,
                    errorString: 'FlowBuilderValidation.cannotBeBlank'
                });
            });

            it('should catch error if maxReaction is less than 1', () => {
                const invalidInput = { maxReaction: { value: 0, error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxReaction.name,
                    errorString: 'FlowBuilderValidation.shouldBeInRange'
                });
            });

            it('should catch error if maxReaction is not a number', () => {
                const invalidInput = { maxReaction: { value: 'test', error: null } };
                const newState = { ...limitRepetitionCmp.state, ...invalidInput };
                const errors = validate(newState);

                expect(errors).toHaveLength(1);
                expect(errors[0]).toEqual({
                    key: ELEMENT_PROPS.maxReaction.name,
                    errorString: 'FlowBuilderValidation.mustBeAValidNumber'
                });
            });
        });
    });
});
