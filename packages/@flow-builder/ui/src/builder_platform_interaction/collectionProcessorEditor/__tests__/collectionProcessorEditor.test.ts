import { createElement } from 'lwc';
import CollectionProcessorEditor from '../collectionProcessorEditor';
import {
    UpdateCollectionProcessorEvent,
    UpdateNodeEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { ticks, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const MOCK_GUID = '93f65bd6-d0ab-4e75-91b1-a8599dee54ed';

const newCollectionProcessor = {
    collectionProcessorType: 'SortCollectionProcessor',
    collectionReference: undefined,
    config: { isSelected: false, isHighlighted: false, isSelectable: true },
    connectorCount: 0,
    description: '',
    elementSubtype: 'SortCollectionProcessor',
    elementType: { value: 'CollectionProcessor', error: null },
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: '', error: null },
    limit: undefined,
    locationX: 384,
    locationY: 134,
    name: { value: '', error: null }
};

const testSortCollectionProcessor = {
    collectionProcessorType: 'SortCollectionProcessor',
    collectionReference: { value: 'accountSObjectCollectionVariable', error: null },
    limit: { value: null, error: null },
    sortOptions: [
        {
            sortField: { value: 'Id', error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        },
        {
            sortField: { value: 'Name', error: null },
            sortOrder: { value: 'Desc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r2'
        }
    ],
    config: { isSelected: false, isHighlighted: false, isSelectable: true },
    connectorCount: 0,
    description: '',
    elementSubtype: 'SortCollectionProcessor',
    elementType: 'CollectionProcessor',
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: 'Sort Account SObject Collection', error: null },
    locationX: 384,
    locationY: 134,
    name: { value: 'Sort_Account_SObject_Collection', error: null }
};

const updateSortCollection = {
    collectionReference: { value: 'anotherVar', error: null },
    limit: { value: '100', error: null },
    sortOptions: [
        {
            sortField: { value: 'newField', error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        }
    ]
};

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        elementTypeToConfigMap: {
            SortCollectionProcessor: {
                configComponent: 'sortEditor'
            }
        }
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    }
    function getStore() {
        return {
            getCurrentState
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

const createComponentForTest = (collectionProcessorNode) => {
    const element = createElement('builder_platform_interaction-collection-processor-editor', {
        is: CollectionProcessorEditor
    });
    element.node = collectionProcessorNode;
    setDocumentBodyChildren(element);
    return element;
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description',
    customEditor: 'builder_platform_interaction-custom-property-editor'
};

const getLabelDescription = (collectionProcessorEditor) => {
    return collectionProcessorEditor.shadowRoot.querySelector(selectors.labelDescription);
};

const getCustomEditor = (collectionProcessorEditor) => {
    return collectionProcessorEditor.shadowRoot.querySelector(selectors.customEditor);
};

describe('collection-processor-editor', () => {
    describe('new element', () => {
        let collectionProcessorEditor;
        beforeEach(() => {
            collectionProcessorEditor = createComponentForTest(newCollectionProcessor);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(collectionProcessorEditor);
            expect(labelDescription.label.value).toEqual('');
            expect(labelDescription.devName.value).toEqual('');
            expect(labelDescription.description.value).toEqual('');
        });
        it('contains sort editor', () => {
            const cpe = getCustomEditor(collectionProcessorEditor);
            expect(cpe).not.toBeNull();
        });
    });
    describe('edit element', () => {
        let collectionProcessorEditor;
        beforeEach(() => {
            collectionProcessorEditor = createComponentForTest(testSortCollectionProcessor);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(collectionProcessorEditor);
            expect(labelDescription.label.value).toEqual('Sort Account SObject Collection');
            expect(labelDescription.devName.value).toEqual('Sort_Account_SObject_Collection');
        });
        it('contains cpe with values', () => {
            const cpe = getCustomEditor(collectionProcessorEditor);
            expect(cpe).not.toBeNull();
        });
    });
    describe('handle events', () => {
        let collectionProcessorEditor;
        beforeEach(() => {
            collectionProcessorEditor = createComponentForTest(testSortCollectionProcessor);
        });
        it('property changed event dispatches an UpdateNodeEvent', async () => {
            const labelDescription = getLabelDescription(collectionProcessorEditor);
            const updateNodeCallback = jest.fn();
            collectionProcessorEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);
            await ticks(1);
            const event = new PropertyChangedEvent('description', 'new desc', null);
            labelDescription.dispatchEvent(event);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: collectionProcessorEditor.getNode() }
                })
            );
        });
        it('collection processor changed event dispatches an UpdateNodeEvent', async () => {
            const handler = jest.fn();
            collectionProcessorEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, handler);
            const cpe = getCustomEditor(collectionProcessorEditor);
            cpe.dispatchEvent(new UpdateCollectionProcessorEvent(updateSortCollection));
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
            const node = handler.mock.calls[0][0].detail.node;
            expect(node.collectionReference).toEqual(updateSortCollection.collectionReference);
            expect(node.sortOptions).toEqual(updateSortCollection.sortOptions);
            expect(node.limit).toEqual(updateSortCollection.limit);
        });
    });
    describe('Validation', () => {
        it('returns no error', () => {
            const collectionProcessorEditor = createComponentForTest(testSortCollectionProcessor);
            const errors = collectionProcessorEditor.validate();
            expect(errors).toHaveLength(0);
        });

        it('returns error when no label, no name', async () => {
            const collectionProcessorEditor = createComponentForTest(newCollectionProcessor);
            const errors = collectionProcessorEditor.validate();
            expect(errors).toHaveLength(2);
            expect(errors).toEqual([
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'label' },
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'name' }
            ]);
        });
    });
});
