import {createElement} from 'engine';
import RecordSortResult from 'builder_platform_interaction-record-sort';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-record-sort', {
        is: RecordSortResult
    });
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

describe('record-sort-result', () => {
    let recordSortResultComponent;
    let sortOrderCmb;
    beforeEach(() => {
        recordSortResultComponent = createComponentUnderTest();
        sortOrderCmb = getSortOrderCombobox(recordSortResultComponent);
    });
    describe('default', () => {
        test('"Default" should be the selected sort order', () => {
            expect(sortOrderCmb.value).toBe('Default');
        });
        test('Filter combobox is not displayed', () => {
            expect(getFilterCombobox(recordSortResultComponent)).not.toBeDefined();
        });
    });
    describe('When sort order changes', () => {
        it('Filter combobox should be visible when Ascending is selected', async () => {
            const sortOrderCmbChangeEventForAscending = new CustomEvent('change', {detail: {value: 'Asc'}});
            sortOrderCmb.dispatchEvent(sortOrderCmbChangeEventForAscending);
            await Promise.resolve();
            expect(getFilterCombobox(recordSortResultComponent)).toBeDefined();
        });
    });
});