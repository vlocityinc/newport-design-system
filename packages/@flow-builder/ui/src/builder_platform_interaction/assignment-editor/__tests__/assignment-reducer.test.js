import {assignmentReducer} from '../assignment-reducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-constant';
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

describe('assignment reducer functions', () => {
    it('test action type UPDATE_ELEMENT_PROPERTY', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = assignmentReducer(deepCopy(state), action);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toBe('newlabel');
        expect(resultObj).not.toBe(state);
    });

    it('test action type update properties with error in it, should not run the validations at the assignment level and keep the child level errors', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'label',
                value: 'newlabel',
                error: 'errorFromChildComponent'
            }
        };
        const resultObj = assignmentReducer(deepCopy(state), action);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.error).toBe('errorFromChildComponent');
        expect(resultObj).not.toBe(state);
    });
    it('test default action case in switch for assignment reducer', () => {
        const action = {
        };
        const resultObj = assignmentReducer(state, action);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toBe('testAssignment');
        expect(resultObj).toBe(state);
    });
    it('test action type ADD_LIST_ITEM', () => {
        const testState = deepCopy(state.assignmentItems);
        const assignmentItemsLength = testState.length;
        const action = {
            type: PROPERTY_EDITOR_ACTION.ADD_LIST_ITEM,
            payload: {
                index: assignmentItemsLength,
                item: {leftHandSide: {value:"", error:null}, operator: {value: "", error:null},  rightHandSide: {value:"", error:null}}
            }
        };
        const resultObj = assignmentReducer(testState, action);
        expect(resultObj.length).toBe(2);
    });
    it('test action type DELETE_LIST_ITEM', () => {
        const testState = deepCopy(state.assignmentItems);
        const action = {
            type: PROPERTY_EDITOR_ACTION.DELETE_LIST_ITEM,
            payload: {
                index: 0,
            }
        };
        const resultObj = assignmentReducer(testState, action);
        expect(resultObj.length).toBe(0);
    });
    it('test action type UPDATE_LIST_ITEM', () => {
        const testState = deepCopy(state.assignmentItems);
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_LIST_ITEM,
            payload: {
                index: 0,
                propertyName: 'leftHandSide',
                value: 'new value',
                error: null
            }
        };
        const resultObj = assignmentReducer(testState, action);
        expect(resultObj.length).toBe(1);
        expect(resultObj[0].leftHandSide.value).toBe('new value');
    });
    it('test action type UPDATE_LIST_ITEM with an update in the middle of the array', () => {
        const testState = deepCopy(state.assignmentItems);
        testState.push(deepCopy(state.assignmentItems[0]));
        testState.push(deepCopy(state.assignmentItems[0]));
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_LIST_ITEM,
            payload: {
                index: 1,
                propertyName: 'leftHandSide',
                value: 'new value',
                error: null
            }
        };
        expect(testState).toHaveLength(3);
        const resultObj = assignmentReducer(testState, action);
        expect(resultObj).toHaveLength(3);
        expect(resultObj[0].leftHandSide.value).toBe(state.assignmentItems[0].leftHandSide.value);
        expect(resultObj[1].leftHandSide.value).toBe('new value');
        expect(resultObj[2].leftHandSide.value).toBe(state.assignmentItems[0].leftHandSide.value);
    });
});