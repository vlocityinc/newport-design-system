import { isPlainObject } from './isPlainObject';
import { deepFreeze } from './deepFreeze';

/**
 * Library for UI state management
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */

/**
 * contains the state of the store
 */
let currentState;

/**
 * contains definition of a reducer which can used to transform state of the store
 */
let currentReducer;

/**
 * contains an instance of the store
 */
let storeInstance;

/**
 * contains list of all the listeners(aka callback that needs to be executed when state changes) of the store.
 * @type {Array}
 */
let currentListeners = [];

/**
 * Store singleton class
 */
export class Store {
    constructor(reducer) {
        if (!reducer) {
            throw new Error('Store must be initialized with reducer');
        } else if (!currentReducer) {
            currentReducer = reducer;
        } else {
            throw new Error('Reducer already exists');
        }
    }

    /**
     * Static method to create a single instance of a store
     * @param {Function} reducer reducer function
     * @returns {Object} instance of the store
     */
    static getStore(reducer) {
        if (!storeInstance) {
            storeInstance = new Store(reducer);
            storeInstance.dispatch({type: 'INIT'});
        }
        return storeInstance;
    }

    /**
     * @returns {Object} current state of the store
     */
    getCurrentState() {
        return currentState;
    }

    /**
     * Subscribe a listener to the store
     * @param {Function} listener function that will be executed when state of store changes
     * @returns {Function} unSubscribe function to unSubscribe from the store.
     */
    subscribe(listener) {
        currentListeners = [...currentListeners, listener];
        return function unSubscribe() {
            const index = currentListeners.indexOf(listener);
            currentListeners = [...currentListeners.slice(0, index), ...currentListeners.slice(index + 1)];
        };
    }

    /**
     * To change the state of the store, call this method with appropriate action
     * TODO: Remove deepFreeze before release. W-4916277
     * @param {Object} action object which contains a type property
     */
    dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error('Action is not a plain javascript object');
        }

        if (!action.type) {
            throw new Error('Type of a action is not defined');
        }

        currentState = deepFreeze(currentReducer(currentState, action));

        // once state is changes, executing all the listeners
        currentListeners.forEach((listener) => {
            listener();
        });
    }
}
