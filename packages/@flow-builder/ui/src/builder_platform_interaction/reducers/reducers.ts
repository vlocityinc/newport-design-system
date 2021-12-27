// @ts-nocheck
import { combinedReducer } from 'builder_platform_interaction/storeLib';
import { shouldUseAutoLayoutCanvas } from 'builder_platform_interaction/storeUtils';
import alcElementsReducer from './alcElementsReducer';
import canvasElementsReducer from './canvasElementsReducer';
import connectorsReducer from './connectorsReducer';
import ffcElementsReducer from './elementsReducer';
import flowPropertiesReducer from './flowPropertiesReducer';
import { peripheralDataReducer } from './peripheralDataReducer';

const alcCombinedReducer = combinedReducer({
    elements: alcElementsReducer,
    properties: flowPropertiesReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer,
    peripheralData: peripheralDataReducer
});

const ffcCombinedReducer = combinedReducer({
    elements: ffcElementsReducer,
    properties: flowPropertiesReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer,
    peripheralData: peripheralDataReducer
});

const reducer = (state, action) => {
    // need to resolve the reducer dynamically, since we don't know if we are using
    // the alc until after the module initialization time
    return (shouldUseAutoLayoutCanvas() ? alcCombinedReducer : ffcCombinedReducer)(state, action);
};

export { reducer };
