// @ts-nocheck
import {
    createStartElement,
    createStartElementWithConnectors,
    createStartElementMetadataObject,
    START_ELEMENT_LOCATION
} from '../startElement';
import { baseCanvasElementMetadataObject } from '../base/baseMetadata';
import { CONDITION_LOGIC, FLOW_TRIGGER_SAVE_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

const startElementReference = 'assignment1';

const MOCK_GUID = 'mockGuid';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/storeUtils', () => ({
    getProcessType: jest.fn(),
    shouldUseAutoLayoutCanvas: jest.fn()
}));

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation(element => {
    return Object.assign({}, element);
});

describe('Start element', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
    describe('createStartElement function', () => {
        let startElement = {
            locationX: START_ELEMENT_LOCATION.x,
            locationY: START_ELEMENT_LOCATION.y,
            objectContainer: 'MarketAudience',
            triggerType: 'None'
        };
        let expectedResult = {
            description: '',
            locationX: START_ELEMENT_LOCATION.x,
            locationY: START_ELEMENT_LOCATION.y,
            filters: [
                {
                    leftHandSide: '',
                    operator: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    rowIndex: MOCK_GUID
                }
            ],
            filterLogic: CONDITION_LOGIC.AND,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None'
        };
        it('with empty base start element object', () => {
            const actualResult = createStartElement();
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('with empty base start element object and triggerType = RecordBeforeSave', () => {
            startElement.triggerType = 'RecordBeforeSave';
            expectedResult.triggerType = 'RecordBeforeSave';
            const actualResult = createStartElement(startElement);
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('with empty base start element object and triggerType = RecordAfterSave', () => {
            startElement.triggerType = 'RecordAfterSave';
            expectedResult.triggerType = 'RecordAfterSave';
            const actualResult = createStartElement(startElement);
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('with empty base start element object and triggerType = Scheduled', () => {
            startElement.triggerType = 'Scheduled';
            expectedResult.triggerType = 'Scheduled';
            const actualResult = createStartElement(startElement);
            expect(actualResult).toMatchObject(expectedResult);
        });

        it('with non-empty start element object', () => {
            startElement = {
                locationX: 10,
                locationY: 20,
                filterLogic: CONDITION_LOGIC.AND,
                filters: [
                    {
                        field: 'Name',
                        operator: 'EqualTo',
                        value: {
                            stringValue: 'myAccount'
                        }
                    }
                ],
                object: 'Account',
                objectContainer: 'MarketAudience',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00'
            };
            expectedResult = {
                description: '',
                locationX: 10,
                locationY: 20,
                filterLogic: 'and',
                filters: [
                    {
                        leftHandSide: 'Account.Name',
                        operator: 'EqualTo',
                        rightHandSide: 'myAccount',
                        rightHandSideDataType: 'String',
                        rowIndex: MOCK_GUID
                    }
                ],
                object: 'Account',
                objectContainer: 'MarketAudience',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00',
                isCanvasElement: true,
                connectorCount: 0,
                config: {
                    isSelected: false,
                    isHighlighted: false
                },
                elementType: 'START_ELEMENT',
                maxConnections: 1
            };
            const actualResult = createStartElement(startElement);
            expect(actualResult).toMatchObject(expectedResult);
        });

        it('with no filter type specified on the start element object', () => {
            startElement = {
                locationX: 10,
                locationY: 20,
                filters: [],
                object: 'Account',
                triggerType: 'scheduled',
                schedule: {
                    frequency: 'hourly',
                    startDate: '1/1/2001',
                    startTime: '18:00:00'
                }
            };
            expectedResult = {
                description: '',
                locationX: 10,
                locationY: 20,
                filterLogic: 'no_conditions',
                filters: [
                    {
                        leftHandSide: '',
                        operator: '',
                        rightHandSide: '',
                        rightHandSideDataType: '',
                        rowIndex: MOCK_GUID
                    }
                ],
                object: 'Account',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00',
                isCanvasElement: true,
                connectorCount: 0,
                config: {
                    isSelected: false,
                    isHighlighted: false
                },
                elementType: 'START_ELEMENT',
                maxConnections: 1
            };
            const actualResult = createStartElement(startElement);
            expect(actualResult).toMatchObject(expectedResult);
        });
    });

    describe('createStartElementWithConnector function', () => {
        it('returns new start element with connector having target as start element reference', () => {
            const { connectors } = createStartElementWithConnectors({}, startElementReference);
            const target = connectors[0].target;
            expect(target).toBe(startElementReference);
        });

        it('returns new start element with connector using connector from base start element object', () => {
            const { connectors } = createStartElementWithConnectors({
                connector: { targetReference: 'foo' }
            });
            const target = connectors[0].target;
            expect(target).toBe('foo');
        });
    });

    describe('createStartElementMetadataObject function', () => {
        it('calls baseCanvasElementMetadataObject function', () => {
            const startElement = {};
            createStartElementMetadataObject(startElement);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(startElement, {});
        });

        it('creates start element metadata object', () => {
            const startElement = {
                filterLogic: CONDITION_LOGIC.NO_CONDITIONS,
                filters: [],
                object: 'Account',
                objectContainer: 'MarketAudience',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00'
            };

            const expectedResult = {
                name: undefined,
                description: undefined,
                label: undefined,
                filters: [],
                filterLogic: undefined,
                object: 'Account',
                objectContainer: 'MarketAudience',
                triggerType: 'scheduled',
                schedule: {
                    frequency: 'hourly',
                    startDate: '1/1/2001',
                    startTime: '18:00:00'
                }
            };
            const actualResult = createStartElementMetadataObject(startElement);

            expect(actualResult).toMatchObject(expectedResult);
        });

        it('creates start element metadata object for delete', () => {
            const startElement = {
                filterLogic: CONDITION_LOGIC.NO_CONDITIONS,
                filters: [],
                object: 'Account',
                objectContainer: undefined,
                triggerType: FLOW_TRIGGER_TYPE.BEFORE_DELETE,
                frequency: undefined,
                startDate: undefined,
                startTime: undefined,
                recordTriggerType: FLOW_TRIGGER_SAVE_TYPE.DELETE
            };

            const expectedResult = {
                name: undefined,
                description: undefined,
                label: undefined,
                filters: [],
                filterLogic: undefined,
                object: 'Account',
                objectContainer: undefined,
                triggerType: FLOW_TRIGGER_TYPE.BEFORE_DELETE,
                recordTriggerType: FLOW_TRIGGER_SAVE_TYPE.DELETE,
                schedule: undefined
            };
            const actualResult = createStartElementMetadataObject(startElement);

            expect(actualResult).toMatchObject(expectedResult);
        });

        it('creates start element metadata object with filters', () => {
            const startElement = {
                filterLogic: '1 AND 2 OR 3',
                filters: [
                    {
                        leftHandSide: 'Account.Name',
                        operator: 'EqualTo',
                        rightHandSide: 'myAccount',
                        rightHandSideDataType: 'String',
                        rowIndex: MOCK_GUID
                    },
                    {
                        leftHandSide: 'Account.NumberOfEmployees',
                        operator: 'EqualTo',
                        rightHandSide: '5',
                        rightHandSideDataType: 'Number',
                        rowIndex: MOCK_GUID
                    },
                    {
                        leftHandSide: 'Account.Name',
                        operator: 'EqualTo',
                        rightHandSide: 'yourAccount',
                        rightHandSideDataType: 'String',
                        rowIndex: MOCK_GUID
                    }
                ],
                object: 'Account',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00'
            };

            const expectedResult = {
                name: undefined,
                description: undefined,
                label: undefined,
                filters: [
                    {
                        field: 'Name',
                        operator: 'EqualTo',
                        value: {
                            stringValue: 'myAccount'
                        }
                    },
                    {
                        field: 'NumberOfEmployees',
                        operator: 'EqualTo',
                        value: {
                            numberValue: '5'
                        }
                    },
                    {
                        field: 'Name',
                        operator: 'EqualTo',
                        value: {
                            stringValue: 'yourAccount'
                        }
                    }
                ],
                filterLogic: '1 AND 2 OR 3',
                object: 'Account',
                triggerType: 'scheduled',
                schedule: {
                    frequency: 'hourly',
                    startDate: '1/1/2001',
                    startTime: '18:00:00'
                }
            };
            const actualResult = createStartElementMetadataObject(startElement);

            expect(actualResult).toMatchObject(expectedResult);
        });

        it('creates start element metadata object with no schedule set', () => {
            const startElement = {
                filterLogic: 'and',
                filters: [
                    {
                        leftHandSide: 'Account.Name',
                        operator: 'EqualTo',
                        rightHandSide: 'myAccount',
                        rightHandSideDataType: 'String',
                        rowIndex: MOCK_GUID
                    }
                ],
                object: 'Account',
                triggerType: 'invoked'
            };

            const expectedResult = {
                name: undefined,
                description: undefined,
                label: undefined,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Name',
                        operator: 'EqualTo',
                        value: {
                            stringValue: 'myAccount'
                        }
                    }
                ],
                object: 'Account',
                triggerType: 'invoked',
                schedule: undefined
            };
            const actualResult = createStartElementMetadataObject(startElement);

            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('creates start element metadata object from element', () => {
            const startElement = {
                filterLogic: undefined,
                filters: [],
                object: 'Account',
                objectContainer: undefined,
                triggerType: 'RecordBeforeSave',
                recordTriggerType: 'Create',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00'
            };

            const expectedStartElement = {
                name: undefined,
                description: undefined,
                label: undefined,
                filters: [],
                filterLogic: undefined,
                object: 'Account',
                objectContainer: undefined,
                triggerType: 'RecordBeforeSave',
                recordTriggerType: 'Create',
                schedule: {
                    frequency: 'hourly',
                    startDate: '1/1/2001',
                    startTime: '18:00:00'
                }
            };

            const filters = [
                {
                    leftHandSide: 'Account.Name',
                    operator: 'EqualTo',
                    rightHandSide: 'myAccount',
                    rightHandSideDataType: 'String',
                    rowIndex: MOCK_GUID
                },
                {
                    leftHandSide: 'Account.NumberOfEmployees',
                    operator: 'EqualTo',
                    rightHandSide: '5',
                    rightHandSideDataType: 'Number',
                    rowIndex: MOCK_GUID
                },
                {
                    leftHandSide: 'Account.Name',
                    operator: 'EqualTo',
                    rightHandSide: 'yourAccount',
                    rightHandSideDataType: 'String',
                    rowIndex: MOCK_GUID
                }
            ];
            describe('With filter logic = no_conditions', () => {
                it('should have filterLogic = undefined', () => {
                    startElement.filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
                    const actualResult = createStartElementMetadataObject(startElement);

                    expect(actualResult).toMatchObject(expectedStartElement);
                });
            });
            describe('With filter logic = no_conditions and filters ', () => {
                it('should have filterLogic = undefined', () => {
                    startElement.filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
                    startElement.filters = filters;

                    const actualResult = createStartElementMetadataObject(startElement);
                    expect(actualResult).toMatchObject(expectedStartElement);
                });
            });
            describe('With filter logic = "and" and no filters ', () => {
                it('should have filterLogic = undefined', () => {
                    startElement.filterLogic = CONDITION_LOGIC.AND;
                    startElement.filters = undefined;

                    const actualResult = createStartElementMetadataObject(startElement);
                    expect(actualResult).toMatchObject(expectedStartElement);
                });
            });
        });
    });
});
