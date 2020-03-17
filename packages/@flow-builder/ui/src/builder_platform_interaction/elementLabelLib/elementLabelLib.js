import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementLabelLibLabels';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { FLOW_DATA_TYPE, isComplexType, getDataTypeLabel } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const LIGHTNING_COMPONENT_OUTPUT_TYPE = FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value;
const ACTION_OUTPUT_TYPE = FLOW_DATA_TYPE.ACTION_OUTPUT.value;
const SUBFLOW_OUTPUT_TYPE = FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value;
const isAnonymousPrimitiveOutputResource = ({ isSystemGeneratedOutput, dataType }) => {
    return isSystemGeneratedOutput === true && dataType !== FLOW_DATA_TYPE.SOBJECT.value;
};

/**
 * Get the formatted label filled with resource related entity label
 * @param {Object} resource - the element
 * @param {String} elementName - the element name
 * @param {String} labelWithTokens - used to format the resulting label with entity label if any (eg: "{0} from {1}")
 * @returns {String} formatted label if any entity label found the given element name otherwise
 */
export const formatWithEntityLabel = (resource = {}, elementName, labelWithTokens) => {
    if (!resource) {
        return elementName;
    }
    const entity = getEntity(resource.subtype || resource.object);
    let label = elementName;
    if (entity) {
        const entityLabel = resource.isCollection ? entity.entityLabelPlural : entity.entityLabel;
        if (entityLabel && labelWithTokens) {
            label = format(labelWithTokens, entityLabel, label);
        }
    }
    return label;
};

/**
 * Get the label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object} resource - the element
 * @returns {String} the resource label for this element
 */
export function getResourceLabel(resource) {
    let label = resource.name.value || resource.name;
    if (resource.storeOutputAutomatically) {
        if (resource.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
            // "Accounts from resourceName" (get record, action with sobject anonymous output, loops...)
            label = formatWithEntityLabel(resource, label, LABELS.recordLookupAsResourceText);
        } else if (resource.elementType === ELEMENT_TYPE.RECORD_CREATE) {
            // "AccountId from myCreateRecord"
            label = formatWithEntityLabel(resource, label, LABELS.recordCreateIdAsResourceText);
        } else if (resource.elementType === ELEMENT_TYPE.LOOP) {
            if (resource.dataType === FLOW_DATA_TYPE.APEX.value) {
                label = format(LABELS.loopAsResourceText, resource.subtype, label);
            } else {
                label = format(
                    LABELS.loopAsResourceText,
                    resource.dataType ? getDataTypeLabel(resource.dataType) : resource.dataType,
                    label
                );
            }
        } else if (resource.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
            // "Outputs from myLC"
            label = format(LABELS.lightningComponentScreenFieldAsResourceText, label);
        } else if (resource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
            // "Outputs from myAction
            label = format(LABELS.actionAsResourceText, label);
        } else if (isAnonymousPrimitiveOutputResource(resource)) {
            const dataTypeLabel = resource.apexClass ? resource.apexClass : getDataTypeLabel(resource.dataType);
            label = resource.isCollection
                ? format(
                      LABELS.actionAnonymousPrimitiveAsResourceText,
                      format(LABELS.collectionDataType, dataTypeLabel),
                      label
                  )
                : format(LABELS.actionAnonymousPrimitiveAsResourceText, dataTypeLabel, label);
        } else if (resource.dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
            // "Outputs from mySubflow"
            label = format(LABELS.subflowAsResourceText, label);
        }
    }
    return label;
}

/**
 * Get category label for an element
 *
 * @param {String}
 *            elementType the element type of an element
 * @returns {String} the category label for this element
 */
export function getElementCategory({ elementType }) {
    let categoryLabel;
    const config = getConfigForElementType(elementType);
    if (config && config.labels && config.labels.plural) {
        categoryLabel = config.labels.plural;
    } else {
        categoryLabel = '';
    }
    return categoryLabel;
}

/**
 * Get element type label for an element
 *
 * @param {String}
 *            elementType the element type of an element
 * @returns {String} the type label for this element
 */
export function getElementTypeLabel({ elementType }) {
    let categoryLabel = '';
    const config = getConfigForElementType(elementType);
    if (config && config.labels && config.labels.singular) {
        categoryLabel = config.labels.singular;
    }
    return categoryLabel;
}

