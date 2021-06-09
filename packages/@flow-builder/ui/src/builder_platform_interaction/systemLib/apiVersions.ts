let apiVersionsList: Array<number>;
let defaultApiVersion: number;
let versioningDataInitialized = false;

const versioningDataByPT = new Map<string, object>();

/**
 * Cache Versioning data for all process types from server.
 *
 * @param data {Map<String, Object>}
 */
export const cacheVersioningDataForAllProcessTypes = (data: Map<string, object>): void => {
    for (const [flowProcessType, ptData] of Object.entries(data)) {
        versioningDataByPT.set(flowProcessType, ptData);
    }
};

/**
 * private getter gets versioning data for a process type.
 *
 * @param flowProcessType {String}
 * @returns {Object}
 */
const getVersioningDataByPT = (flowProcessType: string) => {
    return versioningDataByPT.get(flowProcessType);
};

/**
 * private setter for ApiVersionList.
 *
 * @param data {Object}
 */
const setApiVersionsList = (data): void => {
    if (data && Array.isArray(data.apiVersionsList)) {
        apiVersionsList = data.apiVersionsList;
    }
};

/**
 * private setter for defaultApiVersion.
 *
 * @param data {Object}
 */
const setDefaultApiVersion = (data): void => {
    if (data) {
        defaultApiVersion = data.defaultApiVersion;
    }
};

/**
 * Init Versioning data for the currently selected process types.
 *
 * @param flowProcessType {String}
 */
export const initVersioningInfoForProcessType = (flowProcessType: string): void => {
    const data = getVersioningDataByPT(flowProcessType);
    if (data) {
        setApiVersionsList(data);
        setDefaultApiVersion(data);
    }
};

/**
 * set init versioning data from server flag to a value
 *
 * @param value {boolean}
 */
export const setVersioningDataInitialized = (value: boolean): void => {
    versioningDataInitialized = value;
};

/**
 * getter for ApiVersionList for the current Process type.
 *
 * @returns {Array<number>>}
 */
export const getApiVersionsList = (): Array<number> => {
    return apiVersionsList;
};

/**
 * getter for defaultApiVersion for the current Process type.
 *
 * @returns {number}
 */
export const getDefaultApiVersion = (): number => {
    return defaultApiVersion;
};

/**
 * gets latest apiVersion from ApiVersionList
 *
 * @returns {number}
 */
export const getLatestApiVersion = (): number => {
    if (apiVersionsList && apiVersionsList.length > 0) {
        return apiVersionsList[apiVersionsList.length - 1];
    }
    return 0;
};

/**
 * gets min apiVersion from ApiVersionList
 *
 * @returns {number}
 */
export const getMinApiVersion = (): number => {
    if (apiVersionsList && apiVersionsList.length > 0) {
        return apiVersionsList[0];
    }
    return 0;
};

/**
 * check if Versioning data is initied from server.
 *
 * @returns boolean
 */
export const isVersioningDataInitialized = (): boolean => {
    return versioningDataInitialized;
};

export const isVersioningSupported = (): boolean => {
    const isListValid: boolean =
        apiVersionsList !== undefined && Array.isArray(apiVersionsList) && apiVersionsList.length > 0;
    const isDefaultValueValid: boolean =
        defaultApiVersion !== null && defaultApiVersion !== undefined && defaultApiVersion !== 0;
    return isListValid && isDefaultValueValid;
};
