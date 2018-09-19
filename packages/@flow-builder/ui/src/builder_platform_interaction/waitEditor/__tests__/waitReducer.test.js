import {waitReducer} from "../waitReducer";
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    DeleteWaitEventEvent
} from "builder_platform_interaction/events";
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
                    name : {value: 'waitEvent1', error: null},
                    guid: parentGUID,
                    conditions: [
                        currCondition,
                    ],
                },
                {
                    name : {value: 'waitEvent2', error: null},
                    guid: 'WAIT_EVENT_2',
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

    describe('Delete Wait event', () => {
        it('with a valid guid deletes the outcome', () => {
            const deleteWaitEventEvent = new DeleteWaitEventEvent(initState.waitEvents[0].guid);

            const newState = waitReducer(initState, deleteWaitEventEvent);

            expect(newState.waitEvents).toHaveLength(1);
            expect(newState.waitEvents[0]).toEqual(initState.waitEvents[1]);
        });

        it('with an invalid guid does nothing', () => {
            const deleteWaitEventEvent = new DeleteWaitEventEvent('this.guid.does.not.exist');

            const newState = waitReducer(initState, deleteWaitEventEvent);

            expect(newState.waitEvents).toHaveLength(2);
        });

        describe('used by another element', () => {
            it('invoke the UsedBy alert modal', () => {
                const deleteWaitEventEvent = new DeleteWaitEventEvent(initState.waitEvents[0].guid);

                const usedByLib = require.requireActual('builder_platform_interaction/usedByLib');
                // An element is found which uses the outcome
                usedByLib.usedByStoreAndElementState = jest.fn().mockReturnValue([{guid: 'someElement'}]);
                usedByLib.invokeUsedByAlertModal = jest.fn();

                const newState = waitReducer(initState, deleteWaitEventEvent);

                expect(newState.waitEvents).toHaveLength(2);
                expect(usedByLib.invokeUsedByAlertModal).toHaveBeenCalled();
            });
        });
    });
});