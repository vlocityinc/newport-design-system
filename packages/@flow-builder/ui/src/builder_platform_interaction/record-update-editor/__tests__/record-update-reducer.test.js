import {recordUpdateReducer} from '../record-update-reducer';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';

describe('record-update-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            processMetadataValues: [],
            elementType: 'RECORD_CREATE',
            guid: 'RECORD_CREATE_11',
            isCanvasElement: false,
            inputReference: {value: 'VARIABLE_6', error: null}
        };
    });
    describe('update property action', () => {
        it('updates the inputReference property', () => {
            const propertyName = 'inputReference';
            const value = 'VARIABLE_33';
            const error = null;
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
            const newState = recordUpdateReducer(originalState, action);
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference.value).toEqual('VARIABLE_33');
            expect(newState.inputReference.error).toBe(null);
        });
        it('fetch the error from the action instead of rerunning validation', () => {
            const propertyName = 'inputReference';
            const value = 'notValidSobject';
            const error = 'You have entered an invalid value.';
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
            const newState = recordUpdateReducer(originalState, action);
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference.value).toEqual(value);
            expect(newState.inputReference.error).toBe(error);
        });
    });
    it('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = recordUpdateReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});