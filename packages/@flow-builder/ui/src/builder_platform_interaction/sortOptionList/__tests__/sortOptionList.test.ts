// @ts-nocheck
import { createElement } from 'lwc';
import SortOptionList from 'builder_platform_interaction/sortOptionList';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    AddSortOptionItemEvent,
    DeleteSortOptionItemEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';

const mockEmptySortOption = {
    sortField: { value: null, error: null },
    sortOrder: { value: null, error: null },
    nullsLast: true,
    rowIndex: 'option'
};

const mockSortOption1 = {
    sortField: { value: 'Name', error: null },
    sortOrder: { value: 'Asc', error: null },
    nullsLast: true,
    rowIndex: 'option_1'
};

const mockSortOption2 = {
    sortField: { value: 'AccountNumber', error: null },
    sortOrder: { value: 'Asc', error: null },
    nullsLast: true,
    rowIndex: 'option_2'
};

const mockSortOption3 = {
    sortField: { value: 'PersonBirthdate', error: null },
    sortOrder: { value: 'Desc', error: null },
    nullsLast: true,
    rowIndex: 'option_3'
};

const createComponentUnderTest = ({
    recordEntityName = 'Account',
    isSobject = true,
    sortOptions = [mockEmptySortOption]
} = {}) => {
    const el = createElement('builder_platform_interaction-sort-option-list', {
        is: SortOptionList
    });
    Object.assign(el, { recordEntityName, isSobject, sortOptions });
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/storeLib', () => {
    // this is needed for some reason even if createSelector isn't mocked
    function createSelector() {
        const actual = jest.requireActual('builder_platform_interaction/storeLib');
        return actual.createSelector;
    }
    const storeMockLib = require('builder_platform_interaction_mocks/storeLib');
    storeMockLib.createSelector = createSelector;
    return storeMockLib;
});

let mockAccountFieldsPromise = Promise.resolve(accountFields);

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFieldsPromise)
}));

const getSortOptionList = (sortOptionListComponent) =>
    sortOptionListComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LIST);
const getSortOptionItems = (sortOptionListComponent) =>
    sortOptionListComponent.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.SORT_OPTION_ITEM);
const getFieldPicker = (sortOptionItem) =>
    sortOptionItem.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER);
const getCombobox = (sortOptionItem) =>
    sortOptionItem.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX);
const getCheckbox = (sortOptionItem) =>
    sortOptionItem.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
const getRow = (sortOptionComponent) =>
    sortOptionComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ROW);
const getDeleteIcon = (rowCmp) => rowCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON);
const getAddButton = (sortOptionList) =>
    sortOptionList.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON);

const verifySortOption = (sortOptionItemCmp, sortOption) => {
    const fieldPicker = getFieldPicker(sortOptionItemCmp);
    expect(fieldPicker.value).toEqual(sortOption.sortField.value);
    expect(getCombobox(sortOptionItemCmp).value).toEqual(sortOption.sortOrder.value);
    expect(getCheckbox(sortOptionItemCmp).checked).toEqual(!sortOption.nullsLast);
};

const verifyDeleteIcon = (sortOption, disabled) => {
    const row = getRow(sortOption);
    const deleteIcon = getDeleteIcon(row);
    expect(deleteIcon.disabled).toBe(disabled);
};

const verifyAddButton = (listCmp, disabled) => {
    const addBtn = getAddButton(listCmp);
    expect(addBtn.disabled).toBe(disabled);
};

describe('sort-option-list', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });

    beforeEach(() => {
        mockAccountFieldsPromise = Promise.resolve(accountFields);
    });

    describe('sorting sObject collections', () => {
        let sortOptionList;
        it('show one empty row in sort options', () => {
            sortOptionList = createComponentUnderTest();
            const listCmp = getSortOptionList(sortOptionList);
            expect(listCmp).not.toBeNull();
            const sortOptions = getSortOptionItems(sortOptionList);
            expect(sortOptions).toHaveLength(1);
            verifySortOption(sortOptions[0], mockEmptySortOption);
            verifyDeleteIcon(sortOptions[0], true);
            verifyAddButton(listCmp, false);
        });
        it('show 1 row in options', () => {
            sortOptionList = createComponentUnderTest({
                sortOptions: [mockSortOption1]
            });
            const sortOptions = getSortOptionItems(sortOptionList);
            expect(sortOptions).toHaveLength(1);
            verifySortOption(sortOptions[0], mockSortOption1);
            verifyDeleteIcon(sortOptions[0], true);
            verifyAddButton(getSortOptionList(sortOptionList), false);
        });
        it('show 2 rows in options', () => {
            const mockSortOptions = [mockSortOption1, mockSortOption2];
            sortOptionList = createComponentUnderTest({
                sortOptions: mockSortOptions
            });
            const sortOptions = getSortOptionItems(sortOptionList);
            expect(sortOptions).toHaveLength(mockSortOptions.length);
            mockSortOptions.forEach((mockOption, index) => {
                verifySortOption(sortOptions[index], mockOption);
                verifyDeleteIcon(sortOptions[index], false);
            });
            verifyAddButton(getSortOptionList(sortOptionList), false);
        });
        it('show 3 rows in options', () => {
            const mockSortOptions = [mockSortOption1, mockSortOption2, mockSortOption3];
            sortOptionList = createComponentUnderTest({
                sortOptions: mockSortOptions
            });
            const sortOptions = getSortOptionItems(sortOptionList);
            expect(sortOptions).toHaveLength(mockSortOptions.length);
            mockSortOptions.forEach((mockOption, index) => {
                verifySortOption(sortOptions[index], mockOption);
                verifyDeleteIcon(sortOptions[index], false);
            });
            verifyAddButton(getSortOptionList(sortOptionList), true);
        });
    });
    describe('sorting primitive collections', () => {
        let sortOptionList;
        it('does not show fields', () => {
            sortOptionList = createComponentUnderTest({ isSobject: false });
            expect(getSortOptionList(sortOptionList)).toBeNull();
        });
        it('only shows sort order and checkbox to allow null values on top', () => {
            sortOptionList = createComponentUnderTest({ isSobject: false });
            const sortOptionsItems = getSortOptionItems(sortOptionList);
            expect(sortOptionsItems).toHaveLength(1);
            expect(getCombobox(sortOptionsItems[0]).value).toEqual(mockEmptySortOption.sortOrder.value);
            expect(getCheckbox(sortOptionsItems[0]).checked).toEqual(!mockEmptySortOption.nullsLast);
        });
    });

    describe('handle events', () => {
        let sortOptionList, optionList;
        const mockSortOptions = [mockSortOption1, mockSortOption2];
        beforeEach(() => {
            sortOptionList = createComponentUnderTest({
                sortOptions: mockSortOptions
            });
            optionList = getSortOptionList(sortOptionList);
        });

        it('fires addSortOptionItemEvent', async () => {
            await ticks(1);
            const eventCallback = jest.fn();
            sortOptionList.addEventListener(AddSortOptionItemEvent.EVENT_NAME, eventCallback);
            optionList.dispatchEvent(new AddListItemEvent());
            expect(eventCallback).toHaveBeenCalled();
        });

        it('fires deleteSortOptionItemEvent', async () => {
            const deleteIndex = 1;
            await ticks(1);
            const eventCallback = jest.fn();
            sortOptionList.addEventListener(DeleteSortOptionItemEvent.EVENT_NAME, eventCallback);
            optionList.dispatchEvent(new DeleteListItemEvent(deleteIndex));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: deleteIndex
                }
            });
        });
    });
});
