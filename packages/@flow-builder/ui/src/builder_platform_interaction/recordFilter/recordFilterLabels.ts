import { format } from 'builder_platform_interaction/commonUtils';
import findRecords from '@salesforce/label/FlowBuilderRecordEditor.findRecords';
import addCriteria from '@salesforce/label/FlowBuilderRecordEditor.addCriteria';
import filterLhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterLhsLabel';
import filterOperatorLabel from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorLabel';
import filterRhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterRhsLabel';
import filterNoCriteriaRunFlow from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaRunFlow';
import filterNoCriteriaGet from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaGet';
import filterNoCriteria from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteria';
import filterNoCriteriaUpdate from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaUpdate';
import filterLhsPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterLhsPlaceholder';
import filterOperatorPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorPlaceholder';
import filterAllCriterias from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriterias';
import filterAllCriteriasAnd from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriteriasAnd';
import filterPrefix from '@salesforce/label/FlowBuilderRecordEditor.filterPrefix';
import criteriaMatchingRecords from '@salesforce/label/FlowBuilderRecordEditor.criteriaMatchingRecords';
import filterCriteriaHeaderDelete from '@salesforce/label/FlowBuilderRecordEditor.filterCriteriaHeaderDelete';
import filterCriteriaHeaderUpdate from '@salesforce/label/FlowBuilderRecordEditor.filterCriteriaHeaderUpdate';
import updateAllRecords from '@salesforce/label/FlowBuilderRecordEditor.updateAllRecords';
import getAllRecords from '@salesforce/label/FlowBuilderRecordEditor.getAllRecords';
import warning from '@salesforce/label/FlowBuilderRecordEditor.warning';
import andConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.andConditionLogicLabel';
import orConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.orConditionLogicLabel';
import customConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.customConditionLogicLabel';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    findRecords,
    addCriteria,
    filterLhsLabel,
    filterOperatorLabel,
    filterRhsLabel,
    filterNoCriteria,
    filterNoCriteriaRunFlow,
    filterNoCriteriaGet,
    filterNoCriteriaUpdate,
    filterLhsPlaceholder,
    filterOperatorPlaceholder,
    filterAllCriterias,
    filterAllCriteriasAnd,
    filterPrefix,
    updateAllRecords,
    getAllRecords,
    warning,
    andConditionLogicLabel,
    orConditionLogicLabel,
    customConditionLogicLabel,
    criteriaMatchingRecords,
    filterCriteriaHeaderDelete,
    filterCriteriaHeaderUpdate
};

export const CRITERIA_RECORDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.filterCriteriaHeaderUpdate,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.filterCriteriaHeaderDelete,
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.START_ELEMENT]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.START_ON_DML]: LABELS.criteriaMatchingRecords
};

export const WARNING_LABELS = {
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.updateAllRecords,
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.getAllRecords
};

const defaultFilterLogic = (recordPluralName) => {
    return [
        {
            value: CONDITION_LOGIC.NO_CONDITIONS,
            label: format(LABELS.filterNoCriteriaRunFlow, recordPluralName)
        },
        {
            value: CONDITION_LOGIC.AND,
            label: LABELS.andConditionLogicLabel
        },
        {
            value: CONDITION_LOGIC.OR,
            label: LABELS.orConditionLogicLabel
        },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: LABELS.customConditionLogicLabel
        }
    ];
};

export const filterLogicOptionsLabels = (elementType, recordPluralName, recordSingularName) => {
    switch (elementType) {
        case ELEMENT_TYPE.RECORD_CHOICE_SET:
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return [
                {
                    value: CONDITION_LOGIC.NO_CONDITIONS,
                    label: format(LABELS.filterNoCriteriaGet, recordSingularName)
                },
                {
                    value: CONDITION_LOGIC.AND,
                    label: LABELS.andConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.OR,
                    label: LABELS.orConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.CUSTOM_LOGIC,
                    label: LABELS.customConditionLogicLabel
                }
            ];
        case ELEMENT_TYPE.RECORD_UPDATE:
            return [
                {
                    value: CONDITION_LOGIC.NO_CONDITIONS,
                    label: format(LABELS.filterNoCriteriaUpdate, recordSingularName)
                },
                {
                    value: CONDITION_LOGIC.AND,
                    label: LABELS.andConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.OR,
                    label: LABELS.orConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.CUSTOM_LOGIC,
                    label: LABELS.customConditionLogicLabel
                }
            ];
        case ELEMENT_TYPE.RECORD_DELETE:
            return [
                {
                    value: CONDITION_LOGIC.AND,
                    label: LABELS.andConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.OR,
                    label: LABELS.orConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.CUSTOM_LOGIC,
                    label: LABELS.customConditionLogicLabel
                }
            ];
        case ELEMENT_TYPE.START_ON_DML:
            return [
                {
                    value: CONDITION_LOGIC.NO_CONDITIONS,
                    label: LABELS.filterNoCriteria
                },
                {
                    value: CONDITION_LOGIC.AND,
                    label: LABELS.andConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.OR,
                    label: LABELS.orConditionLogicLabel
                },
                {
                    value: CONDITION_LOGIC.CUSTOM_LOGIC,
                    label: LABELS.customConditionLogicLabel
                }
            ];
        default:
            return defaultFilterLogic(recordPluralName);
    }
};
