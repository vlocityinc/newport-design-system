import { createElement } from 'lwc';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';

import {
    AddRecordFilterEvent,
    UpdateRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateListItemEvent
} from 'builder_platform_interaction/events';
import RecordLookupFilter from 'builder_platform_interaction/recordFilter';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const defaultMockFilterItems = [
    {
        operator: { value: '', error: null },
        leftHandSide: { value: '', error: null },
        rightHandSide: { value: '', error: null },
        rightHandSideDataType: { value: '', error: null },
        rowIndex: 'RECORDLOOKUPFILTERITEM_1'
    }
];

const mockDefaultRecordFilter = (
    elementType = ELEMENT_TYPE.RECORD_LOOKUP,
    filterType = RECORD_FILTER_CRITERIA.ALL,
    filterItems = defaultMockFilterItems
) => ({
    filterType,
    recordEntityName: 'Account',
    filterItems,
    recordFields: accountFields,
    elementType
});

const mock3FilterItems = [
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Name', error: null },
        rightHandSide: { value: 'Account Name', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: '326e1b1a-7235-487f-9b44-38db56af4a45'
    },
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Fax', error: null },
        rightHandSide: { value: '012345567', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: '346e1b1a-7235-487f-9b44-38db56af4a45'
    },
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Id', error: null },
        rightHandSide: { value: '{!accountIdVar}', error: null },
        rightHandSideDataType: { value: 'reference', error: null },
        rowIndex: '143e1b1a-7235-487f-9b44-38db56af4a45'
    }
];

const createComponentUnderTest = (elementType, filterType, filterItems) => {
    const el = createElement('builder_platform_interaction-record-filter', {
        is: RecordLookupFilter
    });
    Object.assign(el, mockDefaultRecordFilter(elementType, filterType, filterItems));
    document.body.appendChild(el);
    return el;
};

const createComponentUnderTestForRecordUpdate = createComponentUnderTest.bind(null, ELEMENT_TYPE.RECORD_UPDATE);

const SELECTORS = {
    filterRecordsCombobox: 'lightning-combobox',
    hiddenFilterList: 'builder_platform_interaction-list.slds-hide',
    filterList: 'builder_platform_interaction-list',
    expressionBuilder: 'builder_platform_interaction-field-to-ferov-expression-builder',
    warningIcon: 'lightning-icon',
    warningMessage: 'builder_platform_interaction-rich-label',
    listAddButton: 'lightning-button',
    filterRow: 'builder_platform_interaction-row',
    deleteRowButton: 'lightning-button-icon',
    rowLHSCombobox: 'builder_platform_interaction-combobox'
};

const getFilterRecordsCombobox = recordLookupFilterCmp =>
    recordLookupFilterCmp.shadowRoot.querySelector(SELECTORS.filterRecordsCombobox);
const getFilterList = recordLookupFilterCmp => recordLookupFilterCmp.shadowRoot.querySelector(SELECTORS.filterList);
const getExpressionBuilders = recordLookupFilterCmp =>
    recordLookupFilterCmp.shadowRoot.querySelectorAll(SELECTORS.expressionBuilder);
const getWarningIcon = recordLookupFilterCmp => recordLookupFilterCmp.shadowRoot.querySelector(SELECTORS.warningIcon);
const getWarningMessage = recordLookupFilterCmp =>
    recordLookupFilterCmp.shadowRoot.querySelector(SELECTORS.warningMessage);
const getListAddButton = recordLookupFilterCmp =>
    recordLookupFilterCmp.shadowRoot
        .querySelector(SELECTORS.filterList)
        .shadowRoot.querySelector(SELECTORS.listAddButton);
const getFirstRow = recordLookupFilterCmp =>
    recordLookupFilterCmp.shadowRoot
        .querySelector(SELECTORS.filterList)
        .shadowRoot.querySelector('slot')
        .assignedNodes()[0]
        .querySelector(SELECTORS.filterRow);
