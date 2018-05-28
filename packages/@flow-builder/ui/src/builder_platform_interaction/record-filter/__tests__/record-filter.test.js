import {createElement} from 'engine';
import { mockAccountFields } from 'mock-server-entity-data';
import { RECORD_LOOKUP_FILTER_CRITERIA } from 'builder_platform_interaction-flow-metadata';
import {
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
} from 'builder_platform_interaction-events';
import RecordLookupFilter from 'builder_platform_interaction-record-filter';

const mockDefaultRecordFilter = {
    filterType: RECORD_LOOKUP_FILTER_CRITERIA.NONE,
    recordEntityName: 'Account',
    filterItems: [{
        operator: {value: '', error: null},
        leftHandSide: {value: '', error: null},
        rightHandSide: {value: '', error: null},
        rightHandSideDataType: {value: '', error: null},
        rowIndex: 'RECORDLOOKUPFILTERITEM_1',
    }],
    recordFields: mockAccountFields,
};

const mock3FilterItems = [{
    operator: {value: 'EqualTo', error: null},
    leftHandSide: {value: 'Account.Description', error: null},
    rightHandSide: {value: 'Account Description', error: null},
    rightHandSideDataType: {value: 'string', error: null},
    rowIndex: 'RECORDLOOKUPFILTERITEM_1',
},
{
    operator: {value: 'EqualTo', error: null},
    leftHandSide: {value: 'Account.Fax', error: null},
    rightHandSide: {value: '012345567', error: null},
    rightHandSideDataType: {value: 'string', error: null},
    rowIndex: 'RECORDLOOKUPFILTERITEM_2',
},
{
    operator: {value: 'EqualTo', error: null},
    leftHandSide: {value: 'Account.Id', error: null},
    rightHandSide: {value: '{!accountIdVar}', error: null},
    rightHandSideDataType: {value: 'reference', error: null},
    rowIndex: 'RECORDLOOKUPFILTERITEM_3',
},
];

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-record-filter', {
        is: RecordLookupFilter
    });
    Object.assign(el, mockDefaultRecordFilter);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    ruleForFindingRecordCombobox: 'lightning-combobox',
    hiddenFilterList: 'builder_platform_interaction-list.slds-hide',
    filterList: 'builder_platform_interaction-list',
    expressionBuilder: 'builder_platform_interaction-expression-builder',
};

const getRuleFindingRecordsCombobox = (recordLookupFilterCmp) => {
    return recordLookupFilterCmp.querySelector(selectors.ruleForFindingRecordCombobox);
};

const getFilterList = (recordLookupFilterCmp) => {
    return recordLookupFilterCmp.querySelector(selectors.filterList);
};

const getHiddenFilterList = (recordLookupFilterCmp) => {
    return recordLookupFilterCmp.querySelector(selectors.hiddenFilterList);
};

const getExpressionBuilders = (recordLookupFilterCmp) => {
    return recordLookupFilterCmp.querySelectorAll(selectors.expressionBuilder);
};

class FilterTypeChangeEvent extends CustomEvent {
    constructor(filterType) {
        super('change', { detail: { value: filterType, }});
    }
}

describe('record-filter', () => {
    describe('Rule for Finding Records', () => {
        let element;
        beforeEach(() => {
            element = createComponentUnderTest();
        });
        it('"All Records (No Criteria)" should be the default selected ', () => {
            expect(getRuleFindingRecordsCombobox(element).value).toBe(RECORD_LOOKUP_FILTER_CRITERIA.NONE);
        });
        it('Do not display filter lists', () => {
            expect(getHiddenFilterList(element)).not.toBeNull();
        });
    });

    describe('When filter type change', () => {
        let element;
        beforeEach(() => {
            element = createComponentUnderTest();
        });
        it('Display the filter list when selecting "Criteria are Met"', () => {
            getRuleFindingRecordsCombobox(element).dispatchEvent(new FilterTypeChangeEvent(RECORD_LOOKUP_FILTER_CRITERIA.ALL));
            return Promise.resolve().then(() => {
                expect(getHiddenFilterList(element)).toBeNull();
                expect(getFilterList(element)).not.toBeNull();
                expect(getExpressionBuilders(element)).toHaveLength(1);
            });
        });
        it('Hide the filter list when selecting "All Records ()"', () => {
            mockDefaultRecordFilter.filterType = RECORD_LOOKUP_FILTER_CRITERIA.ALL;
            getRuleFindingRecordsCombobox(element).dispatchEvent(new FilterTypeChangeEvent(RECORD_LOOKUP_FILTER_CRITERIA.NONE));
            return Promise.resolve().then(() => {
                expect(getHiddenFilterList(element)).not.toBeNull();
            });
        });
    });

    describe('Filter Items', () => {
        let element;
        beforeEach(() => {
            mockDefaultRecordFilter.filterType = RECORD_LOOKUP_FILTER_CRITERIA.ALL;
            mockDefaultRecordFilter.filterItems = mock3FilterItems;
            element = createComponentUnderTest();
        });
        it('"Criteria are Met" should be the default selected ', () => {
            expect(getRuleFindingRecordsCombobox(element).value).toBe(RECORD_LOOKUP_FILTER_CRITERIA.ALL);
        });
        it('Filter list should be displayed', () => {
            expect(getHiddenFilterList(element)).toBeNull();
            expect(getFilterList(element)).not.toBeNull();
        });
        it('All filter items should be displayed', () => {
            expect(getExpressionBuilders(element)).toHaveLength(3);
        });
    });

    describe('handleAddFilter', () => {
        it('fires addRecordLookupFilterEvent', () => {
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(AddRecordLookupFilterEvent.EVENT_NAME, eventCallback);
                const filterList = getFilterList(element);
                filterList.dispatchEvent(new AddRecordLookupFilterEvent());
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });

    describe('handleUpdateFilter', () => {
        it('fires updateRecordLookupFilterEvent', () => {
            const updateData = {
                index: 0,
                value: 'newValue',
            };
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(UpdateRecordLookupFilterEvent.EVENT_NAME, eventCallback);
                const filterList = getFilterList(element);
                filterList.dispatchEvent(new UpdateRecordLookupFilterEvent(updateData.index, updateData.value));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: updateData.index,
                        value: updateData.value,
                    }
                });
            });
        });
    });

    describe('handleDeleteFilter', () => {
        it('fires deleteRecordLookupFilterEvent', () => {
            const deleteIndex = 1;
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteRecordLookupFilterEvent.EVENT_NAME, eventCallback);
                const filterList = getFilterList(element);
                filterList.dispatchEvent(new DeleteRecordLookupFilterEvent(deleteIndex));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: deleteIndex,
                    }
                });
            });
        });
    });
});