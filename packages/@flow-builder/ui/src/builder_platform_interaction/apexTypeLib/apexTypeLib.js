let apexClasses = [];
const apexFieldsForClass = {};

/**
 * This mutates inner properties into a shape that can be handled like sobject fields
 * @param {Object} property  inner property descriptor
 * @return {Object}          object with properties named like sobject field properties
 */
const mutateProperty = (property) => {
    return {
        apiName: property.name,
        dataType: property.type,
        subtype: property.objectType || property.apexClass,
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
    if (apexFieldsForClass[name]) {
        return;
    }

    const apexClass = apexClasses.find(clazz => {
        return clazz.durableId === name;
    });
    apexFieldsForClass[name] = {};
    if (apexClass && apexClass.properties) {
        apexClass.properties.records.forEach((prop) => {
            if (!prop.isCollection) {
                apexFieldsForClass[name][prop.name] = mutateProperty(prop);
            }
        });
    }
};

export const getPropertiesForClass = (clazz) => {
    if (apexFieldsForClass[clazz] === undefined) {
        cachePropertiesForClass(clazz);
    }
    return apexFieldsForClass[clazz];
};
