import {
    getGlobalConstantOrSystemVariable,
    getGlobalVariable,
    isRecordSystemVariableIdentifier,
    GLOBAL_CONSTANT_OBJECTS
} from 'builder_platform_interaction/systemLib';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import {
    mutateFieldToComboboxShape,
    mutateFlowResourceToComboboxShape
} from './menuDataGenerator';
import {
    getElementByGuid,
    getElementByDevName
} from 'builder_platform_interaction/storeUtils';
import { elementToParam } from 'builder_platform_interaction/ruleLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    isObject,
    addCurlyBraces,
    format
} from 'builder_platform_interaction/commonUtils';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import removedResource from '@salesforce/label/FlowBuilderValidation.removedResource';
import { retrieveResourceComplexTypeFields } from 'builder_platform_interaction/complexTypeLib';

/* Global variable to hold the current state of the screen element.
 *  This is being populated by the screenEditor component and
 *   used for accessing screen components added in the current session (which have not yet been committed to the store)
 *   in resource pickers inside the editor.
 * */
let screen = null;

export const  setScreenElement = element => {
    screen = element;
};

export const getScreenElement = () => {
    return screen;
};

export const EXPRESSION_PROPERTY_TYPE = {
    LEFT_HAND_SIDE: 'leftHandSide',
    OPERATOR: 'operator',
    RIGHT_HAND_SIDE: 'rightHandSide',
    RIGHT_HAND_SIDE_DATA_TYPE: 'rightHandSideDataType'
};

export const OPERATOR_DISPLAY_OPTION = {
    COMBOBOX: 'combobox',
    RIGHT_ARROW: 'utility:forward',
    LEFT_ARROW: 'utility:back',
    NONE: 'none'
};

/**
 * The LHS of an expression builder is either a merge field that is not a field,
 * a field on a variable like {!sobjectVar.fieldName}, or a standalone field, "AccountNumber"
 * @type {{NOT_FIELD: string, FIELD_ON_VARIABLE: string, SOBJECT_FIELD: string}}
 */
export const LHS_DISPLAY_OPTION = {
    NOT_FIELD: 'notField',
    FIELD_ON_VARIABLE: 'fieldOnVariable',
    SOBJECT_FIELD: 'sobjectField'
};

/**
 * Extract out value from the event or item if payload is from combobox
 * Ex: If a select happened it will have an item as payload
 * Ex: if a literal is typed then the event will not have an item, just a display text
 * @param {Object} event Event for the data type
 * @return {Object|String} value of the event payload
 */
export const getItemOrDisplayText = event => {
    // if it is a combobox value changed event we have two cases: literals or item select
    return event.detail.item || event.detail.displayText;
};

/**
 * Retrieves element or global constant
 *
 * @param {String} identifier    unique identifier that can be used to retrieve the flow resource
 * @return {Object|undefined}    element or resource if the identifier is valid, otherwise undefined
 */
export const getResourceByUniqueIdentifier = identifier => {
    if (identifier) {
        const complexGuid = sanitizeGuid(identifier);
        return (
            getElementByGuid(complexGuid.guidOrLiteral) ||
            getGlobalConstantOrSystemVariable(identifier) ||
            getGlobalVariable(identifier) ||
            getUncommittedResource(identifier) ||
            (isRecordSystemVariableIdentifier(complexGuid.guidOrLiteral) &&
                getElementByDevName(complexGuid.guidOrLiteral))
        );
    }
    return null;
};

// Check if the resource has been added to the screen in the current session.
// Such a resource will not be present in the source so we need to check in the screen attribute
export function getUncommittedResource(identifier) {
    screen = getScreenElement();
    if (screen && screen.fields) {
        return screen.fields.find(field => {
            return field.guid === identifier;
        });
    }
    return null;
}

/**
 * Gets the data type to determine how this value should be stored in a FEROV if the id belongs to a valid resource.
 * If the id doesn't belong to a valid resource returns null
 *
 * @param {String} identifier    unique identifier that can be used to retrieve the flow resource
 * @returns {FEROV_DATA_TYPE|null}    the dataType category this value belongs to or null if it doesn't exist
 */
export const getFerovDataTypeForValidId = identifier => {
    if (GLOBAL_CONSTANT_OBJECTS[identifier]) {
        return GLOBAL_CONSTANT_OBJECTS[identifier].dataType;
    } else if (getResourceByUniqueIdentifier(identifier)) {
        return FEROV_DATA_TYPE.REFERENCE;
    }
    return null;
};

