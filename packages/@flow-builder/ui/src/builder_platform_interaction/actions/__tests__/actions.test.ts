// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    addElement,
    ADD_CHILD,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_PARENT_WITH_CHILDREN,
    deleteElements,
    DELETE_CHILDREN,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_PARENT_WITH_CHILDREN,
    removeLastCreatedInlineResource,
    REMOVE_LAST_CREATED_INLINE_RESOURCE,
    updateElement,
    updateElementErrorState,
    UPDATE_CANVAS_ELEMENT_ERROR_STATE,
    UPDATE_RESOURCE_ERROR_STATE,
    UPDATE_VARIABLE_CONSTANT
} from '../actions';

describe('Actions', () => {
    describe('updateElement', () => {
        it('handles modify decision with outcomes', () => {
            const payload = {
                elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
                decision: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }],
                deleted: [{ c: 3 }]
            };

            const action = updateElement(payload);

            expect(action.type).toEqual(MODIFY_DECISION_WITH_OUTCOMES);
            expect(action.payload).toEqual(payload);
        });
        it('handles variables with a UPDATE_VARIABLE_CONSTANT action', () => {
            const payload = {
                elementType: ELEMENT_TYPE.VARIABLE,
                somePayload: { x: 6 }
            };

            const action = updateElement(payload);

            expect(action.type).toEqual(UPDATE_VARIABLE_CONSTANT);
            expect(action.payload).toEqual(payload);
        });
        it('handles modify OrchestratedStage with StageSteps', () => {
            const payload = {
                elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS,
                orchestratedStage: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }],
                deleted: [{ c: 3 }]
            };

            const action = updateElement(payload);

            expect(action.type).toEqual(MODIFY_PARENT_WITH_CHILDREN);
        });
    });

    describe('updateElementErrorState', () => {
        it('handles modify error state of decision with outcomes', () => {
            const payload = {
                elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
                canvasElement: { elementType: 'Decision' },
                childElements: [{ elementType: 'OUTCOME' }]
            };

            const action = updateElementErrorState(payload);

            expect(action.type).toEqual(UPDATE_CANVAS_ELEMENT_ERROR_STATE);
            expect(action.payload).toEqual(payload);
        });

        it('handles modify error state of OrchestratedStage', () => {
            const payload = {
                elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS,
                canvasElement: { elementType: 'OrchestratedStage' }
            };

            const action = updateElementErrorState(payload);

            expect(action.type).toEqual(UPDATE_CANVAS_ELEMENT_ERROR_STATE);
            expect(action.payload).toEqual(payload);
        });

        it('handles modify error state of StartElement', () => {
            const payload = {
                elementType: ELEMENT_TYPE.START_WITH_MODIFIED_AND_DELETED_SCHEDULED_PATHS,
                canvasElement: { elementType: 'START_ELEMENT' }
            };

            const action = updateElementErrorState(payload);

            expect(action.type).toEqual(UPDATE_CANVAS_ELEMENT_ERROR_STATE);
            expect(action.payload).toEqual(payload);
        });

        it('handles modify error state of OrchestratedStageStep', () => {
            const payload = {
                elementType: ELEMENT_TYPE.STAGE_STEP
            };

            const action = updateElementErrorState(payload);

            expect(action.type).toEqual(UPDATE_RESOURCE_ERROR_STATE);
            expect(action.payload).toEqual(payload);
        });
    });

    describe('addElement', () => {
        it('handles add decision with outcomes', () => {
            const payload = {
                elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
                decision: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }]
            };

            const action = addElement(payload);

            expect(action.type).toEqual(ADD_DECISION_WITH_OUTCOMES);
            expect(action.payload).toEqual(payload);
        });
        describe('remove last created resource ', () => {
            expect(removeLastCreatedInlineResource.payload).toEqual({});
            expect(removeLastCreatedInlineResource.type).toBe(REMOVE_LAST_CREATED_INLINE_RESOURCE);
        });
        it('handles add OrchestratedStage with StageSteps', () => {
            const payload = {
                elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS,
                orchestratedStage: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }]
            };

            const action = addElement(payload);

            expect(action.type).toEqual(ADD_PARENT_WITH_CHILDREN);
            expect(action.payload).toEqual(payload);
        });
        it('handles add StageStep', () => {
            const payload = {
                elementType: ELEMENT_TYPE.STAGE_STEP,
                stageStep: { x: 6 }
            };

            const action = addElement(payload);

            expect(action.type).toEqual(ADD_CHILD);
            expect(action.payload).toEqual(payload);
        });
        it('handles delete child', () => {
            const payload = {
                parentGUID: 'foo',
                elementType: 'bar'
            };

            const action = deleteElements(payload);

            expect(action.type).toEqual(DELETE_CHILDREN);
            expect(action.payload).toEqual(payload);
        });
    });
});
