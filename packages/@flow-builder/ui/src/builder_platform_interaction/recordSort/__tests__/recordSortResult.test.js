import {createElement} from 'lwc';
import { mockAccountFields, mockAccountExpectedFields } from "mock/recordData";
import RecordSortResult from "builder_platform_interaction/recordSort";
import { getShadowRoot } from 'lwc-test-utils';

const sortValues = {
    ascending: 'Asc',
    descanding: 'Desc',
    notSorted: 'NotSorted',
};

const defaultFieldValue = '';

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetch: (serverActionType, callback) => {
            callback({data : mockAccountFields});
        }
    };
});


const createComponentUnderTest = (resourceApiName, sortOrder, sortField) => {
    const el = createElement('builder_platform_interaction-record-sort', {
        is: RecordSortResult
    });
    if (resourceApiName) {
        el.resourceApiName = resourceApiName;
    }
    if (sortOrder) {
        el.sortOrder = sortOrder;
    }
    if (sortField) {
        el.selectedField = sortField;
    }
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningCombobox: 'lightning-combobox',
    filterHelpText: '#helpText',
};

const getSortOrderCombobox = (recordSortResultComponent) => {
    const lightningComboboxes = getShadowRoot(recordSortResultComponent).querySelectorAll(selectors.lightningCombobox);
    return lightningComboboxes[0];
};

const getFilterCombobox = (recordSortResultComponent) => {
    const lightningComboboxes = getShadowRoot(recordSortResultComponent).querySelectorAll(selectors.lightningCombobox);
    return lightningComboboxes[1];
};

const getFilterHelpText = (recordSortResultComponent) => {
    return getShadowRoot(recordSortResultComponent).querySelector(selectors.filterHelpText);
};

describe('record-sort-result default', () => {
    let recordSortResultComponent;
    let sortOrderCmb;
    beforeEach(() => {
        recordSortResultComponent = createComponentUnderTest(null, sortValues.notSorted);
        sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
    });
    test('sort order list should have 3 options', () => {
        expect(sortOrderCmb.options).toHaveLength(3);
        sortOrderCmb.options.forEach((option, index) => {
            expect(option.value).toEqual(Object.values(sortValues)[index]);
        });
    });
    test('"notSorted" should be the selected sort order', () => {
        expect(sortOrderCmb.value).toBe(sortValues.notSorted);
    });
    test('Filter combobox is not displayed', () => {
        expect(getFilterCombobox(recordSortResultComponent)).not.toBeDefined();
    });
    test('Filter help text is displayed', () => {
        expect(getFilterHelpText(recordSortResultComponent)).not.toBeNull();
    });
    describe('When sort order changes', () => {
        it('fields combobox should be visible when Ascending is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.ascending}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            await Promise.resolve();
            expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
        });
        it('fields combobox should be visible when Descending is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.descanding}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            await Promise.resolve();
            expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
        });
        it('fields combobox should not be visible when Not Sorted is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.notSorted}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            await Promise.resolve();
            expect(getFilterCombobox(recordSortResultComponent)).not.toBeDefined();
        });
    });
});
describe('record-sort With values', () => {
    let recordSortResultComponent;
    test('"Asc" as value, fields combobox should be displayed', () => {
        recordSortResultComponent = createComponentUnderTest('Account', sortValues.ascending);
        expect(getSortOrderCombobox(recordSortResultComponent).value).toBe(sortValues.ascending);
        expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
    });
    test('"Asc" as value, check list of fields is correct', () => {
        recordSortResultComponent = createComponentUnderTest('Account', sortValues.ascending);
        expect(getFilterCombobox(recordSortResultComponent).options).toEqual(mockAccountExpectedFields);
    });
    test('"Asc" and "Description" as value, sort field should be populated', () => {
        const sortField = 'Description';
        recordSortResultComponent = createComponentUnderTest('Account', sortValues.ascending, sortField);
        expect(getFilterCombobox(recordSortResultComponent).value).toEqual(sortField);
    });
    test('"NotSorted" as value, filter combobox should not be displayed', () => {
        recordSortResultComponent = createComponentUnderTest(null, sortValues.notSorted);
        expect(getFilterCombobox(recordSortResultComponent)).not.toBeDefined();
    });
    test('Filter help text is not displayed', () => {
        expect(getFilterHelpText(recordSortResultComponent)).toBeNull();
    });
    describe('field value change', () => {
        test('"Asc" - Should propagate a change event', () => {
            const eventCallback = jest.fn();
            recordSortResultComponent = createComponentUnderTest('Account', sortValues.ascending);
            recordSortResultComponent.addEventListener('change', eventCallback);
            const fieldCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: 'AnnualRevenue'}});
            const fieldCmb = getFilterCombobox(recordSortResultComponent);
            fieldCmb.dispatchEvent(fieldCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: 'AnnualRevenue', sortOrder: sortValues.ascending});
        });
        test('"Desc" - Should propagate a change event', () => {
            const eventCallback = jest.fn();
            recordSortResultComponent = createComponentUnderTest('Account', sortValues.descanding);
            recordSortResultComponent.addEventListener('change', eventCallback);
            const fieldCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: 'AnnualRevenue'}});
            const fieldCmb = getFilterCombobox(recordSortResultComponent);
            fieldCmb.dispatchEvent(fieldCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: 'AnnualRevenue', sortOrder: sortValues.descanding});
        });
    });
    describe('sort order changes', () => {
        test('to "Asc" should propagate a change event', () => {
            const eventCallback = jest.fn();
            recordSortResultComponent = createComponentUnderTest('Account', null);
            recordSortResultComponent.addEventListener('change', eventCallback);
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.ascending}});
            const sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: defaultFieldValue, sortOrder: sortValues.ascending});
        });
        test('to "Desc" should propagate a change event', () => {
            const eventCallback = jest.fn();
            recordSortResultComponent = createComponentUnderTest('Account', null);
            recordSortResultComponent.addEventListener('change', eventCallback);
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.descanding}});
            const sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: defaultFieldValue, sortOrder: sortValues.descanding});
        });
        test('to "notSorted" should propagate a change event', () => {
            const eventCallback = jest.fn();
            recordSortResultComponent = createComponentUnderTest('Account', null);
            recordSortResultComponent.addEventListener('change', eventCallback);
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: sortValues.notSorted}});
            const sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({fieldApiName: defaultFieldValue, sortOrder: sortValues.notSorted});
        });
    });
    describe('sortable fields', () => {
        it('should show only sortable fields', () => {
            recordSortResultComponent = createComponentUnderTest('Account', sortValues.ascending);
            const options = getFilterCombobox(recordSortResultComponent).options;
            const mockAccFieldsArr = JSON.parse(mockAccountFields);
            options.forEach(option => {
                expect(mockAccFieldsArr.find(field => field.apiName === option.value).sortable).toBeTruthy();
            });
        });
    });
});