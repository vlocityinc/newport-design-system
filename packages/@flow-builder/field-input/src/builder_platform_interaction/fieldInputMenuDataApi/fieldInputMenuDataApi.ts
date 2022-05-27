import { getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { Store } from 'builder_platform_interaction/storeLib';

/**
 * Invokes an LDS adaptor programatically, as opposed to using '@wire'
 *
 * For example to programming do:
 *
 * (at)wire(getObjectInfo, { objectApiName })
 * handleGetObjectInfo(results) {...}
 *
 * We can do:
 *
 * const results = await invokeLdsAdaptor(getObjectInfo, { objectApiName });
 * handleGetObjectInfo(results);
 *
 * @param LdsAdaptor - The LDS adaptor, eg: getObjectInfo
 * @param config - The config for the adaptor api call
 * @returns A Promise with the api results
 */
export function invokeLdsAdaptor<T, S>(LdsAdaptor, config: S): WirePromise<T> {
    let cb;
    const ldsPromise = new Promise<ApiResponse<T>>((resolve, reject) => {
        cb = function (res) {
            if (res.error != null) {
                reject(res.error);
            }

            if (res.data) {
                resolve(res);
            }
        };
    });
    const ds = new LdsAdaptor(cb);
    ds.connect();
    ds.update(config);
    return ldsPromise;
}

type ApiConfig<T, S, L> = {
    legacyApi: (config: S) => WirePromise<L>;
    legacyApiAdaptor: (legacyApiResults: L) => WirePromise<T>;
};

// TODO: define proper types
type GetObjectInfoLegacyApiData = {};
type GetPicklistValuesLegacyApiData = {};

type ApisConfig = {
    getEntityInfo: ApiConfig<GetObjectInfoApiData, GetObjectInfoApiConfig, GetObjectInfoLegacyApiData>;
    getPicklistValues: ApiConfig<GetPicklistValuesApiData, GetPicklistValuesApiConfig, GetPicklistValuesLegacyApiData>;
};

// The config for the apis
const apisConfig: ApisConfig = {
    getEntityInfo: {
        legacyApi: (config) => fetchFieldsForEntity(config.objectApiName),
        legacyApiAdaptor: getObjectInfoApiLegacyDataAdapter
    },

    getPicklistValues: {
        legacyApi: (/* config*/) => Promise.resolve({}), // TODO
        legacyApiAdaptor: getPicklistValuesApiLegacyDataAdapter
    }
};

/**
 * Invokes a legacy API and transforms its results with a legacy API adapter so that the results have the shape of the API.
 *
 * @param apiName - The api name
 * @param config - The api cnfig
 * @returns The api results
 */
function invokeLegacyApi<T, S>(apiName: string, config: S): WirePromise<T> {
    const { legacyApi, legacyApiAdaptor } = apisConfig[apiName];
    return legacyApi<T>(config).then(legacyApiAdaptor);
}

/**
 * Transforms the api results of the legacy getObjectInfo into the shape of the getObjectInfo API
 *
 * @param legacyApiResult - The legacy getObjectInfo API result
 * @returns The getObjectInfo API result
 */
function getObjectInfoApiLegacyDataAdapter(
    legacyApiResult: GetObjectInfoLegacyApiData
): WirePromise<GetObjectInfoApiData> {
    // @ts-ignore
    return { data: { fields: legacyApiResult } };
}

/**
 * Transforms the api results of the legacy getObjectInfo into the shape of the getObjectInfo API
 *
 * @param legacyData - The legacy data
 * @returns The getPicklistValues API result
 */
function getPicklistValuesApiLegacyDataAdapter(
    legacyData: GetPicklistValuesLegacyApiData
): WirePromise<GetPicklistValuesApiData> {
    // TODO: tansform the legacy data
    // @ts-ignore
    return { data: legacyData, error: null };
}

/**
 * Invokes the getObjectInfo legacy API
 *
 * @param config - The getObjectInfo API config
 * @returns The getObjectInfo API result
 */
function legacyGetObjectInfoApi(config: GetObjectInfoApiConfig): WirePromise<GetObjectInfoApiData> {
    return invokeLegacyApi<GetObjectInfoApiData, GetObjectInfoApiConfig>('getEntityInfo', config);
}

/**
 * Invokes the getPicklistValues legacy API
 *
 * @param config - The getPicklistValues API config
 * @returns The getPicklistValues API result
 */
function legacyPicklistValuesApi(config: GetPicklistValuesApiConfig): WirePromise<GetPicklistValuesApiData> {
    return invokeLegacyApi<GetPicklistValuesApiData, GetPicklistValuesApiConfig>('getPicklistValues', config);
}

/**
 * Invokes the getPicklistValues API
 *
 * @see https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_object_info
 * @param config - The getPicklistValues API config
 * @returns The getPicklistValues API result
 */
export function getPicklistValuesApi(config: GetPicklistValuesApiConfig): WirePromise<GetPicklistValuesApiData> {
    return legacyPicklistValuesApi(config);
}

/**
 * Invokes the getObjectInfo API
 *
 * @see https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_wire_adapters_picklist_values
 * @param config - The getObjectInfo API config
 * @returns The getObjectInfo API result
 */
export function getObjectInfoApi(config: GetObjectInfoApiConfig): WirePromise<GetObjectInfoApiData> {
    return legacyGetObjectInfoApi(config);
}

/**
 * Invokes the TBD getFlowElements API
 *
 * @see TBD
 * @returns the flow elements
 */
export function getFlowElementsApi(): UI.Element[] {
    return Object.values(Store.getStore().getCurrentState().elements);
}

/**
 * Invokes the TBD getRules API
 *
 * @see TBD
 * @param ruleType - The rule type
 * @param elementType  - The element type
 * @returns the rules
 */
export function getRulesApi(ruleType, elementType): Rule[] {
    return getRulesForElementType(ruleType, elementType);
}
