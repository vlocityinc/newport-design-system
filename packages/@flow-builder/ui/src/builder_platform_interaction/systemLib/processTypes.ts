let processTypes: any[];
const processTypesFeatures = new Map<string, any[]>();

/**
 * Sets the process types. This should be done during app initialization.
 *
 * @param data The data returned by the service
 */
export const setProcessTypes = (data: any[]) => {
    if (Array.isArray(data)) {
        processTypes = data;
    }
};

/**
 * Gets all available process types.
 *
 * @returns process types usable in menus
 */
export const getProcessTypes = (): any[] => {
    return processTypes;
};

/**
 * @param processTypeName - the name of the process type
 * @param features - list of available features
 */
export const setProcessTypeFeature = (processTypeName: string, features: any[]) => {
    processTypesFeatures.set(processTypeName, features);
};

/**
 * @param processTypeName - the name of the process type
 * @returns List of available features for the process type
 */
export const getProcessFeatures = (processTypeName: string): any | undefined => {
    return processTypesFeatures.get(processTypeName);
};
