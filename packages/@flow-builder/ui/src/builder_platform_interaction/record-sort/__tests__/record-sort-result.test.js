import {createElement} from 'engine';
import { mockAccountFields, mockAccountExpectedFields } from 'mock-record-data';
import RecordSortResult from 'builder_platform_interaction-record-sort';

const sortValues = {
    notSorted: 'NotSorted',
    ascending: 'Asc',
    descanding: 'Desc'
};

const defaultFieldValue = '';

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction-server-data-lib', () => {
    const actual = require.requireActual('builder_platform_interaction-server-data-lib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetch: (serverActionType, callback) => {
            callback({data : mockAccountFields});
        }
    };
});


const createComponentUnderTest = (resourceApiName, sortOrder) => {
    const el = createElement('builder_platform_interaction-record-sort', {
        is: RecordSortResult
    });
    if (resourceApiName) {
        el.resourceApiName = resourceApiName;
    }
    if (sortOrder) {
        el.sortOrder = sortOrder;
    }
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningCombobox: 'lightning-combobox'
};

const getSortOrderCombobox = (recordSortResultComponent) => {
    const lightningComboboxes = recordSortResultComponent.querySelectorAll(selectors.lightningCombobox);
    return lightningComboboxes[0];
};

const getFilterCombobox = (recordSortResultComponent) => {
    const lightningComboboxes = recordSortResultComponent.querySelectorAll(selectors.lightningCombobox);
    return lightningComboboxes[1];
};

describe('record-sort-result default', () => {
    let recordSortResultComponent;
    let sortOrderCmb;
    beforeEach(() => {
        recordSortResultComponent = createComponentUnderTest(null, null);
        sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
    });
    test('"notSorted" should be the selected sort order', () => {
        expect(sortOrderCmb.value).toBe(sortValues.notSorted);
    });
    test('Filter combobox is displayed', () => {
        expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
    });
    test('Filter combobox value should be empty by default', () => {
        expect(getFilterCombobox(recordSortResultComponent).value).toBe('');
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
    test('"NotSorted" as value, filter combobox should not be displayed', () => {
        recordSortResultComponent = createComponentUnderTest(null, sortValues.notSorted);
        expect(getFilterCombobox(recordSortResultComponent)).not.toBeDefined();
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
});