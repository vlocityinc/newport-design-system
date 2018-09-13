import canvasElementsReducer from "../canvasElementsReducer";
import {
    UPDATE_FLOW,
    DELETE_ELEMENT,
    ADD_CANVAS_ELEMENT,
    ADD_DECISION_WITH_OUTCOMES
} from "builder_platform_interaction/actions";

const oldCanvasElementsState = [1, 2];
const newCanvasElementsState = [3];

describe('canvas-elements-reducer', () => {
    it('with state set to undefined & action type set to empty should return an empty array ', () => {
        expect(canvasElementsReducer(undefined, {})).toEqual([]);
    });

    it('with state set to undefined & action type set to empty should return the previous state object ', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {});
        expect(newCanvasElementState).toBe(oldCanvasElementsState);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the array of canvas elements', () => {
        expect(canvasElementsReducer(oldCanvasElementsState, {
            type: UPDATE_FLOW,
            payload: {canvasElements: []}
        })).toEqual([]);
    });

    it('with state undefined & action type set to UPDATE_FLOW should return the array of canvas elements', () => {
        expect(canvasElementsReducer(undefined, {type: UPDATE_FLOW, payload: {canvasElements: []}})).toEqual([]);
    });

    it('with state set to defined & action type set to ADD_CANVAS_ELEMENT should return the array with the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_CANVAS_ELEMENT,
            payload: {guid: newCanvasElementsState}
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(3);
    });

    it('with state set to undefined & action type set to ADD_CANVAS_ELEMENT should return the array with only the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(undefined, {
            type: ADD_CANVAS_ELEMENT,
            payload: {guid: newCanvasElementsState}
        });
        expect(newCanvasElementState).not.toBe(newCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to defined & action type is DELETE_ELEMENT should return the array with excluded canvas element', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: DELETE_ELEMENT,
            payload: {selectedElementGUIDs: [oldCanvasElementsState[1]]}
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to undefined & action type is ADD_DECISION_WITH_OUTCOMES should return the array with only the new decision added', () => {
        const guid = '123';

        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_DECISION_WITH_OUTCOMES,
            payload: {
                decision: { guid }
            }
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(3);

        expect(newCanvasElementState[2]).toEqual(guid);
    });
});