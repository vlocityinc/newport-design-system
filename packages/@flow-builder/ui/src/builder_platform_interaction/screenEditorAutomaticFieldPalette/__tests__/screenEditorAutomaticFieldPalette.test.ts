import ScreenEditorAutomaticFieldPalette from '../screenEditorAutomaticFieldPalette';
import { createElement } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel, accountSObjectVariable } from 'mock/storeData';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import {
    SObjectReferenceChangedEvent,
    RemoveMergeFieldPillEvent,
    EditMergeFieldPillEvent,
    PaletteItemClickedEvent,
    SCREEN_EDITOR_EVENT_NAME
} from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn(() => {
        return Promise.resolve(mockAccountFields);
    })
}));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const TOTAL_SUPPORTED_FIELDS = 71;
const NB_REQUIRED_FIELDS = 4;
const STRING_FIELD_NAME = 'Name';
const NUMBER_FIELD_NAME = 'BillingLongitude';
const BOOLEAN_FIELD_NAME = 'IsExcludedFromRealign';
const DATE_FIELD_NAME = 'PersonBirthdate';
const DATE_TIME_FIELD_NAME = 'CustomDateTime__c';

const SELECTORS = {
    searchInput: '.palette-search-input'
};

const getSObjectOrSObjectCollectionPicker = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
    );

const getBasePalette = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LEFT_PANEL_PALETTE);

const getNoItemToShowIllustration = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ILLUSTRATION);

const getSearchInput = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(SELECTORS.searchInput);

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-screen-editor-automatic-field-palette', {
        is: ScreenEditorAutomaticFieldPalette
    });
    document.body.appendChild(el);
    return el;
}

describe('Screen editor automatic field palette', () => {
    let element: ScreenEditorAutomaticFieldPalette;
    beforeEach(() => {
        element = createComponentForTest();
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
    });

    describe('Event handling related to search', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
        beforeEach(async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
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
            expect(element.entityFields).toEqual(mockAccountFields);
        });
        test('SObjectReferenceChangedEvent should generate proper data with 2 sections for inner palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData).toHaveLength(2);
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette first required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(NB_REQUIRED_FIELDS);
        });
        test('SObjectReferenceChangedEvent should generate proper items for palette second section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[1]._children).toHaveLength(TOTAL_SUPPORTED_FIELDS - NB_REQUIRED_FIELDS);
        });
        test('SObjectReferenceChangedEvent should hide no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).toBeNull();
        });
        test('SObjectReferenceChangedEvent should display base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
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
        test('SObjectReferenceChangedEvent with same value still displays base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
        });
        test('SObjectReferenceChangedEvent with same value still generate proper items for palette first required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(NB_REQUIRED_FIELDS);
        });
        test('SObjectReferenceChangedEvent with same value still generate proper items for palette second section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[1]._children).toHaveLength(TOTAL_SUPPORTED_FIELDS - NB_REQUIRED_FIELDS);
        });
        test('SObjectReferenceChangedEvent with same value keeps the search pattern as is', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            element.searchPattern = 'name';
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.searchPattern).toEqual('name');
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
    describe('Palette click event handling', () => {
        let allItemsFromPaletteData: Array<PaletteItem>, eventCallback, palette;
        const getPaletteItemByFieldApiName = (fieldApiName: string): PaletteItem | undefined => {
            return allItemsFromPaletteData.find((paletteItem) => paletteItem.apiName === fieldApiName);
        };
        const expectEventCallbackCalledWithTypeNameAndObjectFieldReference = (
            typeName: string,
            objectFieldReference: string
        ) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.typeName).toEqual(typeName);
            expect(eventCallback.mock.calls[0][0].detail.objectFieldReference).toEqual(objectFieldReference);
        };

        beforeEach(async () => {
            const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(accountSObjectVariable.guid);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks();
            palette = getBasePalette(element);
            allItemsFromPaletteData = [];
            allItemsFromPaletteData.push(...element.paletteData[0]._children);
            allItemsFromPaletteData.push(...element.paletteData[1]._children);
            eventCallback = jest.fn();
            element.addEventListener(SCREEN_EDITOR_EVENT_NAME.AUTOMATIC_SCREEN_FIELD_ADDED, eventCallback);
        });
        afterEach(() => {
            element.removeEventListener(SCREEN_EDITOR_EVENT_NAME.AUTOMATIC_SCREEN_FIELD_ADDED, eventCallback);
        });
        it.each`
            fieldName               | expectedEventFieldTypeName  | expectedObjectFieldReference
            ${STRING_FIELD_NAME}    | ${ScreenFieldName.TextBox}  | ${accountSObjectVariable.guid + '.' + STRING_FIELD_NAME}
            ${BOOLEAN_FIELD_NAME}   | ${ScreenFieldName.Checkbox} | ${accountSObjectVariable.guid + '.' + BOOLEAN_FIELD_NAME}
            ${NUMBER_FIELD_NAME}    | ${ScreenFieldName.Number}   | ${accountSObjectVariable.guid + '.' + NUMBER_FIELD_NAME}
            ${DATE_FIELD_NAME}      | ${ScreenFieldName.Date}     | ${accountSObjectVariable.guid + '.' + DATE_FIELD_NAME}
            ${DATE_TIME_FIELD_NAME} | ${ScreenFieldName.DateTime} | ${accountSObjectVariable.guid + '.' + DATE_TIME_FIELD_NAME}
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
});
