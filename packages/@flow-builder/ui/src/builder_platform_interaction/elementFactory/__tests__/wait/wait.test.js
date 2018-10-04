import { createWaitEvent, createWaitWithWaitEvents, createWaitMetadataObject } from '../../wait';
import { baseCanvasElement, baseChildElement } from "../../base/baseElement";
import { createInputParameter, createInputParameterMetadataObject } from '../../inputParameter';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    ELEMENT_TYPE,
    CONDITION_LOGIC,
    WAIT_EVENT_TYPE
} from "builder_platform_interaction/flowMetadata";

jest.mock('../../base/baseElement', () => {
    return {
        baseCanvasElement: jest.fn(() => {
            return {};
        }).mockName('baseCanvasElementMock'),
        baseChildElement: jest.fn().mockName('baseChildElementMock').mockReturnValue({}),
    };
});

jest.mock('../../base/baseMetadata', () => {
   return {
        baseChildElementMetadataObject: jest.fn().mockName('baseChildElementMetadataObject').mockReturnValue({}),
        baseCanvasElementMetadataObject: jest.fn().mockName('baseCanvasElementMetadataObject').mockReturnValue({}),
   };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn().mockName('getElementByGuid').mockReturnValue({}),
    };
});

jest.mock('../../inputParameter', () => {
    return {
        createInputParameter: jest.fn().mockName('createInputParameter').mockReturnValue({}),
        createInputParameterMetadataObject: jest.fn().mockName('createInputParameterMetadataObject').mockReturnValue({}),
    };
});

describe('wait', () => {
    describe('createWaitWithWaitEvents', () => {
        it('with no parameter calls baseChildElement with an empty object', () => {
            createWaitWithWaitEvents();
            expect(baseCanvasElement.mock.calls[0][0]).toEqual({});
        });
    });

    describe('waitEvent', () => {
        it('calls baseChildElement with elementType = WAIT_EVENT', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.WAIT_EVENT);
        });

        it('has NO_CONDITIONS as the default condition logic', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][0].conditionLogic).toEqual(CONDITION_LOGIC.NO_CONDITIONS);
        });

        it('has a default eventType of ABSOLUTE_TIME', () => {
            const waitEvent = createWaitEvent();
            expect(waitEvent.eventType).toEqual(WAIT_EVENT_TYPE.ABSOLUTE_TIME);
        });

        it('uses existing values when passed in a waitEvent object', () => {
            const mockCondition1 = { operator: 'foo' };
            const mockCondition2 = { operator: 'bar' };
            const mockWaitEvent = {
                conditionLogic: CONDITION_LOGIC.OR,
                conditions: [
                    mockCondition1,
                    mockCondition2,
                ],
                dataType: 'sfdc',
            };
            createWaitEvent(mockWaitEvent);
            expect(baseChildElement.mock.calls[0][0]).toEqual(mockWaitEvent);
        });

        describe('inputParameters', () => {
            let mockInputParameter;
            let mockWaitEvent;
            beforeEach(() => {
                mockInputParameter = {name: 'AlarmTime'};
                mockWaitEvent = {
                    inputParameters: [
                        mockInputParameter,
                    ],
                };
            });

            it('calls createInputParameter with the waitEvent inputParameters', () => {
                createWaitEvent(mockWaitEvent);
                expect(createInputParameter).toHaveBeenCalledWith(mockInputParameter);
            });

            it('creates an object containing all inputParameters', () => {
                createInputParameter.mockReturnValueOnce(mockInputParameter);
                const waitEvent = createWaitEvent(mockWaitEvent);
                expect(Object.keys(waitEvent.inputParameters)).toHaveLength(1);
                expect(waitEvent.inputParameters).toHaveProperty(mockInputParameter.name, mockInputParameter);
            });
        });
    });

    describe('createWaitMetadataObject', () => {
        let mockWait;
        beforeEach(() => {
            mockWait = {
                waitEventReferences: [{}],
            };
        });

        it('calls createInputParameterMetadataObject when creating wait metadata object', () => {
            const mockInputParameter = {name: 'AlarmTime'};
            const mockWaitEvent = {
                inputParameters: {
                    AlarmTime: mockInputParameter,
                },
            };
            getElementByGuid.mockReturnValueOnce(mockWaitEvent);
            createWaitMetadataObject(mockWait);
            expect(createInputParameterMetadataObject).toHaveBeenCalledWith(mockInputParameter);
        });
    });
});