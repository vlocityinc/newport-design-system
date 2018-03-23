import {updateElement, MODIFIED_AND_DELETED_ELEMENTS} from '../actions';

describe('updateElement', () => {
    it('handles modify/delete of multiple elements', () => {
        const payload = {
            modified: [{a:1}, {b:2}],
            deleted: [{c:3}]
        };

        const action = updateElement(payload);

        expect(action.type).toEqual(MODIFIED_AND_DELETED_ELEMENTS);
        expect(action.payload).toEqual(payload);
    });
});