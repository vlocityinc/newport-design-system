import {assignmentReducer} from '../assignment-reducer';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';
import {EXPRESSION_PROPERTY_TYPE} from 'builder_platform_interaction-expression-utils';

import { deepCopy } from 'builder_platform_interaction-store-lib';
const state = {
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

describe('the best assignment reducer ever', () => {
    it('updates the label', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = assignmentReducer(deepCopy(state), event);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toEqual('newlabel');
        expect(resultObj).not.toBe(state);
    });

    it('fetch the error from the property change event instead of rerunning validation', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: 'errorFromChildComponent'
            }
        };
        const resultObj = assignmentReducer(deepCopy(state), event);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.error).toBe('errorFromChildComponent');
        expect(resultObj).not.toBe(state);
    });
    it('ignores unknown events', () => {
        const event = {
        };
        const resultObj = assignmentReducer(state, event);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toBe('testAssignment');
        expect(resultObj).toBe(state);
    });
    it('adds an assignment item', () => {
        const testState = deepCopy(state);
        const assignmentItemsLength = testState.assignmentItems.length;
        const event = {
            type: AddListItemEvent.EVENT_NAME,
            detail: {
                index: assignmentItemsLength
            }
        };
        const resultObj = assignmentReducer(testState, event);
        expect(resultObj.assignmentItems).toHaveLength(2);
    });
    it('deletes an assignment item', () => {
        const testState = deepCopy(state);
        const event = {
            type: DeleteListItemEvent.EVENT_NAME,
            detail: {
                index: 0,
            }
        };
        const resultObj = assignmentReducer(testState, event);
        expect(resultObj.assignmentItems).toHaveLength(0);
    });
    it('updates the left hand side of an assignment item', () => {
        const testState = deepCopy(state);
        const event = {
            type: UpdateListItemEvent.EVENT_NAME,
            detail: {
                index: 0,
                value: {[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'val', error: 'error'}},
            }
        };
        const resultObj = assignmentReducer(testState, event);
        expect(resultObj.assignmentItems).toHaveLength(1);
        expect(resultObj.assignmentItems[0].leftHandSide.value).toBe('val');
    });
    it('updates the second of 3 assignment items', () => {
        const testState = deepCopy(state);
        testState.assignmentItems.push(deepCopy(state.assignmentItems[0]));
        testState.assignmentItems.push(deepCopy(state.assignmentItems[0]));
        const event = {
            type: UpdateListItemEvent.EVENT_NAME,
            detail: {
                index: 1,
                value: {[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'val', error: 'error'}},
            }
        };
        expect(testState.assignmentItems).toHaveLength(3);
        const resultObj = assignmentReducer(testState, event);
        expect(resultObj.assignmentItems).toHaveLength(3);
        expect(resultObj.assignmentItems[0].leftHandSide.value).toBe(state.assignmentItems[0].leftHandSide.value);
        expect(resultObj.assignmentItems[1].leftHandSide.value).toBe('val');
        expect(resultObj.assignmentItems[2].leftHandSide.value).toBe(state.assignmentItems[0].leftHandSide.value);
    });
});
