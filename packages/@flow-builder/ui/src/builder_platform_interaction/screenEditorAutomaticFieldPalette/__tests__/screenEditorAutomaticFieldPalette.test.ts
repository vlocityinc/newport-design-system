import ScreenEditorAutomaticFieldPalette from '../screenEditorAutomaticFieldPalette';
import { createElement } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    flowWithAllElementsUIModel,
    accountSObjectVariable,
    objectWithAllPossibleFieldsVariable
} from 'mock/storeData';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import {
    SObjectReferenceChangedEvent,
    RemoveMergeFieldPillEvent,
    EditMergeFieldPillEvent,
    PaletteItemClickedEvent,
    ScreenEditorEventName
} from 'builder_platform_interaction/events';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleFieldsVariableFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    dragStartEvent
} from 'builder_platform_interaction/builderTestUtils';
import { automaticFieldBetaUrls as mockAutomaticFieldBetaUrls } from 'serverData/GetAutomaticFieldBetaUrls/automaticFieldBetaUrls.json';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { FieldDataType } from 'builder_platform_interaction/dataTypeLib';

let mockAccountFields = accountFields;

enum PromiseMode {
    Pending,
    Rejected,
    Resolved
}

let mockFetchFieldsForEntityMode = PromiseMode.Resolved;

const getResolvablePromise = (mode: PromiseMode, error = 'my error') =>
    new Promise((resolve, reject) => {
        if (mode === PromiseMode.Rejected) {
            reject(error);
        }
    });

function mockFetchFieldsForEntity(recordEntityName) {
    return mockFetchFieldsForEntityMode === PromiseMode.Pending || mockFetchFieldsForEntityMode === PromiseMode.Rejected
        ? getResolvablePromise(mockFetchFieldsForEntityMode)
        : Promise.resolve(
              recordEntityName === 'Account' ? mockAccountFields : mockObjectWithAllPossibleFieldsVariableFields
          );
}

jest.mock(
    '@salesforce/label/FlowBuilderScreenEditorAutomaticFieldPalette.filterFieldsPlaceHolderLabel',
    () => ({ default: 'Search {0} fields...' }),
    {
        virtual: true
    }
);
jest.mock('builder_platform_interaction/sobjectLib', () =>
    Object.assign({}, jest.requireActual('builder_platform_interaction_mocks/sobjectLib'), {
        fetchFieldsForEntity: jest.fn(mockFetchFieldsForEntity)
    })
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    jest.requireActual('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/screenEditorUtils', () =>
    Object.assign({}, jest.requireActual('builder_platform_interaction/screenEditorUtils'), {
        setDragFieldValue: jest.fn()
    })
);
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const { SERVER_ACTION_TYPE } = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_BETA_URLS:
                    return Promise.resolve(mockAutomaticFieldBetaUrls);
                default:
                    return Promise.reject().catch();
            }
        }
    };
});
const SUPPORTED_FIELDS_IN_ACCOUNT = Object.values<FieldDefinition>(mockAccountFields).filter(
    (field) => field.supportedByAutomaticField
);
const TOTAL_SUPPORTED_FIELDS_IN_OBJECT_WITH_ALL_POSSIBLE_FIELDS = Object.values<FieldDefinition>(
    mockObjectWithAllPossibleFieldsVariableFields
).filter((field) => field.supportedByAutomaticField).length;

// Excluding boolean as they are always marked as required by the API
const TOTAL_REQUIRED_FIELDS_IN_OBJECT_WITH_ALL_POSSIBLE_FIELDS = Object.values<FieldDefinition>(
    mockObjectWithAllPossibleFieldsVariableFields
).filter(
    (field) => field.supportedByAutomaticField && field.required && field.fieldDataType !== FieldDataType.Boolean
).length;

const SELECTORS = {
    searchInput: '.palette-search-input',
    noItemsIllustration: '.noItemsIllustration',
    noSupportedFieldsIllustration: '.noSupportedFieldsIllustration'
};

const getSObjectOrSObjectCollectionPicker = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
    );

