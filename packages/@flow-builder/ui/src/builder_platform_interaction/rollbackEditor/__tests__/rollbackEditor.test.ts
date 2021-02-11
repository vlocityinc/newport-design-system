import { createElement } from 'lwc';
import RollbackEditor from '../rollbackEditor';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { ticks, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const MOCK_GUID = '93f65bd6-d0ab-4e75-91b1-a8599dee54dx';

const newRollback = {
    config: { isSelected: false, isHighlighted: false, isSelectable: true },
    connectorCount: 0,
    description: '',
    elementType: 'ROLLBACK',
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: '', error: null },
    locationX: 384,
    locationY: 134,
    name: { value: '', error: null }
};

const testRollback = {
    config: { isSelected: false, isHighlighted: false, isSelectable: true },
    connectorCount: 0,
    description: '',
    elementType: 'ROLLBACK',
    guid: MOCK_GUID,
    isCanvasElement: true,
    label: { value: 'Rollback node', error: null },
    locationX: 384,
    locationY: 134,
    name: { value: 'Rollback_node', error: null }
};

const createComponentForTest = (rollbackNode) => {
    const element = createElement('builder_platform_interaction-collection-processor-editor', {
        is: RollbackEditor
    });
    element.node = rollbackNode;
    setDocumentBodyChildren(element);
    return element;
};

const getLabelDescription = (rollbackEditor) => {
    return rollbackEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION);
};

describe('rollback-editor', () => {
    describe('Validation', () => {
        it('returns no error', () => {
            const rollbackditor = createComponentForTest(testRollback);
            const errors = rollbackditor.validate();
            expect(errors).toHaveLength(0);
        });

        it('returns error when no label, no name', () => {
            const rollbackditor = createComponentForTest(newRollback);
            const errors = rollbackditor.validate();
            expect(errors).toHaveLength(2);
            expect(errors).toEqual([
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'label' },
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'name' }
            ]);
        });
    });

    describe('new element', () => {
        let rollbackEditor;
        beforeEach(() => {
            rollbackEditor = createComponentForTest(newRollback);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(rollbackEditor);
            expect(labelDescription.label.value).toEqual('');
            expect(labelDescription.devName.value).toEqual('');
            expect(labelDescription.description.value).toEqual('');
        });
    });

    describe('edit element', () => {
        let rollbackEditor;
        beforeEach(() => {
            rollbackEditor = createComponentForTest(testRollback);
        });
        it('contains label description with values', () => {
            const labelDescription = getLabelDescription(rollbackEditor);
            expect(labelDescription.label.value).toEqual('Rollback node');
            expect(labelDescription.devName.value).toEqual('Rollback_node');
        });
    });

    describe('handle events', () => {
        let rollbackEditor;
        beforeEach(() => {
            rollbackEditor = createComponentForTest(testRollback);
        });
        it('property changed event dispatches an UpdateNodeEvent', async () => {
            const labelDescription = getLabelDescription(rollbackEditor);
            const updateNodeCallback = jest.fn();
            rollbackEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);
            await ticks(1);
            const event = new PropertyChangedEvent('description', 'new desc', null);
            labelDescription.dispatchEvent(event);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: rollbackEditor.getNode() }
                })
            );
        });
    });
});
