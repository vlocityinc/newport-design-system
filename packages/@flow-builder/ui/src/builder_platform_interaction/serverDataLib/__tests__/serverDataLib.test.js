import { SERVER_ACTION_TYPE, setAuraFetch, fetch, fetchOnce, resetFetchOnceCache, isAlreadyFetched } from "../serverDataLib";

describe('Fetch function', () => {
    beforeEach(() => {
        setAuraFetch(undefined);
    });

    describe('auraFetch is set', () => {
        beforeEach(() => {
            const mockAuraFetch = jest.fn().mockImplementation((actionName, shouldExecuteCallback, callback) => {
                Promise.resolve().then(() => {
                    if (shouldExecuteCallback()) {
                        callback();
                    }
                });
            });
            setAuraFetch(mockAuraFetch);
        });

        it('executes callback', () => {
            const mockCallback = jest.fn();
            fetch(SERVER_ACTION_TYPE.GET_FLOW, mockCallback);
            return Promise.resolve().then(() => {
                expect(mockCallback).toHaveBeenCalled();
            });
        });

        it('does not executes callback when stopCallbackExecution is called', () => {
            const mockCallback = jest.fn();
            const stopCallbackExecution = fetch(SERVER_ACTION_TYPE.GET_FLOW, mockCallback);
            stopCallbackExecution();
            return Promise.resolve().then(() => {
                expect(mockCallback).not.toHaveBeenCalled();
            });
        });
    });

    describe('auraFetch is undefined', () => {
        it('does not executes callback', () => {
            const mockCallback = jest.fn();
            fetch(SERVER_ACTION_TYPE.GET_FLOW, mockCallback);
            return Promise.resolve().then(() => {
                expect(mockCallback).not.toHaveBeenCalled();
            });
        });
    });
});

const mockAuraFetch = (responseProvider) => jest.fn().mockImplementation((actionName, shouldExecuteCallback, callback, params) => {
    Promise.resolve().then(() => {
        if (shouldExecuteCallback()) {
            callback(responseProvider(params));
        }
    });
});
const mockIdentityAuraFetch = mockAuraFetch(params => ({ data:params }));
const mockErrorAuraFetch = (error) => mockAuraFetch(() => ({ error }));

describe('fetchOnce function', () => {
    afterEach(() => {
        resetFetchOnceCache();
    });
    it('calls auraFetch each time we do a call if parameters are not the same', async () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters1 = { actionName: 'actionName', actionType: 'actionType' };
        const parameters2 = { actionName: 'actionName2', actionType: 'actionType2' };
        const firstCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters1);
        const secondCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters2);
        await expect(firstCallPromise).resolves.toEqual(parameters1);
        await expect(secondCallPromise).resolves.toEqual(parameters2);
        expect(mockIdentityAuraFetch).toHaveBeenCalledTimes(2);
    });
    it('calls auraFetch only once if we do several calls with same paramaters', async () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        const promise1 = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        const promise2 = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        await expect(promise1).resolves.toEqual(parameters);
        await expect(promise2).resolves.toEqual(parameters);
        expect(mockIdentityAuraFetch).toHaveBeenCalledTimes(1);
    });
    it('calls auraFetch each time we do a call with the same parameters until call is successful', async () => {
        const errorAuraFetch = mockErrorAuraFetch('error during the call');
        setAuraFetch(errorAuraFetch);
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        const firstCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        await expect(firstCallPromise).rejects.toEqual(new Error('error during the call'));
        const secondCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        await expect(secondCallPromise).rejects.toEqual(new Error('error during the call'));
        setAuraFetch(mockIdentityAuraFetch);
        const thirdCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        await expect(thirdCallPromise).resolves.toEqual(parameters);
        const fourthCallPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        await expect(fourthCallPromise).resolves.toEqual(parameters);
        expect(errorAuraFetch).toHaveBeenCalledTimes(2);
        expect(mockIdentityAuraFetch).toHaveBeenCalledTimes(1);
    });
    it('returns readonly objects', async () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters = { prop1 : { prop2 : 'value'} };
        const callPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        const result = await callPromise;
        expect(result.prop1.prop2).toEqual('value');
        expect(() => {
            result.prop1.prop2 = 'new value';
        }).toThrow('Invalid mutation: Cannot set "prop2" on "[object Object]". "[object Object]" is read-only.');
    });
    it('correctly returns primitive values', async () => {
        setAuraFetch(mockAuraFetch(() => ({ data : 1 })));
        const parameters = {};
        const callPromise = fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        const result = await callPromise;
        expect(result).toEqual(1);
    });
});

describe('isAlreadyFetched function', () => {
    afterEach(() => {
        resetFetchOnceCache();
    });
    it('returns false if not in cache', () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        expect(isAlreadyFetched(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters)).toBe(false);
    });
    it('returns true if has been fetched', async () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        expect(isAlreadyFetched(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters)).toBe(true);
    });
    it('returns false if pending', async () => {
        setAuraFetch(mockIdentityAuraFetch);
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters);
        expect(isAlreadyFetched(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters)).toBe(false);
    });
    it('returns false if it returned an error', async () => {
        setAuraFetch(mockErrorAuraFetch('error during the call'));
        const parameters = { actionName: 'actionName', actionType: 'actionType' };
        await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters).catch(() => {});
        expect(isAlreadyFetched(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, parameters)).toBe(false);
    });
});
