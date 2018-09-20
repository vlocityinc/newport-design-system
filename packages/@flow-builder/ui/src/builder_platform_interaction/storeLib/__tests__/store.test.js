const canvasElementsReducer = jest
    .fn()
    .mockImplementation((canvasElements = [], action) => {
        switch (action.type) {
            case 'updateCanvasElements':
                return [...canvasElements, 'Element 1'];
            default: return canvasElements;
        }
    });

describe('Store class', () => {
    let storeInstance;
    let Store;
    beforeEach(() => {
        jest.resetModules();
        Store = require('../store').Store;
        storeInstance = Store.getStore(canvasElementsReducer);
    });

    describe('get store function', () => {
        it('return new store instance', () => {
            expect(storeInstance).toBeInstanceOf(Store);
        });

        it('return same store instance when getStore is called again', () => {
            expect(Store.getStore()).toBe(storeInstance);
        });

        it('initial state is empty', () => {
            expect(storeInstance.getCurrentState()).toHaveLength(0);
        });
    });

    describe('subscribe function', () => {
        let listener, unsubscribe;
        beforeEach(() => {
            listener = jest.fn();
            unsubscribe = storeInstance.subscribe(listener);
        });
        it('listener gets called when action is dispatch', () => {
            storeInstance.dispatch({
                type: 'random'
            });
            expect(listener).toHaveBeenCalled();
        });

        it('listener should not be called after unsubscribe is called', () => {
            unsubscribe();
            storeInstance.dispatch({
                type: 'random'
            });
            expect(listener).not.toHaveBeenCalled();
        });
        it('unsubscribe fails if listener not found', () => {
            unsubscribe();
            expect(unsubscribe).toThrow('Failed to unsubscribe listener.');
        });
    });

    describe('dispatch function', () => {
        it('throws error if action is not an object', () => {
            const dispatchWithFunction = () => storeInstance.dispatch(() => {});
            expect(dispatchWithFunction).toThrow();
        });

        it('throws error if action does not have type property', () => {
            const dispatchWithEmptyObject = () => storeInstance.dispatch({});
            expect(dispatchWithEmptyObject).toThrow();
        });

        it('update the state if correct action is passed', () => {
            storeInstance.dispatch({
                type: 'updateCanvasElements'
            });
            expect(storeInstance.getCurrentState()).toHaveLength(1);
        });
    });

    describe('unintended store mutation', () => {
        it('should not update the store', () => {
            // initial dispatch to freeze the store
            storeInstance.dispatch({
                type: 'updateCanvasElements'
            });

            // updating store state directly throws error in local env in auto builds it's not
            const previousStoreState = storeInstance.getCurrentState();
            try {
                storeInstance.getCurrentState().invalidProperty = 'property value';
            } catch (e) {
                // ignore the error
            }
            // verify store is not updated with invalidProperty
            expect(storeInstance.getCurrentState()).toEqual(previousStoreState);
        });
    });
});
