import globalConstantEmptyStringLabel from '@label/FlowBuilderGlobalConstants.globalConstantEmptyString';
import globalConstantTrueLabel from '@label/FlowBuilderGlobalConstants.globalConstantTrue';
import globalConstantFalseLabel from '@label/FlowBuilderGlobalConstants.globalConstantFalse';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

export const GLOBAL_CONSTANTS = {
    [globalConstantTrueLabel] : {
        label: globalConstantTrueLabel,
        name: globalConstantTrueLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
    },
    [globalConstantFalseLabel] : {
        label: globalConstantFalseLabel,
        name: globalConstantFalseLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.BOOLEAN,
    },
    [globalConstantEmptyStringLabel] : {
        label: globalConstantFalseLabel,
        name: globalConstantEmptyStringLabel,
        isCollection: false,
        dataType: FEROV_DATA_TYPE.STRING,
    },
};
