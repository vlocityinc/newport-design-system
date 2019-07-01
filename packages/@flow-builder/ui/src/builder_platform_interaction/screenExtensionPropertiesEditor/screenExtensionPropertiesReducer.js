import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';

const PROPS = {
    storeOutputAutomatically: 'storeOutputAutomatically',
    outputParameters: 'outputParameters',
    extensionDescription: '_extensionDescription'
};

const resetOuputParameters = state => {
    const params = [];
    state.extensionDescription.outputParameters.forEach(descriptor => {
        params.push({
            attribute: undefined,
            descriptor,
            key: descriptor.apiName
        });
    });
    return updateProperties(state, {
        [PROPS.outputParameters]: params
    });
};

/**
 * Update the property storeOutputAutomatically and reset ouput parameters if needed
 */
const useAdvancedOptionsSelectionChanged = (
    state,
    { useAdvancedOptions }
) => {
    state = updateProperties(state, {
        [PROPS.storeOutputAutomatically]: !useAdvancedOptions
    });

    return useAdvancedOptions ? state : resetOuputParameters(state);
};

export const screenExtensionPropertiesReducer = (state, event) => {
    return event.type === UseAdvancedOptionsSelectionChangedEvent.EVENT_NAME
        ? useAdvancedOptionsSelectionChanged(state, event.detail)
        : state;
};
