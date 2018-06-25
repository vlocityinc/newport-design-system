import { createElement } from 'engine';
import ScreenEditorPropertiesEditorContainer from '../screen-properties-editor-container';
import { getAllScreenFieldTypes } from 'builder_platform_interaction-screen-editor-utils';
import { query } from 'builder_platform_interaction-builder-test-utils';
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const createComponentUnderTest = (props) => {
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

describe('screen-properties-editor-container', () => {
    it('displays the screen properties header by default', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {elementType: 'SCREEN'}
        });
        return Promise.resolve().then(() => {
            const header = getShadowRoot(screenPropertiesEditorContainerElement).querySelector(headerSelector);
            expect(header.textContent).toBe('FlowBuilderScreenEditor.screen');
        });
    });
    it('displays the field properties header if field is selected', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {type: getAllScreenFieldTypes()[0]}
        });
        return Promise.resolve().then(() => {
            const header = getShadowRoot(screenPropertiesEditorContainerElement).querySelector(headerSelector);
            expect(header.textContent).toBe('FlowBuilderScreenEditor.screen > FlowBuilderScreenEditor.fieldTypeLabelTextField');
        });
    });
    it('displays the error icon when the node has errors', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node:{type: getAllScreenFieldTypes()[0], value: {value: '', error: 'error'}}
        });
        return Promise.resolve().then(() => {
            const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
            expect(icon).toBeTruthy();
        });
    });
    it('does not display the error icon when the node has no errors', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node:{type: getAllScreenFieldTypes()[0], value: {value: '', error: null}}
        });
        return Promise.resolve().then(() => {
            const icon = query(screenPropertiesEditorContainerElement, errorIconSelector);
            expect(icon).toBeFalsy();
        });
    });
});
