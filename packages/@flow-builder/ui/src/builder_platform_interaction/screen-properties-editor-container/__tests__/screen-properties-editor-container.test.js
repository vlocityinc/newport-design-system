import { createElement } from 'engine';
import ScreenEditorPropertiesEditorContainer from '../screen-properties-editor-container';
import { getAllScreenFieldTypes } from 'builder_platform_interaction-screen-editor-utils';

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

describe('screen-properties-editor-container', () => {
    it('displays the screen properties header by default', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {elementType: 'SCREEN'}
        });
        return Promise.resolve().then(() => {
            const header = screenPropertiesEditorContainerElement.querySelector(headerSelector);
            expect(header.textContent).toBe('FlowBuilderScreenEditor.screen');
        });
    });
    it('displays the field properties header if field is selected', () => {
        const screenPropertiesEditorContainerElement = createComponentUnderTest({
            node: {type: getAllScreenFieldTypes()[0]}
        });
        return Promise.resolve().then(() => {
            const header = screenPropertiesEditorContainerElement.querySelector(headerSelector);
            expect(header.textContent).toBe('FlowBuilderScreenEditor.screen > FlowBuilderScreenEditor.fieldTypeLabelTextField');
        });
    });
});
