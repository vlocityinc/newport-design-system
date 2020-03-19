import {
    ADD_CANVAS_ELEMENT,
    ADD_START_ELEMENT,
    DELETE_ELEMENT,
    SELECTION_ON_FIXED_CANVAS
} from 'builder_platform_interaction/actions';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';
import { addElement, deleteElement, addElementToState, linkElement } from 'builder_platform_interaction/flowUtils';
import { createRootElement } from 'builder_platform_interaction/flcConversionUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';

import flcElementsReducer from '../flcElementsReducer.js';

const getElement = (guid, name) => {
    return {
        guid,
        name
    };
};
jest.mock('../elementsReducer', () => {
    return jest.fn(state => Object.assign({}, state));
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    return {
        createEndElement: jest.fn(() => ({
            guid: 'end-element-guid'
        }))
    };
});

jest.mock('builder_platform_interaction/flcConversionUtils', () => {
    return {
        createRootElement: jest.fn(() => ({
            guid: 'root'
        }))
    };
});

jest.mock('builder_platform_interaction/flowUtils', () => {
    return {
        addElement: jest.fn(),
        addElementToState: jest.fn(),
        deleteElement: jest.fn(),
        linkElement: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flcBuilderUtils', () => {
    return {
        supportsChildren: jest.fn()
    };
});

const oldElements = { guid1: getElement('guid1', 'ass1') };
const payload = getElement('guid2', 'ass2');

describe('elements-reducer', () => {
    describe('Add Canvas Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(flcElementsReducer(undefined, {})).toEqual({});
        });

        it('addElement should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = addElement;
            flcElementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
        it('supports children should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = supportsChildren;
            flcElementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Add Start Element', () => {
        it('start, end and root elements are added', () => {
            flcElementsReducer(
                {},
                {
                    type: ADD_START_ELEMENT,
                    payload: { guid: 'start-element-guid' }
                }
            );

            expect(addElementToState).toHaveBeenLastCalledWith({ guid: 'root' }, {});
            expect(linkElement).toHaveBeenLastCalledWith({}, { guid: 'end-element-guid' });
            expect(createRootElement).toHaveBeenLastCalledWith('start-element-guid');
            expect(createEndElement).toHaveBeenLastCalledWith({ prev: 'start-element-guid' });
        });
    });

    describe('Delete Element', () => {
        it('calls deleteElement', () => {
            const elementToDelete = {
                guid: 'element-guid'
            };

            flcElementsReducer(
                {},
                {
                    type: DELETE_ELEMENT,
                    payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: 1 }
                }
            );

            expect(deleteElement).toHaveBeenLastCalledWith({}, elementToDelete, 1);
        });
    });

    describe('Selection/Deselection of an Element', () => {
        let elements;
        beforeEach(() => {
            elements = {
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: false
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: true
                    }
                }
            };
        });

        const canvasElementGuidsToSelect = ['guid1'];
        const canvasElementGuidsToDeselect = ['guid3'];

        it('Should mark guid1 as selected', () => {
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids: [] }
            });

            expect(updatedState.guid1).toMatchObject({
                guid: 'guid1',
                config: {
                    isSelected: true,
                    isHighlighted: false,
                    canSelect: true
                }
            });
        });

        it('Should mark guid3 as de-selected', () => {
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids: [] }
            });

            expect(updatedState.guid3).toMatchObject({
                guid: 'guid3',
                config: {
                    isSelected: false,
                    isHighlighted: false,
                    canSelect: true
                }
            });
        });

        it('Should set canSelect to true for all elements when selectableGuids is an empty array', () => {
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: [], selectableGuids: [] }
            });

            expect(updatedState).toMatchObject({
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: true
                    }
                }
            });
        });

        it('Should set canSelect to true only for elements in selectableGuids and false for the rest', () => {
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: [],
                    canvasElementGuidsToDeselect: [],
                    selectableGuids: ['guid2']
                }
            });

            expect(updatedState).toMatchObject({
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: false
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: false
                    }
                }
            });
        });
    });
});