/**
 * Retrieves the information needed for components to update a ferov from a combobox state changed payload
 * @param {Object} event  event fired by the combobox on change
 * @param {Object} literalDataType the data type we want to assign a literal
 * @returns {Object} object with value and dataType of the ferov, and the error if there is one
 */
export const getFerovInfoAndErrorFromEvent = (event, literalDataType) => {
    const itemOrDisplayText = event.detail.item || event.detail.displayText;
    let error = event.detail.error;
    let value = event.detail.displayText;
    let dataType = literalDataType;
    if (isObject(itemOrDisplayText) && !error) {
        const resourceDataType = getFerovDataTypeForValidId(
            itemOrDisplayText.value
        );
        if (resourceDataType) {
            value = itemOrDisplayText.value;
            dataType = resourceDataType;
        } else {
            error = genericErrorMessage;
        }
    } else if (event.detail.isMergeField) {
        dataType = FEROV_DATA_TYPE.REFERENCE;
    }
    return {
        value,
        dataType,
        error
    };
};

/**
 * Returns the combobox display value based on the unique identifier passed
 * to the RHS.
 * @param {String} identifier    used to identify value, could be GUID or literal
 * @returns {Item}               value in format displayable by combobox
 */
export const normalizeFEROV = identifier => {
    // TODO: W-5981876 consolidate this with outputResourcePicker.normalizeValue
    const rhs = { itemOrDisplayText: identifier };
    const flowElement = getResourceByUniqueIdentifier(identifier);
    if (flowElement) {
        const item = mutateFlowResourceToComboboxShape(flowElement);
        const sanitizedGuid = sanitizeGuid(identifier);
        const fieldName = sanitizedGuid.fieldName;
        if (!fieldName) {
            rhs.itemOrDisplayText = item;
        } else {
            const fields = retrieveResourceComplexTypeFields(flowElement);
            const field = fields && fields[fieldName];
            if (field && fieldName.indexOf('.') === -1) {
                rhs.itemOrDisplayText = mutateFieldToComboboxShape(
                    field,
                    item,
                    true,
                    true
                );
            } else {
                rhs.itemOrDisplayText = addCurlyBraces(
                    item.text + '.' + fieldName
                );
            }
            rhs.fields = fields;
        }
    }
    return rhs;
};

/**
 * The shape an expression builder needs to operator on any LHS.
 * @typedef {Object} normalizedLHS
 * @param {MenuItem} item     what the combobox needs to display this lhs
 * @param {rules/param} param       the param representation of this lhs object/element
 */

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
export const populateLhsStateForField = (
    fields,
    fieldName,
    fieldParent,
    isFieldOnSobjectVar
) => {
    const lhsState = {
        fields
    };
    const field = fields && fields[fieldName];
    if (field) {
        lhsState.value = mutateFieldToComboboxShape(
            field,
            fieldParent,
            isFieldOnSobjectVar,
            isFieldOnSobjectVar
        );
        lhsState.activePicklistValues = field.activePicklistValues || false;
        lhsState.param = elementToParam(field);
    }
    return lhsState;
};

/**
 * Populates the state values on an expression builder wrapper that represent the RHS of the expression.
 *
 * @param {Object} expression   rightHandSide - the display value of the rhs
 *                              rightHandSideDataType - the data type of the rhs
 * @param {rhsDescribe} callback   function to be called with the initialized state values
 */
export const populateRhsState = ({ rightHandSide }, callback) => {
    let rhsState = {
        isField: false,
        fields: null,
        error: rightHandSide.error,
        itemOrDisplayText: rightHandSide.value
    };

    if (!rightHandSide.error) {
        rhsState = Object.assign(rhsState, normalizeFEROV(rightHandSide.value));
        rhsState.isField = !!rhsState.fields;
    }
    callback(rhsState);
};

export const checkExpressionForDeletedElem = (
    deletedGuids,
    expression,
    propertyEditorLabel
) => {
    const checkComboboxForDeletedElem = prop => {
        const property = expression[prop];
        if (property && !property.error && deletedGuids.has(property.value)) {
            const deletedDevName = getResourceByUniqueIdentifier(property.value)
                .name;
            property.value = addCurlyBraces(deletedDevName);
            property.error = format(
                removedResource,
                deletedDevName,
                propertyEditorLabel
            );
        }
    };

    [
        EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
        EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE
    ].forEach(prop => checkComboboxForDeletedElem(prop));
};
