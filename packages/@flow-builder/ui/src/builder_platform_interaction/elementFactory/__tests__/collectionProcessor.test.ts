import {
    createCollectionProcessor,
    createCollectionProcessorWithConnectors,
    createDuplicateCollectionProcessor,
    createCollectionProcessorMetadataObject
} from '../collectionProcessor';
import { COLLECTION_PROCESSOR_SUB_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import * as store from 'mock/storeData';
import { INCOMPLETE_ELEMENT } from 'builder_platform_interaction/elementFactory';

const mockGuid = 'mockGuid';

const defaultCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    description: '',
    name: '',
    label: '',
    guid: mockGuid,
    maxConnections: 1,
    locationX: 0,
    locationY: 0,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0
};

const testSortCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.SORT,
    description: 'create sort collection processor',
    name: 'sortCollectionProcessor',
    guid: mockGuid,
    label: 'sortCollectionProcessorLabel',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    sortOptions: [{ sortField: 'Name', sortOrder: 'Asc', doesPutEmptyStringAndNullFirst: false }],
    limit: null,
    collectionReference: store.accountSObjectCollectionVariable.guid
};

const testSortCollectionProcessorMetadataElement = {
    description: 'create sort collection processor',
    name: 'sortCollectionProcessor',
    label: 'sortCollectionProcessorLabel',
    locationX: 10,
    locationY: 10,
    sortOptions: [{ sortField: 'Name', sortOrder: 'Asc', doesPutEmptyStringAndNullFirst: false }],
    limit: null,
    collectionReference: store.accountSObjectCollectionVariable.guid,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.SORT
};

const testMapCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.MAP,
    description: 'create map collection processor',
    name: 'mapCollectionProcessor',
    guid: mockGuid,
    label: 'mapCollectionProcessorLabel',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    mapItems: [
        {
            leftHandSide: 'Contract.Description',
            operator: 'Assign',
            rightHandSide: 'This is my desc',
            rightHandSideDataType: 'String',
            rowIndex: mockGuid
        }
    ],
    collectionReference: store.accountSObjectCollectionVariable.guid,
    assignNextValueToReference: store.accountSObjectVariable.guid,
    outputSObjectType: 'Contract'
};

const testMapCollectionProcessorMetadataElement = {
    description: 'create map collection processor',
    name: 'mapCollectionProcessor',
    label: 'mapCollectionProcessorLabel',
    locationX: 10,
    locationY: 10,
    mapItems: [
        {
            assignToFieldReference: 'Description',
            operator: 'Assign',
            value: {
                stringValue: 'This is my desc'
            }
        }
    ],
    collectionReference: store.accountSObjectCollectionVariable.guid,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.MAP,
    assignNextValueToReference: store.accountSObjectVariable.guid,
    outputSObjectType: 'Contract'
};

const testFilterCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.FILTER,
    description: 'create filter collection processor',
    name: 'filterCollectionProcessor',
    guid: mockGuid,
    label: 'filterCollectionProcessorLabel',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    collectionReference: store.accountSObjectCollectionVariable.guid,
    assignNextValueToReference: store.accountSObjectVariable.guid,
    conditions: [
        {
            leftHandSide: store.accountSObjectVariable.guid + '.Name',
            operator: 'EqualsTo',
            rightHandSide: 'bar',
            rightHandSideDataType: 'String',
            rowIndex: mockGuid
        }
    ],
    conditionLogic: 'and',
    formula: null
};

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('CollectionProcessor Element Factory', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    describe('createCollectionProcessor Function', () => {
        beforeAll(() => {
            // @ts-ignore
            Store.setMockState(flowWithAllElementsUIModel);
        });
        afterAll(() => {
            // @ts-ignore
            Store.resetStore();
        });
        it('returns a new Collection Processor element object with default values when no arguments are passed', () => {
            const result = createCollectionProcessor();
            expect(result).toMatchObject(defaultCollectionProcessorElement);
        });
        describe('sort collection processor', () => {
            it('returns a sort collectionProcessor element object', () => {
                const result = createCollectionProcessor(testSortCollectionProcessorElement);
                expect(result).toMatchObject(testSortCollectionProcessorElement);
            });
        });
        describe('map collection processor', () => {
            it('returns a map collectionProcessor element object', () => {
                const result = createCollectionProcessor(testMapCollectionProcessorElement);
                expect(result).toMatchObject(testMapCollectionProcessorElement);
            });
            it('returns a map collectionProcessor element object that has isCollection, dataType and subtype properties', () => {
                const result = createCollectionProcessor(testMapCollectionProcessorElement);
                expect(result.isCollection).toBeTruthy();
                expect(result.dataType).toEqual('SObject');
                expect(result.subtype).toEqual(testMapCollectionProcessorElement.outputSObjectType);
            });
        });
        describe('filter collection processor', () => {
            it('returns a filter collectionProcessor element object', () => {
                const result = createCollectionProcessor(testFilterCollectionProcessorElement);
                expect(result).toMatchObject(testFilterCollectionProcessorElement);
            });
            it('returns a filter collectionProcessor element object that has isCollection, dataType and subtype properties', () => {
                const result = createCollectionProcessor(testFilterCollectionProcessorElement);
                expect(result.isCollection).toBeTruthy();
                expect(result.dataType).toEqual('SObject');
                expect(result.subtype).toEqual('Account');
            });
            it('returns a filter collectionProcessor element object without dataType and subtype properties', () => {
                // @ts-ignore
                const result = createCollectionProcessor(testFilterCollectionProcessorElement, { elements: {} });
                expect(result.isCollection).toBeTruthy();
                expect(result.dataType).toBeUndefined();
                expect(result.subtype).toBeUndefined();
                expect(result[INCOMPLETE_ELEMENT]).toBeTruthy();
            });
        });
    });
});

describe('createCollectionProcessortWithConnectors Function', () => {
    it('returns new collection processor element & connector using connector from base collection processor object', () => {
        const { connectors } = createCollectionProcessorWithConnectors({
            connector: { targetReference: 'foo' }
        });
        const target = connectors[0].target;
        expect(target).toBe('foo');
    });
});

describe('createDuplicateCollectionProcessor Function', () => {
    it('returns new duplicate collectionProcessor element with new name and guid', () => {
        const collectionProcessor = {
            elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
            name: 'collectionProcessor1'
        };
        const newName = 'dupeName';
        const newGuid = 'dupeGuid';
        const { duplicatedElement } = createDuplicateCollectionProcessor(collectionProcessor, newGuid, newName);
        expect(duplicatedElement).toEqual(
            expect.objectContaining(Object.assign(collectionProcessor, { name: newName, guid: newGuid }))
        );
    });
});

describe('createCollectionProcessorMetadataObject Function', () => {
    it('returns a new sort collection processor metadata object from a store collection processor object', () => {
        const result = createCollectionProcessorMetadataObject(testSortCollectionProcessorElement);
        expect(result).toMatchObject(testSortCollectionProcessorMetadataElement);
    });
    it('returns a new map collection processor metadata object from a store collection processor object', () => {
        const result = createCollectionProcessorMetadataObject(testMapCollectionProcessorElement);
        expect(result).toMatchObject(testMapCollectionProcessorMetadataElement);
    });
});
