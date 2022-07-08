// @ts-nocheck
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import removedResource from '@salesforce/label/FlowBuilderValidation.removedResource';
import { addCurlyBraces, isObject, removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { elementToParam } from 'builder_platform_interaction/ruleLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getElementByDevName, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    getGlobalConstantOrSystemVariable,
    getGlobalVariable,
    GLOBAL_CONSTANT_OBJECTS,
    isRecordPriorSystemVariableIdentifier,
    isRecordSystemVariableIdentifier
} from 'builder_platform_interaction/systemLib';
import { SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX } from 'builder_platform_interaction/systemVariableConstantsLib';
import { getMenuItemForField, mutateFlowResourceToComboboxShape } from './menuDataGenerator';
import { filterFieldsForChosenElement, getChildrenItems } from './menuDataRetrieval';

const { format } = commonUtils;

/* Global variable to hold the current state of the screen element.
 *  This is being populated by the screenEditor component and
 *   used for accessing screen components added in the current session (which have not yet been committed to the store)
 *   in resource pickers inside the editor.
 * */
let screen = null;

export const setScreenElement = (element) => {
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
 *
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
 *
 * @param {Object} event Event for the data type
 * @returns {Object | string} value of the event payload
 */
export const getItemOrDisplayText = (event) => {
    // if it is a combobox value changed event we have two cases: literals or item select
    return event.detail.item || event.detail.displayText;
};

type getResourceByUniqueIdentifierOptions = {
    /**
     * @summary Set to true to perform resource lookup using element dev names.
     */
    lookupByDevName?: boolean;
};

/**
 * Retrieves element or global constant
 *
 * @param {string} identifier    unique identifier that can be used to retrieve the flow resource
 * @param {getResourceByUniqueIdentifierOptions|undefined} options use to fine-tune resource lookup
 * @returns {Object|undefined}    element or resource if the identifier is valid, otherwise undefined
 */
export const getResourceByUniqueIdentifier = (
    identifier: string,
    { lookupByDevName = false }: getResourceByUniqueIdentifierOptions = {}
): any => {
    if (identifier) {
        const complexGuid = sanitizeGuid(identifier);
        return (
            getElementByGuid(complexGuid.guidOrLiteral) ||
            getGlobalConstantOrSystemVariable(identifier) ||
            getGlobalVariable(identifier) ||
            getUncommittedResource(getScreenElement(), complexGuid.guidOrLiteral) ||
            (isRecordSystemVariableIdentifier(complexGuid.guidOrLiteral) &&
                getElementByDevName(complexGuid.guidOrLiteral)) ||
            (isRecordPriorSystemVariableIdentifier(complexGuid.guidOrLiteral) &&
                getGlobalConstantOrSystemVariable(complexGuid.guidOrLiteral)) ||
            (lookupByDevName && getElementByDevName(complexGuid.guidOrLiteral))
        );
    }
    return null;
};

// Check if the resource has been added to the screen in the current session.
// Such a resource will not be present in the source so we need to check in the screen attribute
/**
 * @param screenElement
 * @param identifier
 */
export function getUncommittedResource(screenElement, identifier) {
    if (!screenElement) {
        return null;
    }
    if (screenElement.fields) {
        const fields = screenElement.fields;
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (field.guid === identifier) {
                return field;
            }
            const foundField = getUncommittedResource(field, identifier);
            if (foundField) {
                return foundField;
            }
        }
    }
    return null;
}

/**
 * Gets the data type to determine how this value should be stored in a FEROV if the id belongs to a valid resource.
 * If the id doesn't belong to a valid resource returns null
 *
 * @param {string} identifier    unique identifier that can be used to retrieve the flow resource
 * @returns {FEROV_DATA_TYPE|null}    the dataType category this value belongs to or null if it doesn't exist
 */
