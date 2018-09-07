import {waitReducer} from '../wait-reducer';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';

describe('wait-editor', () => {
    let noErrorState;
    beforeEach(() => {
        noErrorState = {
            name : {value: 'testWaitName', error: null},
            label : {value: 'testWaitLabel', error: null},
            elementType : 'WAIT',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement : true,
            locationX : 789,
            locationY : 123,
        };
    });
    it('updates label value', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = waitReducer(noErrorState, event);
        expect(resultObj.label.value).toBe('newlabel');
        expect(resultObj.label.error).toBe(null);
    });
    it('updates error from the property change event instead of rerunning validation', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'label',
                error: 'errorForThisProperty'
            }
        };
        const resultObj = waitReducer(noErrorState, event);
        expect(resultObj.label.value).toBe('label');
        expect(resultObj.label.error).toBe('errorForThisProperty');
    });
    it('returns the unchanged state for an unknown event type', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = waitReducer(noErrorState, event);
        expect(resultObj).toEqual(noErrorState);
    });
});