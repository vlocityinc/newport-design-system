import {assignmentReducer} from '../assignment-reducer';
import AssignmentEditor from '../assignment-editor';

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
    it('test action type update properties', () => {
        const action = {
            type: AssignmentEditor.UPDATE_PROPERTY,
            payload: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = assignmentReducer(state, action);
        expect(resultObj).toBeDefined();
        expect(resultObj.label.value).toBe('newlabel');
        expect(resultObj).not.toBe(state);
    });

    it('test action type update properties with error in it, should not run the validations at the assignment level and keep the child level errors', () => {
        const action = {
            type: AssignmentEditor.UPDATE_PROPERTY,
            payload: {
                propertyName: 'label',
                value: 'newlabel',
                error: 'errorFromChildComponent'
            }
        };
        const resultObj = assignmentReducer(state, action);
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
});