const getBasePalette = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LEFT_PANEL_PALETTE);

const getNoItemToShowIllustration = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(SELECTORS.noItemsIllustration);

const getNoSupportedFieldsIllustration = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(SELECTORS.noSupportedFieldsIllustration);

const getSearchInput = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(SELECTORS.searchInput);

const getSpinner = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_SPINNER);

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-screen-editor-automatic-field-palette', {
        is: ScreenEditorAutomaticFieldPalette
    });
    setDocumentBodyChildren(el);
    return el;
}

describe('Screen editor automatic field palette', () => {
    let element: ScreenEditorAutomaticFieldPalette;
    beforeEach(() => {
        element = createComponentForTest();
        mockFetchFieldsForEntityMode = PromiseMode.Resolved;
    });
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('Check initial state', () => {
        it('should contain an entity resource picker for sobject', () => {
            expect(getSObjectOrSObjectCollectionPicker(element)).not.toBeNull();
        });
        it('should not show the palette to show fields', () => {
            expect(getBasePalette(element)).toBeNull();
        });
        it('should display the no item to show illustration', () => {
            expect(getNoItemToShowIllustration(element)).not.toBeNull();
        });
        test('should not display spinner', () => {
            expect(getSpinner(element)).toBeNull();
        });
        test('should have received the expected knowledge article URL from the backend', () => {
            expect(element.knowledgeArticleUrl).toEqual(mockAutomaticFieldBetaUrls.automaticFieldKnowledgeArticle);
        });
    });

    describe('Event handling related to search', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
        beforeEach(async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
        });
        it('should not trim the given search term', async () => {
            const searchTerm = 'Billing ';
            getSearchInput(element).value = searchTerm;
            const inputEvent = new CustomEvent('input');
            getSearchInput(element).dispatchEvent(inputEvent);
            await ticks(1);
            expect(element.searchPattern).toEqual(searchTerm);
        });
    });

    describe('SObjectReferenceChangedEvent event handling', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
        test('SObjectReferenceChangedEvent should update properly recordVariable', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.recordVariable).toEqual(accountSObjectVariable.guid);
        });
        test('SObjectReferenceChangedEvent should load properly entityFields', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(sobjectLib.fetchFieldsForEntity).toHaveBeenCalledWith('Account');
        });
        test('SObjectReferenceChangedEvent should generate proper data with 1 sections for inner palette (no required field)', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData).toHaveLength(1);
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette not required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(SUPPORTED_FIELDS_IN_ACCOUNT.length);
        });
        test('SObjectReferenceChangedEvent should hide no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).toBeNull();
        });
        test('SObjectReferenceChangedEvent should hide no supported field to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getNoSupportedFieldsIllustration(element)).toBeNull();
        });
        test('SObjectReferenceChangedEvent should display base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
        });
        test('SObjectReferenceChangedEvent should display the spinner during field loading', async () => {
            mockFetchFieldsForEntityMode = PromiseMode.Pending;
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getSpinner(element)).not.toBeNull();
        });
        test('SObjectReferenceChangedEvent should not display the spinner after field loaded properly', async () => {
            mockFetchFieldsForEntityMode = PromiseMode.Rejected;
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getSpinner(element)).toBeNull();
        });
        test('SObjectReferenceChangedEvent should not display the spinner after field loading error', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getSpinner(element)).toBeNull();
        });
        test('SObjectReferenceChangedEvent with error should keep illustration visible', async () => {
            const sObjectReferenceChangedEventwithError = new SObjectReferenceChangedEvent(
                'myCrazyValue',
                'Enter a valid value.'
            );
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEventwithError);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).not.toBeNull();
        });
        test('Search pattern should be reset after sObject change', async () => {
            element.searchPattern = 'name';
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.searchPattern).toBeNull();
        });
        test('SObjectReferenceChangedEvent with same value does not fetch entity fields', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(sobjectLib.fetchFieldsForEntity).toHaveBeenCalledTimes(1);
        });
        test('SObjectReferenceChangedEvent with same value still displays base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
        });
        test('SObjectReferenceChangedEvent with same value still generate proper items for palette second section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(SUPPORTED_FIELDS_IN_ACCOUNT.length);
        });
        test('SObjectReferenceChangedEvent with same value keeps the search pattern as is', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            element.searchPattern = 'name';
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.searchPattern).toEqual('name');
        });
        describe('SObjectReferenceChangedEvent with a variable having no supported fields', () => {
            beforeAll(() => {
                mockAccountFields = [];
            });
            beforeEach(async () => {
                getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
                await ticks(1);
            });
            afterAll(() => {
                mockAccountFields = accountFields;
            });
            test('SObjectReferenceChangedEvent should show no supported illustration', () => {
                expect(getNoSupportedFieldsIllustration(element)).not.toBeNull();
            });
            test('SObjectReferenceChangedEvent should hide no items to show illustration', () => {
                expect(getNoItemToShowIllustration(element)).toBeNull();
            });
            test('SObjectReferenceChangedEvent should not show search input', () => {
                expect(getSearchInput(element)).toBeNull();
            });
            test('SObjectReferenceChangedEvent should not fill anything in the data for the palette', () => {
                expect(element.paletteData).toHaveLength(0);
            });
        });
    });

    describe('SObjectReferenceChangedEvent event handling with objectWithAllPossibleFieldsVariable to get both section in the palette', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(objectWithAllPossibleFieldsVariable.guid);
        test('SObjectReferenceChangedEvent should generate proper data with 2 sections for inner palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData).toHaveLength(2);
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(
                TOTAL_REQUIRED_FIELDS_IN_OBJECT_WITH_ALL_POSSIBLE_FIELDS
            );
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette non required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[1]._children).toHaveLength(
                TOTAL_SUPPORTED_FIELDS_IN_OBJECT_WITH_ALL_POSSIBLE_FIELDS -
                    TOTAL_REQUIRED_FIELDS_IN_OBJECT_WITH_ALL_POSSIBLE_FIELDS
            );
        });
    });

    describe('Pills related event handling', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
        const removeMergeFieldPillEvent = new RemoveMergeFieldPillEvent({});
        const editMergeFieldPillEvent = new EditMergeFieldPillEvent({});
        beforeEach(async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
        });
        test('RemoveMergeFieldPillEvent should hide base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEvent);
            await ticks(1);
            expect(getBasePalette(element)).toBeNull();
        });
        test('RemoveMergeFieldPillEvent should show no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEvent);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).not.toBeNull();
        });
        test('RemoveMergeFieldPillEvent should reset record variable', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEvent);
            await ticks(1);
            expect(element.recordVariable).toBe('');
        });
        test('EditMergeFieldPillEvent when pill value is clicked should not show no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(editMergeFieldPillEvent);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).toBeNull();
        });
        test('EditMergeFieldPillEvent when pill value is clicked should keep base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(editMergeFieldPillEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
        });
    });
    describe('Palette content and events handling', () => {
        let allItemsFromPaletteData: Array<ScreenPaletteItem>, eventCallback, palette;
        const getPaletteItemByFieldApiName = (fieldApiName: string): ScreenAutomaticFieldPaletteItem | undefined =>
            (allItemsFromPaletteData as Array<ScreenAutomaticFieldPaletteItem>).find(
                (paletteItem) => paletteItem.apiName === fieldApiName
            );

        beforeEach(async () => {
            const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks();
            palette = getBasePalette(element);
            allItemsFromPaletteData = ([] as Array<ScreenPaletteItem>).concat(
                ...element.paletteData.map((e) => e._children)
            );
        });
        describe('Palette fields filtering', () => {
            // first argument: supportedByAutomaticField flag value, second argument: for test label purpose only
            test.each([
                [true, ''],
                [false, ' NOT']
            ])(
                'when "supportedByAutomaticField" flag is %s, the field is%s in the palette',
                (isSupportedField: boolean) => {
                    const { apiName: fieldApiName } = Object.values<FieldDefinition>(mockAccountFields!).find(
                        (field) => field.supportedByAutomaticField === isSupportedField
                    )!;
                    expect(getPaletteItemByFieldApiName(fieldApiName)).toEqual(
                        isSupportedField ? expect.any(Object) : undefined
                    );
                }
            );
        });

        describe('By field types', () => {
            // first argument: field's fieldDataType, second argument: expected 'internal' field type sent to the event
            const FIELD_DATA_TYPES_CASES = [
                ['BOOLEAN', ScreenFieldName.Checkbox],
                ['DOUBLE', ScreenFieldName.Number],
                ['DATE', ScreenFieldName.Date],
                ['DATETIME', ScreenFieldName.DateTime],
                ['EMAIL', ScreenFieldName.TextBox],
                ['INT', ScreenFieldName.Number],
                ['PHONE', ScreenFieldName.TextBox],
                ['STRING', ScreenFieldName.TextBox],
                ['TEXTAREA', ScreenFieldName.LargeTextArea]
            ];
            const getFieldNameFromFieldDataType = (fieldDataType: string) =>
                SUPPORTED_FIELDS_IN_ACCOUNT.find((field) => field.fieldDataType === fieldDataType)!.apiName;

            describe('Palette click event handling', () => {
                const expectEventCallbackCalledWithTypeNameAndObjectFieldReference = (
                    typeName: string,
                    objectFieldReference: string
                ) => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0].detail.typeName).toEqual(typeName);
                    expect(eventCallback.mock.calls[0][0].detail.objectFieldReference).toEqual(objectFieldReference);
                };

                beforeEach(() => {
                    eventCallback = jest.fn();
                    element.addEventListener(ScreenEditorEventName.AutomaticScreenFieldAdded, eventCallback);
                });
                afterEach(() => {
                    element.removeEventListener(ScreenEditorEventName.AutomaticScreenFieldAdded, eventCallback);
                });

                test.each(FIELD_DATA_TYPES_CASES)(
                    "Palette click event on field of fieldDataType: '%s' should be dispatched with fieldTypeName '%s' and correct objectFieldReference",
                    (fieldDataType: string, expectedEventFieldTypeName: string) => {
                        const fieldName = getFieldNameFromFieldDataType(fieldDataType);
                        const { guid: paletteItemGuid } = getPaletteItemByFieldApiName(fieldName)!;
                        palette.dispatchEvent(new PaletteItemClickedEvent(null, paletteItemGuid));
                        expectEventCallbackCalledWithTypeNameAndObjectFieldReference(
                            expectedEventFieldTypeName,
                            `${accountSObjectVariable.guid}.${fieldName}`
                        );
                    }
                );
            });
            describe('Drag start event handling', () => {
                test.each(FIELD_DATA_TYPES_CASES)(
                    "Drag start event on field of fieldDataType '%s' should transfer with fieldTypeName '%s' and correct objectFieldReference",
                    (fieldDataType: string, expectedEventFieldTypeName: string) => {
                        const fieldName = getFieldNameFromFieldDataType(fieldDataType);
                        const { guid: paletteItemGuid } = getPaletteItemByFieldApiName(fieldName)!;
                        const dragStart = dragStartEvent(JSON.stringify({ key: paletteItemGuid }));
                        palette.dispatchEvent(dragStart);

                        // @ts-ignore
                        const dragStartDataTransfer = dragStart.dataTransfer;
                        expect(dragStartDataTransfer.getData('text')).toBe(
                            JSON.stringify({
                                fieldTypeName: expectedEventFieldTypeName,
                                objectFieldReference: `${accountSObjectVariable.guid}.${fieldName}`
                            })
                        );
                        expect(dragStartDataTransfer.effectAllowed).toBe('copy');
                    }
                );
            });
        });
        describe('Search input place holder', () => {
            const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(
                objectWithAllPossibleFieldsVariable.guid
            );
            beforeEach(async () => {
                getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            });
            it('uses entity label in place holder', () => {
                expect(getSearchInput(element).placeholder).toEqual('Search Object with all possible fields fields...');
            });
        });
    });
});
