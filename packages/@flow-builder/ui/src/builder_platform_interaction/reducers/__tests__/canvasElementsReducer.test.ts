// @ts-nocheck
import canvasElementsReducer from '../canvasElementsReducer';
import {
    UPDATE_FLOW,
    DO_DUPLICATE,
    DELETE_ELEMENT,
    ADD_CANVAS_ELEMENT,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_WAIT_WITH_WAIT_EVENTS,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
    ADD_STEPPED_STAGE_WITH_STEPS
} from 'builder_platform_interaction/actions';

const elementToRemove = {
    guid: '84cc7b31-ab2a-4372-b525-6d1ea13d57b0',
    name: 'mySecondElement',
    description: '',
    label: 'mySecondElement',
    locationX: 740,
    locationY: 352.3125,
    isCanvasElement: true,
    connectorCount: 0,
    config: { isSelected: true, isHighlighted: false },
    object: 'Account',
    objectIndex: '26039970-150e-43db-8f82-e802b61a95ac',
    inputAssignments: {},
    getFirstRecordOnly: true,
    inputReference: '',
    inputReferenceIndex: '949820f3-5bdc-48ca-b1fa-a4d33a2ff4f7',
    availableConnections: {},
    maxConnections: 2,
    elementType: 'RecordCreate',
    assignRecordIdToReference: '',
    assignRecordIdToReferenceIndex: 'e4f96b53-a609-4c95-a4f9-c3c4ee8f94d9',
    dataType: 'String',
    storeOutputAutomatically: true
};

const oldCanvasElementsState = ['5ab8833f-f00f-437f-a13b-bd6dbf5f0d40', '84cc7b31-ab2a-4372-b525-6d1ea13d57b0'];
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
        expect(
            canvasElementsReducer(oldCanvasElementsState, {
                type: UPDATE_FLOW,
                payload: { canvasElements: [] }
            })
        ).toEqual([]);
    });

    it('with state undefined & action type set to UPDATE_FLOW should return the array of canvas elements', () => {
        expect(
            canvasElementsReducer(undefined, {
                type: UPDATE_FLOW,
                payload: { canvasElements: [] }
            })
        ).toEqual([]);
    });

    it('with state set to defined & action type set to UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE should return the array of canvas elements', () => {
        expect(
            canvasElementsReducer(oldCanvasElementsState, {
                type: UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
                payload: { canvasElements: [] }
            })
        ).toEqual([]);
    });

    it('with state undefined & action type set to UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE should return the array of canvas elements', () => {
        expect(
            canvasElementsReducer(undefined, {
                type: UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
                payload: { canvasElements: [] }
            })
        ).toEqual([]);
    });

    it('with state set to defined & action type set to DO_DUPLICATE should return the array of canvas elements with duplicate element added', () => {
        expect(
            canvasElementsReducer(oldCanvasElementsState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap: {
                        1: 7,
                        2: 8
                    }
                }
            })
        ).toHaveLength(oldCanvasElementsState.length + 2);
    });

    it('with state set to defined & action type set to ADD_CANVAS_ELEMENT should return the array with the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_CANVAS_ELEMENT,
            payload: { guid: newCanvasElementsState }
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(3);
    });

    it('with state set to undefined & action type set to ADD_CANVAS_ELEMENT should return the array with only the new canvas element added', () => {
        const newCanvasElementState = canvasElementsReducer(undefined, {
            type: ADD_CANVAS_ELEMENT,
            payload: { guid: newCanvasElementsState }
        });
        expect(newCanvasElementState).not.toBe(newCanvasElementsState);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to defined & action type is DELETE_ELEMENT should return the array with excluded canvas element', () => {
        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: DELETE_ELEMENT,
            payload: { selectedElements: [elementToRemove] }
        });
        expect(newCanvasElementState).not.toContain(elementToRemove.guid);
        expect(newCanvasElementState).toHaveLength(1);
    });

    it('with state set to undefined & action type is ADD_DECISION_WITH_OUTCOMES should return the array with only the new decision added', () => {
        const guid = '123';

        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_DECISION_WITH_OUTCOMES,
            payload: {
                canvasElement: { guid }
            }
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(3);

        expect(newCanvasElementState[2]).toEqual(guid);
    });

    it('with state set to undefined & action type is ADD_WAIT_WITH_WAIT_EVENTS should return teh array with only the new wait event added', () => {
        const guid = '123';

        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_WAIT_WITH_WAIT_EVENTS,
            payload: {
                canvasElement: { guid }
            }
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(3);

        expect(newCanvasElementState[2]).toEqual(guid);
    });

    it('with state set to undefined & action type is ADD_STEPPED_STAGE_WITH_STEPS should return teh array with only the new stage added', () => {
        const guid = '123';

        const newCanvasElementState = canvasElementsReducer(oldCanvasElementsState, {
            type: ADD_STEPPED_STAGE_WITH_STEPS,
            payload: {
                canvasElement: { guid }
            }
        });
        expect(newCanvasElementState).not.toBe(oldCanvasElementsState[0]);
        expect(newCanvasElementState).toHaveLength(3);

        expect(newCanvasElementState[2]).toEqual(guid);
    });
});
