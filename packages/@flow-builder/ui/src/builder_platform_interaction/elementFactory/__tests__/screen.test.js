import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    createScreenWithFields, createDuplicateScreen, createScreenElement,
    createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
    createScreenWithFieldReferences, createScreenMetadataObject
} from '../screen';
import {
    createScreenField,
    createScreenFieldMetadataObject
} from '../screenField';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, duplicateCanvasElementWithChildElements, baseChildElement, baseCanvasElementsArrayToMap } from '../base/baseElement';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from '../base/baseMetadata';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});

const newScreenGuid = 'newScreen';
const existingScreenGuid = 'existingScreen';
const existingScreen = {
    guid: existingScreenGuid,
    fieldReferences: [
        { fieldReference: 'existingScreenField1'},
        { fieldReference: 'existingScreenField2'}
    ]
};

const foundElementGuidPrefix = 'found';
getElementByGuid.mockImplementation((guid) => {
    if (guid === newScreenGuid) {
        return null;
    } else if (guid === existingScreenGuid) {
            return existingScreen;
    }

    return {
        guid: foundElementGuidPrefix + guid
    };
});

jest.mock('../base/baseElement');
baseCanvasElement.mockImplementation((element) => {
    return Object.assign({}, element);
}).mockName('baseCanvasElementMock');
duplicateCanvasElementWithChildElements.mockImplementation(() => {
    const duplicatedElement = {};
    const duplicatedChildElements = {
        'duplicatedFieldGuid': {
            guid: 'duplicatedFieldGuid',
            name: 'duplicatedFieldName'
        }
    };
    const updatedChildReferences = [{
        'fieldReference' : 'duplicatedFieldGuid'
    }];

    return { duplicatedElement, duplicatedChildElements, updatedChildReferences };
}).mockName('duplicateCanvasElementWithChildElementsMock');
baseChildElement.mockImplementation((field) => {
    return Object.assign({}, field);
}).mockName('baseChildElementMock');
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

describe('screen', () => {
    describe('createScreenElement', () => {
        it('includes the return value of a call to baseCanvasElement', () => {
            createScreenElement(existingScreen);
            expect(baseCanvasElement).toHaveBeenCalledWith(existingScreen);
        });
    });
    describe('createScreenWithFields', () => {
        it('element type is SCREEN', () => {
            const screen = createScreenWithFields();
            expect(screen.elementType).toEqual(ELEMENT_TYPE.SCREEN);
        });
        describe('fields', () => {
            it('includes fields for all field references present', () => {
                const fieldReferences = [
                    { fieldReference: 'a'},
                    { fieldReference: 'b'},
                    { fieldReference: 'c'}
                ];
                const screen = createScreenWithFields({
                    fieldReferences
                });
                expect(screen.fields).toHaveLength(3);
            });
        });
    });

    describe('createDuplicateScreen function', () => {
        const { duplicatedElement, duplicatedChildElements } = createDuplicateScreen({}, 'duplicatedGuid', 'duplicatedName', {}, {});

        it('duplicatedElement has updated fieldReferences', () => {
            expect(duplicatedElement.fieldReferences).toEqual([{
                'fieldReference': 'duplicatedFieldGuid'
            }]);
        });
        it('returns correct duplicatedChildElements', () => {
            expect(duplicatedChildElements).toEqual({
                'duplicatedFieldGuid': {
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
                fieldReferences: [
                    {
                        fieldReference: 'field1'
                    },
                    {
                        fieldReference: 'field2'
                    },
                    {
                        fieldReference: 'field3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createScreenMetadataObject(screenFromStore);
            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(screenFromStore, {});
        });

        describe('fields', () => {
            it('screen includes fields for all screen field references present', () => {
                const screen = createScreenMetadataObject(screenFromStore);
                expect(screen.fields).toHaveLength(3);
            });
        });
    });
    describe('createScreenWithFieldReferences', () => {
        let screenFromFlow;

        beforeEach(() => {
            screenFromFlow = {
                guid: existingScreenGuid,
                fields: [
                    {
                        name: 'field1',
                        guid: 'field1'
                    },
                    {
                        name: 'field2',
                        guid: 'field2'
                    },
                    {
                        name: 'field3',
                        guid: 'field3'
                    }
                ]
            };
        });

        it('element type is SCREEN', () => {
            const result = createScreenWithFieldReferences(screenFromFlow);
            const screen = result.elements[existingScreenGuid];
            expect(screen.elementType).toEqual(ELEMENT_TYPE.SCREEN);
        });

        describe('fields', () => {
            it('screen includes fields present', () => {
                const result = createScreenWithFieldReferences(screenFromFlow);
                const screen = result.elements[existingScreenGuid];
                expect(screen.fieldReferences).toHaveLength(3);
            });

            it('are included in element map for all fields present', () => {
                const result = createScreenWithFieldReferences(screenFromFlow);
                expect(result.elements[screenFromFlow.fields[0].guid]).toEqual(screenFromFlow.fields[0]);
                expect(result.elements[screenFromFlow.fields[1].guid]).toEqual(screenFromFlow.fields[1]);
                expect(result.elements[screenFromFlow.fields[2].guid]).toEqual(screenFromFlow.fields[2]);
            });
        });
    });
    describe('createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor', () => {
        let screenFromPropertyEditor;

        beforeEach(() => {
            screenFromPropertyEditor = {
                guid: newScreenGuid,
                fields: [{
                    guid: 'field1'
                }]
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

        describe('new/modified fields', () => {
            it('screen includes field references for all fields present', () => {
                const fields = [
                    { guid: 'a'},
                    { guid: 'b'},
                    { guid: 'c'}
                ];
                screenFromPropertyEditor.fields = fields;
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.fieldReferences).toHaveLength(3);
            });
            it('includes fields for all fields present', () => {
                const fields = [
                    { guid: 'a'},
                    { guid: 'b'},
                    { guid: 'c'}
                ];

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
                    fields: [{
                        guid: 'field1'
                    }]
                };
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.screen.fieldReferences).toHaveLength(1);
            });
            it('includes all deleted fields', () => {
                screenFromPropertyEditor = {
                    guid: existingScreenGuid,
                    fields: [{
                        guid: 'field1'
                    }]
                };
                const result = createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screenFromPropertyEditor);
                expect(result.deletedFields).toHaveLength(2);
            });
        });
    });
});