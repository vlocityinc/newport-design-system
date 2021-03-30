// @ts-nocheck
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { ManuallyAssignVariablesChangedEvent } from 'builder_platform_interaction/events';
import { getComboboxConfig } from 'builder_platform_interaction/baseResourcePicker';
import { superTypeToFlowDataType } from 'builder_platform_interaction/dataTypeLib';
import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { applyDynamicTypeMappings } from 'builder_platform_interaction/flowExtensionLib';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';

const resetOuputParameters = (state, { extensionDescription }) =>
    updateProperties(state, {
        outputParameters: (extensionDescription.outputParameters || []).map((descriptor) => ({
            attribute: undefined,
            descriptor,
            key: descriptor.apiName
        }))
    });

/**
 * Update the property storeOutputAutomatically and reset ouput parameters if needed
 */
const useAdvancedOptionsSelectionChanged = (state, props, { useAdvancedOptions }) => {
    state = updateProperties(state, {
        storeOutputAutomatically: !useAdvancedOptions
    });

    return useAdvancedOptions ? state : resetOuputParameters(state, props);
};

export function screenExtensionPropertiesEventReducer(state, props, event) {
    switch (event.type) {
        case ManuallyAssignVariablesChangedEvent.EVENT_NAME:
            return useAdvancedOptionsSelectionChanged(state, props, event.detail);
        default:
            return state;
    }
}

/**
 * Creates a list of screen field parameters from a list of parameter descriptors and current screen field parameters.
 * @param {[FlowExtensionParameter]} descriptors - Flow extension parameters
 * @param {[ScreenFieldParameter]]} paramsIn - Current screen field parameters
 * @param {string} filteringProperty -
 * @param {boolean} sortByRequiredness - Put required parameters to the top
 * @returns {[{ key, attribute, descriptor, rowIndex, index }]} - A list of screen field parameter data for rendering input components
 */
function createParametersMapping(descriptors, paramsIn, filteringProperty, sortByRequiredness, dynamicTypeMappings) {
    const result = [];
    descriptors
        .filter((descriptor) => descriptor[filteringProperty])
        .filter((descriptor) => !descriptor.availableValues)
        .forEach((descriptor) => {
            let value;
            if (descriptor.availableValues && dynamicTypeMappings) {
                const dynamicTypeMapping = dynamicTypeMappings.find(
                    (item) => getValueFromHydratedItem(item.typeName) === descriptor.availableValues
                );
                if (dynamicTypeMapping) {
                    value = getValueFromHydratedItem(dynamicTypeMapping.typeValue);
                }
            }

            const params = paramsIn.filter((param) => descriptor.apiName === param.name.value);
            if (params && params.length > 0) {
                for (let j = 0; j < params.length; j++) {
                    result.push({
                        attribute: value ? { value } : params[j],
                        descriptor,
                        index: j + 1,
                        rowIndex: params[j].rowIndex,
                        key: descriptor.apiName + j,
                        disabled: !!descriptor.availableValues
                    });
                }
            } else {
                result.push({
                    attribute: value ? { value } : undefined,
                    descriptor,
                    key: descriptor.apiName,
                    disabled: !!descriptor.availableValues
                });
            }
        });

    // Sort by isRequired and label/apiName
    result.sort((p1, p2) => {
        if (sortByRequiredness && p1.descriptor.isRequired !== p2.descriptor.isRequired) {
            return p1.descriptor.isRequired ? -1 : 1;
        }
        const p1Label = (p1.descriptor.label || p1.descriptor.apiName || '').toLowerCase();
        const p2Label = (p2.descriptor.label || p2.descriptor.apiName || '').toLowerCase();
        return p1Label.localeCompare(p2Label);
    });

    return result;
}

const createInputParameters = ({ extensionDescription, field }) =>
    createParametersMapping(
        applyDynamicTypeMappings(extensionDescription.inputParameters, field.dynamicTypeMappings),
        field.inputParameters,
        'isInput',
        true,
        field.dynamicTypeMappings
    );

const createOutputParameters = ({ extensionDescription, field }) =>
    createParametersMapping(
        applyDynamicTypeMappings(extensionDescription.outputParameters, field.dynamicTypeMappings),
        field.outputParameters,
        'isOutput',
        false,
        field.dynamicTypeMappings
    );

/**
 * Creates a list of dynamic type mappings internal to this component. Its main job is to create comboboxConfig.
 * @param {[GenericType]} [genericTypes] - Generic types
 * @param {*} [dynamicTypeMappings] - Current dynamic type mappings
 * @param {*} disabled - Indicates if dynamic type mappings are changeable
 * @returns {[{ name, value, rowIndex, comboboxConfig }]} - Collection of dynamic type mapping data
 *  for rendering entity pickers
 */
const createDynamicTypeMappings = (genericTypes, dynamicTypeMappings = [], disabled) =>
    (genericTypes || [])
        // Add a flow type for a super type
        .map((genericType) => ({
            genericType,
            flowDataType: superTypeToFlowDataType(genericType.superType)
        }))
        // Add a flow data type and a current dynamic type mapping
        .map(({ genericType, flowDataType }) => ({
            genericType,
            flowDataTypeName: flowDataType ? flowDataType.value : undefined,
            dynamicTypeMapping: dynamicTypeMappings.find(
                (item) => getValueFromHydratedItem(item.typeName) === genericType.name
            )
        }))
        // Create dynamic type mapping for rendering the entity picker
        .map(({ genericType, flowDataTypeName, dynamicTypeMapping }) => ({
            comboboxConfig: getComboboxConfig({
                label: genericType.label,
                errorMessage: getErrorFromHydratedItem(dynamicTypeMapping.typeValue),
                required: true,
                disabled,
                type: flowDataTypeName,
                allowSObjectFields: false,
                fieldLevelHelp: genericType.description
            }),
            mode: EntityResourcePicker.flowDataTypeNameToMode(flowDataTypeName),
            name: genericType.name,
            rowIndex: dynamicTypeMapping.rowIndex,
            value: getValueFromHydratedItem(dynamicTypeMapping.typeValue)
        }));

const createDynamicTypeMappingsReducer = ({ field, extensionDescription }) =>
    createDynamicTypeMappings(extensionDescription.genericTypes, field.dynamicTypeMappings, !field.isNewField);

const screenExtensionPropertiesStoreOutputAutomaticallyReducer = (state, { field }) =>
    (field && state.storeOutputAutomatically === undefined ? field : state).storeOutputAutomatically;

export function screenExtensionPropertiesPropsToStateReducer(state, { field, extensionDescription }) {
    if (!field || !extensionDescription || extensionDescription.name === field.name) {
        return updateProperties(state, {
            inputParameters: null,
            outputParameters: null,
            dynamicTypeMappings: [],
            storeOutputAutomatically: undefined
        });
    }

    return updateProperties(state, {
        // Set storeOutputAutomatically, but only once
        storeOutputAutomatically: screenExtensionPropertiesStoreOutputAutomaticallyReducer(state, {
            field,
            extensionDescription
        }),

        // Create a list of dynamic type mappings for the list of comboboxes
        dynamicTypeMappings: createDynamicTypeMappingsReducer({
            field,
            extensionDescription
        }),

        // Create a list of input parameters to render
        inputParameters: createInputParameters({ field, extensionDescription }),

        // Create a list of output parameters to render
        outputParameters: createOutputParameters({
            field,
            extensionDescription
        })
    });
}
