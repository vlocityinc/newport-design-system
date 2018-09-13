import { createElement } from 'lwc';
import AssignmentEditor from "../assignmentEditor";
import { PropertyChangedEvent, AddListItemEvent, DeleteListItemEvent, UpdateListItemEvent} from "builder_platform_interaction/events";
import {deepCopy} from "builder_platform_interaction/storeLib";
import { getShadowRoot } from 'lwc-test-utils';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-assignment-editor', { is: AssignmentEditor });
    document.body.appendChild(el);
    return el;
}

const testObj = {
    assignmentItems : [{
        operator: {value: 'Assign', error: null},
        valueType: {value: '', error: null},
        leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
        rightHandSide: {value: 'xyz', error: null},
        inputDataType: {value:'', error: null}
    }],
    description : {value: '', error: null},
    elementType : 'ASSIGNMENT',
    guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElemen : true,
    label : {value: 'testAssignment', error: null},
    locationX : 358,
    locationY : 227,
    name : {value: 'testAssignment', error: null}
};

const size1 = [{
    leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
    operator: {value: 'Assign', error: null},
    rightHandSide: {value: 'xyz', error: null},
}];

const size2 = [{
    leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
    operator: {value: 'Assign', error: null},
    rightHandSide: {value: 'xyz', error: null},
}, {
    leftHandSide: {value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0', error: null},
    operator: {value: 'Assign', error: null},
    rightHandSide: {value: 'xyz', error: null},
}];

describe('assignment-editor', () => {
    it('handles the property changed event and updates the property', () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            getShadowRoot(assignmentElement).querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(assignmentElement.node.description.value).toBe('new desc');
        });
    });
    it('handles the add list item changed event and updates the assignmentItems array', () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        return Promise.resolve().then(() => {
            const event = new AddListItemEvent(1);
            getShadowRoot(assignmentElement).querySelector('builder_platform_interaction-list').dispatchEvent(event);
            expect(assignmentElement.node.assignmentItems).toHaveLength(2);
        });
    });
    it('handles the delete list item changed event and updates the assignmentItems array', () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        return Promise.resolve().then(() => {
            const event = new DeleteListItemEvent(0);
            getShadowRoot(assignmentElement).querySelector('builder_platform_interaction-list').dispatchEvent(event);
            expect(assignmentElement.node.assignmentItems).toHaveLength(0);
        });
    });
    it('handles the update list item changed event and updates the assignmentItems array', () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        return Promise.resolve().then(() => {
            const event = new UpdateListItemEvent(0, {'leftHandSide': {value: 'val', error: 'err'}});
            getShadowRoot(assignmentElement).querySelector('builder_platform_interaction-list').dispatchEvent(event);
            expect(assignmentElement.node.assignmentItems[0].leftHandSide.value).toBe('val');
        });
    });
    it('shows delete when more than 1 item', () => {
        const assignmentElement = createComponentForTest();
        const node = deepCopy(testObj);
        node.assignmentItems = deepCopy(size2);
        assignmentElement.node = node;
        return Promise.resolve().then(() => {
            const rows = getShadowRoot(assignmentElement).querySelectorAll('builder_platform_interaction-row');
            rows.forEach(row => {
                expect(row.showDelete).toBe(true);
            });
        });
    });
    it('doesnt show delete when exactly 1 item', () => {
        const assignmentElement = createComponentForTest();
        const node = deepCopy(testObj);
        node.assignmentItems = deepCopy(size1);
        assignmentElement.node = node;
        return Promise.resolve().then(() => {
            const rows = getShadowRoot(assignmentElement).querySelectorAll('builder_platform_interaction-row');
            rows.forEach(row => {
                expect(row.showDelete).toBe(false);
            });
        });
    });
});
