/**
 * Combine multiple reducer to a one reducer function.
 * @param {Object} reducers object containing key value pair of all the reducers. Key is name of the property of the state of a store on which reduction needs to happen.
 * @returns {Function} one reducer function.
 */
export function combinedReducer(reducers) {
    return function combined(state = {}, action) {
        let updated = false;
        const newState = {};
        const reducerKeys = Object.keys(reducers);
        reducerKeys.forEach(key => {
            newState[key] = reducers[key](state[key], action);
            updated = updated || newState[key] !== state[key];
        });
        return updated ? newState : state;
    };
}
