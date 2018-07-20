import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';
/* Labels */
import firstRecordLabel from "@salesforce/label/FlowBuilderRecordEditor.firstRecord";
import allRecordsLabel from "@salesforce/label/FlowBuilderRecordEditor.allRecords";
import togetherInsObjectVariable from "@salesforce/label/FlowBuilderRecordEditor.togetherInsObjectVariable";
import separateVariable from "@salesforce/label/FlowBuilderRecordEditor.separateVariable";
import storeFieldsSelectionLabel from "@salesforce/label/FlowBuilderRecordEditor.storeFieldsSelectionLabel";
import numberRecordsToStoreLabel from "@salesforce/label/FlowBuilderRecordEditor.selectionHowManyRecordsToStoreLabel";
import wayToStoreFieldsLabel from "@salesforce/label/FlowBuilderRecordEditor.selectionWhereToStoreRecordsLabel";
import assignNullValuesIfNoRecordsFoundLabel from "@salesforce/label/FlowBuilderRecordEditor.selectionAssignNullIfNoRecordFoundLabel";
import howManyRecordsToCreateLabel from "@salesforce/label/FlowBuilderRecordEditor.howManyRecordsToCreateLabel";
import oneRecordLabel from "@salesforce/label/FlowBuilderRecordEditor.oneRecordLabel";
import multipleRecordsLabel from "@salesforce/label/FlowBuilderRecordEditor.multipleRecordsLabel";
import howAreFieldValuesNewRecordStore from "@salesforce/label/FlowBuilderRecordEditor.howAreFieldValuesNewRecordStore";
import howAreSpecifyRecordsToUpdateLabel from "@salesforce/label/FlowBuilderRecordEditor.howAreSpecifyRecordsToUpdateLabel";
import usingCriteriaLabel from "@salesforce/label/FlowBuilderRecordEditor.usingCriteriaLabel";
import idsStoredSObjectOrSObjectCollectionLabel from "@salesforce/label/FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel";
import howAreSpecifyRecordsToDeleteLabel from "@salesforce/label/FlowBuilderRecordEditor.howAreSpecifyRecordsToDeleteLabel";

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
    howAreSpecifyRecordsToUpdateLabel,
    usingCriteriaLabel,
    idsStoredSObjectOrSObjectCollectionLabel,
    howAreSpecifyRecordsToDeleteLabel
};

const getNumberRecordsOption = (labelFirstRecord, labelAllRecord) => {
    return [{
        label : labelFirstRecord,
        value : NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
    }, {
        label : labelAllRecord,
        value : NUMBER_RECORDS_TO_STORE.ALL_RECORDS,
    }];
};

/**
 * This Constant is used in the first radio button group.
 * The labels depend on the element type but the values are still the same
 */
export const NUMBER_RECORDS_OPTIONS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: getNumberRecordsOption(LABELS.firstRecordLabel, LABELS.allRecordsLabel),
    [ELEMENT_TYPE.RECORD_CREATE]: getNumberRecordsOption(LABELS.oneRecordLabel, LABELS.multipleRecordsLabel),
    [ELEMENT_TYPE.RECORD_UPDATE]: getNumberRecordsOption(LABELS.idsStoredSObjectOrSObjectCollectionLabel, LABELS.usingCriteriaLabel),
    [ELEMENT_TYPE.RECORD_DELETE]: getNumberRecordsOption(LABELS.idsStoredSObjectOrSObjectCollectionLabel, LABELS.usingCriteriaLabel)
};

export const NUMBER_RECORDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.numberRecordsToStoreLabel,
    [ELEMENT_TYPE.RECORD_CREATE]: LABELS.howManyRecordsToCreateLabel,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.howAreSpecifyRecordsToUpdateLabel,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.howAreSpecifyRecordsToDeleteLabel,
};

export const WAY_TO_STORE_FIELDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.wayToStoreFieldsLabel,
    [ELEMENT_TYPE.RECORD_CREATE]:  LABELS.howAreFieldValuesNewRecordStore,
};

export const WAY_TO_STORE_FIELDS_OPTIONS = [{
    label : LABELS.togetherInsObjectVariable,
    value : 'sObjectVariable'
}, {
    label : LABELS.separateVariable,
    value : 'separateVariables'
}];