const getFirstRowDeleteButton = recordLookupFilterCmp =>
    getFirstRow(recordLookupFilterCmp).shadowRoot.querySelector(SELECTORS.deleteRowButton);

const filterTypeChangeEvent = value => new CustomEvent('change', { detail: { value } });
const clickEvent = new CustomEvent('click');

describe('record-filter', () => {
    describe('Filter records combobox', () => {
        describe('For record lookup', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest(ELEMENT_TYPE.RECORD_LOOKUP, RECORD_FILTER_CRITERIA.NONE);
            });
            it('"No Conditions" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.NONE);
            });
            it('Do not display filter items list', () => {
                expect(getFilterList(element)).toBeNull();
            });
        });
        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordUpdate(RECORD_FILTER_CRITERIA.NONE);
            });
            it('"No Conditions" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.NONE);
            });
            it('Do not display filter items list', () => {
                expect(getFilterList(element)).toBeNull();
            });
        });
    });

    describe('Combobox Labels', () => {
        it('For record lookup', () => {
            const filterRecord = getFilterRecordsCombobox(createComponentUnderTest());
            expect(filterRecord.label).toBe('FlowBuilderRecordEditor.ruleFindingRecords');
        });
        it('For record update', () => {
            const filterRecord = getFilterRecordsCombobox(createComponentUnderTestForRecordUpdate());
            expect(filterRecord.label).toBe('FlowBuilderRecordEditor.criteriaMatchingRecords');
        });
    });

    describe('Combobox options', () => {
        it('For record lookup', () => {
            const filterRecord = getFilterRecordsCombobox(createComponentUnderTest());
            expect(filterRecord.options[0].label).toBe('FlowBuilderRecordEditor.filterNoCriteriaGet');
            expect(filterRecord.options[1].label).toBe('FlowBuilderRecordEditor.filterAllCriterias');
        });
        it('For record update', () => {
            const filterRecord = getFilterRecordsCombobox(createComponentUnderTestForRecordUpdate());
            expect(filterRecord.options[0].label).toBe('FlowBuilderRecordEditor.filterNoCriteriaUpdate');
            expect(filterRecord.options[1].label).toBe('FlowBuilderRecordEditor.filterAllCriterias');
        });
    });

    describe('Warning message', () => {
        let element;
        it('Should display warning icon and message for record lookup if "no conditions" filtering', () => {
            element = createComponentUnderTest(ELEMENT_TYPE.RECORD_LOOKUP, RECORD_FILTER_CRITERIA.NONE);
            expect(getWarningIcon(element)).toBeDefined();
            expect(getWarningMessage(element).label).toBe('FlowBuilderRecordEditor.getAllRecords');
        });
        it('Should display warning icon and message for record update if "no conditions" filtering', () => {
            element = createComponentUnderTestForRecordUpdate(RECORD_FILTER_CRITERIA.NONE);
            expect(getWarningIcon(element)).toBeDefined();
            expect(getWarningMessage(element).label).toBe('FlowBuilderRecordEditor.updateAllRecords');
        });
    });

    describe('When filter type change', () => {
        describe('For record lookup', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest();
            });
            it('Display the filter items list when selecting "Conditions are Met"', async () => {
                getFilterRecordsCombobox(element).dispatchEvent(filterTypeChangeEvent(RECORD_FILTER_CRITERIA.ALL));
                await ticks(1);
                expect(getFilterList(element)).not.toBeNull();
                expect(getExpressionBuilders(element)).toHaveLength(1);
            });
            it('Hide the filter items list when selecting "No Conditions"', async () => {
                mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
                getFilterRecordsCombobox(element).dispatchEvent(filterTypeChangeEvent(RECORD_FILTER_CRITERIA.NONE));
                await ticks(1);
                expect(getFilterList(element)).toBeNull();
            });
        });

        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest();
            });
            it('Display the filter items list when selecting "Conditions are Met"', async () => {
                getFilterRecordsCombobox(element).dispatchEvent(filterTypeChangeEvent(RECORD_FILTER_CRITERIA.ALL));
                await ticks(1);
                expect(getFilterList(element)).not.toBeNull();
                expect(getExpressionBuilders(element)).toHaveLength(1);
            });
            it('Hide the filter items list when selecting "No Conditions"', async () => {
                mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
                getFilterRecordsCombobox(element).dispatchEvent(filterTypeChangeEvent(RECORD_FILTER_CRITERIA.NONE));
                await ticks(1);
                expect(getFilterList(element)).toBeNull();
            });
        });
    });

    describe('Filter Items', () => {
        describe('For record lookup', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest(
                    ELEMENT_TYPE.RECORD_LOOKUP,
                    RECORD_FILTER_CRITERIA.ALL,
                    mock3FilterItems
                );
            });
            it('"Conditions are Met" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.ALL);
            });
            it('Filter items list should be displayed', () => {
                expect(getFilterList(element)).not.toBeNull();
            });
            it('All filter items should be displayed', () => {
                expect(getExpressionBuilders(element)).toHaveLength(3);
            });
            it('passes EqualTo as the default operator', () => {
                expect(getExpressionBuilders(element)[0].defaultOperator).toEqual(RULE_OPERATOR.EQUAL_TO);
            });
        });
        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordUpdate(RECORD_FILTER_CRITERIA.ALL, mock3FilterItems);
            });
            it('"Conditions are Met" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(RECORD_FILTER_CRITERIA.ALL);
            });
            it('Filter items list should be displayed', () => {
                expect(getFilterList(element)).not.toBeNull();
            });
            it('All filter items should be displayed', () => {
                expect(getExpressionBuilders(element)).toHaveLength(3);
            });
            it('passes EqualTo as the default operator', () => {
                expect(getExpressionBuilders(element)[0].defaultOperator).toEqual(RULE_OPERATOR.EQUAL_TO);
            });
        });
    });

    describe('Filter items events dispatch', () => {
        it('fires addRecordFilterEvent', async () => {
            const element = createComponentUnderTest();
            const eventCallback = jest.fn();
            element.addEventListener(AddRecordFilterEvent.EVENT_NAME, eventCallback);
            const addFilterListButton = getListAddButton(element);
            addFilterListButton.dispatchEvent(clickEvent);
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
        });

        it('fires updateRecordFilterEvent', async () => {
            const updateData = {
                index: 0,
                value: 'newValue'
            };
            const element = createComponentUnderTest(
                ELEMENT_TYPE.RECORD_LOOKUP,
                RECORD_FILTER_CRITERIA.ALL,
                mock3FilterItems
            );
            const eventCallback = jest.fn();
            element.addEventListener(UpdateRecordFilterEvent.EVENT_NAME, eventCallback);
            const row = getFirstRow(element);
            row.dispatchEvent(new UpdateListItemEvent(updateData.index, updateData.value));
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: updateData.index,
                    value: updateData.value
                }
            });
        });

        it('fires deleteRecordFilterEvent', async () => {
            const firstRowIndex = 0;
            const element = createComponentUnderTest(
                ELEMENT_TYPE.RECORD_LOOKUP,
                RECORD_FILTER_CRITERIA.ALL,
                mock3FilterItems
            );
            const eventCallback = jest.fn();
            element.addEventListener(DeleteRecordFilterEvent.EVENT_NAME, eventCallback);
            const rowsDeleteButtons = getFirstRowDeleteButton(element);
            rowsDeleteButtons.dispatchEvent(clickEvent);
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: firstRowIndex
                }
            });
        });
    });

    describe('Filterable fields', () => {
        it('should show only filterable fields', () => {
            const element = createComponentUnderTest();
            const filterableFields = Object.values(element.recordFields);
            expect(filterableFields).toContainEqual(
                expect.objectContaining({
                    filterable: true
                })
            );
        });
    });
});
