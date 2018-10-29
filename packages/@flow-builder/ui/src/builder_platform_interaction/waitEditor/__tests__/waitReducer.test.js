import {waitReducer} from "../waitReducer";
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    DeleteWaitEventEvent,
    WaitEventPropertyChangedEvent,
    WaitEventParameterChangedEvent,
} from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

describe('wait-reducer', () => {
    let initState;
    const absoluteBaseTime = 'AlarmTime';
    const directRecordSalesforceObject = 'TimeTableColumnEnumOrId';
    const directRecordBaseTime = 'TimeFieldColumnEnumOrId';
    const directRecordRecordId = 'EntityObjectId';
    const stringDataType = FLOW_DATA_TYPE.STRING.value;
    const referenceDataType = FEROV_DATA_TYPE.REFERENCE;
    const rowIndexGuid = '000f916fee-1c6f3-108bf-abcd4-16c041fcba15999';
    const absoluteBaseTimeTypeWaitEventGUID = 'WAIT_EVENT_ABSOLUTE_TIME_TYPE';
    const directRecordTimeTypeWaitEventGUID = 'WAIT_EVENT_DIRECT_RECORD_TYPE';
    const absoluteBaseTimeTypeWaitEventIndex = 0;
    const directRecordTimeTypeWaitEventIndex = 1;
    const nullError = null;
    let currCondition;
    const mockAbsoluteTimeInputParameters = [
        {
            name: { value: absoluteBaseTime, error: null },
            value: {value: 'foo', error: null},
            rowIndex: rowIndexGuid,
            valueDataType: { value: referenceDataType, error : null}
        }];
    const mockDirectRecordTimeInputParameters = [
        {
            name: { value: directRecordSalesforceObject, error: null },
            value: {value: 'Account', error: null},
            rowIndex: rowIndexGuid,
            valueDataType: { value: stringDataType, error : null}
        },
        {
            name: { value: directRecordBaseTime, error: null },
            value: {value: 'LastModifiedDate', error: null},
            rowIndex: rowIndexGuid,
            valueDataType: { value: stringDataType, error : null}
        },
        {
            name: { value: directRecordRecordId, error: null },
            value: {value: '{!recordId}', error: null},
            rowIndex: rowIndexGuid,
            valueDataType: { value: referenceDataType, error : null}
        }];
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
                    guid: absoluteBaseTimeTypeWaitEventGUID,
                    inputParameters: mockAbsoluteTimeInputParameters,
                    conditions: [
                        currCondition,
                    ],
                    conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
                },
                {
                    name : {value: 'waitEvent2', error: null},
                    guid: directRecordTimeTypeWaitEventGUID,
                    inputParameters: mockDirectRecordTimeInputParameters,
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
                error: nullError
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
        const addConditionEvent = new AddConditionEvent(absoluteBaseTimeTypeWaitEventGUID);
        expect(initState.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions).toHaveLength(1);
        const resultObj = waitReducer(initState, addConditionEvent);
        expect(resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions).toHaveLength(2);
    });
    it('hydrates a new condition', () => {
        const addConditionEvent = new AddConditionEvent(absoluteBaseTimeTypeWaitEventGUID);
        expect(initState.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions).toHaveLength(1);
        const resultObj =  waitReducer(initState, addConditionEvent);
        const newCondition = resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions[1];
        expect(newCondition).toHaveProperty('operator.value');
        expect(newCondition).toHaveProperty('operator.error');
    });
    it('updates a condition', () => {
        const operator = 'foo';
        currCondition.operator = operator;
        const updateConditionEvent = new UpdateConditionEvent(absoluteBaseTimeTypeWaitEventGUID, absoluteBaseTimeTypeWaitEventIndex, { operator });
        const resultObj = waitReducer(initState, updateConditionEvent);
        expect(resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions).toHaveLength(1);
        const resultCondition = resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions[0];
        expect(resultCondition).toEqual(currCondition);
    });
    it('deletes a condition', () => {
        const deleteConditionEvent = new DeleteConditionEvent(absoluteBaseTimeTypeWaitEventGUID, absoluteBaseTimeTypeWaitEventIndex);
        const resultObj = waitReducer(initState, deleteConditionEvent);
        expect(resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].conditions).toHaveLength(0);
    });
    describe('inputParameter', () => {
        it('updates absolute basetime inputParameter', () => {
            const newValue = 'bar';
            const waitEventParameterChanged = new WaitEventParameterChangedEvent(absoluteBaseTime, newValue, stringDataType, nullError, absoluteBaseTimeTypeWaitEventGUID, true);
            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[absoluteBaseTimeTypeWaitEventIndex].inputParameters;
            expect(Object.keys(inputParameters)).toHaveLength(1);
            expect(inputParameters[0].name.value).toEqual(absoluteBaseTime);
            expect(inputParameters[0].value).toEqual({value: newValue, error: nullError});
            expect(inputParameters[0].valueDataType.value).toEqual(stringDataType);
        });

        it('updates directRecordRecordId aka EntityObjectId inputParameter when a new value is provided', () => {
            const newValue = 'newRecordId';
            const waitEventParameterChanged = new WaitEventParameterChangedEvent(directRecordRecordId, newValue, stringDataType, nullError, directRecordTimeTypeWaitEventGUID, true);
            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[directRecordTimeTypeWaitEventIndex].inputParameters;
            const recordIdIndex = inputParameters.findIndex(param => {
                return param.name.value === directRecordRecordId;
            });
            expect(inputParameters[recordIdIndex].value).toEqual({value: newValue, error: nullError});
            expect(inputParameters[recordIdIndex].valueDataType.value).toEqual(stringDataType);
        });

        it('updates directRecordSalesforceObject aka TimeTableColumnEnumOrId inputParameter when a new value is provided', () => {
            const newValue = 'Contact';
            const waitEventParameterChanged = new WaitEventParameterChangedEvent(directRecordSalesforceObject, newValue, stringDataType, nullError, directRecordTimeTypeWaitEventGUID, true);
            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[directRecordTimeTypeWaitEventIndex].inputParameters;
            const salesforceObjectIndex = inputParameters.findIndex(param => {
                return param.name.value === directRecordSalesforceObject;
            });
            expect(inputParameters[salesforceObjectIndex].value).toEqual({value: newValue, error: nullError});
            expect(inputParameters[salesforceObjectIndex].valueDataType.value).toEqual(stringDataType);
        });

        it('updates directRecordBaseTime aka TimeFieldColumnEnumOrId inputParameter when a new value is provided', () => {
            const newValue = 'CreatedBy';
            const waitEventParameterChanged = new WaitEventParameterChangedEvent(directRecordBaseTime, newValue, stringDataType, nullError, directRecordTimeTypeWaitEventGUID, true);
            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[directRecordTimeTypeWaitEventIndex].inputParameters;
            const directRecordBaseTimeIndex = inputParameters.findIndex(param => {
                return param.name.value === directRecordBaseTime;
            });
            expect(inputParameters[directRecordBaseTimeIndex].value).toEqual({value: newValue, error: nullError});
            expect(inputParameters[directRecordBaseTimeIndex].valueDataType.value).toEqual(stringDataType);
        });

        it('updates inputParameter if a new name is provided', () => {
            const index = 0;
            const newEventType = 'someEventType';
            const newValue = 'bar';
            const newValueDataType = FLOW_DATA_TYPE.STRING.value;
            const error = null;

            const waitEventParameterChanged = new WaitEventParameterChangedEvent(newEventType, newValue, newValueDataType, error, absoluteBaseTimeTypeWaitEventGUID, true, index);
            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[index].inputParameters;

            expect(inputParameters[0].name.value).toEqual(newEventType);
            expect(inputParameters[0].value).toEqual({value: newValue, error});
            expect(inputParameters[0].valueDataType.value).toEqual(newValueDataType);
        });

        it('updates inputParameter when index is null but name is found', () => {
            const index = null;
            const actualExpectedIndex = 0;
            const newValue = 'bar';
            const newValueDataType = FLOW_DATA_TYPE.STRING.value;
            const error = null;

            const waitEventParameterChanged = new WaitEventParameterChangedEvent(absoluteBaseTime, newValue, newValueDataType, error, absoluteBaseTimeTypeWaitEventGUID, true, index);

            const resultObj = waitReducer(initState, waitEventParameterChanged);
            const inputParameters = resultObj.waitEvents[actualExpectedIndex].inputParameters;

            expect(inputParameters[0].name.value).toEqual(absoluteBaseTime);
            expect(inputParameters[0].value).toEqual({value: newValue, error});
            expect(inputParameters[0].valueDataType.value).toEqual(newValueDataType);
        });
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

    describe('condition logic', () => {
        it('updates condition logic', () => {
            const newConditionLogic = CONDITION_LOGIC.OR;
            const propertyChangedEvent = new WaitEventPropertyChangedEvent('conditionLogic', newConditionLogic, null, absoluteBaseTimeTypeWaitEventGUID);
            expect(initState.waitEvents[0].conditionLogic.value).toEqual(CONDITION_LOGIC.AND);
            const resultObj = waitReducer(initState, propertyChangedEvent);
            expect(resultObj.waitEvents[0].conditionLogic.value).toEqual(newConditionLogic);
        });

        it('other logic to no condition', () => {
            const newConditionLogic = CONDITION_LOGIC.NO_CONDITIONS;
            const propertyChangedEvent = new WaitEventPropertyChangedEvent('conditionLogic', newConditionLogic, null, absoluteBaseTimeTypeWaitEventGUID);
            expect(initState.waitEvents[0].conditionLogic.value).toEqual(CONDITION_LOGIC.AND);
            const resultObj = waitReducer(initState, propertyChangedEvent);
            expect(resultObj.waitEvents[0].conditionLogic.value).toEqual(newConditionLogic);
            expect(resultObj.waitEvents[0].conditions).toHaveLength(0);
        });

        it('no condition to other logic adds a condition', () => {
            initState.waitEvents[0].conditionLogic.value = CONDITION_LOGIC.NO_CONDITION;
            initState.waitEvents[0].conditions = [];
            const newConditionLogic = CONDITION_LOGIC.OR;
            const propertyChangedEvent = new WaitEventPropertyChangedEvent('conditionLogic', newConditionLogic, null, absoluteBaseTimeTypeWaitEventGUID);
            expect(initState.waitEvents[0].conditionLogic.value).toEqual(CONDITION_LOGIC.NO_CONDITION);
            const resultObj = waitReducer(initState, propertyChangedEvent);
            expect(resultObj.waitEvents[0].conditionLogic.value).toEqual(newConditionLogic);
            expect(resultObj.waitEvents[0].conditions).toHaveLength(1);
        });
    });
});