/**
 * Get resource category label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object} resource
 * @param {String}
 *            resource.elementType the element type of the element
 * @param {String}
 *            resource.dataType the datatype of the element
 * @param {Boolean}
 *            [resource.isCollection=false] whether or not that element is a collection
 * @param {Boolean}
 *            [resource.isSystemGeneratedOutput=false] whether or not that element is an anonymous output
 * @returns {String} the category label for this element
 */
export function getResourceCategory({ elementType, dataType, isCollection = false, isSystemGeneratedOutput = false }) {
    let categoryLabel;
    if (elementType === ELEMENT_TYPE.RECORD_CREATE && dataType === FLOW_DATA_TYPE.STRING.value) {
        categoryLabel = LABELS.variablePluralLabel;
    } else if (!isComplexType(dataType)) {
        if (
            isAnonymousPrimitiveOutputResource({
                isSystemGeneratedOutput,
                dataType
            })
        ) {
            categoryLabel = isCollection ? LABELS.collectionVariablePluralLabel : LABELS.variablePluralLabel;
        } else if (!isCollection) {
            if (elementType === ELEMENT_TYPE.LOOP && dataType) {
                categoryLabel = LABELS.variablePluralLabel;
            } else {
                const config = getConfigForElementType(elementType);
                if (config && config.labels && config.labels.plural) {
                    categoryLabel = config.labels.plural;
                }
            }
        } else {
            categoryLabel = LABELS.collectionVariablePluralLabel;
        }
    } else if (isCollection) {
        categoryLabel =
            dataType === SOBJECT_TYPE ? LABELS.sObjectCollectionPluralLabel : LABELS.apexCollectionVariablePluralLabel;
    } else if (dataType === SOBJECT_TYPE) {
        categoryLabel = LABELS.sObjectPluralLabel;
    } else if (dataType === APEX_TYPE) {
        categoryLabel = LABELS.apexVariablePluralLabel;
    } else if (dataType === LIGHTNING_COMPONENT_OUTPUT_TYPE) {
        categoryLabel = LABELS.screenFieldPluralLabel;
    } else if (dataType === ACTION_OUTPUT_TYPE) {
        categoryLabel = LABELS.actionPluralLabel;
    } else if (dataType === SUBFLOW_OUTPUT_TYPE) {
        categoryLabel = LABELS.subflowPluralLabel;
    }
    return categoryLabel;
}

/**
 * Get resource type label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object} resource
 * @param {String}
 *            resource.elementType the element type of the element
 * @param {String}
 *            resource.dataType the datatype of the element
 * @param {Boolean}
 *            [resource.isCollection=false] whether or not that element is a collection
 * @param {Boolean}
 *            resource.storeOutputAutomatically whether or not that element is in automatic output mode
 * @param {Boolean}
 *            resource.isSystemGeneratedOutput whether or not it's an anonymous output
 * @returns {String} the type label for this element
 */
export function getResourceTypeLabel({
    elementType,
    dataType,
    isCollection = false,
    storeOutputAutomatically,
    isSystemGeneratedOutput
}) {
    let typeLabel;
    if (elementType === ELEMENT_TYPE.RECORD_CREATE && storeOutputAutomatically) {
        typeLabel = LABELS.variableSingularLabel;
    } else if (!isComplexType(dataType)) {
        if (
            isAnonymousPrimitiveOutputResource({
                isSystemGeneratedOutput,
                dataType
            })
        ) {
            typeLabel = isCollection ? LABELS.collectionVariableSingularLabel : LABELS.variableSingularLabel;
        } else if (!isCollection) {
            const config = getConfigForElementType(elementType);
            if (config && config.labels && config.labels.singular) {
                typeLabel = config.labels.singular;
            }
        } else {
            typeLabel = LABELS.collectionVariableSingularLabel;
        }
    } else if (isCollection) {
        typeLabel =
            dataType === SOBJECT_TYPE
                ? LABELS.sObjectCollectionSingularLabel
                : LABELS.apexCollectionVariableSingularLabel;
    } else if (dataType === SOBJECT_TYPE) {
        typeLabel = LABELS.sObjectSingularLabel;
    } else if (dataType === APEX_TYPE) {
        typeLabel = LABELS.apexVariableSingularLabel;
    } else if (dataType === LIGHTNING_COMPONENT_OUTPUT_TYPE) {
        typeLabel = LABELS.screenFieldSingularLabel;
    } else if (dataType === ACTION_OUTPUT_TYPE) {
        typeLabel = LABELS.actionSingularLabel;
    } else if (dataType === SUBFLOW_OUTPUT_TYPE) {
        typeLabel = LABELS.subflowSingularLabel;
    }
    return typeLabel;
}
