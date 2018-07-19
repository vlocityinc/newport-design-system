import { generateGuid } from 'builder_platform_interaction-store-lib';

/**
 * Creates an empty screen
 * @returns {object} - The empty screen
 */
export function createEmptyScreenNode() {
    return {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        description: '',
        elementType: 'SCREEN',
        helpText: '',
        label: '',
        name: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        rules: [],
        fields: []
    };
}

/**
 * Creates an empty screen field of the given type
 * @param {object} type - The field type
 * @return {object} - The new screen field
 */
export function createEmptyNodeOfType(type) {
    return {
        guid:generateGuid(),
        isRequired: type.dataType === 'Boolean' ? true : false,
        helpText: '',
        defaultValue: null,
        dataType: type.dataType,
        name: {value: null, error: null},
        extensionName: type.name,
        choiceReferences: [],
        defaultSelectedChoiceReference: '',
        fieldType: type.fieldType,
        inputParameters: [],
        fieldText: {value: null, error: null},
        label: '',
        outputParameters: []
    };
}

export function getValueFromFerov(value, dataType) {
    if (value) {
        if (value.elementReference) {
            return '{!' + value.elementReference + '}';
        } else if (dataType === 'Currency' || dataType === 'Number') {
            return value.numberValue;
        } else if (dataType === 'Date') {
            return value.dateValue;
        } else if (dataType === 'Boolean') {
            return value.booleanValue;
        }

        return value.stringValue;
    }

    return value;
}

export function getFerovFromValue(value, dataType = '') {
    if (value) {
        if (value.startsWith('{!') && value.endsWith('}')) { // TODO Check how the CFD sends default values to the server
            const elementReference = value.substring(2, value.length - 1); // TODO what if it is a merged field and it starts and ends with merge fields
            return {elementReference};
        } else if (dataType === 'Currency' || dataType === 'Number') {
            return {numberValue: value};
        } else if (dataType === 'Date') {
            return {dateValue: value};
        } else if (dataType === 'Boolean') {
            return {booleanValue: value};
        }

        return {stringValue: value};
    }

    return null;
}
