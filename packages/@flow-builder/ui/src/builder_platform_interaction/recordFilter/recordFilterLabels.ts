import andConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.andConditionLogicLabel';
import customConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.customConditionLogicLabel';
import orConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.orConditionLogicLabel';
import formulaOptionLabel from '@salesforce/label/FlowBuilderFilterEditor.formulaOptionLabel';
import addCriteria from '@salesforce/label/FlowBuilderRecordEditor.addCriteria';
import criteriaMatchingRecords from '@salesforce/label/FlowBuilderRecordEditor.criteriaMatchingRecords';
import filterAllCriterias from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriterias';
import filterAllCriteriasAnd from '@salesforce/label/FlowBuilderRecordEditor.filterAllCriteriasAnd';
import filterCriteriaHeaderDelete from '@salesforce/label/FlowBuilderRecordEditor.filterCriteriaHeaderDelete';
import filterLhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterLhsLabel';
import filterLhsPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterLhsPlaceholder';
import filterNoCriteria from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteria';
import filterNoCriteriaGet from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaGet';
import filterNoCriteriaRunFlow from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaRunFlow';
import filterNoCriteriaUpdate from '@salesforce/label/FlowBuilderRecordEditor.filterNoCriteriaUpdate';
import filterOperatorLabel from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorLabel';
import filterOperatorPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.filterOperatorPlaceholder';
import filterPrefix from '@salesforce/label/FlowBuilderRecordEditor.filterPrefix';
import filterRhsLabel from '@salesforce/label/FlowBuilderRecordEditor.filterRhsLabel';
import findRecords from '@salesforce/label/FlowBuilderRecordEditor.findRecords';
import getAllRecords from '@salesforce/label/FlowBuilderRecordEditor.getAllRecords';
import updateAllRecords from '@salesforce/label/FlowBuilderRecordEditor.updateAllRecords';
import warning from '@salesforce/label/FlowBuilderRecordEditor.warning';
import filterCriteriaHeaderUpdate from '@salesforce/label/FlowBuilderRecordUpdateEditor.filterCriteriaHeaderUpdate';
import recordPluralLabel from '@salesforce/label/FlowBuilderRecordUpdateEditor.recordPluralLabel';
import recordSingularLabel from '@salesforce/label/FlowBuilderRecordUpdateEditor.recordSingularLabel';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

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
    filterCriteriaHeaderUpdate,
    recordSingularLabel,
    recordPluralLabel,
    formulaOptionLabel
};

export const criteriaLabels = (elementType, isSingular) => {
    switch (elementType) {
        case ELEMENT_TYPE.RECORD_LOOKUP:
            return LABELS.criteriaMatchingRecords;
        case ELEMENT_TYPE.RECORD_UPDATE:
            return isSingular
                ? format(LABELS.filterCriteriaHeaderUpdate, recordSingularLabel)
                : format(LABELS.filterCriteriaHeaderUpdate, recordPluralLabel);
        case ELEMENT_TYPE.RECORD_DELETE:
            return LABELS.filterCriteriaHeaderDelete;
        case ELEMENT_TYPE.RECORD_CHOICE_SET:
            return LABELS.criteriaMatchingRecords;
        case ELEMENT_TYPE.START_ELEMENT:
            return LABELS.criteriaMatchingRecords;
        case ELEMENT_TYPE.START_ON_DML:
            return LABELS.criteriaMatchingRecords;
        default:
            return LABELS.criteriaMatchingRecords;
    }
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
                },
                {
                    value: CONDITION_LOGIC.FORMULA,
                    label: LABELS.formulaOptionLabel
                }
            ];
        default:
            return defaultFilterLogic(recordPluralName);
    }
};
