// @ts-nocheck
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import * as mockStoreData from 'mock/storeData';
import TextTemplateEditor from '../textTemplateEditor';
import { textTemplateReducer } from '../textTemplateReducer';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-text-template-editor', {
        is: TextTemplateEditor
    });
    element.node = props;
    setDocumentBodyChildren(element);
    return element;
};

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');
    return {
        pick: actual.pick,
        getErrorsFromHydratedElement: jest.fn(),
        getValueFromHydratedItem: actual.getValueFromHydratedItem
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: jest.requireActual('builder_platform_interaction/actions').PROPERTY_EDITOR_ACTION
    };
});

jest.mock('../textTemplateReducer', () => {
    return {
        textTemplateReducer: jest.fn().mockImplementation((obj) => Object.assign({}, obj))
    };
});

const mockHydratedElementWithErrors = [{ key: 'mockKey', errorString: 'mockErrorString' }];

describe('text-template-editor', () => {
    let textTemplateInRichTextModeResource, textTemplateInPlainTextModeResource;

    beforeEach(() => {
        textTemplateInRichTextModeResource = mockStoreData.textTemplateInRichTextModeForPropertyEditor();
        textTemplateInPlainTextModeResource = mockStoreData.textTemplateInPlainTextModeForPropertyEditor();
    });

    test('check UI (snapshot) - "RichTextPlainTextSwitch" displayed with "richText" mode checked by default, and correct css class for resource picker', () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        expect(textTemplateEditor).toMatchSnapshot();
    });

    test('check UI (snapshot) - "RichTextPlainTextSwitch" displayed with "richText" mode off', () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInPlainTextModeResource);
        expect(textTemplateEditor).toMatchSnapshot();
    });

    it('contains a text template element', async () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        await ticks(1);
        expect(textTemplateEditor.node.elementType).toEqual(ELEMENT_TYPE.TEXT_TEMPLATE);
        expect(textTemplateEditor.getNode()).toEqual(textTemplateInRichTextModeResource);
    });

    it('has label description component that shows only dev name and description', () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        const labelDescription = textTemplateEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toEqual(textTemplateInRichTextModeResource.description);
        expect(labelDescription.devName).toEqual(textTemplateInRichTextModeResource.name);
        expect(labelDescription.hideLabel).toBeTruthy();
    });

    it('has resourced-textarea showing the correct text template', () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        const resourcedRichTextEditor = textTemplateEditor.shadowRoot.querySelector(
            SELECTORS.RESOURCED_RICH_TEXT_EDITOR
        );
        expect(resourcedRichTextEditor).toBeDefined();
        const lightningInputRichText = resourcedRichTextEditor.shadowRoot.querySelector(
            SELECTORS.LIGHTNING_INPUT_RICH_TEXT
        );
        expect(lightningInputRichText.value).toEqual(textTemplateInRichTextModeResource.text.value);
    });

    it('handles the property changed event and updates the property from label-description', async () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        await ticks(1);
        const event = new PropertyChangedEvent('description', 'new desc', null);
        textTemplateEditor.shadowRoot
            .querySelector('builder_platform_interaction-label-description')
            .dispatchEvent(event);
        expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
        expect(textTemplateReducer.mock.calls[0][0]).toEqual(textTemplateEditor.node);
    });

    it('handles the change event and updates the property from resourced-textarea', async () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        const newTextTemplate = '<html> New text in template</html>';
        await ticks(1);
        const event = new CustomEvent('change', {
            detail: { value: newTextTemplate, error: null },
            cancelable: true,
            composed: true,
            bubbles: true
        });
        textTemplateEditor.shadowRoot.querySelector(SELECTORS.RESOURCED_RICH_TEXT_EDITOR).dispatchEvent(event);
        expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
        expect(createAction.mock.calls[0][1]).toEqual({
            propertyName: 'text',
            value: newTextTemplate,
            error: null
        });
        expect(textTemplateReducer.mock.calls[0][0]).toEqual(textTemplateEditor.node);
    });

    it('handles the text mode switch event holding mode plain text and updates the property isPlainTextMode', async () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
        await ticks(1);
        const event = new CustomEvent('richtextplaintextswitchchanged', {
            detail: { isPlainText: true },
            cancelable: true,
            composed: true,
            bubbles: true
        });
        textTemplateEditor.shadowRoot.querySelector(SELECTORS.RESOURCED_RICH_TEXT_EDITOR).dispatchEvent(event);
        expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
        expect(createAction.mock.calls[0][1]).toEqual({
            propertyName: 'isViewedAsPlainText',
            value: true
        });
        expect(textTemplateReducer.mock.calls[0][0]).toEqual(textTemplateEditor.node);
    });

    it('handles the text mode switch event holding mode rich text and updates the property isPlainTextMode', async () => {
        const textTemplateEditor = setupComponentUnderTest(textTemplateInPlainTextModeResource);
        await ticks(1);
        const event = new CustomEvent('richtextplaintextswitchchanged', {
            detail: { isPlainText: false },
            cancelable: true,
            composed: true,
            bubbles: true
        });
        textTemplateEditor.shadowRoot.querySelector(SELECTORS.RESOURCED_RICH_TEXT_EDITOR).dispatchEvent(event);
        expect(createAction.mock.calls[0][0]).toEqual(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY);
        expect(createAction.mock.calls[0][1]).toEqual({
            propertyName: 'isViewedAsPlainText',
            value: false
        });
        expect(textTemplateReducer.mock.calls[0][0]).toEqual(textTemplateEditor.node);
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
            const node = textTemplateEditor.node;
            textTemplateEditor.validate();
            expect(textTemplateReducer.mock.calls[0][0]).toEqual(node);
            expect(textTemplateReducer.mock.calls[0][1]).toEqual({
                type: VALIDATE_ALL
            });
        });

        it('gets the errors after validating', () => {
            const textTemplateEditor = setupComponentUnderTest(textTemplateInRichTextModeResource);
            getErrorsFromHydratedElement.mockReturnValueOnce(mockHydratedElementWithErrors);
            const result = textTemplateEditor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledWith(textTemplateEditor.node);
            expect(result).toEqual(mockHydratedElementWithErrors);
        });
    });
});
