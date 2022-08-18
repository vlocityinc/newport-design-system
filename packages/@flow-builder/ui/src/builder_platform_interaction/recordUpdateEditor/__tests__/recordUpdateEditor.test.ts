import {
    changeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    tick
} from 'builder_platform_interaction/builderTestUtils';
import {
    AddRecordFieldAssignmentEvent,
    AddRecordFilterEvent,
    ComboboxStateChangedEvent,
    DeleteRecordFieldAssignmentEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    SObjectReferenceChangedEvent,
    UpdateRecordFieldAssignmentEvent,
    UpdateRecordFilterEvent,
    UpdateRelatedRecordFieldsChangeEvent
} from 'builder_platform_interaction/events';
import {
    CONDITION_LOGIC,
    FLOW_TRIGGER_TYPE,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS
} from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { Store } from 'builder_platform_interaction/storeLib';
import { getTriggerType } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import { mockNewTriggeringRecordUpdateElement } from 'mock/cludData';
import { mockFieldsPerRelatedRecordValue } from 'mock/fieldsData';
import {
    accountSObjectCollectionVariable,
    caseSObjectVariable,
    flowWithAllElementsUIModel,
    updateAccountSObjectVariable,
    updateAccountWithFilter
} from 'mock/storeData';
import {
    recordTriggeredFlowUIModel,
    updateTriggeringRecord,
    updateTriggerRecordWithRelatedFields
} from 'mock/storeDataRecordTriggered';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { accountFields as mockAccountRelatedFields } from 'serverData/GetRelatedRecordFieldsForEntity/accountFields.json';
import RecordUpdateEditor from '../recordUpdateEditor';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn(() => Promise.resolve(mockAccountFields)),
    fetchRelatedRecordFieldsForEntity: jest.fn(() => Promise.resolve(mockAccountRelatedFields)),
    getUpdateableEntities: jest.fn(() => mockEntities),
    ENTITY_TYPE: jest.requireActual('builder_platform_interaction/sobjectLib').ENTITY_TYPE,
    getEntity: jest.fn((entityName) =>
        (mockEntities as { apiName: string }[]).find(({ apiName }) => apiName === entityName)
    )
}));
jest.mock('builder_platform_interaction/storeUtils', () =>
    Object.assign({}, jest.requireActual('builder_platform_interaction/storeUtils'), {
        getElementByGuid: jest.fn().mockReturnValue({}),
        getTriggerType: jest.fn().mockReturnValue({}),
        getStartObject: jest.fn().mockReturnValue('MockEntityName')
    })
);
jest.mock('builder_platform_interaction/mergeFieldLib', () => ({
    resolveReferenceFromIdentifier: jest.fn((recordUpdateInputReference) =>
        Promise.resolve(mockFieldsPerRelatedRecordValue.get(recordUpdateInputReference))
    )
}));

jest.mock(
    '@salesforce/label/FlowBuilderRecordUpdateEditor.filterCriteriaHeaderUpdate',
    () => {
        return { default: 'Condition Requirements to Update {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderRecordUpdateEditor.recordSingularLabel',
    () => {
        return { default: 'Record' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderRecordUpdateEditor.recordPluralLabel',
    () => {
        return { default: 'Records' };
    },
    { virtual: true }
);

const createComponentForTest = (node: {}) => {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    recordFilterTitle: '.slds-text-heading_small',
    infoMessage: '.slds-media__body',
    relatedRecordHelpText: 'div[data-id="relatedRecordFieldsPickerHelpText"]'
};

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);

const getRelatedRecordFieldsPicker = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.RELATED_RECORD_FIELDS_PICKER);

const getEntityResourcePicker = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

const getLightningRadioGroup = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

const getRecordFilter = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

const getConditionList = (recordFilter: HTMLElement) =>
    recordFilter.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST);

const getInputOutputAssignments = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);

const getLightningFormattedRichText = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_RICH_TEXT);

const getRelatedRecordHelpText = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(SELECTORS.relatedRecordHelpText);

const getInfoMessage = (recordUpdateEditor: HTMLElement) =>
    recordUpdateEditor.shadowRoot!.querySelector(SELECTORS.infoMessage);

