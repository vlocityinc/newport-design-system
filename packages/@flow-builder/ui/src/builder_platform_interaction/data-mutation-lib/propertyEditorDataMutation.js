import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {
    mutateAssignment,
    deMutateAssignment
} from './assignmentEditorDataMutation';
import {
    mutateDecision,
    deMutateDecision
} from './decisionEditorDataMutation';
import {
    mutateVariableOrConstant,
    deMutateVariableOrConstant,
} from './variableConstantEditorDataMutation';
import {
    mutateRecordLookup,
    deMutateRecordLookup
} from './recordLookupEditorDataMutation';
import {
    mutateScreen,
    demutateScreen
} from './screenEditorDataMutation';
import {
    mutateFormula,
    demutateFormula
} from './formulaEditorDataMutation';
import {
    mutateFlowProperties,
    demutateFlowProperties
} from './flowPropertiesEditorDataMutation';
/**
 * Add property editor mutation for a given element
 *
 * @param {Object} element Property editor element to mutate
 * @param {Object} state State of the whole project
 * @return {Object} Element in the shape required by property editor
 */
export const mutateEditorElement = (element, state) => {
    // TODO: change editor mutation implementations to be immutable
    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        mutateAssignment(element);
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        mutateDecision(element, state);
    } else if (element.elementType === ELEMENT_TYPE.VARIABLE || element.elementType === ELEMENT_TYPE.CONSTANT) {
        return mutateVariableOrConstant(element);
    } else if (element.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
        return mutateRecordLookup(element);
    } else if (element.elementType === ELEMENT_TYPE.SCREEN) {
        return mutateScreen(element);
    } else if (element.elementType === ELEMENT_TYPE.FORMULA) {
        return mutateFormula(element);
    } else if (element.elementType === ELEMENT_TYPE.FLOW_PROPERTIES) {
        return mutateFlowProperties(element);
    }

    // TODO Add other element types

    return element;
};

/**
 * Remove property editor mutation for a given element.  This may cause additional
 * (children) objects to be modified or deleted as well as the original object.
 *
 * For example: outcomes when a decision is being modified
 *
 * @param {Object} element Property editor element for which mutation is to be removed
 * @param {Object} state State of the whole project
 * @return {Object} Element in the shape required by store
 */
export const removeEditorElementMutation = (element, state) => {
    // TODO: change editor demutation implementations to be immutable
    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        deMutateAssignment(element);
        return element;
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        // deMutateDecision returns outcome elements that also need to be updated in the store
        // as well as outcomes that need to be deleted
        const decisionWithModifiedAndDeletedOutcomes = deMutateDecision(element, state);

        return decisionWithModifiedAndDeletedOutcomes;
    } else if (element.elementType === ELEMENT_TYPE.VARIABLE || element.elementType === ELEMENT_TYPE.CONSTANT) {
        return deMutateVariableOrConstant(element);
    } else if (element.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
        return deMutateRecordLookup(element);
    } else if (element.elementType === ELEMENT_TYPE.SCREEN) {
        return demutateScreen(element);
    }  else if (element.elementType === ELEMENT_TYPE.FORMULA) {
        return demutateFormula(element);
    } else if (element.elementType === ELEMENT_TYPE.FLOW_PROPERTIES) {
        return demutateFlowProperties(element);
    }
    // TODO: Should we throw an exception if  the element type isn't recognized?
    return element;

    // TODO Add other element types
};
