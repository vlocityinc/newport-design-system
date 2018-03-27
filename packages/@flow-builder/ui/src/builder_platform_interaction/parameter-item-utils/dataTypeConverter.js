import { FLOW_DATA_TYPE } from 'builder_platform_interaction-constant';

const TYPE_MAPPING = {
    [FLOW_DATA_TYPE.STRING]: ["id", "reference", "address", "anytype", "base64", "combobox", "complexvalue", "datacategorygroupreference", "email", "encryptedstring", "location", "phone", "string", "textarea", "url"],
    [FLOW_DATA_TYPE.PICKLIST]: ["picklist"],
    [FLOW_DATA_TYPE.MULTI_PICKLIST]: ["multipicklist"],
    [FLOW_DATA_TYPE.DATE_TIME]: ["datetime", "time"],
    [FLOW_DATA_TYPE.DATE]: ["date"],
    [FLOW_DATA_TYPE.NUMBER]: ["double", "int", "percent"],
    [FLOW_DATA_TYPE.BOOLEAN]: ["boolean"],
    [FLOW_DATA_TYPE.CURRENCY]: ["currency"],
    [FLOW_DATA_TYPE.SOBJECT]: ["sobject"],
};

/**
 * convert from parameter data type to flow data type
 * @param {String} dataType     parameter's dataType
 * @returns {String} flow data type
 * TODO: will be replaced by service when W-4797144 is done
 */
export function getFlowDataType(dataType) {
    const flowDataType = Object.keys(TYPE_MAPPING).find(key => TYPE_MAPPING[key].includes(dataType.toLowerCase()));
    return (flowDataType) ? flowDataType : undefined;
}