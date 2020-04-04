import { createElement } from 'lwc';
import AssignmentEditor from '../assignmentEditor';
import {
    PropertyChangedEvent,
    AddListItemEvent,
    DeleteListItemEvent,
    UpdateListItemEvent,
    UpdateNodeEvent
} from 'builder_platform_interaction/events';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

function createComponentForTest(
    props = {
        editorParams: { panelConfig: { isLabelCollapsibleToHeader: false } }
    }
) {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    el.editorParams = props.editorParams;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    labelDescription: 'div.slds-p-horizontal_small.slds-p-top_small builder_platform_interaction-label-description'
};

const testObj = {
    assignmentItems: [
        {
            operator: { value: 'Assign', error: null },
            valueType: { value: '', error: null },
            leftHandSide: {
                value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
                error: null
            },
            rightHandSide: { value: 'xyz', error: null },
            inputDataType: { value: '', error: null },
            rowIndex: 10
        }
    ],
    description: { value: '', error: null },
    elementType: 'ASSIGNMENT',
    guid: '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
    isCanvasElemen: true,
    label: { value: 'testAssignment', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testAssignment', error: null }
};

const size1 = [
    {
        leftHandSide: {
            value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
            error: null
        },
        operator: { value: 'Assign', error: null },
        rightHandSide: { value: 'xyz', error: null },
        rowIndex: 20
    }
];

const size2 = [
    {
        leftHandSide: {
            value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
            error: null
        },
        operator: { value: 'Assign', error: null },
        rightHandSide: { value: 'xyz', error: null },
        rowIndex: 30
    },
    {
        leftHandSide: {
            value: '1bdec16ccb-1919d-1868a-1bb1b-1f2881327c187d0',
            error: null
        },
        operator: { value: 'Assign', error: null },
        rightHandSide: { value: 'xyz', error: null },
        rowIndex: 40
    }
];

describe('assignment-editor', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    it('property changed event dispatches an UpdateNodeEvent', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);

        const updateNodeCallback = jest.fn();
        assignmentElement.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new PropertyChangedEvent('description', 'new desc', null);
        assignmentElement.shadowRoot
            .querySelector('builder_platform_interaction-label-description')
            .dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: assignmentElement.node }
            })
        );
    });

    it('handles the property changed event and updates the property', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        await ticks(1);
        const event = new PropertyChangedEvent('description', 'new desc', null);
        assignmentElement.shadowRoot
            .querySelector('builder_platform_interaction-label-description')
            .dispatchEvent(event);
        expect(assignmentElement.node.description.value).toBe('new desc');
    });
    it('handles the add list item changed event and updates the assignmentItems array', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        await ticks(1);
        const event = new AddListItemEvent(1);
        assignmentElement.shadowRoot.querySelector('builder_platform_interaction-list').dispatchEvent(event);
        expect(assignmentElement.node.assignmentItems).toHaveLength(2);
    });
    it('handles the delete list item changed event and updates the assignmentItems array', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        await ticks(1);
        const event = new DeleteListItemEvent(0);
        assignmentElement.shadowRoot.querySelector('builder_platform_interaction-list').dispatchEvent(event);
        expect(assignmentElement.node.assignmentItems).toHaveLength(0);
    });
    it('handles the update list item changed event and updates the assignmentItems array', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        await ticks(1);
        const event = new UpdateListItemEvent(0, {
            leftHandSide: { value: 'val', error: 'err' }
        });
        assignmentElement.shadowRoot.querySelector('builder_platform_interaction-list').dispatchEvent(event);
        expect(assignmentElement.node.assignmentItems[0].leftHandSide.value).toBe('val');
    });
    it('shows delete when more than 1 item', async () => {
        const assignmentElement = createComponentForTest();
        const node = deepCopy(testObj);
        node.assignmentItems = deepCopy(size2);
        assignmentElement.node = node;
        await ticks(1);
        const rows = assignmentElement.shadowRoot.querySelectorAll('builder_platform_interaction-row');
        rows.forEach(row => {
            expect(row.showDelete).toBe(true);
        });
    });
    it('doesnt show delete when exactly 1 item', async () => {
        const assignmentElement = createComponentForTest();
        const node = deepCopy(testObj);
        node.assignmentItems = deepCopy(size1);
        assignmentElement.node = node;
        await ticks(1);
        const rows = assignmentElement.shadowRoot.querySelectorAll('builder_platform_interaction-row');
        rows.forEach(row => {
            expect(row.showDelete).toBe(false);
        });
    });

    it('sets lhs to be writable', async () => {
        const assignmentElement = createComponentForTest();
        assignmentElement.node = deepCopy(testObj);
        await ticks(1);
        const ferToFerov = assignmentElement.shadowRoot.querySelector(
            'builder_platform_interaction-fer-to-ferov-expression-builder'
        );
        expect(ferToFerov.lhsMustBeWritable).toEqual(true);
    });

    it('sets the default operator to Assign', async () => {
        const assignmentEditor = createComponentForTest();
        const node = deepCopy(testObj);
        node.assignmentItems = deepCopy(size1);
        assignmentEditor.node = node;
        await ticks(1);
        const ferToFerov = assignmentEditor.shadowRoot.querySelector(
            'builder_platform_interaction-fer-to-ferov-expression-builder'
        );
        expect(ferToFerov.defaultOperator).toEqual(RULE_OPERATOR.ASSIGN);
    });
    describe('styles for collapsible label description', () => {
        it('apply if isLabelCollapsibleToHeader = false', async () => {
            expect.assertions(1);
            const assignmentEditor = createComponentForTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: false }
                }
            });
            assignmentEditor.node = deepCopy(testObj);
            await ticks(1);
            const labelDescription = assignmentEditor.shadowRoot.querySelector(selectors.labelDescription);

            expect(labelDescription).not.toBeNull();
        });
        it("don't apply if isLabelCollapsibleToHeader = true", async () => {
            expect.assertions(1);
            const assignmentEditor = createComponentForTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: true }
                }
            });
            assignmentEditor.node = deepCopy(testObj);
            await ticks(1);
            const labelDescription = assignmentEditor.shadowRoot.querySelector(selectors.labelDescription);

            expect(labelDescription).toBeNull();
        });
    });
});
