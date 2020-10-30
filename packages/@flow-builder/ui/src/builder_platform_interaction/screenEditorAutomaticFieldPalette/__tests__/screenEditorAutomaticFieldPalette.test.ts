import ScreenEditorAutomaticFieldPalette from 'builder_platform_interaction/screenEditorAutomaticFieldPalette';
import { createElement } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { SObjectReferenceChangedEvent, RemoveMergeFieldPillEvent } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import * as storeMockedData from 'mock/storeData';
import { accountFields as mockAccountField } from 'serverData/GetFieldsForEntity/accountFields.json';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn(() => {
        return Promise.resolve(mockAccountField);
    })
}));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const SELECTORS = {
    noFieldToShowIllustration: 'builder_platform_interaction-illustration'
};

const getSObjectOrSObjectCollectionPicker = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
    );

const getBasePalette = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LEFT_PANEL_PALETTE);

const getNoItemToShowIllustration = (screenEditorAutomaticFieldPalette) =>
    screenEditorAutomaticFieldPalette.shadowRoot.querySelector(SELECTORS.noFieldToShowIllustration);

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-screen-editor-automatic-field-palette', {
        is: ScreenEditorAutomaticFieldPalette
    });
    document.body.appendChild(el);
    return el;
}

describe('Screen editor automatic field palette', () => {
    let element;
    beforeEach(async () => {
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
    describe('Event handling ', () => {
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(
            storeMockedData.accountSObjectVariable.guid
        );
        const removeMergeFieldPillEventWithXClick = new RemoveMergeFieldPillEvent({}, true);
        const removeMergeFieldPillEventWithoutXClick = new RemoveMergeFieldPillEvent({}, false);
        it('SObjectReferenceChangedEvent should update properly recordVariable', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.recordVariable).toEqual(storeMockedData.accountSObjectVariable.guid);
        });
        it('SObjectReferenceChangedEvent should load properly entityFields', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.entityFields).toEqual(mockAccountField);
        });
        it('SObjectReferenceChangedEvent should generate proper data with 2 sections for inner palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData).toHaveLength(2);
        });
        it('SObjectReferenceChangedEvent should generate proper items for palette first required section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[0]._children).toHaveLength(4);
        });
        it('SObjectReferenceChangedEvent should generate proper items for palette second section', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.paletteData[1]._children).toHaveLength(67);
        });
        it('SObjectReferenceChangedEvent should hide no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).toBeNull();
        });
        it('SObjectReferenceChangedEvent should display base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(getBasePalette(element)).not.toBeNull();
        });
        it('RemoveMergeFieldPillEvent when X is clicked should hide base palette', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEventWithXClick);
            await ticks(1);
            expect(getBasePalette(element)).toBeNull();
        });
        it('RemoveMergeFieldPillEvent when X is clicked should show no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEventWithXClick);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).not.toBeNull();
        });
        it('RemoveMergeFieldPillEvent when pill value is clicked should not show no items to show illustration', async () => {
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(removeMergeFieldPillEventWithoutXClick);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).toBeNull();
        });
        it('SObjectReferenceChangedEvent with error should keep illustration visible', async () => {
            const sObjectReferenceChangedEventwithError = new SObjectReferenceChangedEvent(
                'myCrazyValue',
                'Enter a valid value.'
            );
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEventwithError);
            await ticks(1);
            expect(getNoItemToShowIllustration(element)).not.toBeNull();
        });
        it('Search pattern should be reset after sObject change', async () => {
            element.searchPattern = 'name';
            getSObjectOrSObjectCollectionPicker(element).dispatchEvent(sObjectReferenceChangedEvent);
            await ticks(1);
            expect(element.searchPattern).toEqual('');
        });
    });
});
