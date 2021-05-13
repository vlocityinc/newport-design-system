// @ts-nocheck
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    createScreenWithFields,
    createPastedScreen,
    createDuplicateScreen,
    createScreenElement,
    createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
    createScreenWithFieldReferences,
    createScreenMetadataObject
} from '../screen';
import {
    createScreenField,
    createScreenFieldMetadataObject,
    createScreenFieldWithFieldReferences,
    createScreenFieldWithFields
} from '../screenField';
import { ELEMENT_TYPE, FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseChildElement,
    baseCanvasElementsArrayToMap
} from '../base/baseElement';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from '../base/baseMetadata';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});

const field1Guid = 'field1';
const field2Guid = 'field2';
const field3Guid = 'field3';
const newScreenGuid = 'newScreen';
const existingScreenGuid = 'existingScreen';
const existingScreenWithSectionsAndColumnsGuid = 'existingScreenWithSectionsAndColumnsGuid';
const existingSectionGuid = 'existingSection1';
const existingColumnGuid = 'existingColumn1';
const existingNestedTextFieldGuid = 'existingNestedTextField1';

const existingScreen = {
    guid: existingScreenGuid,
    childReferences: [{ childReference: 'existingScreenField1' }, { childReference: 'existingScreenField2' }]
};

const existingScreenWithSectionsAndColumns = {
    guid: existingScreenWithSectionsAndColumnsGuid,
    childReferences: [
        {
            childReference: existingSectionGuid
        }
    ]
};

const existingSection = {
    guid: existingSectionGuid,
    childReferences: [
        {
            childReference: existingColumnGuid
        }
    ]
};

const existingColumn = {
    guid: existingColumnGuid,
    childReferences: [
        {
            childReference: existingNestedTextFieldGuid
        }
    ]
};

const existingNestedTextField = {
    guid: existingNestedTextFieldGuid
};

const foundElementGuidPrefix = 'found';

getElementByGuid.mockImplementation((guid) => {
    if (guid === newScreenGuid) {
        return null;
    } else if (guid === existingScreenGuid) {
        return existingScreen;
    } else if (guid === existingScreenWithSectionsAndColumnsGuid) {
        return existingScreenWithSectionsAndColumns;
    } else if (guid === existingSectionGuid) {
        return existingSection;
    } else if (guid === existingColumnGuid) {
        return existingColumn;
    } else if (guid === existingNestedTextFieldGuid) {
        return existingNestedTextField;
    }

    return {
        guid: foundElementGuidPrefix + guid
    };
});

jest.mock('../base/baseElement');
baseCanvasElement
    .mockImplementation((element) => {
        return Object.assign({}, element);
    })
    .mockName('baseCanvasElementMock');
createPastedCanvasElement
    .mockImplementation((duplicatedElement) => {
        return duplicatedElement;
    })
    .mockName('createPastedCanvasElementMock');
duplicateCanvasElementWithChildElements
    .mockImplementation(() => {
        const duplicatedElement = {};
        const duplicatedChildElements = {
            duplicatedFieldGuid: {
                guid: 'duplicatedFieldGuid',
                name: 'duplicatedFieldName'
            }
        };
        const updatedChildReferences = [
            {
                childReference: 'duplicatedFieldGuid'
            }
        ];

        return {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences
        };
    })
    .mockName('duplicateCanvasElementWithChildElementsMock');
baseChildElement
    .mockImplementation((field) => {
        return Object.assign({}, field);
    })
    .mockName('baseChildElementMock');
baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
baseChildElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});

jest.mock('../screenField');
createScreenFieldMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
createScreenField.mockImplementation((element) => {
    return Object.assign({}, element);
});
createScreenFieldWithFieldReferences.mockImplementation((element, screenFields, parentName, index) => {
    if (element.fieldType === 'RegionContainer') {
        element.name = parentName + '_Section' + index;
    }
    return Object.assign({}, element);
});
createScreenFieldWithFields.mockImplementation((element) => {
    return Object.assign({}, element);
});

