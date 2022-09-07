import { updateEntities } from 'builder_platform_interaction/actions';
import { fetchOnce, isAlreadyFetched, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';

let cachedEntityFields = {};
let cachedRelatedRecordFieldsForEntity = {};

export const ENTITY_TYPE = {
    CREATABLE: 'CREATABLE',
    QUERYABLE: 'QUERYABLE',
    UPDATABLE: 'UPDATABLE',
    DELETABLE: 'DELETABLE',
    WORKFLOW_ENABLED: 'WORKFLOW_ENABLED'
};

/**
 * Set the SObject Variables in the flow. This should be called at the very beginning of the flow
 *
 * @param {string} entities - String object of all SObjects
 */
export const setEntities = (entities: UI.EntityDefinition[] | null = null) => {
    const allEntities: UI.EntityDefinition[] = [];
    const allEntitiesMap: UI.StringKeyedMap<UI.EntityDefinition> = {};
    const queryableEntities: UI.EntityDefinition[] = [];
    const createableEntities: UI.EntityDefinition[] = [];
    const deletableEntities: UI.EntityDefinition[] = [];
    const updateableEntities: UI.EntityDefinition[] = [];
    const workflowEnabledEntities: UI.EntityDefinition[] = [];

    if (entities) {
        entities.forEach((entity) => {
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

const getStoredEntities = (): UI.StoredEntities | undefined => {
    const peripheralData = Store.getStore().getCurrentState().peripheralData;
    return peripheralData ? peripheralData.entities : undefined;
};

/**
 * Returns all the SObjects, regardless of action
 *
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
 * @returns {Object} the entity description
 */
export const getEntity = (apiName) => {
    const storedEntities = getStoredEntities();
    const map = storedEntities ? storedEntities.allEntitiesMap : undefined;
    return map ? map[apiName.toLowerCase()] : undefined;
};

/**
 * Takes a list of org-accessible workflow enabled entities, filters out the ones that are not user accessible based on
 * the master entities list in the store, and adds the filtered workflow enabled entity list to the store
 *
 * @param {Array} orgWorkflowEnabledEntities List of api names of workflow enabled entities available in the org
 */
export const setWorkflowEnabledEntities = (orgWorkflowEnabledEntities = []) => {
    const workflowEnabledEntities: UI.EntityDefinition[] = [];
    orgWorkflowEnabledEntities.forEach((enabledEntity: any) => {
        const entity = getEntity(enabledEntity.QualifiedApiName);
        if (entity) {
            workflowEnabledEntities.push({ ...entity, durableId: enabledEntity.DurableId });
        }
    });

    const storedEntities = getStoredEntities();
    Store.getStore().dispatch(
        updateEntities({
            allEntities: storedEntities?.allEntities,
            allEntitiesMap: storedEntities?.allEntitiesMap,
            queryableEntities: storedEntities?.queryableEntities,
            createableEntities: storedEntities?.createableEntities,
            deletableEntities: storedEntities?.deletableEntities,
            updateableEntities: storedEntities?.updateableEntities,
            workflowEnabledEntities
        })
    );
};

/**
 * Returns only queryable SObjects
 *
 * @returns {Array} Queryable Entities
 */
export const getQueryableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.queryableEntities : [];
};

/**
 * Returns only creatable SObjects
 *
 * @returns {Array} Createable Entities
 */
export const getCreateableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.createableEntities : [];
};

/**
 * Returns only deletable SObjects
 *
 * @returns {Array} Deletable Entities
 */
export const getDeletableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.deletableEntities : [];
};

/**
 * Returns only updatable SObjects
 *
 * @returns {Array} Updateable Entities
 */
export const getUpdateableEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.updateableEntities : [];
};

/**
 * Returns only workflow enabled SObjects
 *
 * @returns {Array} Worflow Enabled Entities
 */
export const getWorkflowEnabledEntities = () => {
    const storedEntities = getStoredEntities();
    return storedEntities ? storedEntities.workflowEnabledEntities : [];
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
 * @param entityName api name of the SObject
 * @param {{background: (boolean|undefined), disableErrorModal: (boolean|undefined), messageForErrorModal: (string|undefined)}} optionalParams
 *            background need to be set to true if request needs to be run as a background action
 *            disableErrorModal need to be set to true to disable the default error modal panel
 *            messageForErrorModal the message to use instead of the default error message
 * @returns Promise object with the fields
 */
export const fetchFieldsForEntity = (
    entityName: string,
    { background = false, disableErrorModal = false, messageForErrorModal = undefined } = {}
): Promise<{}> => {
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
    }).then((fields) => {
        cachedEntityFields[entityName] = fields;
        return fields;
    });
};

/**
 * Fetch picklistField given a recordTypeId and fieldApiName
 *
 * @param fieldApiName field api name of the format Account.AccountSource
 * @param recordTypeId recordTypeID, once we switch to UI-API use the Object Info defaultRecordTypeId property, which is returned from getObjectInfo.
 * @returns Promise object with the picklist values
 */
export const fetchFieldsForPicklist = async (
    fieldApiName: string,
    recordTypeId: string
): Promise<GetPicklistValuesLegacyApiData> => {
    const [entityName, fieldName] = fieldApiName.split('.');
    const fields = await fetchFieldsForEntity(entityName);
    return fields[fieldName].activePicklistValues;
};

/**
 * Grabs the fields for a specific sObject from the cache, undefined if not a valid entityName
 *
 * @param entityName Api name of the SObject
 * @returns object "map" with entity fields (field API name as "key")
 */
export const getFieldsForEntity = (entityName: string): object => cachedEntityFields[entityName];

/**
 * Grabs the related record fields for a specific sObject from the cache, undefined if not a valid entityName
 *
 * @param entityName Api name of the SObject
 * @returns object "map" with entity related record fields (field API name as "key")
 */
export const getRelatedRecordFieldsForEntity = (entityName: string): object =>
    cachedRelatedRecordFieldsForEntity[entityName];

/**
 * Fetch related fields for given entity
 *
 * @param entityName api name of the SObject
 * @param {{background: (boolean|undefined), disableErrorModal: (boolean|undefined), messageForErrorModal: (string|undefined)}} optionalParams
 *            background need to be set to true if request needs to be run as a background action
 *            disableErrorModal need to be set to true to disable the default error modal panel
 *            messageForErrorModal the message to use instead of the default error message
 * @returns Promise object with the related record fields
 */
export const fetchRelatedRecordFieldsForEntity = (
    entityName: string,
    { background = false, disableErrorModal = false, messageForErrorModal = undefined } = {}
): Promise<{}> => {
    if (cachedRelatedRecordFieldsForEntity[entityName]) {
        return Promise.resolve(cachedRelatedRecordFieldsForEntity[entityName]);
    }
    const params = {
        entityApiName: entityName
    };
    return fetchOnce(SERVER_ACTION_TYPE.GET_RELATED_RECORDS_FIELDS_FOR_ENTITY, params, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then((fields) => {
        cachedRelatedRecordFieldsForEntity[entityName] = fields;
        return fields;
    });
};

/**
 * Get the field with given api name (case-insensitive)
 *
 * @param {Object} fields - map of properties (apiName -> field)
 * @param {string} fieldName
 * @returns {Object|undefined} the field with the api name or undefined if there is no field with this api name
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

export const clearEntityFieldsCache = (): object => (cachedEntityFields = {});
export const clearRelatedRecordFieldsForEntityCache = (): object => (cachedRelatedRecordFieldsForEntity = {});
