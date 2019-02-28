import { mockEventTypes, mockEventTypeAllParameters, platformEvent1ApiName, platformEvent1Label, platformEventInkLevelApiName } from 'mock/eventTypesData';
import { setEventTypes, getEventTypes, getInputParametersForEventType, getOutputParametersForEventType } from 'builder_platform_interaction/sobjectLib';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetch: jest.fn().mockImplementation((actionType, callback, params) => {
            const { eventTypeApiName } = params;
            callback({
                data: mockEventTypeAllParameters[eventTypeApiName],
            });
        }),
        SERVER_ACTION_TYPE: require.requireActual('../../serverDataLib/serverDataLib.js').SERVER_ACTION_TYPE,
    };
});

describe('Event Type Tests', () => {
    describe('Set Event Types Tests', () => {
        it('Set Null Event Types', () => {
            expect(() => {
                setEventTypes(null);
            }).toThrowError('Expected input to be an Array');
        });

        it('Set Event Types', () => {
            expect(() => {
                setEventTypes(mockEventTypes);
            }).not.toThrow();
        });
    });

    describe('Get Event Types Tests', () => {
        it('Get All Event Types', () => {
            const eventTypes = getEventTypes();
            expect(eventTypes).toHaveLength(3);
            expect(eventTypes[0].label).toEqual(platformEvent1Label);
            expect(eventTypes[0].qualifiedApiName).toEqual(platformEvent1ApiName);
        });
    });

    describe('Get Event Type Parameters Callback Tests', () => {
        it('Verify input parameters returned', () => {
            getInputParametersForEventType(platformEvent1ApiName, (parameters) => {
                expect(Object.keys(parameters)).toHaveLength(4);
            });
        });

        it('Verify output parameters returned', () => {
            getOutputParametersForEventType(platformEventInkLevelApiName, (parameters) => {
                expect(Object.keys(parameters)).toHaveLength(1);
            });
        });
    });
});