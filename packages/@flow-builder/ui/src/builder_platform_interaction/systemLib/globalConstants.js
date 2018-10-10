import globalConstantPrefixLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantPrefix';
import globalConstantEmptyStringLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantEmptyString';
import globalConstantTrueLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantTrue';
import globalConstantFalseLabel from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantFalse';
import globalConstantCategory from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantCategory';
import emptyStringMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.emptyStringMetaLine';
import trueMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.trueMetaLine';
import falseMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.falseMetaLine';
import { FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

export const GLOBAL_CONSTANT_PREFIX = globalConstantPrefixLabel;

export const GLOBAL_CONSTANTS = {
    EMPTY_STRING: globalConstantPrefixLabel + '.' + globalConstantEmptyStringLabel,
    BOOLEAN_TRUE:  globalConstantPrefixLabel + '.' + globalConstantTrueLabel,
    BOOLEAN_FALSE: globalConstantPrefixLabel + '.' +  globalConstantFalseLabel,
};

/**
 * Descriptions of the GLOBAL_CONSTANTS variables in a shape that looks like
 * elements. name, guid, description and category are only necessary so that these
 * play nicely with being used in the combobox.
 *
 * NOTE: Any constants added here also need to be added to the menu data selectors.
 */
export const GLOBAL_CONSTANT_OBJECTS = {
    [GLOBAL_CONSTANTS.BOOLEAN_TRUE] : {
        label: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        name: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
        description: trueMetaLine,
    },
    [GLOBAL_CONSTANTS.BOOLEAN_FALSE] : {
        label: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        name: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
        description: falseMetaLine,
    },
    [GLOBAL_CONSTANTS.EMPTY_STRING] : {
        label: GLOBAL_CONSTANTS.EMPTY_STRING,
        name: GLOBAL_CONSTANTS.EMPTY_STRING,
        guid: GLOBAL_CONSTANTS.EMPTY_STRING,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.STRING,
        category: globalConstantCategory,
        description: emptyStringMetaLine,
    },
};
