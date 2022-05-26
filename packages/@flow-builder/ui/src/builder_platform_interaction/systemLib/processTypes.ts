let processTypes: FlowProcessType[];
const processTypesFeatures = new Map<FlowProcessType, ProcessTypeFeatures[]>();

/**
 * Sets the process types. This should be done during app initialization.
 *
 * @param data The data returned by the service
 */
export const setProcessTypes = (data: FlowProcessType[]) => {
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
 * @param processType - the name of the process type
 * @param features - list of available features
 */
export const setProcessTypeFeatures = (processType: FlowProcessType, features: ProcessTypeFeatures[]) => {
    processTypesFeatures.set(processType, features);
};

/**
 * @param processType - the name of the process type
 * @returns List of available features for the process type
 */
export const getProcessFeatures = (processType: FlowProcessType): ProcessTypeFeatures[] | undefined => {
    return processTypesFeatures.get(processType);
};
