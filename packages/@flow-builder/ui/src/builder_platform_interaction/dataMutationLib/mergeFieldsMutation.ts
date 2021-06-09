// @ts-nocheck
import { getElementByGuid, getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { splitStringBySeparator } from 'builder_platform_interaction/commonUtils';
import { isNonRecordGlobalResourceId } from 'builder_platform_interaction/systemLib';
import { EXPRESSION_RE } from 'builder_platform_interaction/flowMetadata';

/**
 * The 5 possible situations are:
 * a) "guidOrLiteral" holds a literal the user entered
 * b) "guidOrLiteral" references a flow element that is not a complex type element, and "fieldNames" is empty
 * c) "guidOrLiteral" references a complex type element, and "fieldNames" is empty
 * d) "guidOrLiteral" references a complex type element, and "fieldNames" is a field path on that complex type
 * e) "guidOrLiteral" holds an a complex type api name, and fieldNames is a field path on that sobject
 *
 * @typedef {Object} ComplexGuid
 * @param {string} guidOrLiteral                 a flow element's guid OR a literal
 * @param {string[] | undefined} fieldNames  if the flow element is an sobjectVar this may be a field on that sobject, or undefined
 * @property
 */
type ComplexGuid = {
    guidOrLiteral: string;
    fieldNames: string[] | undefined;
};

/**
 * If a guid contains more than one level, separates it out to two parts
 *
 * @param {string} potentialGuid The guid to sanitize. This can be the value in the case of literals.
 * @returns {complexGuid} The complex object containing the guid and the field names. Returns an empty object in the literals case.
 */
export const sanitizeGuid = (potentialGuid: string): ComplexGuid => {
    const complexGuid = {};
    if (typeof potentialGuid === 'string') {
        const periodIndex = potentialGuid.indexOf('.');
        if (periodIndex !== -1 && !isNonRecordGlobalResourceId(potentialGuid)) {
            complexGuid.guidOrLiteral = potentialGuid.substring(0, periodIndex);
            complexGuid.fieldNames = potentialGuid.substring(periodIndex + 1).split('.');
        } else {
            complexGuid.guidOrLiteral = potentialGuid;
        }
    }
    return complexGuid;
};

const guidToDevName = (guid) => {
    const elementUi = getElementByGuid(guid);
    if (elementUi) {
        return elementUi.name;
    }
    return undefined;
};

const devNameToGuid = (devName) => {
    // not case-sensitive
    const elementUi = getElementByDevName(devName);
    if (elementUi) {
        return elementUi.guid;
    }
    return undefined;
};

const replaceMergeFieldReference = (mergeFieldValue, mappingFunction) => {
    const parts = splitStringBySeparator(mergeFieldValue);
    const value = mappingFunction(parts[0]);
    if (value) {
        parts[0] = value;
        return parts.join('.');
    }
    return mergeFieldValue;
};

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';

const replaceMergeFieldReferences = (template, mappingFunction) => {
    if (template) {
        return template.replace(
            EXPRESSION_RE,
            (fullMatch, value) =>
                MERGE_FIELD_START_CHARS + replaceMergeFieldReference(value, mappingFunction) + MERGE_FIELD_END_CHARS
        );
    }
    return template;
};

/**
 * Mutate a text with merge fields (formula expression, text template body, body of screen field of type Display Text)
 *
 * @param {string} template Template with merge fields containing guids
 * @returns {string} The mutated template with merge fields containing devNames
 */
export const mutateTextWithMergeFields = (template) => replaceMergeFieldReferences(template, guidToDevName);

/**
 * Demutate a text with merge fields
 *
 * @param {string} template Template with merge fields containing devNames
 * @returns {string} The mutated template with merge fields containing guids
 */
export const demutateTextWithMergeFields = (template) => replaceMergeFieldReferences(template, devNameToGuid);
