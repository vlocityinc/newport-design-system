import { getEntity } from 'builder_platform_interaction/sobjectLib';

let apexClasses = null;
let apexFieldsForClass = {};

/**
 * This mutates inner properties into a shape that can be handled like sobject fields
 * @param {Object} property  inner property descriptor
 * @return {Object}          object with properties named like sobject field properties
 */
const mutateProperty = (apexClassName, property) => {
    let subtype;
    if (property.objectType) {
        // service does not return the api name but the api name lower cased
        // see https://gus.lightning.force.com/lightning/r/0D5B000000xsWoiKAE/view
        const entity = getEntity(property.objectType);
        subtype = entity ? entity.apiName : property.objectType;
    } else {
        subtype = property.apexClass;
    }
    return {
        apiName: property.name,
        dataType: property.type,
        subtype,
        isCollection: property.isCollection,
        apexClass: apexClassName
    };
};

/**
 * Example Apex Class shape
 * {
 *     durableId: "namespace.ApexClass",
 *     name: "ApexClass",
 *     properties: {
 *         records: [
 *             {
 *                 isCollection: false,
 *                 name: "auraEnabledProperty",
 *                 parentId: "ApexClass",
 *                 type: "String",
 *             },
 *         ],
 *     },
 * }
 */

export const setApexClasses = classes => {
    apexFieldsForClass = {};
    apexClasses = classes;
};

/**
 * Get the apex classes or null if they have not yet been set
 */
export const getApexClasses = () => apexClasses;

/**
 * Caches properties & inner types of an apex class so they can be used for menu data, etc
 * @param {String} name     name of the apex class
 */
export const cachePropertiesForClass = name => {
    const apexClass = (apexClasses || []).find(clazz => clazz.durableId === name);
    apexFieldsForClass[name] = {};
    if (apexClass && apexClass.properties) {
        apexClass.properties.records.forEach(prop => {
            apexFieldsForClass[name][prop.name] = mutateProperty(name, prop);
        });
    }
};

export const getPropertiesForClass = clazz => {
    cachePropertiesForClass(clazz);
    return apexFieldsForClass[clazz];
};

/**
 * Get the apex property with given api name (case-insensitive)
 * @param {Object} map of properties (apiName -> field)
 * @param {string} propertyName
 * @return {Object|undefined} the property with the api name or undefined if there is no property with this api name
 */
export function getApexPropertyWithName(properties, propertyName) {
    propertyName = propertyName.toLowerCase();
    for (const apiName in properties) {
        if (properties.hasOwnProperty(apiName)) {
            if (propertyName === apiName.toLowerCase()) {
                return properties[apiName];
            }
        }
    }
    return undefined;
}
