import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    selectEvent,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import CalloutEditor from 'builder_platform_interaction/calloutEditor';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { createElement } from 'lwc';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import {
    getBaseCalloutElement,
    getInputParameterItems,
    verifyOptionalInputParameterNoValue
} from '../baseCalloutEditorTestUtils';
import { resetState, setupStateForProcessType, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';

jest.mock('builder_platform_interaction/editor', () => {
    return Object.assign({}, { launchSubflow: jest.fn() });
});

const createComponentForTest = (node, processType, mode) => {
    const el = createElement('builder_platform_interaction-callout-editor', {
        is: CalloutEditor
    });
    Object.assign(el, { node, processType, mode });
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getActionSelectorElement = (actionEditor) => {
    return actionEditor.shadowRoot.querySelector(SELECTORS.ACTION_SELECTOR);
};

const getActionSelectorComboboxElement = (actionSelector) => {
    return deepQuerySelector(actionSelector, [SELECTORS.COMBOBOX, SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
};

const getSubflowEditorElement = (calloutEditor) => {
    return deepQuerySelector(calloutEditor, [SELECTORS.CALLOUT_EDITOR_CONTAINER, SELECTORS.SUBFLOW_EDITOR]);
};

describe('Subflow Editor (new subflow)', () => {
    let propertyEditor;
    let store;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
        translateFlowToUIAndDispatch(flowWithAllElements, store);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        const element = {
            locationX: 100,
            locationY: 100,
            elementType: ELEMENT_TYPE.SUBFLOW,
            isNew: true
        };
        const processType = FLOW_PROCESS_TYPE.FLOW;
        const subflowNode = getElementForPropertyEditor(element);
        propertyEditor = createComponentForTest(subflowNode, processType, AddElementEvent.EVENT_NAME);
        await ticks(50);
    });
    it('shows subflows in the action selector combobox', () => {
        const actionSelectorElement = getActionSelectorElement(propertyEditor);
        const actionComboboxElement = getActionSelectorComboboxElement(actionSelectorElement);
        expect(actionComboboxElement.items.map((item) => item.text)).toEqual(expect.arrayContaining(['my subflow']));
    });
    describe('When a subflow is selected', () => {
        let subflowElement;
        beforeEach(async () => {
            const actionSelectorElement = getActionSelectorElement(propertyEditor);
            const actionComboboxElement = getActionSelectorComboboxElement(actionSelectorElement);
            actionComboboxElement.dispatchEvent(selectEvent('mynamespace__subflow'));
            await ticks(1);
            subflowElement = getSubflowEditorElement(propertyEditor);
        });
        it('let the user enter label, api name and description', () => {
            const baseCalloutElement = getBaseCalloutElement(subflowElement);
            const labelDescription = new LabelDescriptionComponentTest(getLabelDescriptionElement(baseCalloutElement));
            expect(labelDescription.getLabelElement()).not.toBeNull();
            expect(labelDescription.getNameElement()).not.toBeNull();
        });
        it('displays parameters for the subflow if any', () => {
            const inputAssignments = getInputParameterItems(subflowElement);
            verifyOptionalInputParameterNoValue(inputAssignments[0], 'inputAccountColVar');
        });
    });
});
