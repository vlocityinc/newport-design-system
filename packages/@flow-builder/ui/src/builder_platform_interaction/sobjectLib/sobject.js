import { fetchOnce, isAlreadyFetched, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { logPerfTransactionEnd } from 'builder_platform_interaction/loggingUtils';

const allEntities = [];
const queryableEntities = [];
const createableEntities = [];
const deletableEntities = [];
const updateableEntities = [];

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
    logPerfTransactionEnd('setEntities');
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

export const areFieldsForEntityAlreadyFetched = (entityName) => {
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
export const fetchFieldsForEntity = (entityName, { background = false, disableErrorModal = false, messageForErrorModal } = {}) => {
    const params = {
        entityApiName: entityName
    };
    return fetchOnce(SERVER_ACTION_TYPE.GET_ENTITY_FIELDS, params, { background, disableErrorModal, messageForErrorModal }).then(data => JSON.parse(data));
};

/**
 * Grabs the fields for a specific sObject, mutates it to combobox shape, then calls the callback
 * Only goes to the server if the fields for that sObject are not cached.
 * On error, a modal with an error message is opened but callback is not called.
 * @param {String} entityName Api name of the SObject
 * @param {Function} callback Function to call once the server call is complete
 */
export const getFieldsForEntity = (entityName, callback) => {
    fetchFieldsForEntity(entityName)
        .then(fields => {
            if (callback) {
                callback(fields);
            }
        })
        .catch(() => {
            // we use fetchOnce default behavior : modal with the error.
        });
};