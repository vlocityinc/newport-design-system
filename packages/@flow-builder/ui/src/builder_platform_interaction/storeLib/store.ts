// @ts-nocheck
import { isDevMode } from 'builder_platform_interaction/contextLib';
import { readonly } from 'lwc';
import { isPlainObject } from './isPlainObject';

export type StoreReducer = (storeState: UI.StoreState, action: object) => UI.StoreState;

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
let currentState: UI.StoreState;

/**
 * contains definition of a reducer which can used to transform state of the store
 */
let currentReducer: StoreReducer;

/**
 * contains an instance of the store
 */
let storeInstance: Store;

/**
 * contains list of all the listeners(aka callback that needs to be executed when state changes) of the store.
 *
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
     *
     * @param reducer - reducer function
     * @returns instance of the store
     */
    static getStore(reducer?: StoreReducer) {
        if (!storeInstance) {
            storeInstance = new Store(reducer);
            storeInstance.dispatch({ type: 'INIT' });
        }
        return storeInstance;
    }

    /**
     * @returns the current state of the store
     */
    getCurrentState(): UI.StoreState {
        return currentState;
    }

    /**
     * Subscribe a listener to the store
     *
     * @param {Function} listener function that will be executed when state of store changes
     * @returns {Function} unSubscribe function to unSubscribe from the store.
     */
    subscribe(listener) {
        currentListeners = [...currentListeners, listener];
        return function unSubscribe() {
            const index = currentListeners.indexOf(listener);
            if (index !== -1) {
                currentListeners = [...currentListeners.slice(0, index), ...currentListeners.slice(index + 1)];
            } else {
                throw new Error(`Failed to unsubscribe listener. Listener ${listener} not found!`);
            }
        };
    }

    /**
     * To change the state of the store, call this method with appropriate action
     *
     * @param {Object} action object which contains a type property
     */
    dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error('Action is not a plain javascript object');
        }

        if (!action.type) {
            throw new Error('Type of action is not defined');
        }

        currentState = currentReducer(currentState, action);
        if (isDevMode()) {
            currentState = readonly(currentState);
        }
        // once state is changes, executing all the listeners
        currentListeners.forEach((listener) => {
            listener();
        });
    }
}
