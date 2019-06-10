import { createElement } from 'lwc';
import { mockAccountFields } from 'mock/serverEntityData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';

import {
    AddRecordFilterEvent,
    UpdateRecordFilterEvent,
    DeleteRecordFilterEvent
} from 'builder_platform_interaction/events';
import RecordLookupFilter from 'builder_platform_interaction/recordFilter';

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
    recordFields: mockAccountFields,
    elementType
});

const mock3FilterItems = [
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Name', error: null },
        rightHandSide: { value: 'Account Name', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'RECORDLOOKUPFILTERITEM_1'
    },
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Fax', error: null },
        rightHandSide: { value: '012345567', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'RECORDLOOKUPFILTERITEM_2'
    },
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.Id', error: null },
        rightHandSide: { value: '{!accountIdVar}', error: null },
        rightHandSideDataType: { value: 'reference', error: null },
        rowIndex: 'RECORDLOOKUPFILTERITEM_3'
    }
];

const createComponentUnderTest = (elementType, filterType, filterItems) => {
    const el = createElement('builder_platform_interaction-record-filter', {
        is: RecordLookupFilter
    });
    Object.assign(
        el,
        mockDefaultRecordFilter(elementType, filterType, filterItems)
    );
    document.body.appendChild(el);
    return el;
};

const createComponentUnderTestForRecordUpdate = createComponentUnderTest.bind(
    null,
    ELEMENT_TYPE.RECORD_UPDATE
);
const createComponentUnderTestForRecordDelete = createComponentUnderTest.bind(
    null,
    ELEMENT_TYPE.RECORD_DELETE
);

const selectors = {
    filterRecordsCombobox: 'lightning-combobox',
    hiddenFilterList: 'builder_platform_interaction-list.slds-hide',
    filterList: 'builder_platform_interaction-list',
    expressionBuilder:
        'builder_platform_interaction-field-to-ferov-expression-builder',
    warningIcon: 'lightning-icon',
    warningMessage: 'builder_platform_interaction-rich-label'
};

const getFilterRecordsCombobox = recordLookupFilterCmp => {
    return recordLookupFilterCmp.shadowRoot.querySelector(
        selectors.filterRecordsCombobox
    );
};

const getFilterList = recordLookupFilterCmp => {
    return recordLookupFilterCmp.shadowRoot.querySelector(selectors.filterList);
};

const getExpressionBuilders = recordLookupFilterCmp => {
    return recordLookupFilterCmp.shadowRoot.querySelectorAll(
        selectors.expressionBuilder
    );
};

const getWarningIcon = recordLookupFilterCmp => {
    return recordLookupFilterCmp.shadowRoot.querySelector(
        selectors.warningIcon
    );
};

const getWarningMessage = recordLookupFilterCmp => {
    return recordLookupFilterCmp.shadowRoot.querySelector(
        selectors.warningMessage
    );
};

class FilterTypeChangeEvent extends CustomEvent {
    constructor(filterType) {
        super('change', { detail: { value: filterType } });
    }
}

