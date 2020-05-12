// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditorPropertiesEditorContainer from '../screenPropertiesEditorContainer';
import { getAllScreenFieldTypes } from 'builder_platform_interaction/screenEditorUtils';
import { query, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign(jest.requireActual('builder_platform_interaction/contextLib'), {
        orgHasFlowScreenSections: () => {
            return true;
        }
    });
});

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-properties-editor-container', {
        is: ScreenEditorPropertiesEditorContainer
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const headerSelector = '.slds-panel__header-title';
const errorIconSelector = 'lightning-button-icon[iconName="utility:error"]';
const screenSectionFieldPropertyEditor = 'builder_platform_interaction-screen-section-field-properties-editor';

describe('screen-properties-editor-container', () => {
    it('displays the screen properties header by default', async () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { elementType: ELEMENT_TYPE.SCREEN }
        });
        await ticks(1);
        const header = screenPropertiesEditorContainerElement.shadowRoot.querySelector(headerSelector);
        expect(header.textContent).toBe('FlowBuilderScreenEditor.screenProperties');
    });
    it('displays the field properties header if field is selected', async () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: { type: getAllScreenFieldTypes()[0] }
        });
        await ticks(1);
        const header = screenPropertiesEditorContainerElement.shadowRoot.querySelector(headerSelector);
        expect(header.textContent).toBe('FlowBuilderScreenEditor.fieldTypeLabelTextField');
    });
    it('displays the error icon when the node has errors', async () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {
                type: getAllScreenFieldTypes()[0],
                value: { value: '', error: 'error' }
            }
        });
        await ticks(1);
        const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
        expect(icon).toBeTruthy();
    });
    it('does not display the error icon when the node has no errors', async () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {
                type: getAllScreenFieldTypes()[0],
                value: { value: '', error: null }
            }
        });
        await ticks(1);
        const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
        expect(icon).toBeFalsy();
    });
    it('Displays the screen-section-field-properties-editor if isRegionContainerField', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: Object.assign(
                {
                    type: {},
                    fields: []
                },
                getAllScreenFieldTypes().find(fieldType => fieldType.name === 'Section')
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
