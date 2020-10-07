import { createElement } from 'lwc';
import CollectionProcessorEditor from '../collectionProcessorEditor';

const MOCK_GUID = '93f65bd6-d0ab-4e75-91b1-a8599dee54ed';

const storedCollectionProcessor = {
    collectionProcessorType: undefined,
    collectionReference: undefined,
    config: { isSelected: false, isHighlighted: false, isSelectable: true },
    connectorCount: 0,
    description: '',
    elementSubtype: 'SortCollectionProcessor',
    elementType: { value: 'CollectionProcessor', error: null },
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: '',
    limit: undefined,
    locationX: 384,
    locationY: 134,
    name: { value: '', error: null }
};

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        elementTypeToConfigMap: {
            SortCollectionProcessor: {
                flowBuilderConfigComponent: 'sortEditor'
            }
        }
    };
});
const createComponentForTest = (collectionProcessorNode) => {
    const element = createElement('builder_platform_interaction-collection-processor-editor', {
        is: CollectionProcessorEditor
    });
    element.node = collectionProcessorNode;
    document.body.appendChild(element);
    return element;
};

const selectors = {
    labelDescription: 'builder_platform_interaction-label-description'
};

const getLabelDescription = (collectionProcessorEditor) => {
    return collectionProcessorEditor.shadowRoot.querySelector(selectors.labelDescription);
};

describe('collection-processor-editor', () => {
    describe('new element', () => {
        let collectionProcessorEditor;
        beforeEach(() => {
            collectionProcessorEditor = createComponentForTest(storedCollectionProcessor);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(collectionProcessorEditor);
            expect(labelDescription.label.value).toEqual('');
            expect(labelDescription.devName.value).toEqual('');
            expect(labelDescription.description.value).toEqual('');
        });
    });
});
