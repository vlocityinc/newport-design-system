import {
    addElement,
    updateElement,
    ADD_DECISION_WITH_OUTCOMES,
    MODIFY_DECISION_WITH_OUTCOMES,
    REPLACE_RESOURCE
} from '../actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

describe('updateElement', () => {
    it('handles modify decision with outcomes', () => {
        const payload = {
            elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
            decision: {x: 6},
            modified: [{a: 1}, {b: 2}],
            deleted: [{c: 3}]
        };

        const action = updateElement(payload);

        expect(action.type).toEqual(MODIFY_DECISION_WITH_OUTCOMES);
        expect(action.payload).toEqual(payload);
    });
    it('handles variables with a REPLACE_RESOURCE action', () => {
        const payload = {
            elementType: ELEMENT_TYPE.VARIABLE,
            somePayload: {x: 6},
        };

        const action = updateElement(payload);

        expect(action.type).toEqual(REPLACE_RESOURCE);
        expect(action.payload).toEqual(payload);
    });
});

describe('addElement', () => {
    it('handles add decision with outcomes', () => {
        const payload = {
            elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
            decision: {x: 6},
            modified: [{a: 1}, {b: 2}]
        };

        const action = addElement(payload);

        expect(action.type).toEqual(ADD_DECISION_WITH_OUTCOMES);
        expect(action.payload).toEqual(payload);
    });
});

