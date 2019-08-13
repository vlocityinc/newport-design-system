import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementLabelLibLabels';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import {
    FLOW_DATA_TYPE,
    isComplexType
} from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;
const APEX_TYPE = FLOW_DATA_TYPE.APEX.value;
const LIGHTNING_COMPONENT_OUTPUT_TYPE =
    FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value;
const ACTION_OUTPUT_TYPE = FLOW_DATA_TYPE.ACTION_OUTPUT.value;

/**
 * Get the label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object} resource - the element
 */
export function getResourceLabel(resource) {
    let label = resource.name;
    if (resource.storeOutputAutomatically) {
        if (resource.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
            // "Accounts from myGetRecord"
            const entity = getEntity(resource.subtype);
            if (entity) {
                const entityLabel = resource.isCollection
                    ? entity.entityLabelPlural
                    : entity.entityLabel;
                if (entityLabel) {
                    label = format(
                        LABELS.recordLookupAsResourceText,
                        entityLabel,
                        resource.name
                    );
                }
            }
        } else if (
            resource.dataType ===
            FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
        ) {
            // "Outputs from myLC"
            label = format(
                LABELS.lightningComponentScreenFieldAsResourceText,
                resource.name
            );
        } else if (resource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
            // "Outputs from myAction
            label = format(LABELS.actionAsResourceText, resource.name);
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
 * Get category label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {String}
 *            elementType the element type of the element
 * @param {String}
 *            dataType the datatype of the element
 * @param {Boolean}
 *            isCollection whether or not that element is a collection
 * @returns {String} the category label for this element
 */
export function getResourceCategory({
    elementType,
    dataType,
    isCollection = false
}) {
    let categoryLabel;
    if (!isComplexType(dataType)) {
        if (!isCollection) {
            const config = getConfigForElementType(elementType);
            if (config && config.labels && config.labels.plural) {
                categoryLabel = config.labels.plural;
            }
        } else {
            categoryLabel = LABELS.collectionVariablePluralLabel;
        }
    } else if (isCollection) {
        categoryLabel =
            dataType === SOBJECT_TYPE
                ? LABELS.sObjectCollectionPluralLabel
                : LABELS.apexCollectionVariablePluralLabel;
    } else if (dataType === SOBJECT_TYPE) {
        categoryLabel = LABELS.sObjectPluralLabel;
    } else if (dataType === APEX_TYPE) {
        categoryLabel = LABELS.apexVariablePluralLabel;
    } else if (dataType === LIGHTNING_COMPONENT_OUTPUT_TYPE) {
        categoryLabel = LABELS.screenFieldPluralLabel;
    } else if (dataType === ACTION_OUTPUT_TYPE) {
        categoryLabel = LABELS.actionPluralLabel;
    }
    return categoryLabel;
}

/**
 * Get resource type label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {String}
 *            elementType the element type of the element
 * @param {String}
 *            dataType the datatype of the element
 * @param {Boolean}
 *            [isCollection=false] whether or not that element is a collection
 * @returns {String} the type label for this element
 */
export function getResourceTypeLabel({
    elementType,
    dataType,
    isCollection = false
}) {
    let typeLabel;
    if (!isComplexType(dataType)) {
        if (!isCollection) {
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
    }
    return typeLabel;
}