describe('screen', () => {
    describe('createScreenElement', () => {
        let fields;

        beforeEach(() => {
            fields = [
                {
                    name: field1Guid,
                    guid: field1Guid
                },
                {
                    name: field2Guid,
                    guid: field2Guid,
                    fields: [
                        {
                            name: field3Guid,
                            guid: field3Guid
                        }
                    ]
                }
            ];
        });
        it('includes the return value of a call to baseCanvasElement', () => {
            createScreenElement(existingScreen);
            expect(baseCanvasElement).toHaveBeenCalledWith(existingScreen);
        });
        describe('getFieldIndexesByGUID', () => {
            it('returns correct index chain when looking for a field under a screen', () => {
                const screen = createScreenElement(existingScreen);
                screen.fields = fields;
                const indexes = screen.getFieldIndexesByGUID(field2Guid);
                expect(indexes).toHaveLength(1);
                expect(indexes[0]).toEqual(1);
            });
            it('returns correct index chain when looking for a field under a field under a screen', () => {
                const screen = createScreenElement(existingScreen);
                screen.fields = fields;
                const indexes = screen.getFieldIndexesByGUID(field3Guid);
                expect(indexes).toHaveLength(2);
                expect(indexes[0]).toEqual(0);
                expect(indexes[1]).toEqual(1);
            });
        });
        describe('getFieldByGUID', () => {
            it('returns correct field when looking for a field under a screen', () => {
                const screen = createScreenElement(existingScreen);
                screen.fields = fields;
                const field = screen.getFieldByGUID(field2Guid);
                expect(field).toBeDefined();
                expect(field.name).toEqual(field2Guid);
            });
            it('returns correct field when looking for a field under a field under a screen', () => {
                const screen = createScreenElement(existingScreen);
                screen.fields = fields;
                const field = screen.getFieldByGUID(field3Guid);
                expect(field).toBeDefined();
                expect(field.name).toEqual(field3Guid);
            });
        });
    });

    describe('createScreenWithFields', () => {
        it('element type is SCREEN', () => {
            const screen = createScreenWithFields();
            expect(screen.elementType).toEqual(ELEMENT_TYPE.SCREEN);
        });
        describe('fields', () => {
            it('includes fields for all field references present', () => {
                const childReferences = [{ childReference: 'a' }, { childReference: 'b' }, { childReference: 'c' }];
                const screen = createScreenWithFields({
                    childReferences
                });
                expect(screen.fields).toHaveLength(3);
                expect(screen.fields[0].guid).toEqual(foundElementGuidPrefix + 'a');
            });
        });
    });

    describe('createPastedScreen function', () => {
        const dataForPasting = {
            canvasElementToPaste: {},
            newGuid: 'updatedScreen1Guid',
            newName: 'updatedScreenName',
            childElementGuidMap: {},
            childElementNameMap: {},
            cutOrCopiedChildElements: {}
        };

        const { pastedCanvasElement, pastedChildElements } = createPastedScreen(dataForPasting);

        it('pastedCanvasElement in the result should have the updated childReferences', () => {
            expect(pastedCanvasElement.childReferences).toEqual([
                {
                    childReference: 'duplicatedFieldGuid'
                }
            ]);
        });
        it('returns correct pastedChildElements', () => {
            expect(pastedChildElements).toEqual({
                duplicatedFieldGuid: {
                    guid: 'duplicatedFieldGuid',
                    name: 'duplicatedFieldName'
                }
            });
        });
    });

    describe('createDuplicateScreen function', () => {
        const { duplicatedElement, duplicatedChildElements } = createDuplicateScreen(
            {},
            'duplicatedGuid',
            'duplicatedName',
            {},
            {}
        );

        it('duplicatedElement has updated childReferences', () => {
            expect(duplicatedElement.childReferences).toEqual([
                {
                    childReference: 'duplicatedFieldGuid'
                }
            ]);
        });
        it('returns correct duplicatedChildElements', () => {
            expect(duplicatedChildElements).toEqual({
                duplicatedFieldGuid: {
                    guid: 'duplicatedFieldGuid',
                    name: 'duplicatedFieldName'
                }
            });
        });
    });

    describe('createScreenMetadataObject', () => {
        let screenFromStore;

        beforeEach(() => {
            screenFromStore = {
                guid: existingScreenGuid,
                childReferences: [
                    {
                        childReference: field1Guid
                    },
                    {
                        childReference: field2Guid
                    },
                    {
                        childReference: field3Guid
                    }
                ]
            };
        });
        // TODO: add test for footer labels when metadata changes are finished on backend, commit with work item W-9142863
        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createScreenMetadataObject(screenFromStore);
            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(screenFromStore, {});
        });

        describe('fields', () => {
            it('screen includes fields for all screen field references present', () => {
                const screen = createScreenMetadataObject(screenFromStore);
                expect(screen.fields).toHaveLength(3);
                expect(screen.fields[0].guid).toEqual(foundElementGuidPrefix + field1Guid);
            });
        });
    });
    describe('createScreenWithFieldReferences', () => {
        let screenFromFlow;

        beforeEach(() => {
            screenFromFlow = {
                guid: existingScreenGuid,
                name: existingScreenGuid,
                fields: [
                    {
                        name: field1Guid,
                        guid: field1Guid,
                        fieldType: 'RegionContainer'
                    },
                    {
                        name: field2Guid,
                        guid: field2Guid
                    },
                    {
                        name: field3Guid,
                        guid: field3Guid
                    }
                ]
            };
        });

        it('element type is SCREEN', () => {
            const result = createScreenWithFieldReferences(screenFromFlow);
            const screen = result.elements[existingScreenGuid];
            expect(screen.elementType).toEqual(ELEMENT_TYPE.SCREEN);
        });

        describe('custom footer labels', () => {
            it('creates correct footer label type when allow is true and label is present', () => {
                screenFromFlow.allowFinish = true;
                screenFromFlow.nextOrFinishLabel = 'testFinishLabel';
                screenFromFlow.allowBack = true;
                screenFromFlow.backLabel = 'testBackLabel';
                screenFromFlow.allowPause = true;
                screenFromFlow.pauseLabel = 'testPauseLabel';
                const result = createScreenWithFieldReferences(screenFromFlow);
                const screen = result.elements[existingScreenGuid];
                expect(screen.nextOrFinishLabelType).toEqual(FOOTER_LABEL_TYPE.CUSTOM);
                expect(screen.nextOrFinishLabel).toEqual('testFinishLabel');
                expect(screen.backLabelType).toEqual(FOOTER_LABEL_TYPE.CUSTOM);
                expect(screen.backLabel).toEqual('testBackLabel');
                expect(screen.pauseLabelType).toEqual(FOOTER_LABEL_TYPE.CUSTOM);
                expect(screen.pauseLabel).toEqual('testPauseLabel');
            });
            it('creates correct footer label type when allow is false and label is present', () => {
                screenFromFlow.allowFinish = false;
                screenFromFlow.nextOrFinishLabel = 'testFinishLabel';
                screenFromFlow.allowBack = false;
                screenFromFlow.backLabel = 'testBackLabel';
                screenFromFlow.allowPause = false;
                screenFromFlow.pauseLabel = 'testPauseLabel';
                const result = createScreenWithFieldReferences(screenFromFlow);
                const screen = result.elements[existingScreenGuid];
                expect(screen.nextOrFinishLabelType).toEqual(FOOTER_LABEL_TYPE.HIDE);
                expect(screen.backLabelType).toEqual(FOOTER_LABEL_TYPE.HIDE);
                expect(screen.pauseLabelType).toEqual(FOOTER_LABEL_TYPE.HIDE);
            });
            it('creates correct footer label type when allow is true and label is not present', () => {
                screenFromFlow.allowFinish = true;
                screenFromFlow.nextOrFinishLabel = null;
                screenFromFlow.allowBack = true;
                screenFromFlow.backLabel = null;
                screenFromFlow.allowPause = true;
                screenFromFlow.pauseLabel = null;
                const result = createScreenWithFieldReferences(screenFromFlow);
                const screen = result.elements[existingScreenGuid];
                expect(screen.nextOrFinishLabelType).toEqual(FOOTER_LABEL_TYPE.STANDARD);
                expect(screen.backLabelType).toEqual(FOOTER_LABEL_TYPE.STANDARD);
                expect(screen.pauseLabelType).toEqual(FOOTER_LABEL_TYPE.STANDARD);
            });
        });

        describe('fields', () => {
            it('screen includes fields present', () => {
                const result = createScreenWithFieldReferences(screenFromFlow);
                const screen = result.elements[existingScreenGuid];
                expect(screen.childReferences).toHaveLength(3);
            });

            it('are included in element map for all fields present', () => {
                const result = createScreenWithFieldReferences(screenFromFlow);
                expect(result.elements[screenFromFlow.fields[0].guid]).toEqual(screenFromFlow.fields[0]);
                expect(result.elements[screenFromFlow.fields[1].guid]).toEqual(screenFromFlow.fields[1]);
                expect(result.elements[screenFromFlow.fields[2].guid]).toEqual(screenFromFlow.fields[2]);
            });

            it('includes a region container (section) field whose name was autogenerated', () => {
                const result = createScreenWithFieldReferences(screenFromFlow);
                expect(result.elements[screenFromFlow.fields[0].guid].name).toEqual(existingScreenGuid + '_Section1');
            });
        });
    });
    describe('createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor', () => {
        let screenFromPropertyEditor;

        beforeEach(() => {
            screenFromPropertyEditor = {
                guid: newScreenGuid,
                fields: [
                    {
                        guid: field1Guid
                    }
                ]
            };
        });

        it('element type is SCREEN_WITH_MODIFIED_AND_DELETED_SCREEN_FIELDS', () => {
            const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
            expect(result.elementType).toEqual(ELEMENT_TYPE.SCREEN_WITH_MODIFIED_AND_DELETED_SCREEN_FIELDS);
        });

        it('screen element type is SCREEN', () => {
            const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
            expect(result.screen.elementType).toEqual(ELEMENT_TYPE.SCREEN);
        });

        describe('footer label clear', () => {
            it('clears footer button labels when type is standard', () => {
                screenFromPropertyEditor.nextOrFinishLabel = 'testLabel';
                screenFromPropertyEditor.nextOrFinishLabelType = FOOTER_LABEL_TYPE.STANDARD;
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.nextOrFinishLabel).toBeNull();
            });
            it('clears footer button labels when type is hide', () => {
                screenFromPropertyEditor.nextOrFinishLabel = 'testLabel';
                screenFromPropertyEditor.nextOrFinishLabelType = FOOTER_LABEL_TYPE.HIDE;
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.nextOrFinishLabel).toBeNull();
            });
            it('does not clear footer button labels when type is custom', () => {
                screenFromPropertyEditor.nextOrFinishLabel = 'testLabel';
                screenFromPropertyEditor.nextOrFinishLabelType = FOOTER_LABEL_TYPE.CUSTOM;
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.nextOrFinishLabel).toEqual('testLabel');
            });
        });

        describe('new/modified fields', () => {
            it('screen includes field references for all fields present', () => {
                const fields = [{ guid: 'a' }, { guid: 'b' }, { guid: 'c' }];
                screenFromPropertyEditor.fields = fields;
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.childReferences).toHaveLength(3);
            });
            it('includes fields for all fields present', () => {
                const fields = [{ guid: 'a' }, { guid: 'b' }, { guid: 'c' }];

                screenFromPropertyEditor.fields = fields;

                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);

                expect(result.fields).toHaveLength(3);
                expect(result.fields[0].guid).toEqual(fields[0].guid);
                expect(result.fields[1].guid).toEqual(fields[1].guid);
                expect(result.fields[2].guid).toEqual(fields[2].guid);
            });
        });
        describe('deleted fields', () => {
            it('screen does not include field references for deleted fields', () => {
                screenFromPropertyEditor = {
                    guid: existingScreenGuid,
                    fields: [
                        {
                            guid: field1Guid
                        }
                    ]
                };
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.childReferences).toHaveLength(1);
            });
            it('includes all deleted fields when no fields are nested', () => {
                screenFromPropertyEditor = {
                    guid: existingScreenGuid,
                    fields: [
                        {
                            guid: field1Guid
                        }
                    ]
                };
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.deletedFields).toHaveLength(2);
            });

            it('includes all deleted fields when nested fields are present', () => {
                screenFromPropertyEditor = {
                    guid: existingScreenWithSectionsAndColumnsGuid,
                    fields: [
                        {
                            guid: existingSectionGuid
                        }
                    ]
                };
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.deletedFields).toHaveLength(2);
            });
        });
    });
});
