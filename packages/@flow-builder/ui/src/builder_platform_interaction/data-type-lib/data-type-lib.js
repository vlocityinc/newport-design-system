import { LABELS as SCREEN_LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { LABELS as DATA_TYPE_LABELS } from './data-type-lib-labels';

/**
 * Array of objects representing flow data types
 * Can be consumed by lightning-combobox
 * TODO: Use labels: W-4813532
 * TODO: Update list to use proper icons per designs, this is a dependency TD-0051198
 */
const FLOW_DATA_TYPE = {
    STRING: {
        label: DATA_TYPE_LABELS.textDataTypeLabel,
        value: 'String',
    },
    SOBJECT: {
        label: DATA_TYPE_LABELS.sObjectDataTypeLabel,
        value: 'SObject',
    },
    NUMBER: {
        label: DATA_TYPE_LABELS.numberDataTypeLabel,
        value: 'Number',
    },
    CURRENCY: {
        label: DATA_TYPE_LABELS.currencyDataTypeLabel,
        value: 'Currency',
    },
    BOOLEAN: {
        label: DATA_TYPE_LABELS.booleanDataTypeLabel,
        value: 'Boolean',
    },
    DATE: {
        label: DATA_TYPE_LABELS.dateDataTypeLabel,
        value: 'Date',
    },
    DATE_TIME: {
        label: DATA_TYPE_LABELS.dateTimeDataTypeLabel,
        value: 'DateTime',
    },
    PICKLIST: {
        label: DATA_TYPE_LABELS.picklistDataTypeLabel,
        value: 'Picklist',
    },
    MULTI_PICKLIST: {
        label: DATA_TYPE_LABELS.multiPicklistDataTypeLabel,
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
    STRING : FLOW_DATA_TYPE.STRING.value,
    NUMBER : FLOW_DATA_TYPE.NUMBER.value,
    DATE : FLOW_DATA_TYPE.DATE.value,
    DATETIME: FLOW_DATA_TYPE.DATE_TIME.value,
    BOOLEAN : FLOW_DATA_TYPE.BOOLEAN.value,
    REFERENCE: 'reference'
};

/**
 * Subtypes for screen input field type
 */
export const INPUT_FIELD_DATA_TYPE = {
    STRING: {
        label: SCREEN_LABELS.fieldTypeLabelTextField,
        value: 'TextBox',
    },
    NUMBER: {
        label: SCREEN_LABELS.fieldTypeLabelNumber,
        value: 'Number',
    },
    CURRENCY: {
        label: SCREEN_LABELS.fieldTypeLabelCurrency,
        value: 'Currency',
    },
    BOOLEAN: {
        label: SCREEN_LABELS.fieldTypeLabelCheckbox,
        value: 'Checkbox',
    },
    DATE: {
        label: SCREEN_LABELS.fieldTypeLabelDate,
        value: 'Date',
    },
    DATE_TIME: {
        label: SCREEN_LABELS.fieldTypeLabelDateTime,
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