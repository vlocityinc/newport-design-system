import { createElement } from 'lwc';
import RecordUpdateEditor from '../recordUpdateEditor';
import { accountSObjectVariable, flowWithAllElementsUIModel, updateAccountWithFilter } from 'mock/storeData';
import { recordTriggeredFlowUIModel } from 'mock/storeDataRecordTriggered';

import {
    AddRecordFieldAssignmentEvent,
    AddRecordFilterEvent,
    DeleteRecordFieldAssignmentEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    SObjectReferenceChangedEvent,
    UpdateRecordFieldAssignmentEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    CONDITION_LOGIC,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName, getTriggerType } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByName } from 'mock/storeDataRecordTriggered';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
    getUpdateableEntities: jest.fn().mockImplementation(() => mockEntities),
    ENTITY_TYPE: jest.requireActual('builder_platform_interaction/sobjectLib').ENTITY_TYPE,
    getEntity: jest.fn().mockImplementation((entityName) => mockEntities.find(({ apiName }) => apiName === entityName))
}));
jest.mock('builder_platform_interaction/storeUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeUtils');
    return Object.assign({}, actual, {
        getElementByGuid: jest.fn().mockReturnValue({}),
        getTriggerType: jest.fn().mockReturnValue({}),
        getStartObject: jest.fn().mockReturnValue('MockEntityName')
    });
});

const MOCK_AFTER_SAVE: string = FLOW_TRIGGER_TYPE.AFTER_SAVE;
const MOCK_BEFORE_SAVE: string = FLOW_TRIGGER_TYPE.BEFORE_SAVE;
const MOCK_BEFORE_DELETE: string = FLOW_TRIGGER_TYPE.BEFORE_DELETE;
const MOCK_SCHEDULED: string = FLOW_TRIGGER_TYPE.SCHEDULED;

const createComponentForTest = (node: {}) => {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
};

const newElementNode = {
    guid: '574474cf-2e90-43e4-8f04-95a03e87dd8d',
    name: {
        value: '',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: '',
        error: null
    },
    locationX: 444,
    locationY: 63.3125,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true
    },
    elementSubtype: {
        value: null,
        error: null
    },
    inputReference: {
        value: '',
        error: null
    },
    inputReferenceIndex: {
        value: '8fd8d550-7478-4411-93ab-3c844fb93cfc',
        error: null
    },
    maxConnections: 2,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    elementType: 'RecordUpdate',
    inputAssignments: [],
    filters: [
        {
            rowIndex: 'd181b25d-bda7-4b73-8286-82961bd3270d',
            leftHandSide: {
                value: '',
                error: null
            },
            rightHandSide: {
                value: '',
                error: null
            },
            rightHandSideDataType: {
                value: '',
                error: null
            },
            operator: {
                value: '',
                error: null
            }
        }
    ],
    filterLogic: {
        value: 'and',
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: '0d5629a2-48b2-4ea0-9603-a7a43e0a0ca6',
        error: null
    },
    dataType: {
        value: 'Boolean',
        error: null
    },
    wayToFindRecords: {
        value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE,
        error: null
    }
};

const triggeringRecordElement = {
    guid: '574474cf-2e90-43e4-8f04-95a03e87dd8d',
    name: {
        value: '',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: '',
        error: null
    },
    locationX: 444,
    locationY: 63.3125,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true
    },
    elementSubtype: {
        value: null,
        error: null
    },
    inputReference: {
        value: '',
        error: null
    },
    inputReferenceIndex: {
        value: '8fd8d550-7478-4411-93ab-3c844fb93cfc',
        error: null
    },
    maxConnections: 2,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    elementType: 'RecordUpdate',
    inputAssignments: [],
    filters: [],
    filterLogic: {
        value: CONDITION_LOGIC.NO_CONDITIONS,
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: '0d5629a2-48b2-4ea0-9603-a7a43e0a0ca6',
        error: null
    },
    wayToFindRecords: {
        value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD,
        error: null
    }
};

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);

const getEntityResourcePicker = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

const getLightningRadioGroup = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

const getRecordFilter = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

const getConditionList = (recordFilter) =>
    recordFilter.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST);

const getInputOutputAssignments = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);

