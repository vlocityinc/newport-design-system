let apexClasses = {};
const apexFieldsForClass = {};

/**
 * This mutates inner properties into a shape that can be handled like sobject fields
 * @param {Object} property  inner property descriptor
 * @return {Object}          object with properties named like sobject field properties
 */
const mutateProperty = (property) => {
    return {
        apiName: property.name,
        isCollection: property.isCollection,
        dataType: property.type,
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

export const setApexClasses = (classes) => {
    apexClasses = classes;
};

export const getApexClasses = () => {
    return apexClasses;
};

/**
 * Caches properties & inner types of an apex class so they can be used for menu data, etc
 * @param {String} name     name of the apex class
 */
export const cachePropertiesForClass = (name) => {
    let durableId = name;
    let parentId;
    const complexName = durableId.split('.');
    if (complexName.length > 1) {
        parentId = complexName[0];
        durableId = complexName[1];
    }
    const apexClass = apexClasses.find(clazz => {
        return parentId === clazz.parentId && clazz.durableId === durableId;
    });
    apexFieldsForClass[name] = [];
    if (apexClass.properties) {
        apexFieldsForClass[name].push(...apexClass.properties.records.map(prop => mutateProperty(prop)));
    }
    return apexFieldsForClass[name];
};

export const getPropertiesForClass = (clazz) => {
    return apexFieldsForClass[clazz];
};
