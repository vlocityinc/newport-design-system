import { isNonElementResourceId, getNonElementResource } from "builder_platform_interaction/systemLib";
import { sanitizeGuid } from "builder_platform_interaction/dataMutationLib";
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape,
    mutatePicklistValue,
} from './menuDataGenerator';
import * as sobjectLib from "builder_platform_interaction/sobjectLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { elementToParam } from "builder_platform_interaction/ruleLib";
import { FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

export const EXPRESSION_PROPERTY_TYPE = {
    LEFT_HAND_SIDE: 'leftHandSide',
    OPERATOR: 'operator',
    RIGHT_HAND_SIDE: 'rightHandSide',
    RIGHT_HAND_SIDE_DATA_TYPE: 'rightHandSideDataType',
    RIGHT_HAND_SIDE_GUID: 'rightHandSideGuid',
};

export const OPERATOR_DISPLAY_OPTION = {
    COMBOBOX: 'combobox',
    RIGHT_ARROW: 'utility:forward',
    LEFT_ARROW: 'utility:back',
    NONE: 'none',
};

/**
 * The LHS of an expression builder is either a merge field that is not a field,
 * a field on a variable like {!sobjectVar.fieldName}, or a standalone field, "AccountNumber"
 * @type {{NOT_FIELD: string, FIELD_ON_VARIABLE: string, SOBJECT_FIELD: string}}
 */
export const LHS_DISPLAY_OPTION = {
    NOT_FIELD: 'notField',
    FIELD_ON_VARIABLE: 'fieldOnVariable',
    SOBJECT_FIELD: 'sobjectField',
};

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

/**
 * @typedef lhsDescribe                    the needed values to represent a field value for the LHS of an expression
 * @param {Object} value                   the combobox item to represent the LHS
 * @param {String[]} activePicklistValues  if the LHS is a picklist field, these are the possible values
 * @param {rules/param} param              the parameterized version of the LHS, to be used with the rules
 * @param {Object[]} fields                fields that should be shown in the menuData
 * @param {String} displayOption           from LHS_DISPLAY_OPTION
 */

/**
 * @typedef rhsDescribe      the needed values to represent a value on the RHS of an expression
 * @param {Object} value     the combobox item to represent the RHS
 * @param {String} guid      the GUID of the RHS
 * @param {String} error     the validation error to show the user
 * @param {Boolean} isField  true if this value is a field
 * @param {Object[]} fields  if the menudata shown should be fields, this is the list of fields
 */

/**
 * Populates the state values on an expression builder wrapper to represent the LHS, when the LHS is a field.
 *
 * @param {String} fields             the fields for the lhs menudata
 * @param {String|undefined} fieldName    the api name of the currently selected field, if a field is already selected
 * @param {Object|undefined} fieldParent  the object representing the parent of the currectly selected field, if a field is already selected
 * @param {Boolean} isFieldOnSobjectVar   true if this field should be displayed in a mergefield relative to an sobject variable, false if it should be displayed alone
 * @returns {lhsDescribe}                      describes the attributes needed for the expression builder
 */
export const populateLhsStateForField =  (fields, fieldName, fieldParent, isFieldOnSobjectVar) => {
    const lhsState = {
        fields,
    };
    const field = fields[fieldName];
    if (field) {
        lhsState.value = mutateFieldToComboboxShape(field, fieldParent, isFieldOnSobjectVar, isFieldOnSobjectVar);
        lhsState.activePicklistValues = field.activePicklistValues || false;
        lhsState.param = elementToParam(field);
    }
    return lhsState;
};

/**
 * Populates the state values on an expression builder wrapper that represent the RHS of the expression.
 *
 * @param {String} rhs          the display value of the rhs
 * @param {String} guid         the guid of the rhs
 * @param {rhsDescribe} callback   function to be called with the initialized state values
 */
export const populateRhsState = (rhs, guid, callback) => {
    const rhsState = {
        isField: false,
        fields: null,
        error: rhs.error,
        guid: guid || null,
        value: rhs.value,
    };

    if (!rhs.error && guid) {
        const complexGuid = sanitizeGuid(guid);
        const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);

        if (fer) {
            const rhsItem = mutateFlowResourceToComboboxShape(fer);
            rhsState.value = rhsItem;
            if (complexGuid.fieldName) {
                const isFieldOnSobjectVar = true;
                sobjectLib.getFieldsForEntity(fer.objectType, (fields) => {
                    rhsState.isField = true;
                    rhsState.value = mutateFieldToComboboxShape(fields[complexGuid.fieldName], rhsItem, isFieldOnSobjectVar, isFieldOnSobjectVar);
                    rhsState.fields = fields;
                    callback(rhsState);
                });
                return;
            }
        }
    }
    callback(rhsState);
};
