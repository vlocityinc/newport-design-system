import { isNonElementResourceId, getNonElementResource } from 'builder_platform_interaction-system-lib';
import { sanitizeGuid } from 'builder_platform_interaction-data-mutation-lib';
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue,
} from './menuDataGenerator';
import * as sobjectLib from 'builder_platform_interaction-sobject-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { elementToParam } from 'builder_platform_interaction-rule-lib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

/**
 * Retrieves element or global constant
 *
 * @param {String} identifier    unique identifier that can be used to retrieve the flow resource
 * @return {Object|undefined}    element or resource if the identifier is valid, otherwise undefined
 */
export const getResourceByUniqueIdentifier = (identifier) => {
    return getElementByGuid(identifier) || getNonElementResource(identifier);
};

/**
 * Gets the data type to determine how this value should be stored in a FEROV
 *
 * @param {String} identifier    unique identifier that can be used to retrieve the flow resource
 * @returns {FEROV_DATA_TYPE}    the dataType category this value belongs to
 */
export const getResourceFerovDataType = (identifier) => {
    return isNonElementResourceId(identifier) ? getNonElementResource(identifier).dataType : FEROV_DATA_TYPE.REFERENCE;
};

/**
 * Returns the combobox display value based on the unique identifier passed
 * to the RHS.
 * @param {String} rhsIdentifier    used to identify RHS, could be GUID or literal
 * @param {Object} normalizedLHS    the normalized LHS we receive from normalizeLHS call, represents the LHS of expressionå
 * @returns {Promise}               Promise that resolves with combobox display value
 */
export const normalizeRHS = (rhsIdentifier, normalizedLHS) => {
    const rhs = {};
    const complexGuid = sanitizeGuid(rhsIdentifier);
    const flowElement = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
    if (flowElement && complexGuid.fieldName) {
        return new Promise((resolve) => {
            // TODO: W-4960448: the field will appear empty briefly when fetching the first time
            sobjectLib.getFieldsForEntity(flowElement.objectType, (fields) => {
                rhs.itemOrDisplayText = mutateFieldToComboboxShape(fields[complexGuid.fieldName], mutateFlowResourceToComboboxShape(flowElement), true, true);
                rhs.fields = fields;
                resolve(rhs);
            });
        });
    } else if (flowElement) {
        rhs.itemOrDisplayText = mutateFlowResourceToComboboxShape(flowElement);
    } else {
        // in the case that we have a literal string, we must also check for a picklist value when the LHS is a picklist field
        let foundValue;
        if (normalizedLHS && normalizedLHS.activePicklistValues) {
            // if the lhs is a picklist field and the user did not select an element then match the picklist with the field
            foundValue = normalizedLHS.activePicklistValues.find(item => item.value === rhsIdentifier);
        }
        rhs.itemOrDisplayText = foundValue ? mutatePicklistValue(foundValue) : rhsIdentifier;
    }
    return Promise.resolve(rhs);
};

/**
 * Builds the parameter representation of a field.
 *
 * @param {String} sobject           the sobject type this field belongs to
 * @param {String} fieldName         API name of the field to be described
 * @param {function} callback        to be executed after the field is retrieved
 * @returns {Object}                 the parameter representation of this field, to be used with the rules service
 */
export const getFieldParamRepresentation = (sobject, fieldName, callback) => {
    let fieldParam;
    sobjectLib.getFieldsForEntity(sobject, (fields) => {
        const field = fields[fieldName];
        field.isCollection = false;
        fieldParam = elementToParam(field);
        if (callback) {
            callback(field);
        }
    });
    return fieldParam;
};

/**
 * The shape an expression builder needs to operator on any LHS.
 * @typedef {Object} normalizedLHS
 * @param {MenuItem} item     what the combobox needs to display this lhs
 * @param {rules/param} param       the param representation of this lhs object/element
 */

/**
 * This function handles any identifier that may be passed to the LHS,
 * such as GUIDs for flow elements, and returns what the
 * the expression builder will need to use to work with that LHS.
 *
 * @param {String} lhsIdentifier    Used to identify the LHS (e.g. GUID for flow elements)
 * @param {String} elementType      in case lhsIdentifier.guid is not the flow element, we need this to pass in elementToParam
 * @param {Function} callback       The value returned by this function. Only used in the callback
 * @returns {normalizedLHS}         {item, parameter}, lhsValue is the item to pass to the combobox, lhsParameter is needed for the rules service
 */
export const normalizeLHS = (lhsIdentifier, elementType, callback) => {
    const lhs = {};
    const complexGuid = sanitizeGuid(lhsIdentifier);
    const flowElement = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
    if (!flowElement) {
        // Pass in lhsIdentifier as string in the default case
        lhs.item = lhsIdentifier;
    }
    if (complexGuid.fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        const sobject = (flowElement) ? flowElement.objectType : complexGuid.guidOrLiteral;
        lhs.parameter = getFieldParamRepresentation(sobject, complexGuid.fieldName, (field) => {
            const isFieldOnSobjectVar = !!flowElement;
            const fieldParent = isFieldOnSobjectVar ? mutateFlowResourceToComboboxShape(flowElement) : {value: field.sobjectName};
            lhs.item = mutateFieldToComboboxShape(field, fieldParent, isFieldOnSobjectVar, isFieldOnSobjectVar);
            if (callback) {
                callback(lhsIdentifier);
            }
            lhs.activePicklistValues = field.activePicklistValues;
        });
    } else if (flowElement) {
        lhs.item = mutateFlowResourceToComboboxShape(flowElement);
        lhs.parameter = elementToParam(flowElement);
    }
    return lhs;
};
