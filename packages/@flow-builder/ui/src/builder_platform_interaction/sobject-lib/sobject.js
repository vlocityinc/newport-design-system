import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';

const allEntities = [];
const queryableEntities = [];
const createableEntities = [];
const deletableEntities = [];
const updateableEntities = [];

const cachedEntityFields = {};

/**
 * Fields from SObjects have data types that need to be mapped to Flow
 * @param {Array} fields - Fields from SObject
 * @returns {Array} Modified fields
 */
const mapToFlowDataType = (fields) => {
    fields.forEach((field) => {
        field.dataType = field.dataType[0] + field.dataType.substring(1).toLowerCase();
        // TODO: W-4917767 Need to use the service instead of this!
        switch (field.dataType) {
            case 'Textarea':
            case 'Phone':
            case 'Address':
                field.dataType = 'String';
                break;
            case 'Double':
            case 'Decimal':
            case 'Integer':
            case 'Long':
                field.dataType = 'Number';
                break;
            default:
                break;
        }
    });
    return fields;
};

/**
 * Callback once the fields have been fetched
 * @param {String} data The fields and their properties, in stringified format
 * @param {String} entityName The name of the parent object
 * @param {Function} callback The callback
 */
const getFieldsForEntityCallback = (data, entityName, callback) => {
    const fields = mapToFlowDataType(JSON.parse(data));
    cachedEntityFields[entityName] = fields;
    callback(fields);
};

export const ENTITY_TYPE = {
    CREATABLE: 'CREATABLE',
    QUERYABLE: 'QUERYABLE',
    UPDATABLE: 'UPDATABLE',
    DELETABLE: 'DELETABLE',
};

/**
 * Set the SObject Variables in the flow. This should be called at the very beginning of the flow
 * @param {String} entities - String object of all SObjects
 */
export const setEntities = (entities = null) => {
    const unfilteredEntities = JSON.parse(entities);

    if (unfilteredEntities) {
        unfilteredEntities.forEach((entity) => {
            allEntities.push(entity);
            if (entity.queryable) {
                queryableEntities.push(entity);
            }
            if (entity.createable) {
                createableEntities.push(entity);
            }
            if (entity.deletable) {
                deletableEntities.push(entity);
            }
            if (entity.updateable) {
                updateableEntities.push(entity);
            }
        });
    }
};

/**
 * Returns all the SObjects, regardless of action
 * @returns {Array} All Entities
 */
export const getAllEntities = () => {
    return allEntities;
};

/**
 * Returns only queryable SObjects
 * @returns {Array} Queryable Entities
 */
export const getQueryableEntities = () => {
    return queryableEntities;
};

/**
 * Returns only creatable SObjects
 * @returns {Array} Createable Entities
 */
export const getCreateableEntities = () => {
    return createableEntities;
};

/**
 * Returns only deletable SObjects
 * @returns {Array} Deletable Entities
 */
export const getDeletableEntities = () => {
    return deletableEntities;
};


/**
 * Returns only updatable SObjects
 * @returns {Array} Updateable
 */
export const getUpdateableEntities = () => {
    return updateableEntities;
};

/**
 * Grabs the fields for a specific sObject, mutates it to combobox shape, then calls the callback
 * Only goes to the server if the fields for that sObject are not cached
 * @param {String} entityName Api name of the SObject
 * @param {Function} callback Function to call once the server call is complete
 */
export const getFieldsForEntity = (entityName, callback) => {
    if (cachedEntityFields[entityName]) {
        callback(cachedEntityFields[entityName]);
    } else {
        const params = {
            entityApiName: entityName
        };
        fetch(SERVER_ACTION_TYPE.GET_ENTITY_FIELDS, ({data, error}) => {
            if (error) {
                // TODO: handle error case
            } else {
                getFieldsForEntityCallback(data, entityName, callback);
            }
        }, params);
    }
};