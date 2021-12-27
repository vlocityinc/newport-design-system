// @ts-nocheck
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import * as mockStoreData from 'mock/storeData';
import { textTemplateReducer } from '../textTemplateReducer';

describe('text-template-reducer', () => {
    let textTemplateResourceInRichText, textTemplateResourceInPlainText;

    beforeEach(() => {
        textTemplateResourceInRichText = mockStoreData.textTemplateInRichTextModeForPropertyEditor();
        textTemplateResourceInPlainText = mockStoreData.textTemplateInPlainTextModeForPropertyEditor();
    });

    describe('handles PropertyChangedEvent', () => {
        it('updates the value of the text property', () => {
            const newTextTemplate = '<html> New text in template</html>';
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                value: newTextTemplate,
                propertyName: 'text'
            });
            const resultObj = textTemplateReducer(textTemplateResourceInRichText, action);
            expect(resultObj.text.value).toEqual(newTextTemplate);
            expect(resultObj).not.toBe(textTemplateResourceInRichText);
        });
        it('updates the value of isPlainTextMode from default (rich text) to plain text mode', () => {
            const isViewedAsPlainText = true;
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                value: isViewedAsPlainText,
                propertyName: 'isViewedAsPlainText'
            });
            const resultObj = textTemplateReducer(textTemplateResourceInRichText, action);
            expect(resultObj.isViewedAsPlainText).toEqual(isViewedAsPlainText);
            expect(resultObj).not.toBe(textTemplateResourceInRichText);
        });
        it('updates the value of isPlainTextMode from plain text to rich text mode', () => {
            const isViewedAsPlainText = false;
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                value: isViewedAsPlainText,
                propertyName: 'isViewedAsPlainText'
            });
            const resultObj = textTemplateReducer(textTemplateResourceInPlainText, action);
            expect(resultObj.isViewedAsPlainText).toEqual(isViewedAsPlainText);
            expect(resultObj).not.toBe(textTemplateResourceInPlainText);
        });
    });
});
