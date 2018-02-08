import { createElement } from 'engine';
import AssignmentEditor from '../assignment-editor';
import {PropertyChangedEvent} from 'builder_platform_interactioncommon-events';

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

describe('assignment-editor', () => {
    it('handles the property changed event and updates the property', () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = testObj;
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            assignmentElement.querySelector('builder_platform_interactioncommon-label-description').dispatchEvent(event);
            expect(assignmentElement.node.description.value).toBe('new desc');
        });
    });
});