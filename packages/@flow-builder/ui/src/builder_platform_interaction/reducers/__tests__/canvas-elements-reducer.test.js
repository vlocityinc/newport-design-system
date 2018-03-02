import canvasElementsReducer from '../canvas-elements-reducer';
import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, DELETE_CANVAS_ELEMENT } from 'builder_platform_interaction-actions';

const oldCanvasElementsState = [{
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
}, {
    name: 'ass2',
    label: 'assignment 2',
    description: 'desc 2'
}];
const newCanvasElementsState = {
    name: 'ass3',
    label: 'assignment 3',
    description: 'desc 3'
};

describe('canvas-elemenets-reducer', () => {
    it('with state set to undefined & action type set to empty should return an empty array ', () => {
        expect(canvasElementsReducer(undefined, {})).toEqual([]);
    });

    it('with state set to undefined & action type set to empty should return an previous state object ', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {});
        expect(newCanvasElementState).toEqual(oldCanvasElementsState);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the array of canvas elements', () => {
        expect(canvasElementsReducer(oldCanvasElementsState, {type:UPDATE_FLOW, payload:{canvasElements:[]}})).toEqual([]);
    });

    it('with state undefined & action type set to UPDATE_FLOW should return the array of canvas elements', () => {
        expect(canvasElementsReducer(undefined, {type:UPDATE_FLOW, payload:{canvasElements:[]}})).toEqual([]);
    });

    it('with state set to defined & action type set to ADD_CANVAS_ELEMENT should return the array with the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {type: ADD_CANVAS_ELEMENT, payload: {guid: newCanvasElementsState }});
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(3);
    });

    it('with state set to undefined & action type set to ADD_CANVAS_ELEMENT should return the array with only the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(undefined, {type: ADD_CANVAS_ELEMENT, payload: {guid: newCanvasElementsState }});
        expect(newCanvasElementState).not.toBe(newCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to defined & action type is DELETE_CANVAS_ELEMENT should return the array with excluded canvas element', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {type: DELETE_CANVAS_ELEMENT, payload: {guid: oldCanvasElementsState[1] }});
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to undefined & action type is DELETE_CANVAS_ELEMENT should throw an error.', () => {
        expect(() => {
            canvasElementsReducer(undefined, {type: DELETE_CANVAS_ELEMENT, payload: {guid: oldCanvasElementsState[0] }});
        }).toThrow();
    });
});