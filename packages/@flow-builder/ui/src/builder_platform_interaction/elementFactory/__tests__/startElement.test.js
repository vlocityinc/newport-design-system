import {
    createStartElement,
    createStartElementWithConnectors,
    createStartElementMetadataObject,
    START_ELEMENT_LOCATION
} from '../startElement';
import { baseCanvasElementMetadataObject } from '../base/baseMetadata';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';

const startElementReference = 'assignment1';

const baseRecordElement = require.requireActual('../base/baseRecordElement.js');
baseRecordElement.createRecordFilters = jest.fn().mockImplementation = () => {
    return [{ leftHandSide: 'foo' }];
};

baseRecordElement.createFilterMetadataObject = jest.fn().mockImplementation = () => {
    return { leftHandSide: 'foo' };
};

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation(element => {
    return Object.assign({}, element);
});

describe('Start element', () => {
    describe('createStartElement function', () => {
        it('with empty base start element object', () => {
            const expectedResult = {
                description: '',
                locationX: START_ELEMENT_LOCATION.x,
                locationY: START_ELEMENT_LOCATION.y,
                filterType: RECORD_FILTER_CRITERIA.ALL,
                filters: [{ leftHandSide: 'foo' }],
                isCanvasElement: true,
                connectorCount: 0,
                config: {
                    isSelected: false,
                    isHighlighted: false
                },
                elementType: 'START_ELEMENT',
                maxConnections: 1
            };
            const actualResult = createStartElement();
            expect(actualResult).toMatchObject(expectedResult);
        });

        it('with non-empty start element object', () => {
            const startElement = {
                locationX: 10,
                locationY: 20,
                filterType: RECORD_FILTER_CRITERIA.NONE,
                filters: [],
                object: 'Account',
                triggerType: 'scheduled',
                frequency: 'hourly',
                startDate: '1/1/2001',
                startTime: '18:00:00'
            };
            const expectedResult = {
                description: '',
                locationX: 10,
                locationY: 20,
                filterType: RECORD_FILTER_CRITERIA.NONE,
                filters: [],
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

        it('with no filter type specified on the start element object', () => {
            const startElement = {
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
            const expectedResult = {
                description: '',
                locationX: 10,
                locationY: 20,
                filterType: RECORD_FILTER_CRITERIA.NONE,
                filters: [],
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
            const { connectors } = createStartElementWithConnectors(
                {},
                startElementReference
            );
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

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(
                startElement,
                {}
            );
        });

        it('creates start element metadata object', () => {
            const startElement = {
                filterType: RECORD_FILTER_CRITERIA.ALL,
                filters: [],
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
                filters: [],
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

        it('creates start element metadata object with filters', () => {
            const startElement = {
                filterType: RECORD_FILTER_CRITERIA.ALL,
                filters: [{ leftHandSide: 'foo' }],
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
                filters: [{ leftHandSide: 'foo' }],
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
                filterType: RECORD_FILTER_CRITERIA.ALL,
                filters: [{ leftHandSide: 'foo' }],
                object: 'Account',
                triggerType: 'invoked'
            };

            const expectedResult = {
                name: undefined,
                description: undefined,
                label: undefined,
                filters: [{ leftHandSide: 'foo' }],
                object: 'Account',
                triggerType: 'invoked',
                schedule: undefined
            };
            const actualResult = createStartElementMetadataObject(startElement);

            expect(actualResult).toMatchObject(expectedResult);
        });
    });
});
