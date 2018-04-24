import { SERVER_ACTION_TYPE, setAuraFetch, fetch} from "../server-data-lib";


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