export const getFerovDataTypeForValidId = (identifier) => {
    if (GLOBAL_CONSTANT_OBJECTS[identifier]) {
        return GLOBAL_CONSTANT_OBJECTS[identifier].dataType;
    } else if (getResourceByUniqueIdentifier(identifier)) {
        return FEROV_DATA_TYPE.REFERENCE;
    }
    return null;
};

/**
 * Retrieves the information needed for components to update a ferov from a combobox state changed payload
 *
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
        const resourceDataType = getFerovDataTypeForValidId(itemOrDisplayText.value);
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

const normalizeMenuItemChildField = (
    parentMenuItem,
    fieldNames,
    { allowSObjectFieldsTraversal = true, includeEntityRelatedRecordFields } = {}
) => {
    const [fieldName, ...remainingFieldNames] = fieldNames;
    const fields = getChildrenItems(parentMenuItem, false, includeEntityRelatedRecordFields);
    const menuItems = filterFieldsForChosenElement(parentMenuItem, fields, {
        allowSObjectFieldsTraversal
    });
    const fieldDisplayText = addCurlyBraces(removeCurlyBraces(parentMenuItem.displayText) + '.' + fieldName);
    const item = menuItems.find((menuItem) => menuItem.displayText === fieldDisplayText);
    if (!item) {
        return undefined;
    }
    if (remainingFieldNames.length > 0) {
        return normalizeMenuItemChildField(item, remainingFieldNames, {
            allowSObjectFieldsTraversal,
            includeEntityRelatedRecordFields
        });
    }
    return { itemOrDisplayText: item, fields };
};

/**
 * A reserved identifier is an identifier that cannot be used as literal.
 *
 * @param identifier
 */
const isReservedIdentifier = (identifier: string) => {
    // TODO : W-8315169
    // $Record__Prior is reserved because otherwise $Record__Prior would be a valid literal and there would be no error
    // when we switch from a recordTriggerType that support $Record_Prior to a recordTriggerType that don't for a record triggered flow
    return identifier === SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX;
};

type NormalizeOptions = {
    /**
     * @summary Set to true to traverse sobject fields that are spannable.
     */
    allowSObjectFieldsTraversal?: boolean;
    /**
     * @summary Set to true to perform resource lookup using element dev names.
     */
    lookupByDevName?: boolean;
    /**
     *  @summary Set to true to perform resource lookup using related fields
     */
    includeEntityRelatedRecordFields?: boolean;
};

/**
 * Returns the combobox display value based on the unique identifier passed
 * to the RHS.
 *
 * @param {string} identifier    used to identify value, could be GUID or literal
 * @param {NormalizeOptions} options use to fine-tune normalization
 * @returns {Item}               value in format displayable by combobox
 */
export const normalizeFEROV = (
    identifier: string,
    {
        allowSObjectFieldsTraversal = true,
        lookupByDevName = false,
        formattedDisplayText = null,
        includeEntityRelatedRecordFields = false
    }: NormalizeOptions = {}
) => {
    let result: { itemOrDisplayText: UI.ComboboxItem | string; fields?: any } = { itemOrDisplayText: identifier };
    const elementOrResource = getResourceByUniqueIdentifier(identifier, { lookupByDevName });
    const { guidOrLiteral, fieldNames } = sanitizeGuid(identifier);
    if (!elementOrResource) {
        if (isReservedIdentifier(guidOrLiteral)) {
            result.itemOrDisplayText = addCurlyBraces(identifier);
        }
        return result;
    }
    const elementOrResourceMenuItem = mutateFlowResourceToComboboxShape(elementOrResource);
    if (fieldNames) {
        const normalizedChildField = normalizeMenuItemChildField(elementOrResourceMenuItem, fieldNames, {
            allowSObjectFieldsTraversal,
            includeEntityRelatedRecordFields
        });
        if (!normalizedChildField) {
            result.itemOrDisplayText = addCurlyBraces(
                removeCurlyBraces(elementOrResourceMenuItem.displayText) + '.' + fieldNames.join('.')
            );
        } else {
            result = normalizedChildField;
        }
    } else {
        result.itemOrDisplayText = elementOrResourceMenuItem;
    }
    if (formattedDisplayText && result.itemOrDisplayText) {
        result.itemOrDisplayText.displayText = formattedDisplayText;
    }
    return result;
};

