// @ts-nocheck
import { format } from 'builder_platform_interaction/commonUtils';
/* Labels */
import findRecords from '@salesforce/label/FlowBuilderRecordEditor.findRecords';
import ruleFindingRecords from '@salesforce/label/FlowBuilderRecordEditor.ruleFindingRecords';
import addCriteria from '@salesforce/label/FlowBuilderRecordEditor.addCriteria';
import filterLhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterLhsLabel';
import filterOperatorLabel from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorLabel';
import filterRhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterRhsLabel';
import filterNoCriteriaGet from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaGet';
import filterNoCriteria from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteria';
import filterNoCriteriaUpdate from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaUpdate';
import filterLhsPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterLhsPlaceholder';
import filterOperatorPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorPlaceholder';
import filterAllCriterias from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriterias';
import filterAllCriteriasAnd from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriteriasAnd';
import filterPrefix from '@salesforce/label/FlowBuilderRecordEditor.filterPrefix';
import criteriaMatchingRecords from '@salesforce/label/FlowBuilderRecordEditor.criteriaMatchingRecords';
import updateAllRecords from '@salesforce/label/FlowBuilderRecordEditor.updateAllRecords';
import getAllRecords from '@salesforce/label/FlowBuilderRecordEditor.getAllRecords';
import warning from '@salesforce/label/FlowBuilderRecordEditor.warning';
import andConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.andConditionLogicLabel';
import orConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.orConditionLogicLabel';
import customConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.customConditionLogicLabel';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    findRecords,
    ruleFindingRecords,
    addCriteria,
    filterLhsLabel,
    filterOperatorLabel,
    filterRhsLabel,
    filterNoCriteria,
    filterNoCriteriaGet,
    filterNoCriteriaUpdate,
    filterLhsPlaceholder,
    filterOperatorPlaceholder,
    filterAllCriterias,
    filterAllCriteriasAnd,
    filterPrefix,
    criteriaMatchingRecords,
    updateAllRecords,
    getAllRecords,
    warning,
    andConditionLogicLabel,
    orConditionLogicLabel,
    customConditionLogicLabel
};

export const CRITERIA_RECORDS_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.ruleFindingRecords,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.RECORD_DELETE]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: LABELS.criteriaMatchingRecords,
    [ELEMENT_TYPE.START_ELEMENT]: LABELS.ruleFindingRecords
};

export const WARNING_LABELS = {
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.updateAllRecords,
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.getAllRecords
};

export const NO_CRITERIA_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.filterNoCriteriaGet,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.filterNoCriteriaUpdate,
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: LABELS.filterNoCriteriaGet,
    [ELEMENT_TYPE.START_ELEMENT]: LABELS.filterNoCriteriaGet
};

export const ALL_CRITERIA_LABELS = {
    [ELEMENT_TYPE.RECORD_LOOKUP]: LABELS.filterAllCriterias,
    [ELEMENT_TYPE.RECORD_UPDATE]: LABELS.filterAllCriterias,
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: LABELS.filterAllCriterias,
    [ELEMENT_TYPE.START_ELEMENT]: LABELS.filterAllCriteriasAnd
};

const defaultFilterLogic = recordName => {
    return [
        {
            value: CONDITION_LOGIC.NO_CONDITIONS,
            label: format(LABELS.filterNoCriteriaGet, recordName)
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

export const filterLogicOptions = (elementType, recordName) => {
    switch (elementType) {
        case ELEMENT_TYPE.RECORD_UPDATE:
            return [
                {
                    value: CONDITION_LOGIC.NO_CONDITIONS,
                    label: format(LABELS.filterNoCriteriaUpdate, recordName)
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
                    label: format(LABELS.filterNoCriteria, recordName)
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
            return defaultFilterLogic(recordName);
    }
};
