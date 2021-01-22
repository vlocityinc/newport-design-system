import { createElement } from 'lwc';
import ScreenEditor from 'builder_platform_interaction/screenEditor';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

export const SCREEN_FIELD_TITLES = {
    SECTION: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
    TEXT: 'FlowBuilderScreenEditor.fieldTypeLabelTextField',
    NUMBER: 'FlowBuilderScreenEditor.fieldTypeLabelNumber',
    PICKLIST: 'FlowBuilderScreenEditor.fieldTypeLabelPicklist',
    EMAIL: 'Email'
};

export const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

export const getCanvasElement = (screenEditor) => {
    return deepQuerySelector(screenEditor, [SELECTORS.SCREEN_EDITOR_CANVAS, SELECTORS.SCREEN_CANVAS]);
};

const getScreenEditorHighlight = (screenEditor, elementTitle) => {
    const screenEditorCanvas = getCanvasElement(screenEditor);
    const screenEditorHighlights = screenEditorCanvas.shadowRoot.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
    return findByTitle(Object.values(screenEditorHighlights), elementTitle);
};

export const getScreenField = (screenEditor, elementTitle) => {
    return getScreenEditorHighlight(screenEditor, elementTitle).querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SCREEN_FIELD
    );
};

export const getCanvasScreenFieldElement = (screenEditor, elementTitle) => {
    return getScreenEditorHighlight(screenEditor, elementTitle).shadowRoot.querySelector('div');
};

export const getScreenPropertiesEditorContainerElement = (screenEditor) => {
    return screenEditor.shadowRoot.querySelector(SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER);
};

export const getExtensionPropertiesEditorElement = (screenEditor) => {
    return getScreenPropertiesEditorContainerElement(screenEditor).shadowRoot.querySelector(
        SELECTORS.SCREEN_EXTENSION_PROPERTIES_EDITOR
    );
};

export const getTabsetForPalette = (screenEditor) => {
    return screenEditor.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TABSET);
};

export const getComponentsPaletteInFirstTab = (screenEditor) => {
    const tabset = getTabsetForPalette(screenEditor);
    const componentsTab = tabset.shadowRoot.querySelector('slot').assignedNodes()[0];
    return componentsTab.shadowRoot
        .querySelector('slot')
        .assignedNodes()[0]
        .querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_PALETTE);
};

export const getAutomaticFieldsPaletteInSecondTab = (screenEditor) => {
    const tabset = getTabsetForPalette(screenEditor);
    const automaticFieldsTab = tabset.shadowRoot.querySelector('slot').assignedNodes()[1];
    return automaticFieldsTab.shadowRoot
        .querySelector('slot')
        .assignedNodes()[0]
        .querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_AUTOMATIC_FIELDS_PALETTE);
};

export const getSectionElementInScreenEditorCanvas = (screenEditor, sectionTitle) => {
    const screenEditorHighlights = getCanvasElement(screenEditor).shadowRoot.querySelectorAll(
        SELECTORS.SCREEN_EDITOR_HIGHLIGHT
    );
    for (const element of screenEditorHighlights) {
        if (element.title === SCREEN_FIELD_TITLES.SECTION) {
            const section = element
                .querySelector(SELECTORS.SCREEN_FIELD)
                .shadowRoot.querySelector(SELECTORS.SCREEN_SECTION_FIELD);

            if (section.title === sectionTitle) {
                return section;
            }
        }
    }
    return null;
};

const findByTitle = (elements, title) => {
    return elements.find((element) => element.title === title);
};

const getScreenFieldElementInColumn = (column, elementTitle) => {
    const screenEditorHighlights = column.shadowRoot.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT);
    return findByTitle(Object.values(screenEditorHighlights), elementTitle);
};

export const getScreenEditorHighlightElementInSection = (section, elementTitle) => {
    const columns = section.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS);
    let result: any = null;
    for (const column of columns) {
        result = getScreenFieldElementInColumn(column, elementTitle);
        if (result) {
            return result;
        }
    }

    return result;
};

export const getScreenFieldInSection = (section, elementTitle) => {
    return getScreenEditorHighlightElementInSection(section, elementTitle).querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SCREEN_FIELD
    );
};
