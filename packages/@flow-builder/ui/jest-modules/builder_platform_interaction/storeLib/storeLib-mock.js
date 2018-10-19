import * as storeLib from '../../../modules/builder_platform_interaction/storeLib/storeLib.js';

/**
 * Mock object for the store library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
const mock = {};

// mock of createSelector that just returns a function that when called, simply returns the parameter passed
const createSelectorMock = jest.fn().mockImplementation(() => {
    return jest.fn().mockImplementation(state => state);
});

/**
 * Initializes a mock store. Has a lot of useful spies for store methods
 * NOTE: If you dirty the state of the mock store that will carry on to other tests.
 * This also applies to the state of the spies (previous calls from other tests remain)
 * To prevent this, jestSetupTest.js created as a "setupTestFrameworkScriptFile"
 * We call call resetStore for you so that every test gets a clean mock store
 * @return {Object}                the mock store with helper methods to manipulate store
 */
const MockStore = jest.fn().mockImplementation(() => {
    let _actions = [];
    let _listeners = [];
    let _state = {};
    const createMockState = () => {
        // the state of the store is a shallow copy. This means if you change the values of the mock store directly in
        // your test, this will carry over into other tests.
        // call set mock state if you want to reset your dirty state
        return Object.assign({}, _state);
    };

    const isFunction = (arg) => typeof arg === 'function';
    const UnsubscribeSpy = jest.fn().mockImplementation(() => {});

    const SubscribeSpy = jest.fn().mockImplementation((subscribeCallback) => {
        if (isFunction(subscribeCallback)) {
            // add the subscribeCallback to list of listners
            _listeners.push(subscribeCallback);
            // call what ever callback the component passes when subscribing to our mock store
            subscribeCallback();
        }

        // return an unsubscribe spy function in case any test needs to check if the unsubribe was used correctly
        return UnsubscribeSpy;
    });

    const DispatchSpy = jest.fn().mockImplementation((action) => {
        // keep track of the actions dispatched to the mock store. It is NOT the job of the mock store
        // to validate if these actions are valid, there should be tests for actions that cover that
        _actions.push(action);
    });

    const CurrentStateSpy = jest.fn().mockImplementation(() => {
        return createMockState();
    });

    const setMockState = (mockState = {}) => {
        _state = Object.assign({}, mockState);
    };

    const StoreSpy = jest.fn().mockImplementation(() => {
        // return an object with spy methods
        return {
            subscribe : SubscribeSpy,
            dispatch : DispatchSpy,
            getCurrentState : CurrentStateSpy
        };
    });

    // reset all the spys in the store. Ideally should be called before each test if the store was dirtied
    const resetStore = () => {
        SubscribeSpy.mockClear();
        DispatchSpy.mockClear();
        CurrentStateSpy.mockClear();
        StoreSpy.mockClear();
        UnsubscribeSpy.mockClear();
        setMockState({});
        _actions = [];
        _listeners = [];
    };
    return {
        getStore: StoreSpy,
        // helper methods to get the actions dispatched and listeners added to mock store
        getActions : () => _actions,
        getListeners : () => _listeners,
        setMockState,
        resetStore,
    };
});

const mockStoreInstance = new MockStore();

export const generateGuid = () => {
    return storeLib.generateGuid();
};

export const deepCopy = (arg) => {
    return storeLib.deepCopy(arg);
};

export const isPlainObject = (arg) => {
    return storeLib.isPlainObject(arg);
};

// Store
export { mock as combinedReducer };
export { createSelectorMock as createSelector };
export { mockStoreInstance as Store };
export { mock as guid };
