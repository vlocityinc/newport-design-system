// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditor from 'builder_platform_interaction/screenEditor';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { flowWithSectionsAndColumns } from 'mock/flows/flowWithSectionsAndColumns';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { initializeAuraFetch } from '../../serverDataTestUtils';
import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { resetState, translateFlowToUIAndDispatch } from '../../integrationTestUtils';
import { initializeLoader } from 'builder_platform_interaction/preloadLib';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
    SCREEN_FIELD: 'builder_platform_interaction-screen-field',
    SCREEN_SECTION_FIELD: 'builder_platform_interaction-screen-section-field'
};

const SCREEN_FIELD_TITLES = {
    SECTION: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
    TEXT: 'FlowBuilderScreenEditor.fieldTypeLabelTextField'
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const getScreenPropertiesEditorContainerElement = (screenEditor) => {
    return screenEditor.shadowRoot.querySelector(SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER);
};

const getExtensionPropertiesEditorElement = (screenEditor) => {
    return getScreenPropertiesEditorContainerElement(screenEditor).shadowRoot.querySelector(
        SELECTORS.SCREEN_EXTENSION_PROPERTIES_EDITOR
    );
};

const getCanvasElement = (screenEditor) => {
    return deepQuerySelector(screenEditor, [SELECTORS.SCREEN_EDITOR_CANVAS, SELECTORS.SCREEN_CANVAS]);
};

const getCanvasScreenFieldElement = (screenEditor, elementTitle) => {
    const screenEditorCanvas = getCanvasElement(screenEditor);
    const screenEditorHighlight = screenEditorCanvas.shadowRoot.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
    let elementAddress;
    screenEditorHighlight.forEach((element) => {
        if (element.title === elementTitle) {
            elementAddress = element;
        }
    });
    return elementAddress.shadowRoot.querySelector('div');
};

const getCanvasSectionElement = (screenEditor, sectionTitle) => {
    const screenEditorCanvas = getCanvasElement(screenEditor);
    let result = screenEditorCanvas;
    const screenEditorHighlights = result.shadowRoot.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
    result = null;
    for (const element of screenEditorHighlights) {
        if (element.title === SCREEN_FIELD_TITLES.SECTION) {
            const section = element
                .querySelector(SELECTORS.SCREEN_FIELD)
                .shadowRoot.querySelector(SELECTORS.SCREEN_SECTION_FIELD);

            if (section.title === sectionTitle) {
                result = section;
            }
        }
    }
    return result;
};

const getScreenFieldElementInSection = (section, elementTitle) => {
    const screenCanvas = section.shadowRoot.querySelector(SELECTORS.SCREEN_CANVAS);
    let result = screenCanvas;
    const screenEditorHighlights = result.shadowRoot.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
    result = null;
    for (const element of screenEditorHighlights) {
        if (element.title === elementTitle) {
            result = element;
        }
    }
    if (result === null) {
        return result;
    }

    return result;
};

describe('ScreenEditor', () => {
    let screenNode, store;
    let screenEditor;
    describe('Existing flow with a Screen that has address screen field and Section containing slider screen field ', () => {
        beforeAll(async () => {
            store = Store.getStore(reducer);
            initializeAuraFetch();
            initializeLoader(store);
            translateFlowToUIAndDispatch(flowWithSectionsAndColumns, store);
        });
        afterAll(() => {
            resetState();
        });
        describe('Get Screen Editor and click on address field', () => {
            beforeEach(async () => {
                /*
                    Layout of Screen1
                    - Section1
                        - Slider
                    - Address
                */
                const element = getElementByDevName('Screen1');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(screenEditor, 'Address');
                addressElement.click();
                await ticks(50);
            });
            it('Get Address Extension', async () => {
                const extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
                await ticks(1);
                expect(extensionPropertiesEditor).toBeDefined();
            });
            it('Get the Slider screen field in section in screen', async () => {
                const section = getCanvasSectionElement(screenEditor, 'Screen1_Section1');
                const slider = getScreenFieldElementInSection(section, 'Slider');
                await ticks(1);
                expect(slider).not.toBeNull();
            });
        });
        describe('Get the second screen in the flow', () => {
            beforeEach(async () => {
                /*
                    Layout of Screen2
                        - Number
                        - Section1
                            - Text - Email
                        - Address
                */
                const element = getElementByDevName('Screen2');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
                await ticks(50);
                const addressElement = getCanvasScreenFieldElement(screenEditor, 'Address');
                addressElement.click();
                await ticks(50);
            });
            it('Get the text screen field in section in Screen2', async () => {
                const section = getCanvasSectionElement(screenEditor, 'Screen2_Section1');
                const text = getScreenFieldElementInSection(section, SCREEN_FIELD_TITLES.TEXT);
                await ticks(1);
                expect(text).not.toBeNull();
            });
        });
    });
});
