import reducer from '../resources-reducer';
import { UPDATE_FLOW, ADD_RESOURCE, DELETE_RESOURCE } from 'builder_platform_interaction-actions';

const oldVariablesState = [{
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
}, {
    name: 'ass2',
    label: 'assignment 2',
    description: 'desc 2'
}];
const newVariablesState = {
    name: 'ass3',
    label: 'assignment 3',
    description: 'desc 3'
};

describe('resources-reducer', () => {
    it('with state set to undefined & action type set to empty should return empty array', () => {
        expect(reducer(undefined, {})).toEqual([]);
    });

    it('with state set to defined & action type set to empty should return current state object', () => {
        const newVariableState = reducer(oldVariablesState, {});
        expect(newVariableState).toHaveLength(2);
        expect(newVariableState).toEqual(oldVariablesState);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the array of resources', () => {
        expect(reducer(oldVariablesState, {type:UPDATE_FLOW, payload:{resources:[]}})).toEqual([]);
    });

    it('with state set to undefined & action type set to UPDATE_FLOW should return the array of resources', () => {
        expect(reducer(undefined, {type:UPDATE_FLOW, payload:{resources:[]}})).toEqual([]);
    });

    it('with state set to defined & action type set to ADD_RESOURCE should return the array with the new resource object along with the previous resources', () => {
        const newVariableState = reducer(oldVariablesState, {type: ADD_RESOURCE, payload: {guid: newVariablesState }});
        expect(newVariableState).not.toBe(oldVariablesState);
        expect(newVariableState).toHaveLength(3);
    });

    it('with state set to undefined & action type is ADD_RESOURCE should return the array with the new resource object', () => {
        const newVariableState = reducer(undefined, {type: ADD_RESOURCE, payload: {guid: newVariablesState }});
        expect(newVariableState).not.toBe(newVariablesState);
        expect(newVariableState).toHaveLength(1);
    });

    it('with state set to defined & action type set to DELETE_RESOURCE should return the array with the omitted resource object', () => {
        const newVariableState = reducer(oldVariablesState, {type: DELETE_RESOURCE, payload: {guid: oldVariablesState[1] }});
        expect(newVariableState).not.toBe(oldVariablesState[0]);
        expect(newVariableState).toHaveLength(1);
    });

    it('with state set to undefined & action type set to DELETE_RESOURCE should throw an error.', () => {
        expect(() => {
            reducer(undefined, {type: DELETE_RESOURCE, payload: {guid: oldVariablesState[0] }});
        }).toThrow();
    });
});