import reducer from '../start-element-reducer';
import { UPDATE_FLOW } from 'builder_platform_interaction-actions';

const newState = {
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
};

describe('start-elemenet-reducer', () => {
    it('with state set to undefined & action type set to empty should return null', () => {
        expect(reducer(undefined, {})).toBeNull();
    });

    it('with state set to undefined & action type set to UPDATE_FLOW should return the new state element object', () => {
        expect(reducer(undefined, {type:UPDATE_FLOW, payload:{startElement:newState}})).toEqual(newState);
    });
});