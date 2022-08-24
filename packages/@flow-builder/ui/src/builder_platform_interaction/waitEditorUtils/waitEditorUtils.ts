/**
 * Parse the property name from an id string of the format:
 * [propertyName]-[integer value] ex: "resumeDate-769"
 *
 * @param id the id string to parse
 */
export function parsePropertyNameFromId(id) {
    return id.split('-')[0];
}
