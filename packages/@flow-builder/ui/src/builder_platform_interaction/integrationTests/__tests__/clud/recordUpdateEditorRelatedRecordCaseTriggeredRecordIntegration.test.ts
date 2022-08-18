import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import RecordUpdateEditor from 'builder_platform_interaction/recordUpdateEditor';
import type { RelatedRecordFieldsPicker } from 'builder_platform_interaction/relatedRecordFieldsPicker';
import * as recordTriggeredCaseFlow from 'mock/flows/recordTriggeredCaseFlow.json';
import { updateRelatedOwnerUser } from 'mock/storeDataRecordTriggeredCase';
import type { ComboboxTestComponent } from '../comboboxTestUtils';
import { findComboboxMenuItemByValue, getRecordChildrenComboboxMenuItemsValues } from '../comboboxTestUtils';
import { resetState, setupStateForFlow, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import {
    getComboboxFromPicker,
    getRecordFilter,
    getRecordInputOutputAssignments,
    getRelatedRecordFieldsPicker
} from './cludEditorTestUtils';

const recordCaseContactFieldMenuItem = {
    type: 'option-card',
    text: 'Contact',
    subText: 'Contact ID',
    displayText: '{!$Record.Contact}',
    iconSize: 'xx-small',
    value: '$Record.Contact',
    parent: {
        iconSize: 'xx-small',
        text: '$Record',
        value: '$Record',
        haveSystemVariableFields: true,
        displayText: '{!$Record}',
        subText: 'Case',
        hasNext: true,
        rightIconName: 'utility:chevronright',
        iconName: 'utility:system_and_global_variable',
        type: 'option-card',
        dataType: 'SObject',
        subtype: 'Case',
        rightIconSize: 'xx-small',
        iconAlternativeText: 'SObject'
    },
    haveSystemVariableFields: true,
    dataType: 'SObject',
    subtype: 'Contact',
    isCollection: false,
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    hasNext: true
};
const recordCaseOwnerUserFieldMenuItem = {
    type: 'option-card',
    text: 'Owner (User)',
    subText: 'Owner ID',
    displayText: '{!$Record.Owner:User}',
    iconSize: 'xx-small',
    value: '$Record.Owner:User',
    parent: {
        iconSize: 'xx-small',
        text: '$Record',
        value: '$Record',
        haveSystemVariableFields: true,
        displayText: '{!$Record}',
        subText: 'Case',
        hasNext: true,
        rightIconName: 'utility:chevronright',
        iconName: 'utility:system_and_global_variable',
        type: 'option-card',
        dataType: 'SObject',
        subtype: 'Case',
        rightIconSize: 'xx-small',
        iconAlternativeText: 'SObject'
    },
    haveSystemVariableFields: true,
    dataType: 'SObject',
    subtype: 'User',
    isCollection: false,
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    hasNext: true
};
const recordCaseAttachmentsFieldMenuItem = {
    type: 'option-card',
    text: 'Attachments',
    subText: 'Attachments',
    displayText: '{!$Record.Attachments}',
    iconName: 'utility:record_alt',
    iconAlternativeText: 'String',
    iconSize: 'xx-small',
    value: '$Record.Attachments',
    parent: {
        iconSize: 'xx-small',
        text: '$Record',
        value: '$Record',
        haveSystemVariableFields: true,
        displayText: '{!$Record}',
        subText: 'Case',
        hasNext: true,
        rightIconName: 'utility:chevronright',
        iconName: 'utility:system_and_global_variable',
        type: 'option-card',
        dataType: 'SObject',
        subtype: 'Case',
        rightIconSize: 'xx-small',
        iconAlternativeText: 'SObject'
    },
    isSystemVariableField: true,
    dataType: 'String',
    subtype: 'Attachment',
    isCollection: false
};

describe('Record Update Editor - related record mode (Case record triggered flow - Create/RecordAfterSave)', () => {
    let recordUpdateNode: {}, recordUpdateComponent: RecordUpdateEditor;
    let relatedRecordFieldsPicker: RelatedRecordFieldsPicker, combobox: ComboboxTestComponent;

    beforeAll(async () => {
        const store = await setupStateForFlow(recordTriggeredCaseFlow);
        translateFlowToUIAndDispatch(recordTriggeredCaseFlow, store);
        recordUpdateNode = getElementForPropertyEditor(updateRelatedOwnerUser);
        recordUpdateComponent = await createComponent('builder_platform_interaction-record-update-editor', {
            node: recordUpdateNode,
            mode: EditElementEvent.EVENT_NAME
        });
    });
    beforeEach(async () => {
        relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateComponent);
        combobox = getComboboxFromPicker(relatedRecordFieldsPicker);
        await combobox.removePill();
    });
    afterAll(() => resetState());
    test('the related record fields picker should be displayed with correct value and label', () => {
        const relatedRecordFieldsPicker = getRelatedRecordFieldsPicker(recordUpdateComponent);
        expect(relatedRecordFieldsPicker).not.toBeNull();
        expect(relatedRecordFieldsPicker).toMatchObject({
            label: 'FlowBuilderRecordUpdateEditor.filterCriteriaRelatedRecords',
            value: updateRelatedOwnerUser.inputReference
        });
    });
    describe('handle event related record fields picker value changed', () => {
        describe('typing', () => {
            describe('NO errors', () => {
                it.each`
                    relatedRecordFieldsPickerMergeFieldValue | expectedRelatedRecordFieldsPickerValue | expectedRecordFilterAssignmentsEntityName | expectedPillLabel
                    ${'{!$Record.Contact}'}                  | ${'$Record.Contact'}                   | ${'Contact'}                              | ${'$Record > Contact ID'}
                    ${'{!$Record.Owner:User}'}               | ${'$Record.Owner:User'}                | ${'User'}                                 | ${'$Record > Owner ID (User)'}
                    ${'{!$Record.Attachments}'}              | ${'$Record.Attachments'}               | ${'Attachment'}                           | ${'$Record > Attachments'}
                `(
                    'When typing "$relatedRecordFieldsPickerMergeFieldValue" related record fields picker value should be "$expectedRelatedRecordFieldsPickerValue" with pill labeled: "$expectedPillLabel", record filters/inputAssignments entityName: "$expectedRecordFilterAssignmentsEntityName"',
                    async ({
                        relatedRecordFieldsPickerMergeFieldValue,
                        expectedRelatedRecordFieldsPickerValue,
                        expectedRecordFilterAssignmentsEntityName,
                        expectedPillLabel
                    }) => {
                        await combobox.typeMergeField(relatedRecordFieldsPickerMergeFieldValue);

                        // related record fields picker
                        expect(relatedRecordFieldsPicker.value).toEqual(expectedRelatedRecordFieldsPickerValue);

                        // error
                        expect(combobox.element.errorMessage).toBeNull();

                        // pill
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill.label).toEqual(expectedPillLabel);

                        // record filters
                        const recordFilter = getRecordFilter(recordUpdateComponent);
                        expect(recordFilter.recordEntityName).toBe(expectedRecordFilterAssignmentsEntityName);

                        // record input assignments
                        const recordInputOutputAssignments = getRecordInputOutputAssignments(recordUpdateComponent);
                        expect(recordInputOutputAssignments.recordEntityName).toBe(
                            expectedRecordFilterAssignmentsEntityName
                        );
                    }
                );
            });
            describe('errors', () => {
                it.each`
                    relatedRecordFieldsPickerMergeFieldValue  | errorMessage
                    ${''}                                     | ${'FlowBuilderCombobox.genericErrorMessage'}
                    ${'{!$Record}'}                           | ${'FlowBuilderCombobox.genericErrorMessage'}
                    ${'{!$Record.ThisFieldDoesNotEvenExist}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                `(
                    'When typing "$relatedRecordFieldsPickerMergeFieldValue" error message should be: "$errorMessage"',
                    async ({ relatedRecordFieldsPickerMergeFieldValue, errorMessage }) => {
                        await combobox.typeMergeField(relatedRecordFieldsPickerMergeFieldValue);
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.errorMessage).toEqual(errorMessage);
                    }
                );
            });
        });
        describe('selecting', () => {
            it.each`
                relatedRecordFieldsPickerValue | relatedRecordFieldsPickerText | expectedMenuItem                      | expectedRecordFilterAssignmentsEntityName | expectedPillLabel
                ${'$Record.Contact'}           | ${'$Record.Contact'}          | ${recordCaseContactFieldMenuItem}     | ${'Contact'}                              | ${'$Record > Contact ID'}
                ${'$Record.Owner:User'}        | ${'$Record.Owner (User)'}     | ${recordCaseOwnerUserFieldMenuItem}   | ${'User'}                                 | ${'$Record > Owner ID (User)'}
                ${'$Record.Attachments'}       | ${'$Record.Attachments'}      | ${recordCaseAttachmentsFieldMenuItem} | ${'Attachment'}                           | ${'$Record > Attachments'}
            `(
                'When selecting "$relatedRecordFieldsPickerText" the related record fields picker value should be: "$relatedRecordFieldsPickerValue" with a pill labeled: "$expectedPillLabel", record filters/inputAssignments entityName: "$expectedRecordFilterAssignmentsEntityName"',
                async ({
                    relatedRecordFieldsPickerText,
                    relatedRecordFieldsPickerValue,
                    expectedMenuItem,
                    expectedRecordFilterAssignmentsEntityName,
                    expectedPillLabel
                }) => {
                    await combobox.selectItemBy('text', relatedRecordFieldsPickerText.split('.'));

                    // pill
                    expect(combobox.element.hasPill).toBe(true);
                    expect(combobox.element.pill.label).toEqual(expectedPillLabel);

                    // related record fields picker
                    expect(relatedRecordFieldsPicker.value).toEqual(relatedRecordFieldsPickerValue);
                    const recordChildrenComboboxMenuItemsValues = await getRecordChildrenComboboxMenuItemsValues(
                        combobox
                    );

                    // combobox menuItems
                    const comboboxMenuItem = findComboboxMenuItemByValue(
                        recordChildrenComboboxMenuItemsValues,
                        relatedRecordFieldsPickerValue
                    );
                    expect(comboboxMenuItem).toEqual(expectedMenuItem);

                    // record filters
                    const recordFilter = getRecordFilter(recordUpdateComponent);
                    expect(recordFilter.recordEntityName).toBe(expectedRecordFilterAssignmentsEntityName);

                    // record input assignments
                    const recordInputOutputAssignments = getRecordInputOutputAssignments(recordUpdateComponent);
                    expect(recordInputOutputAssignments.recordEntityName).toBe(
                        expectedRecordFilterAssignmentsEntityName
                    );
                }
            );
        });
    });
});
