import { combinedReducer } from 'builder_platform_interaction/storeLib';
import flowPropertiesReducer from './flowPropertiesReducer';
import elementsReducer from './elementsReducer';
import canvasElementsReducer from './canvasElementsReducer';
import connectorsReducer from './connectorsReducer';

export const reducer = combinedReducer({
    elements: elementsReducer,
    properties: flowPropertiesReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer
});
