/**
 * SessionManager is a tool used to provide revisable history capabilities.
 * The session manager is activated when the START_EDIT_SESSION action is dispatched. When active, this manager
 * will keep track of all dispatched actions and their payloads. Any action payload may contain a bool flag:
 * `isSessionGroupable`. This flag will be used whenever the session closes, it's purpose is to tell this manager
 * which actions need to be grouped together for this session only.
 *
 * When closing a session, the accumulated session history is re-ordered so that the actions with the
 * `isSessionGroupable` flag are grouped on the last instance of an action with the same type and flag. Once the actions
 * are re-ordered, the actions are re-applied with the new order, grouping all the session groupable actions as well
 * as any normally groupable actions (actions in the normal groupedActions list are not affected by the reordering unless
 * they also have the isSessionGroupable flag).
 */
export class SessionManager {
    private pastActions: UI.StoreAction<any>[] = [];
    private futureActions: (UI.StoreAction<any> | null)[] = [];
    isActive = false;

    /**
     * Handles start of an editing session
     */
    startSession() {
        this.isActive = true;
        this.clearSession();
    }

    /**
     * Handles ending an edit session
     *
     * @param reducer The reducer used to dispatch session actions against
     * @param past Existing array of past states
     * @param present The present state
     * @param groupedActions List of actions to group
     * @returns Object the revised list of past states, updated present, and the most recent applied action
     */
    endSession(reducer: UI.StoreReducer<any>, past: UI.StoreState[], present: UI.StoreState, groupedActions: string[]) {
        this.isActive = false;
        if (this.pastActions.length < 2) {
            this.clearSession();
            // If only one action happened (or no action at all) then there is nothing to revise, so exit early
            return { past, present };
        }
        // Revise history
        return this.reviseHistory(reducer, past, groupedActions);
    }

    /**
     * Takes the reducer and existing array of past states and revises the history that took place during the session
     * using the session history actions.
     *
     * @param reducer Reducer to dispatch session actions against
     * @param past Existing array of past states
     * @param groupedActions List of actions to group
     * @private
     * @returns Object containing the revised list of past states, updated present
     */
    private reviseHistory(reducer: UI.StoreReducer<any>, past: UI.StoreState[], groupedActions: string[]) {
        // Take the action history and pass it through the sorting fn
        const sessionActionHistory = this.groupSessionActions(this.pastActions);

        const revisedHistory = past.slice(0, past.length - sessionActionHistory.length + 1);
        let prevAction: string | null = null;
        sessionActionHistory.forEach((actionToApply) => {
            const prevState = revisedHistory[revisedHistory.length - 1];
            const revisedState = reducer(prevState, actionToApply);
            const isGroupable =
                groupedActions.includes(actionToApply.type) || actionToApply.payload?.isSessionGroupable;
            // If previous action is the same as the current then group it
            if (prevAction && isGroupable && actionToApply.type === prevAction) {
                revisedHistory[revisedHistory.length - 1] = revisedState;
            } else {
                revisedHistory.push(revisedState);
            }
            prevAction = actionToApply.type;
        });

        const present = revisedHistory.pop();
        this.clearSession();

        return {
            past: revisedHistory,
            present
        };
    }

    /**
     * Takes in a list of store actions and returns a reordered list of actions where all actions with the
     * `payload.isSessionGroupable` flag are grouped together on the last instance of the action.
     *
     * @param storeActions List of store actions to reorder
     * @private
     * @returns Reordered list of store actions
     */
    private groupSessionActions(storeActions: UI.StoreAction<any>[]): UI.StoreAction<any>[] {
        const actionIdx = {}; // LUT for action indexes
        return [...storeActions]
            .reverse()
            .reduce((acc: UI.StoreAction<any>[][], action) => {
                if (action.payload?.isSessionGroupable) {
                    if (actionIdx[action.type] === undefined) {
                        // Keep track of the index for this action
                        actionIdx[action.type] = acc.length;
                        acc.push([]);
                    }
                    acc[actionIdx[action.type]].unshift(action);
                } else {
                    acc.push([action]);
                }
                return acc;
            }, [])
            .reverse()
            .flatMap((a) => a);
    }

    /**
     * Add a StoreAction to the stack of session actions
     *
     * @param action The action to add to the stack
     */
    addAction(action: UI.StoreAction<any>) {
        this.pastActions.push(action);
    }

    /**
     * Handles Undo for the session
     */
    undoAction() {
        const pastAction = this.pastActions.length > 0 ? this.pastActions.pop() : null;
        // If the session history stack is empty and undo is called, which can happen when the main store history stack
        // is populated when the session started, push null onto the stack. This keeps the session internal stacks in
        // sync with whatever is going on in the main store. When redo is called the null values are promptly ignored.
        this.futureActions.push(pastAction ? pastAction : null);
    }

    /**
     * Handles Redo for the session
     */
    redoAction() {
        const futureAction = this.futureActions.pop();
        if (futureAction) {
            this.pastActions.push(futureAction);
        }
    }

    /**
     * Handles clearing the session state
     */
    clearSession() {
        this.pastActions = [];
        this.futureActions = [];
    }
}
