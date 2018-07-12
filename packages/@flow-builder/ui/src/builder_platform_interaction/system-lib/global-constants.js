import globalConstantEmptyStringLabel from '@label/FlowBuilderGlobalConstants.globalConstantEmptyString';
import globalConstantTrueLabel from '@label/FlowBuilderGlobalConstants.globalConstantTrue';
import globalConstantFalseLabel from '@label/FlowBuilderGlobalConstants.globalConstantFalse';
import globalConstantCategory from '@label/FlowBuilderGlobalConstants.globalConstantCategory';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

/**
 * Descriptions of the GLOBAL_CONSTANTS variables in a shape that looks like
 * elements. name, guid, and category are only necessary so that these
 * play nicely with being used in the combobox.
 *
 * NOTE: Any constants added here also need to be added to the menu data selectors.
 */
export const GLOBAL_CONSTANTS = {
    [globalConstantTrueLabel] : {
        label: globalConstantTrueLabel,
        name: globalConstantTrueLabel,
        guid: globalConstantTrueLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
    },
    [globalConstantFalseLabel] : {
        label: globalConstantFalseLabel,
        name: globalConstantFalseLabel,
        guid: globalConstantFalseLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
    },
    [globalConstantEmptyStringLabel] : {
        label: globalConstantEmptyStringLabel,
        name: globalConstantEmptyStringLabel,
        guid: globalConstantEmptyStringLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.STRING,
        category: globalConstantCategory,
    },
};
