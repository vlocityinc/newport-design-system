import {recordDeleteReducer} from '../recordDeleteReducer';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';

const INPUT_REFERENCE_PROPERTY_NAME = 'inputReference';

describe('record-delete-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            elementType: 'RECORD_DELETE',
            inputReference: {value: 'VARIABLE_1', error: null}
        };
    });
    describe('update property action', () => {
        test('updates the "inputReference" element property value', () => {
            const newValue = 'VARIABLE_2';
            const newError = null;
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {propertyName: INPUT_REFERENCE_PROPERTY_NAME, value: newValue, error: newError });
            const newState = recordDeleteReducer(originalState, action);
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference).toMatchObject({value: newValue, error: newError});
        });
        test('fetch the error from the action instead of rerunning validation', () => {
            const newValue = 'notValidSobjectVariable';
            const newError = 'You have entered an invalid value.';
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName: INPUT_REFERENCE_PROPERTY_NAME, value: newValue, error: newError });
            const newState = recordDeleteReducer(originalState, action);
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference).toMatchObject({value: newValue, error: newError});
        });
    });
    test('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = recordDeleteReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});