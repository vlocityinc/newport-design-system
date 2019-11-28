import {
    fetchOnce,
    isAlreadyFetched,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import { updateEntities } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';

let cachedEntityFields = {};

export const ENTITY_TYPE = {
    CREATABLE: 'CREATABLE',
    QUERYABLE: 'QUERYABLE',
    UPDATABLE: 'UPDATABLE',
    DELETABLE: 'DELETABLE',
    WORKFLOW_ENABLED: 'WORKFLOW_ENABLED'
};

/**
 * Set the SObject Variables in the flow. This should be called at the very beginning of the flow
 * @param {String} entities - String object of all SObjects
 */
export const setEntities = (entities = null) => {
    const allEntities = [];
    const allEntitiesMap = {};
    const queryableEntities = [];
    const createableEntities = [];
    const deletableEntities = [];
    const updateableEntities = [];
    const workflowEnabledEntities = [];

    if (entities) {
        entities.forEach(entity => {
            allEntities.push(entity);
            allEntitiesMap[entity.apiName.toLowerCase()] = entity;
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
    Store.getStore().dispatch(
        updateEntities({
            allEntities,
            allEntitiesMap,
            queryableEntities,
            createableEntities,
            deletableEntities,
            updateableEntities,
            workflowEnabledEntities
        })
    );
};

const getStoredEntities = () => {
    const peripheralData = Store.getStore().getCurrentState().peripheralData;
    return peripheralData ? peripheralData.entities : undefined;
};

/**
 * Returns all the SObjects, regardless of action
 * @returns {Array} All Entities
 */
export const getAllEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.allEntities : [];
};

/**
 * Return the SObject description
 *
 * @param {string} apiName the api name of the entity
 * @return {Object} the entity description
 */
export const getEntity = apiName => {
    const storedEntities = getStoredEntities();
    const map = storedEntities ? storedEntities.allEntitiesMap : undefined;
    return map ? map[apiName.toLowerCase()] : undefined;
};

/**
 * Takes a list of org-accessible workflow enabled entities, filters out the ones that are not user accessible based on
 * the master entities list in the store, and adds the filtered workflow enabled entity list to the store
 * @param {Array} orgWorkflowEnabledEntities List of api names of workflow enabled entities available in the org
 */
export const setWorkflowEnabledEntities = (orgWorkflowEnabledEntities = []) => {
    const workflowEnabledEntities = [];
    orgWorkflowEnabledEntities.forEach(entityApiName => {
        const entity = getEntity(entityApiName);
        if (entity) {
            workflowEnabledEntities.push(entity);
        }
    });

    const storedEntities = getStoredEntities();
    Store.getStore().dispatch(
        updateEntities({
            allEntities: storedEntities.allEntities,
            allEntitiesMap: storedEntities.allEntitiesMap,
            queryableEntities: storedEntities.queryableEntities,
            createableEntities: storedEntities.createableEntities,
            deletableEntities: storedEntities.deletableEntities,
            updateableEntities: storedEntities.updateableEntities,
            workflowEnabledEntities
        })
    );
};

/**
 * Returns only queryable SObjects
 * @returns {Array} Queryable Entities
 */
export const getQueryableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.queryableEntities : [];
};

/**
 * Returns only creatable SObjects
 * @returns {Array} Createable Entities
 */
export const getCreateableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.createableEntities : [];
};

/**
 * Returns only deletable SObjects
 * @returns {Array} Deletable Entities
 */
export const getDeletableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.deletableEntities : [];
};

/**
 * Returns only updatable SObjects
 * @returns {Array} Updateable Entities
 */
export const getUpdateableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.updateableEntities : [];
};

/**
 * Returns only workflow enabled SObjects
 * @returns {Array} Worflow Enabled Entities
 */
export const getWorkflowEnabledEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.workflowEnabledEntities : [];
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

/**
 * Get the field with given api name (case-insensitive)
 * @param {Object} map of properties (apiName -> field)
 * @param {string} fieldName
 * @return {Object|undefined} the field with the api name or undefined if there is no field with this api name
 */
export const getEntityFieldWithApiName = (fields, fieldName) => {
    fieldName = fieldName.toLowerCase();
    for (const apiName in fields) {
        if (fields.hasOwnProperty(apiName)) {
            if (fieldName === apiName.toLowerCase()) {
                return fields[apiName];
            }
        }
    }
    return undefined;
};

export const clearEntityFieldsCache = () => (cachedEntityFields = {});
