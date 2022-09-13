// @ts-nocheck
import { CLEAR_UNDO_REDO, END_EDIT_SESSION, INIT, REDO, START_EDIT_SESSION, UNDO } from '../undoRedoLib';

const initialStoreState = {
    elements: {},
    properties: {},
    canvasElements: [],
    variables: []
};
const MOCK_GROUPED_ACTION = 'mockGroupedAction';
const MOCK_GROUPED_ACTION2 = 'mockGroupedAction2';

const storeStateWithOneMockElement = {
    elements: {
        guid1: {
            elementType: 'test',
            guid: 'guid1',
            name: 'testElement',
            label: 'testElementLabel'
        }
    },
    properties: {
        mockProp1: '1',
        mockProp2: '2'
    },
    canvasElements: [],
    variables: []
};

const mockReducerFn = jest.fn((x) => ({ ...x }));

describe('UndoRedo Library Function', () => {
    const blacklistedActions = [INIT];
    const groupedActions = [MOCK_GROUPED_ACTION, MOCK_GROUPED_ACTION2];
    const mockInitAction = { type: INIT };
    const mockRedoAction = { type: REDO };
    const mockUndoAction = { type: UNDO };
    const mockClearUndoRedoAction = { type: CLEAR_UNDO_REDO };
    const mockSessionStartAction = { type: START_EDIT_SESSION };
    const mockSessionEndAction = { type: END_EDIT_SESSION };
    const mockGroupedAction = { type: MOCK_GROUPED_ACTION, payload: {} };
    const mockGroupedAction2 = { type: MOCK_GROUPED_ACTION2, payload: {} };

    const mockTestAction = { type: 'test' };

    let undoRedo, isUndoAvailable, isRedoAvailable, undoRedoFnWithMockReducer;
    beforeEach(() => {
        jest.resetModules();
        undoRedo = require('../undoRedoLib').undoRedo;
        isUndoAvailable = require('../undoRedoLib').isUndoAvailable;
        isRedoAvailable = require('../undoRedoLib').isRedoAvailable;
        undoRedoFnWithMockReducer = undoRedo(mockReducerFn, {
            blacklistedActions,
            groupedActions
        });
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
        it('Expect No state is added to past until all the consecutive actions are the same groupedAction', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction); // Init action does not create a past state.
            const stateAfterOneGroupedAction = undoRedoFnWithMockReducer(stateAfterInit, mockGroupedAction);
            undoRedoFnWithMockReducer(stateAfterOneGroupedAction, mockGroupedAction);
            expect(isUndoAvailable()).toBe(false);
        });
        it('Expect one state is added to past when a different grouped action is fired', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction); // Init action does not create a past state.
            const stateAfterOneGroupedAction = undoRedoFnWithMockReducer(stateAfterInit, mockGroupedAction);
            const stateAfterSecondGroupedAction = undoRedoFnWithMockReducer(
                stateAfterOneGroupedAction,
                mockGroupedAction
            );
            undoRedoFnWithMockReducer(stateAfterSecondGroupedAction, mockGroupedAction2);
            expect(isUndoAvailable()).toBe(true);
        });
        it('Expect one state is added to past when a non-grouped action is fired after a series of grouped actions', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction); // Init action does not create a past state.
            const stateAfterOneGroupedAction = undoRedoFnWithMockReducer(stateAfterInit, mockGroupedAction);
            const stateAfterSecondGroupedAction = undoRedoFnWithMockReducer(
                stateAfterOneGroupedAction,
                mockGroupedAction
            );
            undoRedoFnWithMockReducer(stateAfterSecondGroupedAction, mockTestAction);
            expect(isUndoAvailable()).toBe(true);
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

    describe('UndoRedo function - Switch case - Clear Undo Redo', () => {
        it('makes undo and redo unavailable by clearing the past and future array', () => {
            const stateAfterInit = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            undoRedoFnWithMockReducer(stateAfterInit, mockTestAction);
            const stateAfterSecondAction = undoRedoFnWithMockReducer(storeStateWithOneMockElement, mockTestAction);
            const stateAfterUndoAction = undoRedoFnWithMockReducer(stateAfterSecondAction, mockUndoAction);
            undoRedoFnWithMockReducer(stateAfterUndoAction, mockClearUndoRedoAction);
            expect(isRedoAvailable()).toBe(false);
            expect(isUndoAvailable()).toBe(false);
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

    describe('UndoRedo function - Session Revisioning', () => {
        it('Expect no past states if closing session without any changes', () => {
            undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            undoRedoFnWithMockReducer(initialStoreState, mockTestAction);
            undoRedoFnWithMockReducer(initialStoreState, mockSessionStartAction);
            const result = undoRedoFnWithMockReducer(initialStoreState, mockSessionEndAction);
            expect(result).toEqual(initialStoreState);
            expect(isUndoAvailable()).toBe(false);
        });
        it('Expect one past state if dispatching one action during a session', () => {
            let storeState = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            // Initialize present state
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            expect(isUndoAvailable()).toBe(false);
            storeState = undoRedoFnWithMockReducer(storeState, mockSessionStartAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            undoRedoFnWithMockReducer(storeState, mockSessionEndAction);
            expect(isUndoAvailable()).toBe(true);
        });
        it('Expect past state if dispatching multiple grouped actions during a session', () => {
            let storeState = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            // Initialize present state
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockSessionStartAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            undoRedoFnWithMockReducer(storeState, mockSessionEndAction);
            // After closing the session, the grouped actions should result in only one undoable action
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            expect(isUndoAvailable()).toBe(false);
        });
        it('Expect multiple past states during a session if dispatching multiple undo action with multiple actions', () => {
            let storeState = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            // Initialize present state
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockSessionStartAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            // After dispatching three grouped actions while inside a panel session, we should be able to undo each
            // action separately iff we are still inside the same session
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            // After undoing every change, there should be no more undo actions available
            expect(isUndoAvailable()).toBe(false);
        });
        it('Expect grouped action to be sorted after other actions after session closes', () => {
            mockGroupedAction.payload.isSessionGroupable = true;
            let storeState = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            // Start session
            storeState = undoRedoFnWithMockReducer(storeState, mockSessionStartAction);

            // Dispatch a few grouped actions mixed with other non-blacklisted actions
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction2);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);

            // End Session
            undoRedoFnWithMockReducer(storeState, mockSessionEndAction);
            // After closing the session, the grouped actions should be sorted to the end of the undo stack
            // The first undo action will undo all mockGroupedAction(s)
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            // Second undo will undo the mockGroupedAction2 action
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            // Third undo will undo the mockTestAction
            expect(isUndoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            expect(isUndoAvailable()).toBe(false);
        });
        it('Expect undo/redo to work on every action during a session even if action is group-able', () => {
            let storeState = undoRedoFnWithMockReducer(initialStoreState, mockInitAction);
            // Initialize present state
            storeState = undoRedoFnWithMockReducer(storeState, mockTestAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockSessionStartAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            storeState = undoRedoFnWithMockReducer(storeState, mockGroupedAction);
            // Undo each change that happened so far
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            undoRedoFnWithMockReducer(storeState, mockUndoAction);
            // Redo all the changes
            expect(isRedoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockRedoAction);
            expect(isRedoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockRedoAction);
            expect(isRedoAvailable()).toBe(true);
            undoRedoFnWithMockReducer(storeState, mockRedoAction);
            expect(isRedoAvailable()).toBe(false);
        });
    });
});
