import {
    UNDO,
    REDO,
    INIT
} from '../undoRedoLib';

const initialStoreState = {
    elements: {},
    properties: {},
    canvasElements: [],
    variables: []
};

const storeStateWithOneMockElement = {
    elements: {'guid1': {
        elementType: 'test',
        guid: 'guid1',
        name: 'testElement',
        label: 'testElementLabel'
    }},
    properties: {
        mockProp1: '1',
        mockProp2: '2'
    },
    canvasElements: [],
    variables: []
};

const mockReducerFn = jest.fn().mockImplementation(x => x);

describe('UndoRedo Library Function', () => {
    const blacklistedActions = [INIT];
    const mockInitAction = {type: INIT};
    const mockRedoAction = {type: REDO};
    const mockUndoAction = {type: UNDO};
    const mockTestAction = {type: "test"};

    let undoRedo, isUndoAvailable, isRedoAvailable, undoRedoFnWithMockReducer;
    beforeEach(() => {
        jest.resetModules();
        undoRedo = require('../undoRedoLib').undoRedo;
        isUndoAvailable = require('../undoRedoLib').isUndoAvailable;
        isRedoAvailable = require('../undoRedoLib').isRedoAvailable;
        undoRedoFnWithMockReducer = undoRedo(mockReducerFn, {blacklistedActions});
    });

    describe('UndoRedo function - Switch case - Default', () => {
        it('Expect reducer to be called in case the action type is not undo or redo', () => {
            undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(mockReducerFn).toHaveBeenCalledWith(initialStoreState, mockInitAction);
        });
        it('Expect the return state from undo redo to be same as initialStateStore', () => {
            const result = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(result).toEqual(initialStoreState);
        });
    });
    describe('UndoRedo function - Switch Case - Undo', () => {
        it('to throw if past length is 0', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(() => {
                undoRedoFnWithMockReducer(stateAfterInit, mockUndoAction);
            }).toThrow();
        });
        it('Brings back previous State after undo is pressed', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            const stateAfterFirstAction = undoRedoFnWithMockReducer(stateAfterInit, mockTestAction);
            const stateAfterSecondAction = undoRedoFnWithMockReducer(storeStateWithOneMockElement, mockTestAction);
            const undoActionResult = undoRedoFnWithMockReducer(stateAfterSecondAction, mockUndoAction);
            expect(undoActionResult).toEqual(stateAfterFirstAction);
            expect(isUndoAvailable()).toBe(false);
            expect(isRedoAvailable()).toBe(true);
        });
    });
    describe('UndoRedo function - Switch case - Redo', () => {
        it('to throw if future length is 0', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(() => {
                undoRedoFnWithMockReducer(stateAfterInit, mockRedoAction);
            }).toThrow();
        });
        it('to return the first state stored in future array', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            undoRedoFnWithMockReducer(stateAfterInit, mockTestAction);
            const stateAfterSecondAction = undoRedoFnWithMockReducer(storeStateWithOneMockElement, mockTestAction);
            const stateAfterUndoAction = undoRedoFnWithMockReducer(stateAfterSecondAction, mockUndoAction);
            const redoActionResult = undoRedoFnWithMockReducer(stateAfterUndoAction, mockRedoAction);
            expect(redoActionResult).toEqual(stateAfterSecondAction);
            expect(isRedoAvailable()).toBe(false);
            expect(isUndoAvailable()).toBe(true);
        });
    });
    describe('isUndoAvailable function', () => {
        it('return false when past length is less than 1', () => {
            undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(isUndoAvailable()).toBe(false);
        });
        it('return true after 1 state is pushed into the past array.', () => {
            // Initially there is nothing in past, present or future.
            // The first mockTestAction puts the state in the present, at this point the past and future are empty arrays
            undoRedoFnWithMockReducer(initialStoreState, mockTestAction);
            // The second mockTestAction moves the present state to past array
            undoRedoFnWithMockReducer(initialStoreState, mockTestAction);
            expect(isUndoAvailable()).toBe(true);
        });
    });
    describe('isRedoAvailable function', () => {
        it('return false when past length is less than 1', () => {
            undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            expect(isRedoAvailable()).toBe(false);
        });
        it('return true when there is atleast 1 item in the future array', () => {
            // Add something to present
            undoRedoFnWithMockReducer(initialStoreState, mockTestAction);
            // Move it to past and add a new state to present
            undoRedoFnWithMockReducer(initialStoreState, mockTestAction);
            // Do Undo, to put present state into future array
            undoRedoFnWithMockReducer(initialStoreState, mockUndoAction);
            expect(isRedoAvailable()).toBe(true);
        });
    });
});
