// @ts-nocheck
import {
    cachePropertiesForClass,
    getPropertiesForClass,
    setApexClasses
} from 'builder_platform_interaction/apexTypeLib';
import {
    changeEvent,
    checkboxChangeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ComboboxStateChangedEvent, UpdateSortOptionItemEvent } from 'builder_platform_interaction/events';
import { APEX_SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';
import SortOptionItem from 'builder_platform_interaction/sortOptionItem';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';

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

const getFieldPicker = (sortOptionItem) => {
    return sortOptionItem.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER);
};

const getSortOrderCombobox = (sortOptionItem) => {
    return sortOptionItem.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX);
};

const getNullsFirstCheckbox = (sortOptionItem) => {
    return sortOptionItem.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
};

const getSortableFields = (account) => {
    const sortableFields = {};
    const fields = Object.keys(account);
    fields.forEach((field) => {
        if (account[field].sortable) {
            sortableFields[field] = Object.assign({}, account[field]);
        }
    });
    return sortableFields;
};

const getApexClassSortableFields = (apexClassProps) => {
    const sortableFields = {};
    const fields = Object.keys(apexClassProps);
    fields.forEach((field) => {
        if (
            !apexClassProps[field].isCollection &&
            APEX_SORT_COMPATIBLE_TYPES.includes(apexClassProps[field].dataType)
        ) {
            sortableFields[field] = Object.assign({}, apexClassProps[field]);
        }
    });
    return sortableFields;
};

const createComponentUnderTest = ({
    optionIndex = 0,
    sobjectOrApexReference = { value: 'Account', isSObject: true },
    doesPutEmptyStringAndNullFirst = false,
    sortField = '',
    sortFieldIndex = '0',
    sortOrder = '',
    selectedFields = ['Name', 'BillingCity']
} = {}) => {
    const el = createElement('builder_platform_interaction-sort-option-item', {
        is: SortOptionItem
    });
    Object.assign(el, {
        optionIndex,
        sobjectOrApexReference,
        doesPutEmptyStringAndNullFirst,
        sortField,
        sortFieldIndex,
        sortOrder,
        selectedFields
    });
    setDocumentBodyChildren(el);
    return el;
};

let mockAccountFieldsPromise = Promise.resolve(accountFields);

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFieldsPromise),
    getEntity: jest.fn().mockImplementation((entityName) => mockEntities.find(({ apiName }) => apiName === entityName))
}));

