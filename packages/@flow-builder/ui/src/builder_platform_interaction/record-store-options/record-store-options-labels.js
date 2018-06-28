import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';
/* Labels */
import firstRecordLabel from '@label/FlowBuilderRecordEditor.firstRecord';
import allRecordsLabel from '@label/FlowBuilderRecordEditor.allRecords';
import togetherInsObjectVariable from '@label/FlowBuilderRecordEditor.togetherInsObjectVariable';
import separateVariable from '@label/FlowBuilderRecordEditor.separateVariable';
import storeFieldsSelectionLabel from '@label/FlowBuilderRecordEditor.storeFieldsSelectionLabel';
import numberRecordsToStoreLabel from '@label/FlowBuilderRecordEditor.selectionHowManyRecordsToStoreLabel';
import wayToStoreFieldsLabel from '@label/FlowBuilderRecordEditor.selectionWhereToStoreRecordsLabel';
import assignNullValuesIfNoRecordsFoundLabel from '@label/FlowBuilderRecordEditor.selectionAssignNullIfNoRecordFoundLabel';
import howManyRecordsToCreateLabel from '@label/FlowBuilderRecordEditor.howManyRecordsToCreateLabel';
import oneRecordLabel from '@label/FlowBuilderRecordEditor.oneRecordLabel';
import multipleRecordsLabel from '@label/FlowBuilderRecordEditor.multipleRecordsLabel';
import howAreFieldValuesNewRecordStore from '@label/FlowBuilderRecordEditor.howAreFieldValuesNewRecordStore';
import howAreSpecifyRecordsToUpdateLabel from '@label/FlowBuilderRecordEditor.howAreSpecifyRecordsToUpdateLabel';
import usingCriteriaLabel from '@label/FlowBuilderRecordEditor.usingCriteriaLabel';
import idsStoredSObjectOrSObjectCollectionLabel from '@label/FlowBuilderRecordEditor.idsStoredSObjectOrSObjectCollectionLabel';
import howAreSpecifyRecordsToDeleteLabel from '@label/FlowBuilderRecordEditor.howAreSpecifyRecordsToDeleteLabel';

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
