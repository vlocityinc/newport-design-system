import { createElement } from 'lwc';
import LoopEditor from '../loop-editor';
import {PropertyChangedEvent, ComboboxStateChangedEvent} from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

const IAMERRORED = 'IAMERRORED';
const VARIABLE = 'VARIABLE_GUID';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-loop-editor', { is: LoopEditor });
    document.body.appendChild(el);
    return el;
}

const selectors = {
    LOOP_COLLECTION_FEROV_RESOURCE_PICKER: '.test-loop-collection',
    LOOP_VARIABLE_FEROV_RESOURCE_PICKER: '.test-loop-variable',
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description'
};

describe('loop-editor', () => {
    let noErrorState;
    beforeEach(() => {
        noErrorState = {
            name : {value: 'testLoop', error: null},
            label : {value: 'testLoop', error: null},
            description : {value: 'test description', error: null},
            assignNextValueToReference: {value: 'VARIABLE_1', error: null},
            collectionReference: {value: 'VARIABLE_2', error: null},
            iterationOrder: {value:'Asc', error: null },
            elementType : 'LOOP',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement : true,
            locationX : 789,
            locationY : 123,
        };
    });
    it('handles the property changed event and updates the property', () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            getShadowRoot(loopElement).querySelector(selectors.LABEL_DESCRIPTION).dispatchEvent(event);
        });
        return Promise.resolve().then(() => {
            expect(loopElement.node.description.value).toBe('new desc');
        });
    });
    it('loop collection handles the combobox value changed event and updates the property', () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        Promise.resolve().then(() => {
            const event = new ComboboxStateChangedEvent({
                value : VARIABLE
            }, VARIABLE, null);
            getShadowRoot(loopElement).querySelector(selectors.LOOP_VARIABLE_FEROV_RESOURCE_PICKER).dispatchEvent(event);
        });
        return Promise.resolve().then(() => {
            expect(loopElement.node.assignNextValueToReference.value).toBe(VARIABLE);
            expect(loopElement.node.assignNextValueToReference.error).toBe(null);
        });
    });
    it('handles the loop collection value and error message is updated', () => {
        const loopElement = createComponentForTest();
        loopElement.node = noErrorState;
        Promise.resolve().then(() => {
            const event = new ComboboxStateChangedEvent({
                value: VARIABLE
            }, VARIABLE, IAMERRORED);
            getShadowRoot(loopElement).querySelector(selectors.LOOP_COLLECTION_FEROV_RESOURCE_PICKER).dispatchEvent(event);
        });
        return Promise.resolve().then(() => {
            expect(loopElement.node.collectionReference.value).toBe(VARIABLE);
            expect(loopElement.node.collectionReference.error).toBe(IAMERRORED);
        });
    });
});