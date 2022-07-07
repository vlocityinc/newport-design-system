import emptyStringMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.emptyStringMetaLine';
import falseMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.falseMetaLine';
import globalConstantCategory from '@salesforce/label/FlowBuilderGlobalConstants.globalConstantCategory';
import trueMetaLine from '@salesforce/label/FlowBuilderGlobalConstants.trueMetaLine';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const GLOBAL_CONSTANT_PREFIX = '$GlobalConstant';

export const GLOBAL_CONSTANTS: Record<string, UI.FieldInputMenu.GlobalConstant> = {
    EMPTY_STRING: '$GlobalConstant.EmptyString',
    BOOLEAN_TRUE: '$GlobalConstant.True',
    BOOLEAN_FALSE: '$GlobalConstant.False'
} as const;

/**
 * Descriptions of the GLOBAL_CONSTANTS variables in a shape that looks like
 * elements. name, guid, description and category are only necessary so that these
 * play nicely with being used in the combobox.
 *
 * NOTE: Any constants added here also need to be added to the menu data selectors.
 */
export const GLOBAL_CONSTANT_OBJECTS: Record<UI.FieldInputMenu.GlobalConstant, UI.FieldInputMenu.GlobalConstantInfo> = {
    '$GlobalConstant.True': {
        label: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        name: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
        description: trueMetaLine
    },
    '$GlobalConstant.False': {
        label: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        name: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        guid: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
        category: globalConstantCategory,
        description: falseMetaLine
    },
    '$GlobalConstant.EmptyString': {
        label: GLOBAL_CONSTANTS.EMPTY_STRING,
        name: GLOBAL_CONSTANTS.EMPTY_STRING,
        guid: GLOBAL_CONSTANTS.EMPTY_STRING,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.STRING,
        category: globalConstantCategory,
        description: emptyStringMetaLine
    }
};
