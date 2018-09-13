import {
    getScreenFieldTypeByName, getAllScreenFieldTypes
} from "builder_platform_interaction/screenEditorUtils";

jest.mock('../screen-editor-extension-utils', () => {
    const componentInstanceFieldType = require.requireActual('../screen-editor-extension-utils').COMPONENT_INSTANCE;
    return {
        getAllCachedExtensionTypes: () => {
            return [
                {
                    name: 'flowruntime:fileUpload',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'File Upload',
                    icon: 'utility:type_tool',
                    category: 'Input'
                }, {
                    name: 'orgns:customComp',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'Custom Comp',
                    icon: 'utility:type_tool',
                    category: 'Custom'
                }];
        }
    };
});

describe('getScreenFieldTypeByName function', () => {
    it('Returns normal screen field type (not extension) by name', () => {
        const name = getAllScreenFieldTypes()[1].name;
        const fieldType = getScreenFieldTypeByName(name);
        expect(fieldType.name).toBe(name);
    });

    it('Returns extension field type by name', () => {
        const fieldType = getScreenFieldTypeByName('orgns:customComp');
        expect(fieldType.name).toBe('orgns:customComp');
        expect(fieldType.fieldType).toBe(require.requireActual('../screen-editor-extension-utils').COMPONENT_INSTANCE);
    });
});