describe('sort-option-item', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        mockAccountFieldsPromise = Promise.resolve(accountFields);
    });
    describe('When sorting on sObject collection', () => {
        describe('Load all sortable fields', () => {
            let sortOptionItem;
            beforeEach(() => {
                sortOptionItem = createComponentUnderTest();
            });
            it('contains a field picker', () => {
                const fieldPicker = getFieldPicker(sortOptionItem);
                expect(fieldPicker).toBeDefined();
            });

            it('retrieves fields menu data on initial load that can be sortable', () => {
                const fieldPicker = getFieldPicker(sortOptionItem);
                const fields = Object.keys(fieldPicker.fields);
                expect(fields).toHaveLength(Object.keys(getSortableFields(accountFields)).length - 2); // exclude 'Name', 'BillingCity'
                // check 'Name' and 'BillingCity' are not in fields
                expect(fields).toEqual(expect.not.arrayContaining(['Name']));
                expect(fields).toEqual(expect.not.arrayContaining(['BillingCity']));
            });

            it('contains sort order combobox', () => {
                const sortOrderCombobox = getSortOrderCombobox(sortOptionItem);
                expect(sortOrderCombobox).toBeDefined();
            });

            it('contains a checkbox to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(sortOptionItem);
                expect(nullFirstCheckbox).toBeDefined();
            });
        });

        describe('When it cannot fetch entity fields', () => {
            it('set fields menu data to an empty menu data if it cannot retrieve fields', () => {
                mockAccountFieldsPromise = Promise.reject(Error('Cannot find entity'));
                const sortOptionItem = createComponentUnderTest();
                const fieldPicker = getFieldPicker(sortOptionItem);
                const fields = Object.keys(fieldPicker.fields);
                expect(fields).toHaveLength(0);
            });
        });

        describe('Set the value', () => {
            it('should set field picker value', () => {
                const fieldPicker = getFieldPicker(createComponentUnderTest({ sortField: 'BillingCity' }));
                expect(fieldPicker.value).toEqual('BillingCity');
            });
            it('should set row index for sort field', () => {
                const fieldPicker = getFieldPicker(
                    createComponentUnderTest({ sortField: 'BillingCity', sortFieldIndex: 'idx' })
                );
                expect(fieldPicker.rowIndex).toEqual('idx');
            });
            it('should set sort order', () => {
                const sortOrderCombobox = getSortOrderCombobox(
                    createComponentUnderTest({ sortField: 'BillingCity', sortOrder: 'Asc' })
                );
                expect(sortOrderCombobox.value).toEqual('Asc');
            });
            it('should check to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(
                    createComponentUnderTest({
                        sortField: 'BillingCity',
                        sortOrder: 'Asc',
                        doesPutEmptyStringAndNullFirst: true
                    })
                );
                expect(nullFirstCheckbox.checked).toBeTruthy();
            });
        });
    });

    describe('When sorting on apex collection', () => {
        beforeAll(() => {
            setApexClasses(apexTypesForFlow);
            cachePropertiesForClass('ApexComplexTypeTestOne216');
        });
        afterAll(() => {
            setApexClasses(null);
        });
        describe('Load all sortable fields', () => {
            let sortOptionItem, apexClassProps;
            beforeEach(() => {
                sortOptionItem = createComponentUnderTest({
                    sobjectOrApexReference: { value: 'ApexComplexTypeTestOne216', isApexClass: true }
                });
                apexClassProps = getPropertiesForClass('ApexComplexTypeTestOne216');
            });
            it('contains a field picker', () => {
                const fieldPicker = getFieldPicker(sortOptionItem);
                expect(fieldPicker).toBeDefined();
            });

            it('retrieves fields menu data on initial load that can be sortable', () => {
                const fieldPicker = getFieldPicker(sortOptionItem);
                const fields = Object.keys(fieldPicker.fields);
                expect(fields).toHaveLength(Object.keys(getApexClassSortableFields(apexClassProps)).length);
            });

            it('contains sort order combobox', () => {
                const sortOrderCombobox = getSortOrderCombobox(sortOptionItem);
                expect(sortOrderCombobox).toBeDefined();
            });

            it('contains a checkbox to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(sortOptionItem);
                expect(nullFirstCheckbox).toBeDefined();
            });
        });

        describe('Set the value', () => {
            it('should set field picker value', () => {
                const fieldPicker = getFieldPicker(
                    createComponentUnderTest({
                        sobjectOrApexReference: { value: 'ApexComplexTypeTestOne216', isApexClass: true },
                        sortField: 'name'
                    })
                );
                expect(fieldPicker.value).toEqual('name');
            });
            it('should set sort order', () => {
                const sortOrderCombobox = getSortOrderCombobox(
                    createComponentUnderTest({ sortField: 'name', sortOrder: 'Asc' })
                );
                expect(sortOrderCombobox.value).toEqual('Asc');
            });
            it('should check to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(
                    createComponentUnderTest({
                        sortField: 'name',
                        sortOrder: 'Asc',
                        doesPutEmptyStringAndNullFirst: true
                    })
                );
                expect(nullFirstCheckbox.checked).toBeTruthy();
            });
        });
    });

    describe('When sorting on primitive collection', () => {
        describe('Empty sort option', () => {
            let sortOptionItem;
            beforeEach(() => {
                sortOptionItem = createComponentUnderTest({ sobjectOrApexReference: null });
            });
            it('does not contains a field picker', () => {
                const fieldPicker = getFieldPicker(sortOptionItem);
                expect(fieldPicker).toBeNull();
            });
            it('contains sort order combobox', () => {
                const sortOrderCombobox = getSortOrderCombobox(sortOptionItem);
                expect(sortOrderCombobox).toBeDefined();
            });

            it('contains a checkbox to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(sortOptionItem);
                expect(nullFirstCheckbox).toBeDefined();
            });
        });
        describe('Set the value', () => {
            it('should set sort order', () => {
                const sortOrderCombobox = getSortOrderCombobox(createComponentUnderTest({ sortOrder: 'Asc' }));
                expect(sortOrderCombobox.value).toEqual('Asc');
            });
            it('should check to allow null values on top', () => {
                const nullFirstCheckbox = getNullsFirstCheckbox(
                    createComponentUnderTest({ sortOrder: 'Asc', doesPutEmptyStringAndNullFirst: true })
                );
                expect(nullFirstCheckbox.checked).toBeTruthy();
            });
        });
    });

    describe('Handling value change event ', () => {
        it("should fire 'UpdateSortOptionItemEvent' when sort field combobox changed", async () => {
            const sortOptionItem = createComponentUnderTest();
            const fieldPicker = getFieldPicker(sortOptionItem);
            const newParamValue = 'Fax';
            await ticks(1);
            const eventCallback = jest.fn();
            sortOptionItem.addEventListener(UpdateSortOptionItemEvent.EVENT_NAME, eventCallback);
            fieldPicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { propertyName: 'sortField', optionIndex: 0, value: newParamValue }
            });
        });
        it("should fire 'UpdateSortOptionItemEvent' when sort order combobox changed", async () => {
            const sortOptionItem = createComponentUnderTest();
            const sortOrderCombobox = getSortOrderCombobox(sortOptionItem);
            const newParamValue = 'Asc';
            await ticks(1);
            const eventCallback = jest.fn();
            sortOptionItem.addEventListener(UpdateSortOptionItemEvent.EVENT_NAME, eventCallback);
            sortOrderCombobox.dispatchEvent(changeEvent(newParamValue));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { propertyName: 'sortOrder', optionIndex: 0, value: newParamValue }
            });
        });
        it("should fire 'UpdateSortOptionItemEvent' when nullFirst checkbox checked", async () => {
            const sortOptionItem = createComponentUnderTest();
            const nullFirstCheckbox = getNullsFirstCheckbox(sortOptionItem);
            const checked = true;
            await ticks(1);
            const eventCallback = jest.fn();
            sortOptionItem.addEventListener(UpdateSortOptionItemEvent.EVENT_NAME, eventCallback);
            nullFirstCheckbox.dispatchEvent(checkboxChangeEvent(checked));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { propertyName: 'doesPutEmptyStringAndNullFirst', optionIndex: 0, value: checked }
            });
        });
    });
});
