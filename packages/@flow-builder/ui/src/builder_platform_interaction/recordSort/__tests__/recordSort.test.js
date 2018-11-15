import {createElement} from 'lwc';
import { mockAccountFields, mockAccountExpectedFields } from "mock/recordData";
import RecordSortResult from "builder_platform_interaction/recordSort";
import { getShadowRoot } from 'lwc-test-utils';
import { ComboboxStateChangedEvent } from "builder_platform_interaction/events";
import { SORT_ORDER } from "builder_platform_interaction/recordEditorLib";
import { until } from 'builder_platform_interaction/builderTestUtils';

let mockEntityFieldsPromise = Promise.resolve(mockAccountFields);

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: () => {
            return mockEntityFieldsPromise;
        }
    };
});

const resourceApiName = 'Account';
const selectedField = 'Description';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-record-sort', {
        is: RecordSortResult
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningCombobox: 'lightning-combobox',
    filterHelpText: '.helpText',
    fieldPicker: 'builder_platform_interaction-field-picker',
};

const getSortOrderCombobox = (recordSortResultComponent) => {
    return getShadowRoot(recordSortResultComponent).querySelector(selectors.lightningCombobox);
};

const getFilterCombobox = (recordSortResultComponent) => {
    return getShadowRoot(recordSortResultComponent).querySelector(selectors.fieldPicker);
};

const getFilterHelpText = (recordSortResultComponent) => {
    return getShadowRoot(recordSortResultComponent).querySelector(selectors.filterHelpText);
};

describe('recordSort', () => {
    afterEach(() => {
        mockEntityFieldsPromise = Promise.resolve(mockAccountFields);
    });
    describe('default', () => {
        let recordSortResultComponent, sortOrderCmb;
        beforeEach(() => {
            recordSortResultComponent = createComponentUnderTest({
                sortOrder: SORT_ORDER.NOT_SORTED,
            });
            sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
        });
        it('sort order list should have all the options', () => {
            expect(sortOrderCmb.options).toHaveLength(Object.values(SORT_ORDER).length);
        });
        it('"notSorted" should be the selected sort order', () => {
            expect(sortOrderCmb.value).toBe(SORT_ORDER.NOT_SORTED);
        });
        it('Filter combobox is not displayed', () => {
            expect(getFilterCombobox(recordSortResultComponent)).toBeNull();
        });
        it('Filter help text is displayed', () => {
            expect(getFilterHelpText(recordSortResultComponent)).not.toBeNull();
        });
    });
    describe('when values are populated', () => {
        let recordSortResultComponent, sortOrderCmb;
        beforeEach(() => {
            recordSortResultComponent = createComponentUnderTest({
                resourceApiName,
                sortOrder: SORT_ORDER.ASC,
                selectedField,
            });
            sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
        });
        it('fields combobox should be displayed with correct fields', async () => {
            expect(getSortOrderCombobox(recordSortResultComponent).value).toBe(SORT_ORDER.ASC);
            expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
            expect(Object.keys(getFilterCombobox(recordSortResultComponent).fields)).toHaveLength(mockAccountExpectedFields.length);
        });
        it('"Description" as value, sort field should be populated', () => {
            expect(getFilterCombobox(recordSortResultComponent).value).toEqual(selectedField);
        });
        it('Filter help text is not displayed', () => {
            expect(getFilterHelpText(recordSortResultComponent)).toBeNull();
        });
        it('field value change should propagate a change event', () => {
            const eventCallback = jest.fn();
            const sortField = "Annual Revenue";
            recordSortResultComponent.addEventListener('change', eventCallback);
            const fieldCmbChangeEventForAscending = new ComboboxStateChangedEvent(null, sortField);
            const fieldCmb = getFilterCombobox(recordSortResultComponent);
            fieldCmb.dispatchEvent(fieldCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: sortField, sortOrder: SORT_ORDER.ASC});
        });
        it('fields combobox should be visible when Ascending is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: SORT_ORDER.ASC}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            return Promise.resolve().then(() => {
                expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
            });
        });
        it('fields combobox should be visible when Descending is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: SORT_ORDER.DESC}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            return Promise.resolve().then(() => {
                expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
            });
        });
        it('error is shown on the sort by field, if one exists', () => {
            const sortFieldError = 'Invalid field';
            recordSortResultComponent = createComponentUnderTest({
                resourceApiName,
                sortOrder: SORT_ORDER.ASC,
                selectedField,
                sortFieldError,
            });
            expect(getFilterCombobox(recordSortResultComponent).errorMessage).toEqual(sortFieldError);
        });
    });
    describe('when entity fields cannot be loaded', () => {
        let recordSortResultComponent;
        beforeEach(() => {
            mockEntityFieldsPromise = Promise.reject(Error('Cannot get fields'));
            recordSortResultComponent = createComponentUnderTest({
                resourceApiName,
                sortOrder: SORT_ORDER.ASC,
                selectedField,
            });
        });
        it('fields combobox should be empty', async () => {
            expect(getSortOrderCombobox(recordSortResultComponent).value).toBe(SORT_ORDER.ASC);
            expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
            expect(Object.keys(getFilterCombobox(recordSortResultComponent).fields)).toHaveLength(0);
        });
    });
    describe('sort order changes', () => {
        it('to "Asc" should propagate a change event if sort field has not been defined', () => {
            const eventCallback = jest.fn();
            const recordSortResultComponent = createComponentUnderTest();
            recordSortResultComponent.addEventListener('change', eventCallback);
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: SORT_ORDER.ASC}});
            const sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: undefined, sortOrder: SORT_ORDER.ASC});
        });
        it('to "Asc" should propagate a change event if sort field has been defined', () => {
            const eventCallback = jest.fn();
            const recordSortResultComponent = createComponentUnderTest({
                resourceApiName,
                sortOrder: SORT_ORDER.DESC,
                selectedField,
            });
            recordSortResultComponent.addEventListener('change', eventCallback);
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: SORT_ORDER.ASC}});
            const sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: selectedField, sortOrder: SORT_ORDER.ASC});
        });
    });
    describe('sortable fields', () => {
        it('should show only sortable fields', async () => {
            const recordSortResultComponent = createComponentUnderTest({
                resourceApiName,
                sortOrder: SORT_ORDER.ASC,
            });
            const options = await until(() => getFilterCombobox(recordSortResultComponent).fields);
            const mockAccFieldsArr = JSON.parse(mockAccountFields);
            Object.values(options).forEach(option => {
                expect(mockAccFieldsArr.find(field => field.apiName === option.apiName).sortable).toBeTruthy();
            });
        });
    });
});