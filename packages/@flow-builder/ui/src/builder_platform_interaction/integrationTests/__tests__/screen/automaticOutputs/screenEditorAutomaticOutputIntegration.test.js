import { createElement } from 'lwc';
import ScreenEditor from 'builder_platform_interaction/screenEditor';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { flowWithScreenAndLightningComponentAddress } from 'mock/flows/flowWithScreenAndLightningComponentAddress';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { clearExtensionsCache } from 'builder_platform_interaction/flowExtensionLib/';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    auraFetch
} from '../../../integrationTestUtils';
import {
    mockRuntimeAddressFlowExtensionListParams,
    mockFlowExtensions
} from 'mock/flowExtensionsData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    SCREEN_PALETTE: 'builder_platform_interaction-screen-editor-palette',
    SCREEN_EDITOR_CANVAS: 'builder_platform_interaction-screen-editor-canvas',
    SCREEN_EDITOR_HIGHLIGHT:
        'builder_platform_interaction-screen-editor-highlight',
    SCREEN_PROPERTIES_EDITOR_CONTAINER:
        'builder_platform_interaction-screen-properties-editor-container',
    SCREEN_EXTENSION_PROPERTIES_EDITOR:
        'builder_platform_interaction-screen-extension-properties-editor',
    USE_ADVANCED_OPTIONS_CHECKBOX:
        'builder_platform_interaction-use-advanced-options-checkbox'
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

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'flow';

class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/processTypeLib'
    );
    const FLOW_AUTOMATIC_OUTPUT_HANDLING =
        actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn(processType => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
    };
});

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

const getAdvancedOptionsCheckbox = screenEditor => {
    return getExtensionPropertiesEditorElement(
        screenEditor
    ).shadowRoot.querySelector(SELECTORS.USE_ADVANCED_OPTIONS_CHECKBOX);
};

const getAdvancedOptionsCheckboxLightningInput = screenEditor => {
    return getAdvancedOptionsCheckbox(screenEditor).shadowRoot.querySelector(
        SELECTORS.LIGHTNING_INPUT
    );
};

const getTitleFromExtensionPropertiesEditorElement = screenEditor => {
    return getExtensionPropertiesEditorElement(
        screenEditor
    ).shadowRoot.querySelector('h3');
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

describe('ScreenEditor', () => {
    let screenNode, store, uiFlow;
    let screenEditor;
    beforeEach(() => {
        clearExtensionsCache();
    });
    afterEach(() => {
        clearExtensionsCache();
    });
    describe('existing flow with a screen lightning component : Address and automatic value output', () => {
        beforeAll(() => {
            setAuraFetch(
                auraFetch({
                    'c.getFlowExtensionListParams': () => ({
                        data: mockRuntimeAddressFlowExtensionListParams
                    }),
                    'c.getFlowExtensions': () => ({
                        data: mockFlowExtensions
                    })
                })
            );
            store = Store.getStore(reducer);
            uiFlow = translateFlowToUIModel(
                flowWithScreenAndLightningComponentAddress
            );
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        describe('Test component values', () => {
            beforeEach(async () => {
                const element = getElementByDevName('ScreenFlowAskAdress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(
                    screenEditor,
                    'Address'
                );
                addressElement.click();
                await ticks(50);
            });
            it('Advanced Option checkbox should be unchecked', async () => {
                expect(getAdvancedOptionsCheckbox(screenEditor)).toBeDefined();
                expect(
                    getAdvancedOptionsCheckboxLightningInput(screenEditor)
                        .checked
                ).toBe(false);
            });
            it('Output value should not be visible', async () => {
                expect(
                    getTitleFromExtensionPropertiesEditorElement(screenEditor)
                ).toBeNull();
            });
        });
        describe('modify from automatic to advanced', () => {
            beforeEach(async () => {
                const element = getElementByDevName('ScreenFlowAskAdress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(
                    screenEditor,
                    'Address'
                );
                addressElement.click();
                await ticks(50);
            });
            it('should display the outputs', async () => {
                const advancedOptionCheckbox = getAdvancedOptionsCheckboxLightningInput(
                    screenEditor
                );
                advancedOptionCheckbox.dispatchEvent(
                    new ToggleOnChangeEvent(true)
                );
                await ticks(50);
                expect(
                    getAdvancedOptionsCheckboxLightningInput(screenEditor)
                        .checked
                ).toBe(true);
                expect(
                    getTitleFromExtensionPropertiesEditorElement(screenEditor)
                        .textContent
                ).toBe('FlowBuilderScreenEditor.extensionOutputsHeader');
            });
        });
    });
});
