// @ts-nocheck
import allRecordsLabel from '@salesforce/label/FlowBuilderRecordEditor.allRecords';
/* Labels */
import firstRecordLabel from '@salesforce/label/FlowBuilderRecordEditor.firstRecord';
import howAreFieldValuesNewRecordStore from '@salesforce/label/FlowBuilderRecordEditor.howAreFieldValuesNewRecordStore';
import howManyRecordsToCreateLabel from '@salesforce/label/FlowBuilderRecordEditor.howManyRecordsToCreateLabel';
import howToFindRecordsToDeteLabel from '@salesforce/label/FlowBuilderRecordEditor.howToFindRecordsToDete';
import idsStoredSObjectOrSObjectCollectionLabel from '@salesforce/label/FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel';
import multipleRecordsLabel from '@salesforce/label/FlowBuilderRecordEditor.multipleRecordsLabel';
import oneRecordLabel from '@salesforce/label/FlowBuilderRecordEditor.oneRecordLabel';
import assignNullValuesIfNoRecordsFoundLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionAssignNullIfNoRecordFoundLabel';
import numberRecordsToStoreLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionHowManyRecordsToStoreLabel';
import wayToStoreFieldsLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionWhereToStoreRecordsLabel';
import separateVariable from '@salesforce/label/FlowBuilderRecordEditor.separateVariable';
import specifyConditionsToDeleteLabel from '@salesforce/label/FlowBuilderRecordEditor.specifyConditionsToDelete';
import storeFieldsSelectionLabel from '@salesforce/label/FlowBuilderRecordEditor.storeFieldsSelectionLabel';
import togetherInsObjectVariable from '@salesforce/label/FlowBuilderRecordEditor.togetherInsObjectVariable';
import useAllValuesFromRecordVariableLabel from '@salesforce/label/FlowBuilderRecordEditor.useAllValuesFromRecordVariable';
import useIdsStoredToDeleteLabel from '@salesforce/label/FlowBuilderRecordEditor.useIdsStoredToDelete';
import useSeparateVariableLabel from '@salesforce/label/FlowBuilderRecordEditor.useSeparateVariable';
import usingCriteriaLabel from '@salesforce/label/FlowBuilderRecordEditor.usingCriteriaLabel';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';

export const LABELS = {
    firstRecordLabel,
    allRecordsLabel,
    togetherInsObjectVariable,
    separateVariable,
    storeFieldsSelectionLabel,
    numberRecordsToStoreLabel,
    wayToStoreFieldsLabel,
    assignNullValuesIfNoRecordsFoundLabel,
    howManyRecordsToCreateLabel,
    oneRecordLabel,
    multipleRecordsLabel,
    howAreFieldValuesNewRecordStore,
    usingCriteriaLabel,
    idsStoredSObjectOrSObjectCollectionLabel,
    useAllValuesFromRecordVariableLabel,
    useSeparateVariableLabel,
    howToFindRecordsToDeteLabel,
    useIdsStoredToDeleteLabel,
    specifyConditionsToDeleteLabel
};

const getNumberRecordsOption = (labelFirstRecord, labelAllRecord) => {
    return [
        {
            label: labelFirstRecord,
            value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
        },
        {
            label: labelAllRecord,
            value: NUMBER_RECORDS_TO_STORE.ALL_RECORDS
        }
    ];
};

const getWayToStoreOption = (labelFirstWay, labelSecondWay) => {
    return [
        {
            label: labelFirstWay,
            value: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
        },
        {
            label: labelSecondWay,
            value: WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
        }
    ];
};

/**
 * This Constant is used in the first radio button group.
 * The labels depend on the element type but the values are still the same
 */
export const NUMBER_RECORDS_OPTIONS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: getNumberRecordsOption(LABELS.firstRecordLabel, LABELS.allRecordsLabel),
    [ELEMENT_TYPE.RECORD_CREATE]: getNumberRecordsOption(LABELS.oneRecordLabel, LABELS.multipleRecordsLabel),
    [ELEMENT_TYPE.RECORD_DELETE]: getNumberRecordsOption(
        LABELS.useIdsStoredToDeleteLabel,
        LABELS.specifyConditionsToDeleteLabel
    )
};

/**
 * This Constant is used in the second radio button group.
 * The labels depend on the element type but the values are still the same
 */
export const WAY_TO_STORE_FIELDS_OPTIONS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: getWayToStoreOption(LABELS.togetherInsObjectVariable, LABELS.separateVariable),
    [ELEMENT_TYPE.RECORD_CREATE]: getWayToStoreOption(
        LABELS.useAllValuesFromRecordVariableLabel,
        LABELS.useSeparateVariableLabel
    )
};

export const NUMBER_RECORDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.numberRecordsToStoreLabel,
    [ELEMENT_TYPE.RECORD_CREATE]: LABELS.howManyRecordsToCreateLabel,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.howToFindRecordsToDeteLabel
};

export const WAY_TO_STORE_FIELDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.wayToStoreFieldsLabel,
    [ELEMENT_TYPE.RECORD_CREATE]: LABELS.howAreFieldValuesNewRecordStore
};
