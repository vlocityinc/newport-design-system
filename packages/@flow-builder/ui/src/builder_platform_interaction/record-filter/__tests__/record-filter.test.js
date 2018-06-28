import {createElement} from 'engine';
import { mockAccountFields } from 'mock-server-entity-data';
import { getShadowRoot } from 'lwc-test-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-record-editor-lib';

import {
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
} from 'builder_platform_interaction-events';
import RecordLookupFilter from 'builder_platform_interaction-record-filter';

const mockDefaultRecordFilter = {
    filterType: RECORD_FILTER_CRITERIA.NONE,
    recordEntityName: 'Account',
    filterItems: [{
        operator: {value: '', error: null},
        leftHandSide: {value: '', error: null},
        rightHandSide: {value: '', error: null},
        rightHandSideDataType: {value: '', error: null},
        rowIndex: 'RECORDLOOKUPFILTERITEM_1',
    }],
    recordFields: mockAccountFields,
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
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
    filterRecordsCombobox: 'lightning-combobox',
    hiddenFilterList: 'builder_platform_interaction-list.slds-hide',
    filterList: 'builder_platform_interaction-list',
    expressionBuilder: 'builder_platform_interaction-expression-builder',
    warningIcon: 'lightning-icon',
    warningMessage: 'lightning-formatted-rich-text',
};

const getFilterRecordsCombobox = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelector(selectors.filterRecordsCombobox);
};

const getFilterList = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelector(selectors.filterList);
};

const getHiddenFilterList = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelector(selectors.hiddenFilterList);
};

const getExpressionBuilders = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelectorAll(selectors.expressionBuilder);
};

const getWarningIcon = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelector(selectors.warningIcon);
};

const getWarningMessage = (recordLookupFilterCmp) => {
    return getShadowRoot(recordLookupFilterCmp).querySelector(selectors.warningMessage);
};

class FilterTypeChangeEvent extends CustomEvent {
    constructor(filterType) {
        super('change', { detail: { value: filterType, }});
    }
}

describe('record-filter', () => {
    describe('Filter records combobox', () => {
        let element;
        beforeEach(() => {
            element = createComponentUnderTest();
        });
        it('"All Records (No Criteria)" should be the default selected ', () => {
            expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.NONE);
        });
        it('Do not display filter lists', () => {
            expect(getHiddenFilterList(element)).not.toBeNull();
        });
    });

    describe('Labels', () => {
        let element;
        it('Check filter records combobox label for record lookup', () => {
            element = createComponentUnderTest();
            expect(getFilterRecordsCombobox(element).label).toBe('FlowBuilderRecordEditor.ruleFindingRecords');
        });
        it('Check filter records combobox label for record update', () => {
            mockDefaultRecordFilter.elementType = ELEMENT_TYPE.RECORD_UPDATE;
            element = createComponentUnderTest();
            expect(getFilterRecordsCombobox(element).label).toBe('FlowBuilderRecordEditor.criteriaMatchingRecords');
        });
        it('Check filter records combobox label for record delete', () => {
            mockDefaultRecordFilter.elementType = ELEMENT_TYPE.RECORD_DELETE;
            element = createComponentUnderTest();
            expect(getFilterRecordsCombobox(element).label).toBe('FlowBuilderRecordEditor.criteriaMatchingRecords');
        });
    });

    describe('Warning message', () => {
        let element;
        it('Should not display warning icon for record lookup', () => {
            mockDefaultRecordFilter.elementType = ELEMENT_TYPE.RECORD_LOOKUP;
            element = createComponentUnderTest();
            expect(getWarningIcon(element)).toBeNull();
            expect(getWarningMessage(element)).toBeNull();
        });
        it('Should display warning icon and message for record update', () => {
            mockDefaultRecordFilter.elementType = ELEMENT_TYPE.RECORD_UPDATE;
            element = createComponentUnderTest();
            expect(getWarningIcon(element)).toBeDefined();
            expect(getWarningMessage(element).value).toBe('FlowBuilderRecordEditor.updateAllRecords');
        });
        it('Should display warning icon and message for record delete', () => {
            mockDefaultRecordFilter.elementType = ELEMENT_TYPE.RECORD_DELETE;
            element = createComponentUnderTest();
            expect(getWarningIcon(element)).toBeDefined();
            expect(getWarningMessage(element).value).toBe('FlowBuilderRecordEditor.deleteAllRecords');
        });
    });

    describe('When filter type change', () => {
        let element;
        beforeEach(() => {
            element = createComponentUnderTest();
        });
        it('Display the filter list when selecting "Criteria are Met"', () => {
            getFilterRecordsCombobox(element).dispatchEvent(new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.ALL));
            return Promise.resolve().then(() => {
                expect(getHiddenFilterList(element)).toBeNull();
                expect(getFilterList(element)).not.toBeNull();
                expect(getExpressionBuilders(element)).toHaveLength(1);
            });
        });
        it('Hide the filter list when selecting "All Records ()"', () => {
            mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
            getFilterRecordsCombobox(element).dispatchEvent(new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.NONE));
            return Promise.resolve().then(() => {
                expect(getHiddenFilterList(element)).not.toBeNull();
            });
        });
    });

    describe('Filter Items', () => {
        let element;
        beforeEach(() => {
            mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
            mockDefaultRecordFilter.filterItems = mock3FilterItems;
            element = createComponentUnderTest();
        });
        it('"Criteria are Met" should be the default selected ', () => {
            expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.ALL);
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