/**
 * The shape an expression builder needs to operator on any LHS.
 *
 * @typedef {Object} normalizedLHS
 * @param {MenuItem} item     what the combobox needs to display this lhs
 * @param {rules/param} param       the param representation of this lhs object/element
 * @property
 */

/**
 * @typedef lhsDescribe                    the needed values to represent a field value for the LHS of an expression
 * @param {Object} value                   the combobox item to represent the LHS
 * @param {string[]} activePicklistValues  if the LHS is a picklist field, these are the possible values
 * @param {rules/param} param              the parameterized version of the LHS, to be used with the rules
 * @param {Object[]} fields                fields that should be shown in the menuData
 * @param {string} displayOption           from LHS_DISPLAY_OPTION
 */

/**
 * @typedef rhsDescribe      the needed values to represent a value on the RHS of an expression
 * @param {Object} value     the combobox item to represent the RHS
 * @param {string} guid      the GUID of the RHS
 * @param {string} error     the validation error to show the user
 * @param {boolean} isField  true if this value is a field
 * @param {Object[]} fields  if the menudata shown should be fields, this is the list of fields
 */

/**
 * Populates the state values on an expression builder wrapper to represent the LHS, when the LHS is a field.
 *
 * @param {string} fields             the fields for the lhs menudata
 * @param {string | undefined} fieldName    the api name of the currently selected field, if a field is already selected
 * @param {Object|undefined} fieldParent  the object representing the parent of the currectly selected field, if a field is already selected
 * @param {boolean} isFieldOnSobjectVar   true if this field should be displayed in a mergefield relative to an sobject variable, false if it should be displayed alone
 * @returns {lhsDescribe}                      describes the attributes needed for the expression builder
 */
export const populateLhsStateForField = (fields, fieldName, fieldParent, isFieldOnSobjectVar) => {
    const lhsState = {
        fields
    };
    const field = fields && fields[fieldName];
    if (field) {
        lhsState.value = getMenuItemForField(field, fieldParent, {
            showAsFieldReference: isFieldOnSobjectVar,
            showSubText: isFieldOnSobjectVar
        });
        lhsState.activePicklistValues = field.activePicklistValues || false;
        lhsState.param = elementToParam(field, field.isSystemVariable);
    }
    return lhsState;
};

/**
 * Populates the state values on an expression builder wrapper that represent the RHS of the expression.
 *
 * @param {Object} expression   rightHandSide - the display value of the rhs
 * @param expression.rightHandSide
 * @param {rhsDescribe} callback   function to be called with the initialized state values
 */
export const populateRhsState = ({ rightHandSide }, callback) => {
    let rhsState = {
        isField: false,
        fields: null,
        error: rightHandSide.error,
        itemOrDisplayText: rightHandSide.value
    };
    rhsState = Object.assign(rhsState, normalizeFEROV(rightHandSide.value));
    rhsState.isField = !!rhsState.fields;
    callback(rhsState);
};

export const checkExpressionForDeletedElem = (deletedGuids, expression, propertyEditorLabel) => {
    const checkComboboxForDeletedElem = (prop) => {
        const property = expression[prop];
        if (property && !property.error && deletedGuids.has(property.value)) {
            const deletedDevName = getResourceByUniqueIdentifier(property.value).name;
            property.value = addCurlyBraces(deletedDevName);
            property.error = format(removedResource, deletedDevName, propertyEditorLabel);
        }
    };

    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE, EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].forEach((prop) =>
        checkComboboxForDeletedElem(prop)
    );
};
