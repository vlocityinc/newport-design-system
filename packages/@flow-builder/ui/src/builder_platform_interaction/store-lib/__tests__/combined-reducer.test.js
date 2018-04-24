import { combinedReducer } from '../combinedReducer';

const state = {
    canvasElements: ['Element 1']
};

const canvasElementsReducer = jest
    .fn()
    .mockImplementation((canvasElements = [], action) => {
        switch (action.type) {
            case 'updateCanvasElements':
                return [...canvasElements, 'Element 2'];
            default:
                return canvasElements;
        }
    });

const reducers = {
    canvasElements: canvasElementsReducer
};

describe('combined reducer', () => {
    describe('when action with type is passed', () => {
        const newState = combinedReducer(reducers)(state, {
            type: 'updateCanvasElements'
        });

        it('returns new state object', () => {
            expect(newState).not.toBe(state);
        });
    });

    describe('when action without type is passed', () => {
        const newState = combinedReducer(reducers)(state, {});

        it('returns new state object', () => {
            expect(newState).toBe(state);
        });
    });
});
