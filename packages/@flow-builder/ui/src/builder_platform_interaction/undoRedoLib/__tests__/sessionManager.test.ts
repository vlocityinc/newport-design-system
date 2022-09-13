import { SessionManager } from '../sessionManager';

const mockStoreState = {
    elements: {},
    properties: {},
    canvasElements: [],
    variables: []
};
describe('UndoRedoLib - SessionManager', () => {
    const mockActionA = { type: 'action-a', payload: { isSessionGroupable: true } };
    const mockActionB = { type: 'action-b', payload: { isSessionGroupable: false } };
    const mockActionC = { type: 'action-c', payload: { isSessionGroupable: false } };
    const mockActionD = { type: 'action-d', payload: { isSessionGroupable: false } };
    const mockReducer = jest.fn((a, b) => a);
    const groupedActions = [mockActionB.type];
    const sessionManager = new SessionManager();
    beforeEach(() => {
        jest.resetModules();
        sessionManager.clearSession();
    });

    describe('SessionManager', () => {
        it('Handles starting and ending sessions without changes', () => {
            sessionManager.startSession();
            expect(sessionManager.isActive).toBeTruthy();
            const { past, present } = sessionManager.endSession(mockReducer, [], mockStoreState, groupedActions);
            expect(past.length).toBe(0);
            expect(present).toEqual(mockStoreState);
            expect(sessionManager.isActive).toBeFalsy();
        });
        it('Handles starting and ending sessions with one change', () => {
            sessionManager.startSession();
            sessionManager.addAction(mockActionA);
            const { past, present } = sessionManager.endSession(mockReducer, [], mockStoreState, groupedActions);
            expect(past.length).toBe(0);
            expect(present).toEqual(mockStoreState);
        });
        it('Revises history using grouping function', () => {
            sessionManager.startSession();
            // Add all session actions to test
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionC);
            const { past } = sessionManager.endSession(
                mockReducer,
                // Set up the past array with the same number of states as actions applied during the session
                [mockStoreState, mockStoreState, mockStoreState, mockStoreState],
                mockStoreState,
                groupedActions
            );
            expect(mockReducer.mock.calls.length).toBe(4);
            expect(mockReducer.mock.calls[0][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[1][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[2][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[3][1]).toBe(mockActionC);
            // Ensure that the revised past has 3 objects because of action grouping
            expect(past.length).toBe(3);
        });
        it('Revises complicated history using grouping function', () => {
            sessionManager.startSession();
            mockActionD.payload.isSessionGroupable = true;
            // Add all session actions to test
            // What the action history for this session looks before BEFORE revising
            // => [ D, B, D, A, C, D, B, B, A, C, A ]
            // What it should look like AFTER (A and D are session groupable, B is a 'groupedAction')
            // => [ B, C, D, D, D, B, B, C, A, A, A ]
            sessionManager.addAction(mockActionD);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionD);
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionC);
            sessionManager.addAction(mockActionD);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionC);
            sessionManager.addAction(mockActionA);
            const { past } = sessionManager.endSession(
                mockReducer,
                // Set up the past array with the same number of states as actions applied during the session
                [
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState,
                    mockStoreState
                ],
                mockStoreState,
                groupedActions
            );
            expect(mockReducer.mock.calls.length).toBe(11);
            expect(mockReducer.mock.calls[0][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[1][1]).toBe(mockActionC);
            expect(mockReducer.mock.calls[2][1]).toBe(mockActionD);
            expect(mockReducer.mock.calls[3][1]).toBe(mockActionD);
            expect(mockReducer.mock.calls[4][1]).toBe(mockActionD);
            expect(mockReducer.mock.calls[5][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[6][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[7][1]).toBe(mockActionC);
            expect(mockReducer.mock.calls[8][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[9][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[10][1]).toBe(mockActionA);
            // Ensure that the revised past has 6 objects because A, B, and D should be grouped
            // => [ B, C, D, B, C, A ]
            expect(past.length).toBe(6);
        });
        it('Handles Undo with an empty session', () => {
            sessionManager.startSession();
            sessionManager.undoAction();
            sessionManager.undoAction();
            const { past, present } = sessionManager.endSession(
                mockReducer,
                [mockStoreState, mockStoreState],
                mockStoreState,
                groupedActions
            );
            // Ensure the past and present objects are unchanged
            expect(past.length).toBe(2);
            expect(present).toEqual(mockStoreState);
        });
        it('Handles Undo with a populated session', () => {
            sessionManager.startSession();
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionB);
            // Undo the 'B' action
            sessionManager.undoAction();
            sessionManager.addAction(mockActionC);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionA);
            // Undo the last 'A' action
            sessionManager.undoAction();

            sessionManager.endSession(
                mockReducer,
                [mockStoreState, mockStoreState, mockStoreState, mockStoreState, mockStoreState],
                mockStoreState,
                groupedActions
            );

            // 7 actions dispatched, 2 were undone, so 5 calls to reducer are expected
            expect(mockReducer.mock.calls.length).toBe(5);
            expect(mockReducer.mock.calls[0][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[1][1]).toBe(mockActionC);
            expect(mockReducer.mock.calls[2][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[3][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[4][1]).toBe(mockActionA);
        });
        it('Handles Redo with a populated session', () => {
            sessionManager.startSession();
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionB);
            sessionManager.undoAction();
            sessionManager.undoAction();
            sessionManager.redoAction();
            sessionManager.addAction(mockActionC);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionA);
            sessionManager.undoAction();
            sessionManager.undoAction();
            sessionManager.undoAction();
            sessionManager.undoAction();
            sessionManager.redoAction();
            sessionManager.redoAction();
            sessionManager.redoAction();

            sessionManager.endSession(
                mockReducer,
                [mockStoreState, mockStoreState, mockStoreState, mockStoreState, mockStoreState],
                mockStoreState,
                groupedActions
            );

            // 7 actions dispatched, 2 were undone, so 5 calls to reducer are expected
            expect(mockReducer.mock.calls.length).toBe(5);
            expect(mockReducer.mock.calls[0][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[1][1]).toBe(mockActionC);
            expect(mockReducer.mock.calls[2][1]).toBe(mockActionB);
            expect(mockReducer.mock.calls[3][1]).toBe(mockActionA);
            expect(mockReducer.mock.calls[4][1]).toBe(mockActionA);
        });
        it('Handles Clearing with a populated session', () => {
            sessionManager.startSession();
            // Add all session actions to test
            sessionManager.addAction(mockActionA);
            sessionManager.addAction(mockActionB);
            sessionManager.addAction(mockActionA);
            sessionManager.clearSession();

            sessionManager.addAction(mockActionC);
            sessionManager.addAction(mockActionB);
            sessionManager.endSession(
                mockReducer,
                // Set up the past array with the same number of states as actions applied during the session
                [mockStoreState, mockStoreState, mockStoreState, mockStoreState],
                mockStoreState,
                groupedActions
            );

            expect(mockReducer.mock.calls.length).toBe(2);
            expect(mockReducer.mock.calls[0][1]).toBe(mockActionC);
            expect(mockReducer.mock.calls[1][1]).toBe(mockActionB);
        });
    });
});
