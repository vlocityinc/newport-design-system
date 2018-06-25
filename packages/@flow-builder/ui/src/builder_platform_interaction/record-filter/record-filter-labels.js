/* Labels */
import findRecords from '@label/FlowBuilderRecordEditor.findRecords';
import ruleFindingRecords from '@label/FlowBuilderRecordEditor.ruleFindingRecords';
import addCriteria from '@label/FlowBuilderRecordEditor.addCriteria';
import filterLhsLabel from '@label/FlowBuilderRecordEditor.filterLhsLabel';
import filterOperatorLabel from '@label/FlowBuilderRecordEditor.filterOperatorLabel';
import filterRhsLabel from '@label/FlowBuilderRecordEditor.filterRhsLabel';
import filterNoCriteria from '@label/FlowBuilderRecordEditor.filterNoCriteria';
import filterAllCriterias from '@label/FlowBuilderRecordEditor.filterAllCriterias';
import filterPrefix from '@label/FlowBuilderRecordEditor.filterPrefix';
import criteriaMatchingRecords from '@label/FlowBuilderRecordEditor.criteriaMatchingRecords';
import deleteAllRecords from '@label/FlowBuilderRecordEditor.deleteAllRecords';
import updateAllRecords from '@label/FlowBuilderRecordEditor.updateAllRecords';
import warning from '@label/FlowBuilderRecordEditor.warning';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
export const LABELS = {
    findRecords,
    ruleFindingRecords,
    addCriteria,
    filterLhsLabel,
    filterOperatorLabel,
    filterRhsLabel,
    filterNoCriteria,
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