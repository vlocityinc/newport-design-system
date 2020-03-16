import elementsReducer from '../flcElementsReducer.js';
import { ADD_CANVAS_ELEMENT } from 'builder_platform_interaction/actions';

import { addElement } from 'builder_platform_interaction/flowUtils';

import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';

import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

const getElement = (guid, name) => {
    return {
        guid,
        name
    };
};

jest.mock('builder_platform_interaction/flowUtils', () => {
    return {
        addElement: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flcBuilderUtils', () => {
    return {
        supportsChildren: jest.fn()
    };
});

const oldElements = { guid1: getElement('guid1', 'ass1') };
const addedElements = { guid2: getElement('guid2', 'ass2') };
const payload = getElement('guid2', 'ass2');

describe('elements-reducer', () => {
    describe('Add Canvas Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementsReducer(undefined, {})).toEqual({});
        });

        it('with state set to undefined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
            const newElementState = elementsReducer(undefined, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(addedElements);
        });

        it('with state set to defined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
            const newElementState = elementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual({
                ...oldElements,
                ...addedElements
            });
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
});
