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
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const mockedSobjectLib = require('builder_platform_interaction_mocks/sobjectLib');
    mockedSobjectLib.fetchFieldsForEntity = jest.fn(mockFetchFieldsForEntity);
    return mockedSobjectLib;
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const {
        ScreenFieldName,
        SCREEN_EDITOR_GUIDS,
        LIGHTNING_INPUT_VARIANTS,
        InputsOnNextNavToAssocScrnOption,
        getFieldByGuid,
        getScreenFieldName
    } = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return {
        setDragFieldValue: jest.fn(),
        ScreenFieldName,
        SCREEN_EDITOR_GUIDS,
        LIGHTNING_INPUT_VARIANTS,
        InputsOnNextNavToAssocScrnOption,
        getFieldByGuid,
        getScreenFieldName
    };
});
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

const TOTAL_SUPPORTED_FIELDS_IN_ACCOUNT = 29;
const TOTAL_SUPPORTED_FIELDS_IN_OBJECT_WIH_ALL_POSSIBLE_FIELDS = 8;
const NB_REQUIRED_FIELDS_IN_OBJECT_WIH_ALL_POSSIBLE_FIELDS = 1;

const STRING_FIELD_NAME = 'SicDesc';
const NUMBER_FIELD_NAME = 'OutstandingShares__c';
const BOOLEAN_FIELD_NAME = 'IsExcludedFromRealign';
const DATE_FIELD_NAME = 'PersonBirthdate';
const DATE_TIME_FIELD_NAME = 'CustomDateTime__c';
const LONG_TEXT_AREA_FIELD_NAME = 'Description';
const CURRENCY_FIELD_NAME = 'AnnualRevenue';
const PHONE_FIELD_NAME = 'Fax';
const EMAIL_FIELD_NAME = 'PersonEmail';
const URL_FIELD_NAME = 'Website';
const FIELD_OF_COMPOUND_FIELD_NAME = 'BillingLongitude';
const ACCOUNT_NAME_FIELD_NAME = 'Name'; // this one is a String but also a compound subfield that we accept

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
            expect(element.paletteData[0]._children).toHaveLength(TOTAL_SUPPORTED_FIELDS_IN_ACCOUNT);
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
            expect(element.paletteData[0]._children).toHaveLength(TOTAL_SUPPORTED_FIELDS_IN_ACCOUNT);
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
            expect(element.paletteData[0]._children).toHaveLength(NB_REQUIRED_FIELDS_IN_OBJECT_WIH_ALL_POSSIBLE_FIELDS);
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette non required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[1]._children).toHaveLength(
                TOTAL_SUPPORTED_FIELDS_IN_OBJECT_WIH_ALL_POSSIBLE_FIELDS -
                    NB_REQUIRED_FIELDS_IN_OBJECT_WIH_ALL_POSSIBLE_FIELDS
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
            test.each`
                fieldName                       | shouldShowUpInThePalette
                ${STRING_FIELD_NAME}            | ${true}
                ${BOOLEAN_FIELD_NAME}           | ${true}
                ${NUMBER_FIELD_NAME}            | ${true}
                ${DATE_FIELD_NAME}              | ${true}
                ${DATE_TIME_FIELD_NAME}         | ${true}
                ${LONG_TEXT_AREA_FIELD_NAME}    | ${true}
                ${ACCOUNT_NAME_FIELD_NAME}      | ${true}
                ${CURRENCY_FIELD_NAME}          | ${false}
                ${PHONE_FIELD_NAME}             | ${false}
                ${EMAIL_FIELD_NAME}             | ${false}
                ${URL_FIELD_NAME}               | ${false}
                ${FIELD_OF_COMPOUND_FIELD_NAME} | ${false}
            `(
                '$fieldName should be present in the palette: $shouldShowUpInThePalette',
                ({ fieldName, shouldShowUpInThePalette }) => {
                    const paletteItem = getPaletteItemByFieldApiName(fieldName)!;
                    if (shouldShowUpInThePalette) {
                        expect(paletteItem).toBeTruthy();
                    } else {
                        expect(paletteItem).toBeUndefined();
                    }
                }
            );
        });
        describe('Palette click event handling', () => {
            const expectEventCallbackCalledWithTypeNameAndObjectFieldReference = (
                typeName: string,
                objectFieldReference: string
            ) => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0].detail.typeName).toEqual(typeName);
                expect(eventCallback.mock.calls[0][0].detail.objectFieldReference).toEqual(objectFieldReference);
            };

            beforeEach(async () => {
                eventCallback = jest.fn();
                element.addEventListener(ScreenEditorEventName.AutomaticScreenFieldAdded, eventCallback);
            });
            afterEach(() => {
                element.removeEventListener(ScreenEditorEventName.AutomaticScreenFieldAdded, eventCallback);
            });
            test.each`
                fieldName                    | expectedEventFieldTypeName       | expectedObjectFieldReference
                ${STRING_FIELD_NAME}         | ${ScreenFieldName.TextBox}       | ${accountSObjectVariable.guid + '.' + STRING_FIELD_NAME}
                ${BOOLEAN_FIELD_NAME}        | ${ScreenFieldName.Checkbox}      | ${accountSObjectVariable.guid + '.' + BOOLEAN_FIELD_NAME}
                ${NUMBER_FIELD_NAME}         | ${ScreenFieldName.Number}        | ${accountSObjectVariable.guid + '.' + NUMBER_FIELD_NAME}
                ${DATE_FIELD_NAME}           | ${ScreenFieldName.Date}          | ${accountSObjectVariable.guid + '.' + DATE_FIELD_NAME}
                ${DATE_TIME_FIELD_NAME}      | ${ScreenFieldName.DateTime}      | ${accountSObjectVariable.guid + '.' + DATE_TIME_FIELD_NAME}
                ${LONG_TEXT_AREA_FIELD_NAME} | ${ScreenFieldName.LargeTextArea} | ${accountSObjectVariable.guid + '.' + LONG_TEXT_AREA_FIELD_NAME}
            `(
                'PaletteItemClickedEvent on $fieldName should dispatch AddAutomaticScreenField event with fieldTypeName: $expectedEventFieldTypeName and objectFieldReference: $expectedObjectFieldReference',
                async ({ fieldName, expectedEventFieldTypeName, expectedObjectFieldReference }) => {
                    const paletteItem = getPaletteItemByFieldApiName(fieldName)!;
                    const event = new PaletteItemClickedEvent(null, paletteItem.guid);
                    palette.dispatchEvent(event);
                    await ticks();
                    expectEventCallbackCalledWithTypeNameAndObjectFieldReference(
                        expectedEventFieldTypeName,
                        expectedObjectFieldReference
                    );
                }
            );
        });
        describe('Drag start event handling', () => {
            test.each`
                fieldName                    | expectedEventFieldTypeName       | expectedObjectFieldReference
                ${STRING_FIELD_NAME}         | ${ScreenFieldName.TextBox}       | ${accountSObjectVariable.guid + '.' + STRING_FIELD_NAME}
                ${BOOLEAN_FIELD_NAME}        | ${ScreenFieldName.Checkbox}      | ${accountSObjectVariable.guid + '.' + BOOLEAN_FIELD_NAME}
                ${NUMBER_FIELD_NAME}         | ${ScreenFieldName.Number}        | ${accountSObjectVariable.guid + '.' + NUMBER_FIELD_NAME}
                ${DATE_FIELD_NAME}           | ${ScreenFieldName.Date}          | ${accountSObjectVariable.guid + '.' + DATE_FIELD_NAME}
                ${DATE_TIME_FIELD_NAME}      | ${ScreenFieldName.DateTime}      | ${accountSObjectVariable.guid + '.' + DATE_TIME_FIELD_NAME}
                ${LONG_TEXT_AREA_FIELD_NAME} | ${ScreenFieldName.LargeTextArea} | ${accountSObjectVariable.guid + '.' + LONG_TEXT_AREA_FIELD_NAME}
            `(
                'DragStart event on $fieldName should transfer fieldTypeName: $expectedEventFieldTypeName and objectFieldReference: $expectedObjectFieldReference as data',
                async ({ fieldName, expectedEventFieldTypeName, expectedObjectFieldReference }) => {
                    const paletteItem = getPaletteItemByFieldApiName(fieldName)!;
                    const dragStart = dragStartEvent(JSON.stringify({ key: paletteItem.guid }));
                    palette.dispatchEvent(dragStart);
                    await ticks();

                    // @ts-ignore
                    const dragStartDatatransfer = dragStart.dataTransfer;
                    expect(dragStartDatatransfer.getData('text')).toBe(
                        JSON.stringify({
                            fieldTypeName: expectedEventFieldTypeName,
                            objectFieldReference: expectedObjectFieldReference
                        })
                    );
                    expect(dragStartDatatransfer.effectAllowed).toBe('copy');
                }
            );
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
