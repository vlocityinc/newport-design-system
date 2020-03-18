import { ADD_CANVAS_ELEMENT, ADD_START_ELEMENT, DELETE_ELEMENT } from 'builder_platform_interaction/actions';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';
import { addElement, deleteElement, addElementToState, linkElement } from 'builder_platform_interaction/flowUtils';
import { createRootElement } from 'builder_platform_interaction/flcConversionUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';

import elementsReducer from '../flcElementsReducer.js';

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
            expect(elementsReducer(undefined, {})).toEqual({});
        });

        it('addElement should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = addElement;
            elementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
        it('supports children should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = supportsChildren;
            elementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Add Start Element', () => {
        it('start, end and root elements are added', () => {
            elementsReducer(
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

            elementsReducer(
                {},
                {
                    type: DELETE_ELEMENT,
                    payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: 1 }
                }
            );

            expect(deleteElement).toHaveBeenLastCalledWith({}, elementToDelete, 1);
        });
    });
});
