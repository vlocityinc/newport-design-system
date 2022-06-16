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
    const ldsPromise = new Promise<WireResponse<T>>((resolve, reject) => {
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

type LegacyApiConfig<C, L, R> = {
    legacyApi: (config: C) => Promise<L>;
    legacyApiAdaptor: (legacyApiResults: L) => R;
};

// TODO: define proper types
type GetObjectInfoLegacyApiData = {};
type GetPicklistValuesLegacyApiData = {};

type GetEntityInfoLegacyApiConfig = LegacyApiConfig<
    GetObjectInfoApiConfig,
    GetObjectInfoLegacyApiData,
    GetObjectInfoApiData
>;
type GetPicklistValueLegacyApiConfig = LegacyApiConfig<
    GetPicklistValuesApiConfig,
    GetPicklistValuesLegacyApiData,
    GetPicklistValuesApiData
>;

/**
 * Invokes a legacy API and transforms its results with a legacy API adapter so that the results have the shape of the API.
 *
 * @param legacyApiConfig - The api name
 * @param config - The api cnfig
 * @returns The api results
 */
function invokeLegacyApi<C, L, R>(legacyApiConfig: LegacyApiConfig<C, L, R>, config: C): WirePromise<R> {
    const { legacyApi, legacyApiAdaptor } = legacyApiConfig;
    return legacyApi(config).then((data) => makeWireResponse(legacyApiAdaptor(data)));
}

/**
 * Transforms the api results of the legacy getObjectInfo into the shape of the getObjectInfo API
 *
 * @param legacyApiResult - The legacy getObjectInfo API result
 * @returns The getObjectInfo API result
 */
function getObjectInfoApiLegacyDataAdapter(legacyApiResult: GetObjectInfoLegacyApiData): GetObjectInfoApiData {
    // @ts-ignore
    return { fields: legacyApiResult };
}

/**
 * Transforms the api results of the legacy getObjectInfo into the shape of the getObjectInfo API
 *
 * @param legacyData - The legacy data
 * @returns The getPicklistValues API result
 */
function getPicklistValuesApiLegacyDataAdapter(legacyData: GetPicklistValuesLegacyApiData): GetPicklistValuesApiData {
    // TODO: tansform the legacy data
    // @ts-ignore
    return legacyData;
}

const apisConfigGetEntityInfo: GetEntityInfoLegacyApiConfig = {
    legacyApi: (config: GetObjectInfoApiConfig) => fetchFieldsForEntity(config.objectApiName),
    legacyApiAdaptor: getObjectInfoApiLegacyDataAdapter
};

/**
 * Invokes the getObjectInfo legacy API
 *
 * @param config - The getObjectInfo API config
 * @returns The getObjectInfo API result
 */
function legacyGetObjectInfoApi(config: GetObjectInfoApiConfig): WirePromise<GetObjectInfoApiData> {
    return invokeLegacyApi(apisConfigGetEntityInfo, config);
}

const apisConfigGetPicklistValues: GetPicklistValueLegacyApiConfig = {
    legacyApi: (/* config*/) => Promise.resolve({}), // TODO
    legacyApiAdaptor: getPicklistValuesApiLegacyDataAdapter
};

/**
 * Invokes the getPicklistValues legacy API
 *
 * @param config - The getPicklistValues API config
 * @returns The getPicklistValues API result
 */
function legacyPicklistValuesApi(config: GetPicklistValuesApiConfig): WirePromise<GetPicklistValuesApiData> {
    return invokeLegacyApi(apisConfigGetPicklistValues, config);
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

/**
 * Make a wire response from data
 *
 * @param data - The data
 * @returns The wire response
 */
export function makeWireResponse<T>(data: T): WireResponse<T> {
    return { data, error: null };
}
