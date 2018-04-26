const FLOW_DATA_TYPE = {
    CURRENCY: 'Currency',
    DATE: 'Date',
    NUMBER: 'Number',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    SOBJECT: 'SObject',
    DATE_TIME: 'DateTime',
    PICKLIST: 'Picklist',
    MULTI_PICKLIST: 'Multipicklist',
};

/**
 * Array of menu data items representing flow data types
 * Consumed by lightning-combobox
 * TODO: Use labels: W-4813532
 * TODO: Update list to use proper icons per designs, this is a dependency
 */
export const FLOW_DATA_TYPE_MENU_ITEMS = [
    {
        label: 'Text',
        value: FLOW_DATA_TYPE.STRING,
    },
    {
        label: 'sObject',
        value: FLOW_DATA_TYPE.SOBJECT,
    },
    {
        label: 'Number',
        value: FLOW_DATA_TYPE.NUMBER,
    },
    {
        label: 'Currency',
        value: FLOW_DATA_TYPE.CURRENCY,
    },
    {
        label: 'Boolean',
        value: FLOW_DATA_TYPE.BOOLEAN,
    },
    {
        label: 'Date',
        value: FLOW_DATA_TYPE.DATE,
    },
    {
        label: 'Date Time',
        value: FLOW_DATA_TYPE.DATE_TIME,
    },
    {
        label: 'Picklist',
        value: FLOW_DATA_TYPE.PICKLIST,
    },
    {
        label: 'Picklist Multi-select',
        value: FLOW_DATA_TYPE.MULTI_PICKLIST,
    },
];

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

export { FLOW_DATA_TYPE };

export const FEROV_DATA_TYPE = {
    STRING : 'string',
    NUMBER : 'number',
    DATE : 'date',
    DATETIME: 'datetime',
    BOOLEAN : 'boolean',
    REFERENCE: 'reference'
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