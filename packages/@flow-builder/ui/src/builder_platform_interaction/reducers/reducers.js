import { combinedReducer } from 'builder_platform_interaction/storeLib';
import flowPropertiesReducer from './flowPropertiesReducer';
import ffcElementsReducer from './elementsReducer';
import canvasElementsReducer from './canvasElementsReducer';
import connectorsReducer from './connectorsReducer';
import { peripheralDataReducer } from './peripheralDataReducer';
import flcElementsReducer from './flcElementsReducer';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

const flcCombinedReducer = combinedReducer({
    elements: flcElementsReducer,
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
    // the flc until after the module initialization time
    return (useFixedLayoutCanvas() ? flcCombinedReducer : ffcCombinedReducer)(state, action);
};

export { reducer };
