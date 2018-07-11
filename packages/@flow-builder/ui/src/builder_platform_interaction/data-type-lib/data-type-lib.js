import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

/**
 * Array of objects representing flow data types
 * Can be consumed by lightning-combobox
 * TODO: Use labels: W-4813532
 * TODO: Update list to use proper icons per designs, this is a dependency TD-0051198
 */
const FLOW_DATA_TYPE = {
    STRING: {
        label: 'Text',
        value: 'String',
    },
    SOBJECT: {
        label: 'sObject',
        value: 'SObject',
    },
    NUMBER: {
        label: 'Number',
        value: 'Number',
    },
    CURRENCY: {
        label: 'Currency',
        value: 'Currency',
    },
    BOOLEAN: {
        label: 'Boolean',
        value: 'Boolean',
    },
    DATE: {
        label: 'Date',
        value: 'Date',
    },
    DATE_TIME: {
        label: 'Date Time',
        value: 'DateTime',
    },
    PICKLIST: {
        label: 'Picklist',
        value: 'Picklist',
    },
    MULTI_PICKLIST: {
        label: 'Picklist Multi-select',
        value: 'Multipicklist',
    },
};

export const SCALE_RANGE = {
    min : 0,
    max : 17
};

export const SCALE_DEFAULT = 2;

const TYPE_MAPPING = {
    [FLOW_DATA_TYPE.STRING.value]: ["id", "reference", "address", "anytype", "base64", "combobox", "complexvalue", "datacategorygroupreference", "email", "encryptedstring", "location", "phone", "string", "textarea", "url"],
    [FLOW_DATA_TYPE.PICKLIST.value]: ["picklist"],
    [FLOW_DATA_TYPE.MULTI_PICKLIST.value]: ["multipicklist"],
    [FLOW_DATA_TYPE.DATE_TIME.value]: ["datetime", "time"],
    [FLOW_DATA_TYPE.DATE.value]: ["date"],
    [FLOW_DATA_TYPE.NUMBER.value]: ["double", "int", "percent"],
    [FLOW_DATA_TYPE.BOOLEAN.value]: ["boolean"],
    [FLOW_DATA_TYPE.CURRENCY.value]: ["currency"],
    [FLOW_DATA_TYPE.SOBJECT.value]: ["sobject"],
};

let resourceTypes = [];

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
 * Subtypes for screen input field type
 */
export const INPUT_FIELD_DATA_TYPE = {
    STRING: {
        label: LABELS.fieldTypeLabelTextField,
        value: 'TextBox',
    },
    NUMBER: {
        label: LABELS.fieldTypeLabelNumber,
        value: 'Number',
    },
    CURRENCY: {
        label: LABELS.fieldTypeLabelCurrency,
        value: 'Currency',
    },
    BOOLEAN: {
        label: LABELS.fieldTypeLabelCheckbox,
        value: 'Checkbox',
    },
    DATE: {
        label: LABELS.fieldTypeLabelDate,
        value: 'Date',
    },
    DATE_TIME: {
        label: LABELS.fieldTypeLabelDateTime,
        value: 'DateTime',
    }
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

/**
 * Set the supported resource types for New Resource panel. This is called at the very beginning of the flow.
 * @param {String} newResourceTypes - String object of all supported resource types.
 */
export function setResourceTypes(newResourceTypes = []) {
    resourceTypes = newResourceTypes;
}

/**
 * Returns supported resource types for New Resource panel.
 * @return {Array} resource types
 */
export function getResourceTypes() {
    return resourceTypes;
}