describe('record-filter', () => {
    describe('Filter records combobox', () => {
        describe('For record lookup', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest(
                    ELEMENT_TYPE.RECORD_LOOKUP,
                    RECORD_FILTER_CRITERIA.NONE
                );
            });
            it('"No Conditions" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.NONE
                );
            });
            it('Do not display filter items list', () => {
                expect(getFilterList(element)).toBeNull();
            });
        });
        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordUpdate(
                    RECORD_FILTER_CRITERIA.NONE
                );
            });
            it('"No Conditions" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.NONE
                );
            });
            it('Do not display filter items list', () => {
                expect(getFilterList(element)).toBeNull();
            });
        });
        describe('For record delete', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordDelete();
            });
            it('"All criteria" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.ALL
                );
            });
            it('Should display filter items list', () => {
                expect(getFilterList(element)).toBeDefined();
            });
        });
    });

    describe('Combobox Labels', () => {
        it('For record lookup', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTest()
            );
            expect(filterRecord.label).toBe(
                'FlowBuilderRecordEditor.ruleFindingRecords'
            );
        });
        it('For record update', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTestForRecordUpdate()
            );
            expect(filterRecord.label).toBe(
                'FlowBuilderRecordEditor.criteriaMatchingRecords'
            );
        });
        it('For record delete', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTestForRecordDelete(
                    RECORD_FILTER_CRITERIA.ALL
                )
            );
            expect(filterRecord.label).toBe(
                'FlowBuilderRecordEditor.criteriaMatchingRecords'
            );
        });
    });

    describe('Combobox options', () => {
        it('For record lookup', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTest()
            );
            expect(filterRecord.options[0].label).toBe(
                'FlowBuilderRecordEditor.filterNoCriteriaGet'
            );
            expect(filterRecord.options[1].label).toBe(
                'FlowBuilderRecordEditor.filterAllCriterias'
            );
        });
        it('For record update', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTestForRecordUpdate()
            );
            expect(filterRecord.options[0].label).toBe(
                'FlowBuilderRecordEditor.filterNoCriteriaUpdate'
            );
            expect(filterRecord.options[1].label).toBe(
                'FlowBuilderRecordEditor.filterAllCriterias'
            );
        });
        it('For record delete', () => {
            const filterRecord = getFilterRecordsCombobox(
                createComponentUnderTestForRecordDelete(
                    RECORD_FILTER_CRITERIA.ALL
                )
            );
            expect(filterRecord.options[0].label).toBe(
                'FlowBuilderRecordEditor.filterAllCriterias'
            );
        });
    });

    describe('Warning message', () => {
        let element;
        it('Should not display warning icon for record lookup if "no conditions" filtering', () => {
            element = createComponentUnderTest(
                ELEMENT_TYPE.RECORD_LOOKUP,
                RECORD_FILTER_CRITERIA.NONE
            );
            expect(getWarningIcon(element)).toBeNull();
            expect(getWarningMessage(element)).toBeNull();
        });
        it('Should display warning icon and message for record update if "no conditions" filtering', () => {
            element = createComponentUnderTestForRecordUpdate(
                RECORD_FILTER_CRITERIA.NONE
            );
            expect(getWarningIcon(element)).toBeDefined();
            expect(getWarningMessage(element).label).toBe(
                'FlowBuilderRecordEditor.updateAllRecords'
            );
        });
        it('Should not display warning icon and message for record delete as no criteria disallowed', () => {
            element = createComponentUnderTestForRecordDelete(
                RECORD_FILTER_CRITERIA.ALL
            );
            expect(getWarningIcon(element)).toBeNull();
        });
    });

    describe('When filter type change', () => {
        describe('For record lookup', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest();
            });
            it('Display the filter items list when selecting "Conditions are Met"', () => {
                getFilterRecordsCombobox(element).dispatchEvent(
                    new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.ALL)
                );
                return Promise.resolve().then(() => {
                    expect(getFilterList(element)).not.toBeNull();
                    expect(getExpressionBuilders(element)).toHaveLength(1);
                });
            });
            it('Hide the filter items list when selecting "No Conditions"', () => {
                mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
                getFilterRecordsCombobox(element).dispatchEvent(
                    new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.NONE)
                );
                return Promise.resolve().then(() => {
                    expect(getFilterList(element)).toBeNull();
                });
            });
        });

        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTest();
            });
            it('Display the filter items list when selecting "Conditions are Met"', () => {
                getFilterRecordsCombobox(element).dispatchEvent(
                    new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.ALL)
                );
                return Promise.resolve().then(() => {
                    expect(getFilterList(element)).not.toBeNull();
                    expect(getExpressionBuilders(element)).toHaveLength(1);
                });
            });
            it('Hide the filter items list when selecting "No Conditions"', () => {
                mockDefaultRecordFilter.filterType = RECORD_FILTER_CRITERIA.ALL;
                getFilterRecordsCombobox(element).dispatchEvent(
                    new FilterTypeChangeEvent(RECORD_FILTER_CRITERIA.NONE)
                );
                return Promise.resolve().then(() => {
                    expect(getFilterList(element)).toBeNull();
                });
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
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.ALL
                );
            });
            it('Filter items list should be displayed', () => {
                expect(getFilterList(element)).not.toBeNull();
            });
            it('All filter items should be displayed', () => {
                expect(getExpressionBuilders(element)).toHaveLength(3);
            });
            it('passes EqualTo as the default operator', () => {
                expect(
                    getExpressionBuilders(element)[0].defaultOperator
                ).toEqual(RULE_OPERATOR.EQUAL_TO);
            });
        });
        describe('For record update', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordUpdate(
                    RECORD_FILTER_CRITERIA.ALL,
                    mock3FilterItems
                );
            });
            it('"Conditions are Met" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.ALL
                );
            });
            it('Filter items list should be displayed', () => {
                expect(getFilterList(element)).not.toBeNull();
            });
            it('All filter items should be displayed', () => {
                expect(getExpressionBuilders(element)).toHaveLength(3);
            });
            it('passes EqualTo as the default operator', () => {
                expect(
                    getExpressionBuilders(element)[0].defaultOperator
                ).toEqual(RULE_OPERATOR.EQUAL_TO);
            });
        });
        describe('For record delete', () => {
            let element;
            beforeEach(() => {
                element = createComponentUnderTestForRecordDelete(
                    RECORD_FILTER_CRITERIA.ALL,
                    mock3FilterItems
                );
            });
            it('"Conditions are Met" should be the default selected ', () => {
                expect(getFilterRecordsCombobox(element).value).toBe(
                    RECORD_FILTER_CRITERIA.ALL
                );
            });
            it('Filter items list should be displayed', () => {
                expect(getFilterList(element)).not.toBeNull();
            });
            it('All filter items should be displayed', () => {
                expect(getExpressionBuilders(element)).toHaveLength(3);
            });
            it('passes EqualTo as the default operator', () => {
                expect(
                    getExpressionBuilders(element)[0].defaultOperator
                ).toEqual(RULE_OPERATOR.EQUAL_TO);
            });
        });
    });

    describe('Filter items events dispatch', () => {
        it('fires addRecordFilterEvent', () => {
            const element = createComponentUnderTest();
            const eventCallback = jest.fn();
            element.addEventListener(
                AddRecordFilterEvent.EVENT_NAME,
                eventCallback
            );
            const filterList = getFilterList(element);
            return Promise.resolve().then(() => {
                filterList.dispatchEvent(new AddRecordFilterEvent());
                expect(eventCallback).toHaveBeenCalled();
            });
        });

        it('fires updateRecordFilterEvent', () => {
            const updateData = {
                index: 0,
                value: 'newValue'
            };
            const element = createComponentUnderTest();
            const eventCallback = jest.fn();
            element.addEventListener(
                UpdateRecordFilterEvent.EVENT_NAME,
                eventCallback
            );
            const filterList = getFilterList(element);
            return Promise.resolve().then(() => {
                filterList.dispatchEvent(
                    new UpdateRecordFilterEvent(
                        updateData.index,
                        updateData.value
                    )
                );
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: updateData.index,
                        value: updateData.value
                    }
                });
            });
        });

        it('fires deleteRecordFilterEvent', () => {
            const deleteIndex = 1;
            const element = createComponentUnderTest();
            const eventCallback = jest.fn();
            element.addEventListener(
                DeleteRecordFilterEvent.EVENT_NAME,
                eventCallback
            );
            const filterList = getFilterList(element);
            return Promise.resolve().then(() => {
                filterList.dispatchEvent(
                    new DeleteRecordFilterEvent(deleteIndex)
                );
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: deleteIndex
                    }
                });
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