const getRecordFilterTitle = (recordFilter: HTMLElement) =>
    recordFilter.shadowRoot!.querySelector(SELECTORS.recordFilterTitle);

describe('record-update-editor', () => {
    describe('new', () => {
        describe('using triggeringRecord (Account type / "Update" recordTriggerType / "RecordAfterSave" TriggerType)', () => {
            let recordUpdateEditor: HTMLElement;
            beforeAll(() => {
                getTriggerType.mockReturnValue(FLOW_TRIGGER_TYPE.AFTER_SAVE);
                recordUpdateEditor = createComponentForTest(mockNewTriggeringRecordUpdateElement);
            });
            it('does not have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not have a visible entity picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('has a visible radioGroup with 4 options, correct labels and triggering record option checked', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
                expect(wayToFindRecords.options).toHaveLength(4);
                expect(wayToFindRecords.options[0].label).toBe('FlowBuilderRecordUpdateEditor.triggeringRecordLabel');
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordUpdateEditor.updateRecordsRelatedToTriggeredFlow'
                );
                expect(wayToFindRecords.options[2].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[3].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
                expect(wayToFindRecords.value).toBe(RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD);
            });
            it('has visible recordFilters where filter logic is NO_CONDITIONS and filters are empty', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                expect(recordFilter.filterLogic.value).toBe(CONDITION_LOGIC.NO_CONDITIONS);
                expect(recordFilter.items).toBeUndefined();
            });
            it('has visible inputAssignments with empty input assignments', () => {
                const recordInputOutputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(recordInputOutputAssignments).not.toBeNull();
                expect(recordInputOutputAssignments.inputOutputAssignmentsItems).toHaveLength(0);
            });
        });
    });
    describe('existing', () => {
        describe('using sObject variable (with screen flow)', () => {
            let recordUpdateEditor: HTMLElement & RecordUpdateEditor, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(flowWithAllElementsUIModel);
                getTriggerType.mockReturnValue({});
                recordUpdateNode = getElementForPropertyEditor(updateAccountSObjectVariable);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('contains an sobject variable picker', () => {
                const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectPicker).not.toBeNull();
            });
            it('has a visible radioGroup with 2 options, correct labels and sobject reference option checked', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
                expect(wayToFindRecords.options).toHaveLength(2);
                expect(wayToFindRecords.options[0].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[1].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
                expect(wayToFindRecords.value).toBe(RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE);
            });
            it('has NOT a visible entityResourcePicker', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            });
            it('has NOT a visible recordFilters', () => {
                expect(getRecordFilter(recordUpdateEditor)).toBeNull();
            });
            it('has NOT a visible inputOutputAssignments', () => {
                expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
            });
            it('has correct sObject variable selected with pill (enabled by default)', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(updateAccountSObjectVariable.inputReference);
                expect(sObjectOrSObjectCollectionPicker.isPillSupported).toBe(true);
            });
            it('does not have an info message', () => {
                expect(getInfoMessage(recordUpdateEditor)).toBeNull();
            });
            it('should not alter the current state when you do reselect the same sObject variable', async () => {
                const oldRecordUpdateElementState = recordUpdateEditor.node;
                const oldInputReference = oldRecordUpdateElementState.inputReference.value;
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                sObjectOrSObjectCollectionPicker.dispatchEvent(
                    new SObjectReferenceChangedEvent(oldInputReference, null)
                );
                await tick();
                expect(oldRecordUpdateElementState).toBe(recordUpdateEditor.node);
            });
            it('should alter the current state when you do select a different sObject variable', async () => {
                const newInputReferenceValue = caseSObjectVariable.guid;
                const oldRecordUpdateElementState = recordUpdateEditor.node;
                const currentInputReference = oldRecordUpdateElementState.inputReference.value;
                expect(newInputReferenceValue).not.toBe(currentInputReference);
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                sObjectOrSObjectCollectionPicker.dispatchEvent(
                    new SObjectReferenceChangedEvent(newInputReferenceValue, null)
                );
                await tick();
                expect(oldRecordUpdateElementState).not.toBe(recordUpdateEditor.node);
                expect(recordUpdateEditor.node.inputReference).toMatchObject({
                    value: newInputReferenceValue,
                    error: null
                });
            });
            describe('Handle Events', () => {
                test('"SObjectReferenceChangedEvent" changing the inputReference accordingly', () => {
                    // initial input reference value (see screen flow "flowWithAllElements" details)
                    expect(recordUpdateEditor.node.inputReference.value).toBe(accountSObjectCollectionVariable.guid);
                    const event = new SObjectReferenceChangedEvent(caseSObjectVariable.guid, null);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(event);
                    expect(recordUpdateEditor.node.inputReference.value).toBe(caseSObjectVariable.guid);
                });
            });
        });
        describe('using triggeringRecord on update/after save', () => {
            let recordUpdateEditor: HTMLElement, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(recordTriggeredFlowUIModel);
                getTriggerType.mockReturnValue(FLOW_TRIGGER_TYPE.AFTER_SAVE);
                recordUpdateNode = getElementForPropertyEditor(updateTriggeringRecord);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('does not a have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not a have a visible entity resource picker', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            });
            it('has a radioGroup with 4 options, the correct labels, not disabled and the option checked', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
                expect(wayToFindRecords.disabled).toBe(false);
                expect(wayToFindRecords.options).toHaveLength(4);
                expect(wayToFindRecords.options[0].label).toBe('FlowBuilderRecordUpdateEditor.triggeringRecordLabel');
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordUpdateEditor.updateRecordsRelatedToTriggeredFlow'
                );
                expect(wayToFindRecords.options[2].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[3].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
                expect(wayToFindRecords.value).toBe(RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD);
            });
            it('has visible recordFilters with correct title', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('Condition Requirements to Update Record');
            });
            it('has visible inputAssignments with correct title', () => {
                const inputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(inputAssignments).not.toBeNull();
                expect(inputAssignments.title).toBe('FlowBuilderRecordUpdateEditor.setFieldValuesForTheRecordsFormat');
            });
            it('has the correct texts', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(getInfoMessage(recordUpdateEditor)).toBeNull();
                expect(getRecordFilterTitle(recordFilter)!.textContent).toBe(
                    'FlowBuilderRecordUpdateEditor.findRecords'
                );
            });
            describe('Handle Events', () => {
                describe('on SOBJECT_REFERENCE change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            changeEvent(RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE)
                        );
                    });
                    it('displays sobject variable picker and its value is empty', async () => {
                        await tick();
                        const sObjectOrSObjectCollectionPicker =
                            getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                        expect(sObjectOrSObjectCollectionPicker).not.toBeNull();
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                    it('has a visible lightning radio group', () => {
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have a visible entity resource picker', () => {
                        expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visible recordFilters', () => {
                        expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visible outputAssignments', () => {
                        expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                    });
                });
                describe('on RECORD_LOOKUP change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            changeEvent(RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP)
                        );
                    });
                    it('does not have a visible sobject picker', () => {
                        expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has a visible lightning radio group', () => {
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('has a visible entity resource picker', () => {
                        expect(getEntityResourcePicker(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have visible recordFilters', () => {
                        expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visible outputAssignments', () => {
                        expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                    });
                });
            });
        });
        describe('using triggeringRecord on update/before save', () => {
            let recordUpdateEditor: HTMLElement, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(recordTriggeredFlowUIModel);
                getTriggerType.mockReturnValue(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
                recordUpdateNode = getElementForPropertyEditor(updateTriggeringRecord);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('does not have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not have a visible entity resource picker', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            });
            it('has a visible recordFilter with correct title', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('Condition Requirements to Update Record');
            });
            it('has visible inputAssignments', () => {
                const inputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(inputAssignments).not.toBeNull();
                expect(inputAssignments.title).toBe('FlowBuilderRecordUpdateEditor.setFieldValuesForTheRecordsFormat');
            });
            it('has visible but disabled radioGroup', () => {
                expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                expect(getLightningRadioGroup(recordUpdateEditor).disabled).toBe(true);
            });
            it('has show way to find info message', () => {
                expect(getLightningFormattedRichText(recordUpdateEditor).value).toBe(
                    'FlowBuilderRecordUpdateEditor.wayToFindRecordsInfoMessage'
                );
            });
        });
        describe('using triggeringRecord on update/before delete', () => {
            let recordUpdateEditor: HTMLElement, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(recordTriggeredFlowUIModel);
                getTriggerType.mockReturnValue(FLOW_TRIGGER_TYPE.BEFORE_DELETE);
                recordUpdateNode = getElementForPropertyEditor(updateTriggeringRecord);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('has a radioGroup with 4 options', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(4);
                expect(wayToFindRecords.options[0].label).toBe('FlowBuilderRecordUpdateEditor.triggeringRecordLabel');
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordUpdateEditor.updateRecordsRelatedToTriggeredFlow'
                );
                expect(wayToFindRecords.options[2].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[3].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
            });
        });
        describe('using triggeringRecord for scheduled flow', () => {
            let recordUpdateEditor: HTMLElement, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(recordTriggeredFlowUIModel);
                getTriggerType.mockReturnValue(FLOW_TRIGGER_TYPE.SCHEDULED);
                recordUpdateNode = getElementForPropertyEditor(updateTriggeringRecord);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('has a radioGroup with 4 options having correct labels and triggered record option checked', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(4);
                expect(wayToFindRecords.options[0].label).toBe(
                    'FlowBuilderRecordUpdateEditor.triggeringScheduledRecordLabel'
                );
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordUpdateEditor.updateRecordsRelatedToTriggeredFlow'
                );
                expect(wayToFindRecords.options[2].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[3].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
                expect(wayToFindRecords.value).toBe(RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD);
            });
        });
        describe('using fields (with screen flow)', () => {
            let recordUpdateEditor: HTMLElement & RecordUpdateEditor, recordUpdateNode: {};
            beforeAll(() => {
                Store.setMockState(flowWithAllElementsUIModel);
                getTriggerType.mockReturnValue({});
                recordUpdateNode = getElementForPropertyEditor(updateAccountWithFilter);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('has an entity resource picker visible', () => {
                const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
                expect(entityResourcePicker).not.toBeNull();
            });
            it('has NOT a visible sObject picker', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker).toBeNull();
            });
            it('has visible recordFilters with correct title', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('Condition Requirements to Update Records');
            });
            it('should only display editable fields in "inputOutputAssignments"', () => {
                const inputOutputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(inputOutputAssignments.title).toBe(
                    'FlowBuilderRecordUpdateEditor.setFieldValuesForTheRecordsFormat'
                );
                expect(inputOutputAssignments.recordFields).not.toBeNull();
                const fields = Object.values(inputOutputAssignments.recordFields);
                expect(fields).toContainEqual(
                    expect.objectContaining({
                        editable: true
                    })
                );
                expect(fields).not.toContainEqual(
                    expect.objectContaining({
                        editable: false
                    })
                );
            });
            it('has the correct texts', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(getInfoMessage(recordUpdateEditor)).toBeNull();
                expect(getRecordFilterTitle(recordFilter)!.textContent).toBe('FlowBuilderRecordEditor.findRecords');
            });
            describe('Handle Events', () => {
                it('"change" event with SOBJECT_REFERENCE should show sObject picker and the value should be empty', async () => {
                    getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                        changeEvent(RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE)
                    );
                    await tick();
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                it('should hide filters and input assignments when the object is empty', async () => {
                    getEntityResourcePicker(recordUpdateEditor).dispatchEvent(
                        new ComboboxStateChangedEvent(null, '', 'A value is required.')
                    );
                    await tick();
                    expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                });
                test('changing the way to find the record(s) to update to "related record" mode should hide filters and input assignments', async () => {
                    getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                        new CustomEvent('change', {
                            detail: { value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RELATED_RECORD_LOOKUP }
                        })
                    );
                    await tick();
                    expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                });
                describe('on TRIGGERING_RECORD change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            changeEvent(RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD)
                        );
                    });
                    it('does not have a visible sobject picker', () => {
                        expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has a visible lighting radio group', () => {
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have a visible entity resource picker', () => {
                        expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has visible recordFilters and filter logic is NO_CONDITIONS', () => {
                        expect(getRecordFilter(recordUpdateEditor)).not.toBeNull();
                        expect(recordUpdateEditor.getNode().filterLogic.value).toBe(CONDITION_LOGIC.NO_CONDITIONS);
                    });
                    it('has visible output assignments with one empty row', () => {
                        expect(getInputOutputAssignments(recordUpdateEditor)).not.toBeNull();

                        // setup has 2 input assignments, 1 here means that the filters have been cleared out
                        expect(recordUpdateEditor.node!.inputAssignments).toHaveLength(1);
                        expect(recordUpdateEditor.node!.inputAssignments![0].leftHandSide.value).toBe('');
                    });
                });
                it('"UpdateRecordFilterEvent" should update the filter element', async () => {
                    const [filterElement] = updateAccountWithFilter.filters;
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new UpdateRecordFilterEvent(0, filterElement));
                    await tick();
                    expect(recordUpdateEditor.node.filters![0]).toMatchObject(filterElement);
                });
                it('"AddRecordFilterEvent" should add a filter element', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new AddRecordFilterEvent());
                    await tick();
                    expect(recordUpdateEditor.node.filters).toHaveLength(4);
                });
                it('"DeleteRecordFilterEvent" fired by record filter', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new DeleteRecordFilterEvent(0));
                    await tick();
                    expect(recordUpdateEditor.node.filters).toHaveLength(2);
                });
                it('"AddRecordFieldAssignmentEvent" should add an input assignments element', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(new AddRecordFieldAssignmentEvent());
                    await tick();
                    expect(recordUpdateEditor.node.inputAssignments).toHaveLength(
                        updateAccountWithFilter.inputAssignments.length + 1
                    );
                });
                it('"UpdateRecordFieldAssignmentEvent" should update the input assignments element', async () => {
                    const [inputAssignmentElement] = updateAccountWithFilter.inputAssignments;
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new UpdateRecordFieldAssignmentEvent(0, inputAssignmentElement, null)
                    );
                    await tick();
                    expect(recordUpdateEditor.node.inputAssignments![0]).toMatchObject(inputAssignmentElement);
                });
                it('"DeleteRecordFieldAssignmentEvent" should delete the input assignments', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new DeleteRecordFieldAssignmentEvent(0)
                    );
                    await tick();
                    expect(recordUpdateEditor.getNode().inputAssignments).toHaveLength(
                        updateAccountWithFilter.inputAssignments.length - 1
                    );
                });
                it('record filter logic change event ("PropertyChangedEvent")', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(
                        new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.OR)
                    );
                    await tick();
                    expect(recordUpdateEditor.getNode().filterLogic.value).toBe(CONDITION_LOGIC.OR);
                });
            });
        });
        describe('using related record fields (Account record triggered flow)', () => {
            let recordUpdateEditor: HTMLElement & RecordUpdateEditor;
            beforeAll(async () => {
                Store.setMockState(recordTriggeredFlowUIModel);
                const recordUpdateNode = getElementForPropertyEditor(updateTriggerRecordWithRelatedFields);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
                await tick();
            });
            afterAll(() => {
                Store.resetStore();
            });
            it('has the related record fields picker visible with correct value', () => {
                const relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateEditor);
                expect(relatedRecordFieldsPicker).not.toBeNull();
                expect(relatedRecordFieldsPicker.value).toBe(updateTriggerRecordWithRelatedFields.inputReference);
            });
            it('has the related record fields picker helpText visible', () => {
                const relatedRecordFieldsPickerHelpText = getRelatedRecordHelpText(recordUpdateEditor);
                expect(relatedRecordFieldsPickerHelpText).not.toBeNull();
            });
            it('has the sObject picker not visible', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker).toBeNull();
            });
            it('has visible recordFilters with correct filters and label', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                expect(recordFilter.filterItems).toHaveLength(1);
                expect(recordFilter.filterItems[0]).toMatchObject({
                    rowIndex: expect.any(String),
                    leftHandSide: {
                        value: '.MailingCity',
                        error: null
                    },
                    leftHandSideDataType: {
                        value: 'String',
                        error: null
                    },
                    rightHandSide: {
                        value: '$Record.BillingCity',
                        error: null
                    },
                    rightHandSideDataType: {
                        value: 'reference',
                        error: null
                    },
                    operator: {
                        value: 'EqualTo',
                        error: null
                    }
                });
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('Condition Requirements to Update Record');
            });
            it('has visible inputAssignments', () => {
                expect(getInputOutputAssignments(recordUpdateEditor)).not.toBeNull();
            });
            it.each`
                inputReference | error
                ${''}          | ${'A value is required.'}
                ${'$Record'}   | ${'Enter a valid value.'}
            `(
                'should hide helpText, filters, assignments when inputReference is "$inputReference"',
                async ({ inputReference, error }) => {
                    getRelatedRecordFieldsPicker(recordUpdateEditor).dispatchEvent(
                        new UpdateRelatedRecordFieldsChangeEvent(inputReference, undefined, error)
                    );
                    await tick();
                    expect(getRelatedRecordHelpText(recordUpdateEditor)).toBeNull();
                    expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                    expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                }
            );
            it('should display helpText, filters, assignments when after an invalid related record a valid one is used', async () => {
                const relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateEditor);
                relatedRecordFieldsPicker.dispatchEvent(
                    new UpdateRelatedRecordFieldsChangeEvent('', undefined, 'A value is required.')
                );
                relatedRecordFieldsPicker.dispatchEvent(
                    new UpdateRelatedRecordFieldsChangeEvent('$Record.Parent.Contacts', 'Contact', null)
                );
                await tick();
                expect(getRelatedRecordHelpText(recordUpdateEditor)).not.toBeNull();
                expect(getInputOutputAssignments(recordUpdateEditor)).not.toBeNull();
                expect(getRecordFilter(recordUpdateEditor)).not.toBeNull();
            });
            it('should not alter the current state when you do reselect the same related record', async () => {
                const oldRecordUpdateElementState = recordUpdateEditor.node;
                const oldRelatedRecordInputReference = oldRecordUpdateElementState.inputReference.value;
                const relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateEditor);
                relatedRecordFieldsPicker.dispatchEvent(
                    new UpdateRelatedRecordFieldsChangeEvent(oldRelatedRecordInputReference, 'Contact', null)
                );
                await tick();
                expect(oldRecordUpdateElementState).toBe(recordUpdateEditor.node);
            });
            it('should alter the current state when you do select a different related record', async () => {
                const newRelatedRecordInputReference = '$Record.Owner';
                const oldRecordUpdateElementState = recordUpdateEditor.node;
                const currentRelatedRecordInputReference = oldRecordUpdateElementState.inputReference.value;
                expect(newRelatedRecordInputReference).not.toBe(currentRelatedRecordInputReference);
                const relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateEditor);
                relatedRecordFieldsPicker.dispatchEvent(
                    new UpdateRelatedRecordFieldsChangeEvent(newRelatedRecordInputReference, 'User', null)
                );
                await tick();
                expect(oldRecordUpdateElementState).not.toBe(recordUpdateEditor.node);
                expect(recordUpdateEditor.node.inputReference).toMatchObject({
                    value: newRelatedRecordInputReference,
                    error: null
                });
            });
            it('has the correct related record entity for conditions and assignments', async () => {
                getRelatedRecordFieldsPicker(recordUpdateEditor).dispatchEvent(
                    new UpdateRelatedRecordFieldsChangeEvent('$Record.Owner', 'User', null)
                );
                await tick();
                const inputAssignments = getInputOutputAssignments(recordUpdateEditor);
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(inputAssignments.recordEntityName).toEqual('User');
                expect(recordFilter.recordEntityName).toEqual('User');
            });
            it('should not return any errors on validate call', async () => {
                const errors = recordUpdateEditor.validate();
                expect(errors).toHaveLength(0);
            });
        });
    });
});