const getLightningFormattedRichText = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_RICH_TEXT);

const selectors = {
    recordFilterTitle: '.slds-text-heading_small',
    infoMessage: '.slds-media__body'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

jest.mock(
    '@salesforce/label/FlowBuilderRecordUpdateEditor.filterCriteriaHeaderUpdate',
    () => {
        return { default: '{0}' };
    },
    { virtual: true }
);

describe('record-update-editor', () => {
    describe('new', () => {
        describe('using sObject', () => {
            let recordUpdateEditor;
            beforeAll(() => {
                (getTriggerType as jest.Mock).mockReturnValue({});
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(newElementNode);
            });
            it('contains an entity resource picker for sobject', () => {
                const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectPicker).not.toBeNull();
            });
            it('contains a lightning radio group component', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
            });
            it('Other elements should not be visible', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
            });
            it('has no sObject selected', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });

            describe('Handle Events', () => {
                it('"SObjectReferenceChangedEvent" (inputReference) changed', async () => {
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(accountSObjectVariable.guid, null)
                    );
                    await ticks(1);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
                });
            });
        });
        describe('using triggeringRecord', () => {
            let recordUpdateEditor;
            beforeAll(() => {
                (getTriggerType as jest.Mock).mockReturnValue(MOCK_AFTER_SAVE);
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(triggeringRecordElement);
            });
            it('does not have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not have a visible entity picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('has a visible radioGroup', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
                expect(wayToFindRecords.options).toHaveLength(3);
                expect(wayToFindRecords.value).toBe(RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD);
            });
            it('has visible recordFilters where filter logic is NO_CONDITIONS and filters are empty', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                expect(recordFilter.filterLogic.value).toBe(CONDITION_LOGIC.NO_CONDITIONS);
            });
            it('has visible inputAssignments', () => {
                expect(getInputOutputAssignments(recordUpdateEditor)).not.toBeNull();
            });
        });
    });
    describe('existing', () => {
        describe('using sObject', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(flowWithAllElementsUIModel);
                (getTriggerType as jest.Mock).mockReturnValue({});
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByDevName('updateSObject');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('contains an entity resource picker for sobject', () => {
                const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectPicker).not.toBeNull();
            });
            it('contains a lightning radio group component', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
            });
            it('contains 2 lightning radio group options', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(2);
                expect(wayToFindRecords.options[0].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[1].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
            });
            it('other elements (entityResourcePicker, recordFilter, inputOutputAssignments) should not be visible', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
            });
            it('has correct sObject selected', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(updateElement.inputReference);
            });
            it('supports pills by default', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.isPillSupported).toBe(true);
            });
            it('does not have an info message', () => {
                expect(runQuerySelector(recordUpdateEditor, selectors.infoMessage)).toBeNull();
            });

            describe('Handle Events', () => {
                it('"SObjectReferenceChangedEvent" (inputReference)', async () => {
                    const event = new SObjectReferenceChangedEvent(accountSObjectVariable.guid, null);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(event);
                    await ticks(1);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
                });
            });
        });
        describe('using triggeringRecord for after save', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(recordTriggeredFlowUIModel);
                (getTriggerType as jest.Mock).mockReturnValue(MOCK_AFTER_SAVE);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByName('Update_Triggering_Record');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('does not a have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not a have a visible entity resource picker', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            });
            it('has a visible radioGroup and its enabled', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords).not.toBeNull();
                expect(wayToFindRecords.disabled).toBeFalsy();
            });
            it('has a radioGroup with 3 options', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(3);
                expect(wayToFindRecords.options[0].label).toBe('FlowBuilderRecordUpdateEditor.triggeringRecordLabel');
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[2].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
            });
            it('has visible recordFilters', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('FlowBuilderRecordUpdateEditor.recordSingularLabel');
            });
            it('has visible inputAssignments', () => {
                const inputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(inputAssignments).not.toBeNull();
                expect(inputAssignments.title).toBe('FlowBuilderRecordUpdateEditor.setFieldValuesForTheRecordsFormat');
            });
            it('has the correct texts', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(runQuerySelector(recordUpdateEditor, selectors.infoMessage)).toBeNull();
                expect(runQuerySelector(recordFilter, selectors.recordFilterTitle).textContent).toBe(
                    'FlowBuilderRecordUpdateEditor.findRecords'
                );
            });
            describe('Handle Events', () => {
                describe('on SOBJECT_REFERENCE change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            new CustomEvent('change', {
                                detail: { value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE }
                            })
                        );
                    });
                    it('displays sobject collection picker and value is empty', async () => {
                        await ticks(1);
                        const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                            recordUpdateEditor
                        );
                        expect(sObjectOrSObjectCollectionPicker).not.toBeNull();
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                    it('has a visible lightning radio group', async () => {
                        await ticks(1);
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have a visible entity resource picker', async () => {
                        await ticks(1);
                        expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visisble recordFilters', async () => {
                        await ticks(1);
                        expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visisble outputAssignments', async () => {
                        await ticks(1);
                        expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                    });
                });
                describe('on RECORD_LOOKUP change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            new CustomEvent('change', {
                                detail: { value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP }
                            })
                        );
                    });
                    it('does not have a visible sobject picker', async () => {
                        await ticks(1);
                        expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has a visible lightning radio group', async () => {
                        await ticks(1);
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('has a visible entity resource picker', async () => {
                        await ticks(1);
                        expect(getEntityResourcePicker(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have visible recordFilters', async () => {
                        await ticks(1);
                        expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                    });
                    it('does not have visible outputAssignments', async () => {
                        await ticks(1);
                        expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
                    });
                });
            });
        });
        describe('using triggeringRecord for before save', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(recordTriggeredFlowUIModel);
                (getTriggerType as jest.Mock).mockReturnValue(MOCK_BEFORE_SAVE);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByName('Update_Triggering_Record');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('does not have a visible sobject picker', () => {
                expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
            });
            it('does not have a visible entity resource picker', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            });
            it('has a visible recordFilter', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('FlowBuilderRecordUpdateEditor.recordSingularLabel');
            });
            it('has visible inputAssignments', () => {
                const inputAssignments = getInputOutputAssignments(recordUpdateEditor);
                expect(inputAssignments).not.toBeNull();
                expect(inputAssignments.title).toBe('FlowBuilderRecordUpdateEditor.setFieldValuesForTheRecordsFormat');
            });
            it('has visible but disabled radioGroup', () => {
                expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                expect(getLightningRadioGroup(recordUpdateEditor).disabled).toBeTruthy();
            });
            it('has info message', () => {
                expect(getLightningFormattedRichText(recordUpdateEditor).value).toBe(
                    'FlowBuilderRecordUpdateEditor.wayToFindRecordsInfoMessage'
                );
            });
        });
        describe('using triggeringRecord for before delete', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(recordTriggeredFlowUIModel);
                (getTriggerType as jest.Mock).mockReturnValue(MOCK_BEFORE_DELETE);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByName('Update_Triggering_Record');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('has a radioGroup with 3 options', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(3);
                expect(wayToFindRecords.options[0].label).toBe('FlowBuilderRecordUpdateEditor.triggeringRecordLabel');
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[2].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
            });
        });
        describe('using triggeringRecord for scheduled flow', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(recordTriggeredFlowUIModel);
                (getTriggerType as jest.Mock).mockReturnValue(MOCK_SCHEDULED);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByName('Update_Triggering_Record');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('has a radioGroup with 3 options', () => {
                const wayToFindRecords = getLightningRadioGroup(recordUpdateEditor);
                expect(wayToFindRecords.options).toHaveLength(3);
                expect(wayToFindRecords.options[0].label).toBe(
                    'FlowBuilderRecordUpdateEditor.triggeringScheduledRecordLabel'
                );
                expect(wayToFindRecords.options[1].label).toBe(
                    'FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel'
                );
                expect(wayToFindRecords.options[2].label).toBe('FlowBuilderRecordEditor.usingCriteriaLabel');
            });
        });
        describe('using fields', () => {
            let recordUpdateEditor, recordUpdateNode;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(flowWithAllElementsUIModel);
                (getTriggerType as jest.Mock).mockReturnValue({});
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                recordUpdateNode = getElementForPropertyEditor(updateAccountWithFilter);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('entity resource picker should be visible & sObject picker should not be visible', () => {
                const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker).toBeNull();
                expect(entityResourcePicker).not.toBeNull();
            });
            it('has visible recordFilters', () => {
                const recordFilter = getRecordFilter(recordUpdateEditor);
                expect(recordFilter).not.toBeNull();
                const conditionList = getConditionList(recordFilter);
                // This is only a part of the condition list label, but we only care about this, because its conditional.
                expect(conditionList.logicComboboxLabel).toBe('FlowBuilderRecordUpdateEditor.recordPluralLabel');
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
                expect(runQuerySelector(recordUpdateEditor, selectors.infoMessage)).toBeNull();
                expect(runQuerySelector(recordFilter, selectors.recordFilterTitle).textContent).toBe(
                    'FlowBuilderRecordEditor.findRecords'
                );
            });
            describe('Handle Events', () => {
                it('"change" event with SOBJECT_REFERENCE should show sObject picker and the value should be empty', async () => {
                    getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                        new CustomEvent('change', {
                            detail: { value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE }
                        })
                    );
                    await ticks(1);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                describe('on TRIGGERING_RECORD change event', () => {
                    beforeEach(() => {
                        getLightningRadioGroup(recordUpdateEditor).dispatchEvent(
                            new CustomEvent('change', {
                                detail: { value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD }
                            })
                        );
                    });
                    it('does not have a visible sobject picker', async () => {
                        await ticks(1);
                        expect(getSObjectOrSObjectCollectionPicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has a visible lighting radio group', async () => {
                        await ticks(1);
                        expect(getLightningRadioGroup(recordUpdateEditor)).not.toBeNull();
                    });
                    it('does not have a visible entity resource picker', async () => {
                        await ticks(1);
                        expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                    });
                    it('has visible recordFilters and filter logic is NO_CONDITIONS', async () => {
                        await ticks(1);
                        expect(getRecordFilter(recordUpdateEditor)).not.toBeNull();
                        expect(recordUpdateEditor.getNode().filterLogic.value).toBe(CONDITION_LOGIC.NO_CONDITIONS);
                    });
                    it('has visisble output assignments with one empty row', async () => {
                        await ticks(1);
                        expect(getInputOutputAssignments(recordUpdateEditor)).not.toBeNull();

                        // setup has 2 input assignments, 1 here means that the filters have been cleared out
                        expect(recordUpdateEditor.node.inputAssignments).toHaveLength(1);
                        expect(recordUpdateEditor.node.inputAssignments[0].leftHandSide.value).toBe('');
                    });
                });
                it('"UpdateRecordFilterEvent" should update the filter element', async () => {
                    const [filterElement] = updateAccountWithFilter.filters;
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new UpdateRecordFilterEvent(0, filterElement));
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters[0]).toMatchObject(filterElement);
                });
                it('"AddRecordFilterEvent" should add a filter element', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new AddRecordFilterEvent());
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters).toHaveLength(4);
                });
                it('"DeleteRecordFilterEvent" fired by record filter', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new DeleteRecordFilterEvent(0));
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters).toHaveLength(2);
                });
                it('"AddRecordFieldAssignmentEvent" should add an input assignments element', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(new AddRecordFieldAssignmentEvent());
                    await ticks(1);
                    expect(recordUpdateEditor.node.inputAssignments).toHaveLength(
                        updateAccountWithFilter.inputAssignments.length + 1
                    );
                });
                it('"UpdateRecordFieldAssignmentEvent" should update the input assignments element', async () => {
                    const [inputAssignmentElement] = updateAccountWithFilter.inputAssignments;
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new UpdateRecordFieldAssignmentEvent(0, inputAssignmentElement, null)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.node.inputAssignments[0]).toMatchObject(inputAssignmentElement);
                });
                it('"DeleteRecordFieldAssignmentEvent" should delete the input assignments', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new DeleteRecordFieldAssignmentEvent(0)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.getNode().inputAssignments).toHaveLength(
                        updateAccountWithFilter.inputAssignments.length - 1
                    );
                });
                it('record filter logic change event ("PropertyChangedEvent")', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(
                        new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.OR)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.getNode().filterLogic.value).toBe(CONDITION_LOGIC.OR);
                });
            });
        });
    });
});
