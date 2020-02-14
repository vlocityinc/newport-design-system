import { combinedReducer } from 'builder_platform_interaction/storeLib';
import flowPropertiesReducer from './flowPropertiesReducer';
import ffcElementsReducer from './elementsReducer';
import ffcCanvasElementsReducer from './canvasElementsReducer';
import connectorsReducer from './connectorsReducer';
import { peripheralDataReducer } from './peripheralDataReducer';
import flcElementsReducer from './flcElementsReducer';
import flcCanvasElementsReducer from './flcCanvasElementsReducer';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

const elementsReducer = useFixedLayoutCanvas() ? flcElementsReducer : ffcElementsReducer;
const canvasElementsReducer = useFixedLayoutCanvas() ? flcCanvasElementsReducer : ffcCanvasElementsReducer;

const reducer = combinedReducer({
    elements: elementsReducer,
    properties: flowPropertiesReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer,
    peripheralData: peripheralDataReducer
});

export {
    reducer,
    elementsReducer,
    flowPropertiesReducer,
    canvasElementsReducer,
    connectorsReducer,
    peripheralDataReducer
};
