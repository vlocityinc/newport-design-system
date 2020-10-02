// @ts-nocheck
import {
    addElement,
    removeLastCreatedInlineResource,
    updateElement,
    ADD_DECISION_WITH_OUTCOMES,
    MODIFY_DECISION_WITH_OUTCOMES,
    UPDATE_VARIABLE_CONSTANT,
    REMOVE_LAST_CREATED_INLINE_RESOURCE,
    MODIFY_PARENT_WITH_CHILDREN,
    ADD_PARENT_WITH_CHILDREN,
    ADD_CHILD
} from '../actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

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
        it('handles modify SteppedStage with SteppedStageItems', () => {
            const payload = {
                elementType: ELEMENT_TYPE.STEPPED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS,
                steppedStage: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }],
                deleted: [{ c: 3 }]
            };

            const action = updateElement(payload);

            expect(action.type).toEqual(MODIFY_PARENT_WITH_CHILDREN);
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
        it('handles add SteppedStage with SteppedStageItems', () => {
            const payload = {
                elementType: ELEMENT_TYPE.STEPPED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS,
                steppedStage: { x: 6 },
                modified: [{ a: 1 }, { b: 2 }]
            };

            const action = addElement(payload);

            expect(action.type).toEqual(ADD_PARENT_WITH_CHILDREN);
            expect(action.payload).toEqual(payload);
        });
        it('handles add SteppedStageItem', () => {
            const payload = {
                elementType: ELEMENT_TYPE.STEPPED_STAGE_ITEM,
                steppedStageItem: { x: 6 }
            };

            const action = addElement(payload);

            expect(action.type).toEqual(ADD_CHILD);
            expect(action.payload).toEqual(payload);
        });
    });
});
