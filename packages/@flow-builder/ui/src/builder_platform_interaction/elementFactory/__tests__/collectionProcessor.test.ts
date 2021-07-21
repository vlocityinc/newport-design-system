import {
    createCollectionProcessor,
    createCollectionProcessorWithConnectors,
    createDuplicateCollectionProcessor,
    createCollectionProcessorMetadataObject,
    createPastedCollectionProcessor
} from '../collectionProcessor';
import { COLLECTION_PROCESSOR_SUB_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';

const defaultCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    description: '',
    name: '',
    guid: 'testGUID',
    label: '',
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
    description: 'testElementDesc',
    name: 'collectionProcessor1',
    guid: 'testGUID',
    label: 'collectionProcessor1label',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    sortOptions: [{ sortField: 'sortField', sortOrder: 'Asc', doesPutEmptyStringAndNullFirst: false }],
    limit: null,
    collectionReference: 'collectionRef'
};

const testSortCollectionProcessorMetadataElement = {
    description: 'testElementDesc',
    name: 'collectionProcessor1',
    label: 'collectionProcessor1label',
    locationX: 10,
    locationY: 10,
    sortOptions: [{ sortField: 'sortField', sortOrder: 'Asc', doesPutEmptyStringAndNullFirst: false }],
    limit: null,
    collectionReference: 'collectionRef',
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.SORT
};

const testMapCollectionProcessorElement = {
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.MAP,
    description: 'testElementDesc',
    name: 'collectionProcessor1',
    guid: 'testGUID',
    label: 'collectionProcessor1label',
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
            leftHandSide: 'Recommendation.foo',
            operator: 'Equals',
            rightHandSide: 'bar',
            rightHandSideDataType: 'String',
            rowIndex: 'testGUID'
        }
    ],
    collectionReference: 'collectionRef',
    assignNextValueToReference: 'vVariable',
    outputSObjectType: 'Recommendation'
};

const testMapCollectionProcessorMetadataElement = {
    description: 'testElementDesc',
    name: 'collectionProcessor1',
    label: 'collectionProcessor1label',
    locationX: 10,
    locationY: 10,
    mapItems: [
        {
            assignToFieldReference: 'foo',
            operator: 'Equals',
            value: {
                stringValue: 'bar'
            }
        }
    ],
    collectionReference: 'collectionRef',
    collectionProcessorType: COLLECTION_PROCESSOR_SUB_TYPE.MAP,
    assignNextValueToReference: 'vVariable',
    outputSObjectType: 'Recommendation'
};

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

describe('CollectionProcessor Element Factory', () => {
    describe('createCollectionProcessor Function', () => {
        it('returns a new Collection Processor element object with default values when no arguments are passed', () => {
            const result = createCollectionProcessor();
            expect(result).toMatchObject(defaultCollectionProcessorElement);
        });
        it('returns a sort collectionProcessor element object', () => {
            const result = createCollectionProcessor(testSortCollectionProcessorElement);
            expect(result).toMatchObject(testSortCollectionProcessorElement);
        });
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

describe('create pasted collection processor', () => {
    const dataForPasting = {
        canvasElementToPaste: {
            guid: 'originalGuid',
            name: 'originalName',
            label: 'label',
            elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
            locationX: 100,
            locationY: 100,
            config: {
                isSelected: true,
                isHighlighted: false
            },
            connectorCount: 0,
            maxConnections: 1
        },
        newGuid: 'updatedSubflowGuid',
        newName: 'updatedSubflowName',
        canvasElementGuidMap: {},
        topCutOrCopiedGuid: '',
        bottomCutOrCopiedGuid: '',
        prev: {},
        next: {},
        parent: {},
        childIndex: 1
    };

    const { pastedCanvasElement } = createPastedCollectionProcessor(dataForPasting);

    it('has the new guid', () => {
        expect(pastedCanvasElement.guid).toEqual('updatedSubflowGuid');
    });
    it('has the new name', () => {
        expect(pastedCanvasElement.name).toEqual('updatedSubflowName');
    });
    it('has the updated locationX', () => {
        expect(pastedCanvasElement.locationX).toEqual(
            dataForPasting.canvasElementToPaste.locationX + DUPLICATE_ELEMENT_XY_OFFSET
        );
    });
    it('has the updated locationY', () => {
        expect(pastedCanvasElement.locationY).toEqual(
            dataForPasting.canvasElementToPaste.locationY + DUPLICATE_ELEMENT_XY_OFFSET
        );
    });
    it('has isSelected set to true', () => {
        expect(pastedCanvasElement.config.isSelected).toBeFalsy();
    });
    it('has isHighlighted set to false', () => {
        expect(pastedCanvasElement.config.isHighlighted).toBeFalsy();
    });
    it('has connectorCount set to 0', () => {
        expect(pastedCanvasElement.connectorCount).toEqual(0);
    });
    it('has maxConnections set to 1', () => {
        expect(pastedCanvasElement.maxConnections).toEqual(1);
    });
    it('has the right elementType', () => {
        expect(pastedCanvasElement.elementType).toEqual(ELEMENT_TYPE.COLLECTION_PROCESSOR);
    });
});
