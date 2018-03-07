import { combinedReducer } from 'builder_platform_interaction-store-lib';
import propertiesReducer from './properties-reducer';
import elementsReducer from './elements-reducer';
import variablesReducer from './variables-reducer';
import canvasElementsReducer from './canvas-elements-reducer';
import connectorsReducer from './connectors-reducer';
import startElementReducer from './start-element-reducer';

export const reducer =  combinedReducer({
    elements: elementsReducer,
    properties: propertiesReducer,
    variables: variablesReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer,
    startElement: startElementReducer
});