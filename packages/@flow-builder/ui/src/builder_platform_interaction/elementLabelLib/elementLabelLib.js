import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementLabelLibLabels';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { FLOW_DATA_TYPE, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';

const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;

/**
 * Get the label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object] resource - the element
 */
export function getResourceLabel(resource) {
    let label = resource.name;
    if (resource.elementType === ELEMENT_TYPE.RECORD_LOOKUP && resource.storeOutputAutomatically) {
        // "Accounts from myGetRecord"
        const entity = getEntity(resource.subtype);
        if (entity) {
            const entityLabel = resource.isCollection ? entity.entityLabelPlural : entity.entityLabel;
            if (entityLabel) {
                label = format(LABELS.recordLookupAsResourceText, entityLabel, resource.name);
            }
        }
    }
    return label;
}

/**
 * Get category label for an element
 *
 * @param {String}
 *            elementType the element type of an element
 * @param {String}
 *            dataType the datatype of an element
 * @param {Boolean}
 *            isCollection whether or not that element is a collection
 * @returns {String} the category label for this element
 */
export function getElementCategory({ elementType, dataType, isCollection }) {
    return getCategory(elementType, dataType, isCollection, false);
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
export function getResourceCategory({ elementType, dataType, isCollection = false }) {
    return getCategory(elementType, dataType, isCollection, true);
}

/**
 * Determines category for display.
 *
 * @param {String}
 *            elementType the element type of an element
 * @param {String}
 *            dataType the datatype of an element
 * @param {Boolean}
 *            isCollection whether or not that element is a collection
 * @param {Boolean}
 *            asResource whether or not considered as a resource that can be used in a merge field
 * @returns {String} the full category label for this element
 */
function getCategory(elementType, dataType, isCollection, asResource) {
    let categoryLabel;
    if (!isComplexType(dataType) || (!asResource && elementType !== ELEMENT_TYPE.VARIABLE)) {
        if (!isCollection) {
            const config = getConfigForElementType(elementType);
            if (config && config.labels && config.labels.plural) {
                categoryLabel = config.labels.plural;
            }
        } else {
            categoryLabel = LABELS.collectionVariablePluralLabel;
        }
    } else if (isCollection) {
        categoryLabel = dataType === SOBJECT_TYPE ? LABELS.sObjectCollectionPluralLabel : LABELS.apexCollectionVariablePluralLabel;
    } else {
        categoryLabel =  dataType === SOBJECT_TYPE ? LABELS.sObjectPluralLabel : LABELS.apexVariablePluralLabel;
    }
    return categoryLabel;
}