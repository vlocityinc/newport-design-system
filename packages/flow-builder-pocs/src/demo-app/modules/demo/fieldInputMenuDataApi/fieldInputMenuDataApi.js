import { getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import getObjectInfo_Account from './apiData/getObjectInfo_Account';
import getObjectInfo_Account_picklistValues_012RO00000055zsYAA_AccountSource from './apiData/getObjectInfo_Account_picklist-values_012RO00000055zsYAA_AccountSource';
import storeState from './apiData/storeState';

/**
 * Mock api calls for the node app
 */

export function getPicklistValuesApi({ recordTypeId, fieldApiName }) {
    return Promise.resolve({
        data: getObjectInfo_Account_picklistValues_012RO00000055zsYAA_AccountSource,
        error: null
    });
}

export function getObjectInfoApi({ objectApiName }) {
    return Promise.resolve({
        data: getObjectInfo_Account,
        error: null
    });
}

/**
 * Invokes the TBD getFlowElements API
 *
 * @see TBD
 * @returns the flow elements
 */
export function getFlowElementsApi() {
    return Object.values(storeState.elements);
}

/**
 * Invokes the TBD getRules API
 *
 * @see TBD
 * @param ruleType - The rule type
 * @param elementType  - The element type
 * @returns the rules
 */
export function getRulesApi(ruleType, elementType) {
    return getRulesForElementType(ruleType, elementType);
}

export function getStoreState() {
    return storeState;
}
