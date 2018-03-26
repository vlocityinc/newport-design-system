import {updateElement, MODIFY_DECISION_WITH_OUTCOMES} from '../actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

describe('updateElement', () => {
    it('handles modify decision with outcomes', () => {
        const payload = {
            elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
            decision: {x: 6},
            modified: [{a:1}, {b:2}],
            deleted: [{c:3}]
        };

        const action = updateElement(payload);

        expect(action.type).toEqual(MODIFY_DECISION_WITH_OUTCOMES);
        expect(action.payload).toEqual(payload);
    });
});