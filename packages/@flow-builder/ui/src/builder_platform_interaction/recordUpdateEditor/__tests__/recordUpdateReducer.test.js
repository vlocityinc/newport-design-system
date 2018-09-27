import {recordUpdateReducer} from "../recordUpdateReducer";
import { PropertyChangedEvent } from "builder_platform_interaction/events";

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
            const propChangedEvent = new PropertyChangedEvent(propertyName, value, error, null, originalState.inputReference.value);
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordUpdateReducer(originalState, propChangedEvent);
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference.value).toEqual('VARIABLE_33');
            expect(newState.inputReference.error).toBe(null);
        });
        it('fetch the error from the action instead of rerunning validation', () => {
            const propertyName = 'inputReference';
            const value = 'notValidSobject';
            const error = 'You have entered an invalid value.';
            const propChangedEvent = new PropertyChangedEvent(propertyName, value, error, null, originalState.inputReference.value);
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordUpdateReducer(originalState, propChangedEvent);
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