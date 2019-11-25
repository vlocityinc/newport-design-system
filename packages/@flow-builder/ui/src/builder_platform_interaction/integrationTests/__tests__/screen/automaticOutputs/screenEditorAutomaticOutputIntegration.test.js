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
import { ToggleOnChangeEvent } from '../../integrationTestUtils';
import { auraFetch, getFlowExtensions } from '../../serverDataTestUtils';
import { flowExtensionListParams } from 'serverData/GetFlowExtensionListParams/flowExtensionListParams.json';
import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { flowExtensionsForFlow as mockFlowExtensions } from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';

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

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = FLOW_PROCESS_TYPE.FLOW;

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/processTypeLib'
    );
    const FLOW_AUTOMATIC_OUTPUT_HANDLING =
        actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        isLookupTraversalSupported: jest.fn(() => {
            return true;
        }),
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn(processType => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
    };
});

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

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
                    'c.getFlowExtensionListParams': params => ({
                        data: params.names.reduce((obj, name) => {
                            obj[name] = flowExtensionListParams[name];
                            return obj;
                        }, {})
                    }),
                    'c.getFlowExtensions': getFlowExtensions({
                        [FLOW_PROCESS_TYPE.FLOW]: mockFlowExtensions
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
                    processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE,
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
                advancedOptionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
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