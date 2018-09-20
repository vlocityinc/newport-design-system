import { textTemplateReducer } from "../textTemplateReducer";
import * as mockStoreData from 'mock/storeData';
import { deepCopy } from "builder_platform_interaction/storeLib";
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";

describe('text-template-reducer', () => {
    let textTemplateResource;

    beforeEach(() => {
        textTemplateResource = deepCopy(mockStoreData.textTemplates[mockStoreData.textTemplateGuid]);
    });

    describe('handles PropertyChangedEvent', () => {
        it('updates the value of the text property', () => {
            const newTextTemplate = '<html> New text in template</html>';
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                value : newTextTemplate,
                error: null,
                propertyName: 'text'
            });
            const resultObj = textTemplateReducer(textTemplateResource, action);
            expect(resultObj.text.value).toEqual(newTextTemplate);
            expect(resultObj.text.error).toBe(null);
            expect(resultObj).not.toBe(textTemplateResource);
        });
    });
});