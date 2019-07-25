import {
    fetchOnce,
    isAlreadyFetched,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';

let allEntities = [];
let allEntitiesMap = {};
let queryableEntities = [];
let createableEntities = [];
let deletableEntities = [];
let updateableEntities = [];

let cachedEntityFields = {};

export const ENTITY_TYPE = {
    CREATABLE: 'CREATABLE',
    QUERYABLE: 'QUERYABLE',
    UPDATABLE: 'UPDATABLE',
    DELETABLE: 'DELETABLE'
};

/**
 * Set the SObject Variables in the flow. This should be called at the very beginning of the flow
 * @param {String} entities - String object of all SObjects
 */
export const setEntities = (entities = null) => {
    allEntities = [];
    allEntitiesMap = {};
    queryableEntities = [];
    createableEntities = [];
    deletableEntities = [];
    updateableEntities = [];
    const unfilteredEntities = JSON.parse(entities);

    if (unfilteredEntities) {
        unfilteredEntities.forEach(entity => {
            allEntities.push(entity);
            allEntitiesMap[entity.apiName] = entity;
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
 * Return the SObject description
 *
 * @param {string} apiName the api name of the entity
 * @return {Object} the entity description
 */
export const getEntity = apiName => allEntitiesMap[apiName];

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

export const areFieldsForEntityAlreadyFetched = entityName => {
    const params = {
        entityApiName: entityName
    };
    return isAlreadyFetched(SERVER_ACTION_TYPE.GET_ENTITY_FIELDS, params);
};

/**
 * Fetch fields for given entity
 *
 * @param {string} entityName api name of the SObject
 * @param {{background: (boolean|undefined), disableErrorModal: (boolean|undefined), messageForErrorModal: (string|undefined)}} optionalParams
 *            background need to be set to true if request needs to be run as a background action
 *            disableErrorModal need to be set to true to disable the default error modal panel
 *            messageForErrorModal the message to use instead of the default error message
 * @return {Promise} Promise object with the fields
 */
export const fetchFieldsForEntity = (
    entityName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) => {
    if (cachedEntityFields[entityName]) {
        return Promise.resolve(cachedEntityFields[entityName]);
    }
    const params = {
        entityApiName: entityName
    };
    return fetchOnce(SERVER_ACTION_TYPE.GET_ENTITY_FIELDS, params, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(fields => {
        cachedEntityFields[entityName] = fields;
        return fields;
    });
};

/**
 * Grabs the fields for a specific sObject from the cache, undefined if not a valid entityName
 * @param {String} entityName Api name of the SObject
 */
export const getFieldsForEntity = entityName => {
    return cachedEntityFields[entityName];
};

export const clearEntityFieldsCache = () => (cachedEntityFields = {});
