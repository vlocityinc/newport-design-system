import {waitReducer} from '../waitReducer';
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
} from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';

describe('wait-reducer', () => {
    let initState;
    const parentGUID = 'WAIT_EVENT_1';
    let currCondition;
    beforeEach(() => {
        currCondition = createCondition();
        initState = {
            name : {value: 'testWaitName', error: null},
            label : {value: 'testWaitLabel', error: null},
            elementType : 'WAIT',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement : true,
            locationX : 789,
            locationY : 123,
            waitEvents: [
                {
                    guid: parentGUID,
                    conditions: [
                        currCondition,
                    ],
                },
            ],
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
        const resultObj = waitReducer(initState, event);
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
        const resultObj = waitReducer(initState, event);
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
        const resultObj = waitReducer(initState, event);
        expect(resultObj).toEqual(initState);
    });

    it('adds a condition', () => {
        const addConditionEvent = new AddConditionEvent(parentGUID);
        expect(initState.waitEvents[0].conditions).toHaveLength(1);
        const resultObj = waitReducer(initState, addConditionEvent);
        expect(resultObj.waitEvents[0].conditions).toHaveLength(2);
    });

    it('updates a condition', () => {
        const index = 0;
        const operator = 'foo';
        currCondition.operator = operator;
        const updateConditionEvent = new UpdateConditionEvent(parentGUID, index, { operator });
        const resultObj = waitReducer(initState, updateConditionEvent);
        expect(resultObj.waitEvents[index].conditions).toHaveLength(1);
        const resultCondition = resultObj.waitEvents[index].conditions[0];
        expect(resultCondition).toEqual(currCondition);
    });

    it('deletes a condition', () => {
        const index = 0;
        const deleteConditionEvent = new DeleteConditionEvent(parentGUID, index);
        const resultObj = waitReducer(initState, deleteConditionEvent);
        expect(resultObj.waitEvents[index].conditions).toHaveLength(0);
    });
});