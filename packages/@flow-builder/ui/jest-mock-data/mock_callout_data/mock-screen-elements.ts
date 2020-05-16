// @ts-nocheck
export const mockScreenElement = {
    allowBack: true,
    allowFinish: true,
    allowPause: true,
    connectorCount: 0,
    elementType: 'Screen',
    fields: [
        {
            elementType: 'SCREEN_FIELD',
            fieldType: 'DisplayText',
            guid: 'e1b88c4a-1a78-42d2-8057-93e2401bbdd4',
            isNewField: true,
            isRequired: false,
            isVisible: undefined,
            name: { value: 'dt1', error: null },
            type: {
                name: 'DisplayText',
                fieldType: 'DisplayText',
                label: 'Display Text',
                icon: 'standard:display_text',
                category: 'Display',
                type: 'String'
            }
        },
        {
            elementType: 'SCREEN_FIELD',
            fieldType: 'DisplayText',
            guid: 'b6c2e62a-ba90-4dfc-8d48-d4b0061e84fd',
            isNewField: true,
            isRequired: false,
            isVisible: undefined,
            name: {
                value: 'invalidMergeFieldScreenElementNotInStore',
                error: null
            },
            type: {
                name: 'DisplayText',
                fieldType: 'DisplayText',
                label: 'Display Text',
                icon: 'standard:display_text',
                category: 'Display',
                type: undefined
            }
        },
        {
            elementType: 'SCREEN_FIELD',
            fieldType: 'DisplayText',
            guid: 'ef49374c-ba9b-4c15-8ffc-f1551c62a516',
            isNewField: true,
            isRequired: false,
            isVisible: undefined,
            name: {
                value: 'validMergeFieldScreenElementNotInStore',
                error: null
            },
            type: {
                name: 'DisplayText',
                fieldType: 'DisplayText',
                label: 'Display Text',
                icon: 'standard:display_text',
                category: 'Display',
                type: 'String'
            }
        },
        {
            elementType: 'SCREEN_FIELD',
            fieldType: 'RegionContainer',
            guid: 'region-container-1',
            isNewField: true,
            isRequired: false,
            isVisible: undefined,
            name: {
                value: 'Screen_Section1',
                error: null
            },
            type: {
                name: 'Section',
                fieldType: 'RegionContainer',
                label: 'Section',
                icon: 'standard:display_text',
                category: 'Display'
            },
            fields: [
                {
                    elementType: 'SCREEN_FIELD',
                    fieldType: 'Region',
                    guid: 'region-container-1-region-1',
                    isNewField: true,
                    isRequired: false,
                    isVisible: undefined,
                    name: {
                        value: 'Screen_Section1_Column1',
                        error: null
                    },
                    type: {
                        name: 'Column',
                        fieldType: 'Region'
                    },
                    fields: [
                        {
                            elementType: 'SCREEN_FIELD',
                            fieldType: 'InputField',
                            guid: 'region-container-1-region-1-input-field-1',
                            isNewField: true,
                            isRequired: false,
                            isVisible: undefined,
                            name: {
                                value: 'section1Column1Text1',
                                error: null
                            },
                            type: {
                                name: 'TextBox',
                                fieldType: 'InputField',
                                dataType: 'String',
                                label: 'Text',
                                icon: 'standard:textbox',
                                category: 'Input',
                                type: 'String'
                            }
                        },
                        {
                            elementType: 'SCREEN_FIELD',
                            fieldType: 'InputField',
                            guid: 'region-container-1-region-1-input-field-2',
                            isNewField: true,
                            isRequired: false,
                            isVisible: undefined,
                            name: {
                                value: 'section1Column1Text2',
                                error: null
                            },
                            type: {
                                name: 'TextBox',
                                fieldType: 'InputField',
                                dataType: 'String',
                                label: 'Text',
                                icon: 'standard:textbox',
                                category: 'Input',
                                type: 'String'
                            }
                        }
                    ]
                },
                {
                    elementType: 'SCREEN_FIELD',
                    fieldType: 'Region',
                    guid: 'region-container-1-region-2',
                    isNewField: true,
                    isRequired: false,
                    isVisible: undefined,
                    name: {
                        value: 'Screen_Section1_Column2',
                        error: null
                    },
                    type: {
                        name: 'Column',
                        fieldType: 'Region'
                    },
                    fields: [
                        {
                            elementType: 'SCREEN_FIELD',
                            fieldType: 'InputField',
                            guid: 'region-container-1-region-2-input-field-1',
                            isNewField: true,
                            isRequired: false,
                            isVisible: undefined,
                            name: {
                                value: 'section1Column2Text1',
                                error: null
                            },
                            type: {
                                name: 'TextBox',
                                fieldType: 'InputField',
                                dataType: 'String',
                                label: 'Text',
                                icon: 'standard:textbox',
                                category: 'Input',
                                type: 'String'
                            }
                        },
                        {
                            elementType: 'SCREEN_FIELD',
                            fieldType: 'InputField',
                            guid: 'region-container-1-region-2-input-field-2',
                            isNewField: true,
                            isRequired: false,
                            isVisible: undefined,
                            name: {
                                value: 'section1Column2Text2',
                                error: null
                            },
                            type: {
                                name: 'TextBox',
                                fieldType: 'InputField',
                                dataType: 'String',
                                label: 'Text',
                                icon: 'standard:textbox',
                                category: 'Input',
                                type: 'String'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
