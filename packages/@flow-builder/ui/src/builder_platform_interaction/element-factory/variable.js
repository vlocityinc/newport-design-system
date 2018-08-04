import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseResource } from './base/base-element';
import { baseResourceMetadataObject } from './base/base-metadata';
import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

const elementType = ELEMENT_TYPE.VARIABLE;
const FEROV_OBJECT_NAME = 'value';
const DEFAULT_VALUE_PROPERTY = 'defaultValue';
const FEROV_DATA_TYPE_PROPERTY = 'ferovDataType';

export function createVariable(variable = {}) {
    let newVariable = baseResource(variable);
    const { dataType, isCollection = false, isInput = false, isOutput = false, objectType, scale = 0, value } = variable;
    Object.assign(newVariable, {
        elementType,
        isCollection,
        isInput,
        isOutput,
        dataType,
        objectType,
        scale,
        value
    });
    if (value) {
        newVariable = mutateFEROV(newVariable, FEROV_OBJECT_NAME, {
            valueProperty: DEFAULT_VALUE_PROPERTY,
            dataTypeProperty: FEROV_DATA_TYPE_PROPERTY,
        });
    }
    return newVariable;
}

export function createVariableMetadataObject(variable) {
    if (!variable) {
        throw new Error('variable is not defined');
    }
    let newVariable = baseResourceMetadataObject(variable);
    const { isCollection = false, isInput = false, isOutput = false, scale = 0, defaultValue, dataType, objectType } = variable;
    Object.assign(newVariable, {
        dataType,
        isCollection,
        isInput,
        isOutput,
        objectType,
        scale
    });
    if (defaultValue) {
        newVariable = deMutateFEROV(variable, FEROV_OBJECT_NAME, {
            valueProperty: DEFAULT_VALUE_PROPERTY,
            dataTypeProperty: FEROV_DATA_TYPE_PROPERTY
        });
    }
    return newVariable;
}
