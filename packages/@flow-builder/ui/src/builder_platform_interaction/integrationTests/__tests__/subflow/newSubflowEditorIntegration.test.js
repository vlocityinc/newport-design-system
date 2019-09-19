import { createElement } from 'lwc';
import CalloutEditor from 'builder_platform_interaction/calloutEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    ticks,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    resetState,
    selectEvent,
    getLabelDescriptionLabelElement,
    getLabelDescriptionNameElement
} from '../../integrationTestUtils';
import {
    auraFetch,
    getSubflows,
    getFlowInputOutputVariables
} from '../../serverDataTestUtils';
import {
    ELEMENT_TYPE,
    FLOW_PROCESS_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { reducer } from 'builder_platform_interaction/reducers';
import { Store } from 'builder_platform_interaction/storeLib';
import { mockSubflows, mockSubflowAllTypesVariables } from 'mock/calloutData';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import {
    getBaseCalloutElement,
    verifyOptionalInputParameterNoValue,
    getInputParameterItems
} from '../../baseCalloutEditorTestUtils';

const createComponentForTest = (node, processType) => {
    const el = createElement('builder_platform_interaction-callout-editor', {
        is: CalloutEditor
    });
    Object.assign(el, { node, processType });
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector'
};

const getActionSelectorElement = actionEditor => {
    return actionEditor.shadowRoot.querySelector(SELECTORS.ACTION_SELECTOR);
};

const getActionSelectorComboboxElement = actionSelector => {
    return deepQuerySelector(actionSelector, [
        SELECTORS.COMBOBOX,
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

const getSubflowEditorElement = calloutEditor => {
    return deepQuerySelector(calloutEditor, [
        SELECTORS.CALLOUT_EDITOR_CONTAINER,
        SELECTORS.SUBFLOW_EDITOR
    ]);
};

describe('Subflow Editor (new subflow)', () => {
    let propertyEditor;
    beforeAll(() => {
        Store.getStore(reducer);
        setAuraFetch(
            auraFetch({
                'c.getSubflows': getSubflows({
                    [FLOW_PROCESS_TYPE.FLOW]: mockSubflows
                }),
                'c.getFlowInputOutputVariables': getFlowInputOutputVariables({
                    mynamespace__subflow: mockSubflowAllTypesVariables
                })
            })
        );
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        const element = {
            locationX: 100,
            locationY: 100,
            elementType: ELEMENT_TYPE.SUBFLOW,
            isNewElement: true
        };
        const processType = FLOW_PROCESS_TYPE.FLOW;
        const subflowNode = getElementForPropertyEditor(element);
        propertyEditor = createComponentForTest(subflowNode, processType);
        await ticks(50);
    });
    it('shows subflows in the action selector combobox', () => {
        const actionSelectorElement = getActionSelectorElement(propertyEditor);
        const actionComboboxElement = getActionSelectorComboboxElement(
            actionSelectorElement
        );
        expect(actionComboboxElement.items.map(item => item.text)).toEqual(
            expect.arrayContaining(['my subflow'])
        );
    });
    describe('When a subflow is selected', () => {
        let subflowElement;
        beforeEach(async () => {
            const actionSelectorElement = getActionSelectorElement(
                propertyEditor
            );
            const actionComboboxElement = getActionSelectorComboboxElement(
                actionSelectorElement
            );
            actionComboboxElement.dispatchEvent(
                selectEvent('mynamespace__subflow')
            );
            await ticks(50);
            subflowElement = getSubflowEditorElement(propertyEditor);
        });
        it('let the user enter label, api name and description', () => {
            const baseCalloutElement = getBaseCalloutElement(subflowElement);
            const labelInput = getLabelDescriptionLabelElement(
                baseCalloutElement
            );
            expect(labelInput).toBeDefined();
            const devNameInput = getLabelDescriptionNameElement(
                baseCalloutElement
            );
            expect(devNameInput).toBeDefined();
        });
        it('displays parameters for the subflow if any', () => {
            const inputAssignments = getInputParameterItems(subflowElement);
            verifyOptionalInputParameterNoValue(
                inputAssignments[0],
                'inputAccountColVar'
            );
        });
    });
});
