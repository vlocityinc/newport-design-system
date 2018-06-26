import { getElementByGuid, getElementByDevName } from 'builder_platform_interaction-store-utils';

const guidToDevName = (guid) => {
    const flowElement = getElementByGuid(guid);
    if (flowElement) {
        return flowElement.name;
    }
    return undefined;
};

const devNameToGuid = (devName) => {
    const flowElement = getElementByDevName(devName);
    if (flowElement) {
        return flowElement.guid;
    }
    return undefined;
};

const replaceMergeFieldReference = (mergeFieldValue, mappingFunction) => {
    const parts = mergeFieldValue.split('.');
    const value = mappingFunction(parts[0]);
    if (value) {
        parts[0] = value;
        return parts.join('.');
    }
    return mergeFieldValue;
};

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';
const MERGEFIELD_REGEX = /\{!(\$\w+\.\w+|\w+\.\w+|\w+)\}/g;

const replaceMergeFieldReferences = (template, mappingFunction) => {
    return template.replace(MERGEFIELD_REGEX, (fullMatch, value) =>
        MERGE_FIELD_START_CHARS + replaceMergeFieldReference(value, mappingFunction) + MERGE_FIELD_END_CHARS);
};

/**
 * Mutate a text with merge fields (formula expression, text template body, body of screen field of type Display Text)
 * @param {string} template Template with merge fields containing guids
 * @return {string} The mutated template with merge fields containing devNames
 */
export const mutateTextWithMergeFields = template => replaceMergeFieldReferences(template, guidToDevName);

/**
 * Demutate a text with merge fields
 * @param {string} template Template with merge fields containing devNames
 * @return {string} The mutated template with merge fields containing guids
 */
export const demutateTextWithMergeFields = template => replaceMergeFieldReferences(template, devNameToGuid);