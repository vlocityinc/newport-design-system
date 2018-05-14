import {loopReducer} from '../loop-reducer';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

describe('decision-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            loopItems : [],
            description : {value: '', error: null},
            elementType : 'LOOP',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElemen : true,
            label : {value: 'testLoop', error: null},
            locationX : 789,
            locationY : 123,
            name : {value: 'testLoop', error: null}
        };
    });
    describe('loopPropertyChanged event updates loop element properties', () => {
        it('updates the label', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                propertyName: 'label',
                value: 'newlabel',
                error: null
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj).toBeDefined();
            expect(resultObj.label.value).toEqual('newlabel');
            expect(resultObj.label.error).toBe(null);
            expect(resultObj).not.toBe(originalState);
        });
        it('fetch the error from the property change event instead of rerunning validation', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                propertyName: 'label',
                value: 'label',
                error: 'errorFromChildComponent'
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj).toBeDefined();
            expect(resultObj.label.value).toEqual('label');
            expect(resultObj.label.error).toBe('errorFromChildComponent');
            expect(resultObj).not.toBe(originalState);
        });
        it('ignores unknown events', () => {
            const event = {
                type: 'unknown event',
                propertyName: 'label',
                value: 'newlabel',
                error: null
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj).toBeDefined();
            expect(resultObj).toBe(originalState);
        });
    });
});