/* Labels */
import findRecords from "@salesforce/label/FlowBuilderRecordEditor.findRecords";
import ruleFindingRecords from "@salesforce/label/FlowBuilderRecordEditor.ruleFindingRecords";
import addCriteria from "@salesforce/label/FlowBuilderRecordEditor.addCriteria";
import filterLhsLabel from "@salesforce/label/FlowBuilderRecordEditor.filterLhsLabel";
import filterOperatorLabel from "@salesforce/label/FlowBuilderRecordEditor.filterOperatorLabel";
import filterRhsLabel from "@salesforce/label/FlowBuilderRecordEditor.filterRhsLabel";
import filterNoCriteriaGet from "@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaGet";
import filterNoCriteriaUpdate from "@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaUpdate";
import filterNoCriteriaDelete from "@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaDelete";
import filterLhsPlaceholder from "@salesforce/label/FlowBuilderRecordEditor.filterLhsPlaceholder";
import filterOperatorPlaceholder from "@salesforce/label/FlowBuilderRecordEditor.filterOperatorPlaceholder";
import filterAllCriterias from "@salesforce/label/FlowBuilderRecordEditor.filterAllCriterias";
import filterPrefix from "@salesforce/label/FlowBuilderRecordEditor.filterPrefix";
import criteriaMatchingRecords from "@salesforce/label/FlowBuilderRecordEditor.criteriaMatchingRecords";
import deleteAllRecords from "@salesforce/label/FlowBuilderRecordEditor.deleteAllRecords";
import updateAllRecords from "@salesforce/label/FlowBuilderRecordEditor.updateAllRecords";
import warning from "@salesforce/label/FlowBuilderRecordEditor.warning";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
export const LABELS = {
    findRecords,
    ruleFindingRecords,
    addCriteria,
    filterLhsLabel,
    filterOperatorLabel,
    filterRhsLabel,
    filterNoCriteriaGet,
    filterNoCriteriaUpdate,
    filterNoCriteriaDelete,
    filterLhsPlaceholder,
    filterOperatorPlaceholder,
    filterAllCriterias,
    filterPrefix,
    criteriaMatchingRecords,
    deleteAllRecords,
    updateAllRecords,
    warning,
};

export const CRITERIA_RECORDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.ruleFindingRecords,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.criteriaMatchingRecords,
};

export const WARNING_LABELS = {
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.updateAllRecords,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.deleteAllRecords,
};


export const NO_CRITERIA_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.filterNoCriteriaGet,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.filterNoCriteriaUpdate,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.filterNoCriteriaDelete,
};