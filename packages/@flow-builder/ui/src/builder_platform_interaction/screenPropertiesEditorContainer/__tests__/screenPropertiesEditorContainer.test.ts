// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    query,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { getAllScreenFieldTypes } from 'builder_platform_interaction/screenEditorUtils';
import { createElement } from 'lwc';
import ScreenPropertiesEditorContainer from '../screenPropertiesEditorContainer';

jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/screenAutomaticFieldPropertiesEditor', () =>
    require('builder_platform_interaction_mocks/screenAutomaticFieldPropertiesEditor')
);

const getScreenPropertyEditor = (screen) =>
    screen.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SCREEN_PROPERTIES_EDITOR);

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-properties-editor-container', {
        is: ScreenPropertiesEditorContainer
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

const headerSelector = '.slds-panel__header-title';
const errorIconSelector = 'lightning-button-icon[iconName="utility:error"]';
const screenSectionFieldPropertyEditor = 'builder_platform_interaction-screen-section-field-properties-editor';

describe('screen-properties-editor-container', () => {
    it('displays the screen properties header by default', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { elementType: ELEMENT_TYPE.SCREEN }
        });
        const header = screenPropertiesEditorContainerElement.shadowRoot.querySelector(headerSelector);
        expect(header.textContent).toBe('FlowBuilderScreenEditor.screenProperties');
    });
    it('displays the field properties header if field is selected', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { type: getAllScreenFieldTypes()[0] }
        });
        const header = screenPropertiesEditorContainerElement.shadowRoot.querySelector(headerSelector);
        expect(header.textContent).toBe('FlowBuilderScreenEditor.fieldTypeLabelTextField');
    });
    it('displays the automatic field properties header if automatic field is selected', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { fieldType: FlowScreenFieldType.ObjectProvided }
        });
        const header = screenPropertiesEditorContainerElement.shadowRoot.querySelector(headerSelector);
        expect(header.textContent).toBe('FlowBuilderAutomaticFieldEditor.panelTitle');
    });
    it('displays the error icon when the node has errors', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {
                type: getAllScreenFieldTypes()[0],
                value: { value: '', error: 'error' }
            }
        });
        const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
        expect(icon).toBeTruthy();
    });
    it('does not display the error icon when the node has no errors', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {
                type: getAllScreenFieldTypes()[0],
                value: { value: '', error: null }
            }
        });
        const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
        expect(icon).toBeFalsy();
    });
    it('will call focus on screenPropertiesEditorElement when focusLabelDescription is called', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { elementType: ELEMENT_TYPE.SCREEN }
        });
        const screenPropertiesEditorElement = getScreenPropertyEditor(screenPropertiesEditorContainerElement);
        screenPropertiesEditorElement.focus = jest.fn();
        screenPropertiesEditorContainerElement.focusLabelDescription();

        expect(screenPropertiesEditorElement.focus).toHaveBeenCalled();
    });
    it('Displays the screen-section-field-properties-editor if isRegionContainerField', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: Object.assign(
                {
                    type: {},
                    fields: []
                },
                getAllScreenFieldTypes().find((fieldType) => fieldType.name === 'Section')
            )
        });

        return Promise.resolve().then(() => {
            return Promise.resolve().then(() => {
                const sectionPropertyEditor = query(
                    screenPropertiesEditorContainerElement,
                    screenSectionFieldPropertyEditor
                );
                expect(sectionPropertyEditor).toBeTruthy();
            });
        });
    });
});
