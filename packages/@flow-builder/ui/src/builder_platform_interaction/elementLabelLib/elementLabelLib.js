import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementLabelLibLabels';
import { getEntity } from 'builder_platform_interaction/sobjectLib';

/**
 * Get the label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param {Object] resource - the element
 */
export function getResourceLabel(resource) {
    let label = resource.name;
    if (resource.elementType === ELEMENT_TYPE.RECORD_LOOKUP && resource.outputHandled) {
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