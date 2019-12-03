import { createElement } from 'lwc';
import ScreenEditor from 'builder_platform_interaction/screenEditor';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as contactRequestFlow from 'mock/flows/contactRequestFlow.json';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState } from '../../integrationTestUtils';
import { auraFetch, allAuraActions } from '../../serverDataTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { selectGroupedComboboxItemBy } from '../../comboboxTestUtils';
import { loadDataForProcessType } from 'builder_platform_interaction/preloadLib';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const getScreenPropertiesEditorContainerElement = screenEditor => {
    return screenEditor.shadowRoot.querySelector(
        SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
    );
};

const getEditorCanvasElement = screenEditor => {
    return screenEditor.shadowRoot.querySelector(
        SELECTORS.SCREEN_EDITOR_CANVAS
    );
};

const getExtensionPropertiesEditorElement = screenEditor => {
    return getScreenPropertiesEditorContainerElement(
        screenEditor
    ).shadowRoot.querySelector(SELECTORS.SCREEN_EXTENSION_PROPERTIES_EDITOR);
};

const getCanvasScreenFieldElement = (screenEditor, elementTitle) => {
    const screenEditorCanvas = getEditorCanvasElement(screenEditor);
    const screenEditorHighlight = screenEditorCanvas.shadowRoot.querySelectorAll(
        SELECTORS.SCREEN_EDITOR_HIGHLIGHT
    );
    let elementAddress;
    screenEditorHighlight.forEach(element => {
        if (element.title === elementTitle) {
            elementAddress = element;
        }
    });
    return elementAddress.shadowRoot.querySelector('div');
};

const getGroupedCombobox = extensionPropertiesEditor => {
    return deepQuerySelector(extensionPropertiesEditor, [
        SELECTORS.SCREEN_EXTENSION_ATTRIBUTE_EDITOR,
        SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR,
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

describe('ScreenEditor', () => {
    let screenNode, store, uiFlow;
    let screenEditor;
    describe('existing flow with a screen lightning component : Address, and an account variable', () => {
        beforeAll(async () => {
            store = Store.getStore(reducer);
            setAuraFetch(auraFetch(allAuraActions));
        });
        afterAll(() => {
            resetState();
        });
        describe('Process type supports lookup traversal', () => {
            beforeEach(async () => {
                uiFlow = translateFlowToUIModel(flowWithAllElements);
                store.dispatch(updateFlow(uiFlow));
                await loadDataForProcessType(FLOW_PROCESS_TYPE.FLOW);

                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(
                    screenEditor,
                    'Address'
                );
                addressElement.click();
                await ticks(50);
            });
            it('shows up chevrons on fields', async () => {
                const groupedCombobox = getGroupedCombobox(
                    getExtensionPropertiesEditorElement(screenEditor)
                );
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    [
                        '{!accountSObjectVariable}',
                        '{!accountSObjectVariable.CreatedBy}'
                    ],
                    { blur: false }
                );

                expect(accountCreatedByItem.rightIconName).toBe(
                    'utility:chevronright'
                );
            });
        });
        describe('Process type does not support lookup traversal', () => {
            beforeEach(async () => {
                uiFlow = translateFlowToUIModel(contactRequestFlow);
                store.dispatch(updateFlow(uiFlow));
                await loadDataForProcessType(
                    FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW
                );

                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    processType: FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW,
                    node: screenNode
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(
                    screenEditor,
                    'Address'
                );
                addressElement.click();
                await ticks(50);
            });
            it('does not show up chevrons on fields', async () => {
                const groupedCombobox = getGroupedCombobox(
                    getExtensionPropertiesEditorElement(screenEditor)
                );
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    ['{!vMyTestAccount}', '{!vMyTestAccount.CreatedBy}'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                    groupedCombobox,
                    'displayText',
                    ['{!vMyTestAccount}', '{!vMyTestAccount.CreatedById}'],
                    { blur: false }
                );

                expect(accountCreatedByIdItem).toBeDefined();
                expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
            });
        });
    });
});
