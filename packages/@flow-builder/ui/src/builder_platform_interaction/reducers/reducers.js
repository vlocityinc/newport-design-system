import { combinedReducer } from 'builder_platform_interaction-store-lib';
import flowPropertiesReducer from './flow-properties-reducer';
import elementsReducer from './elements-reducer';
import variablesReducer from './variables-reducer';
import formulasReducer from './formulas-reducer';
import canvasElementsReducer from './canvas-elements-reducer';
import connectorsReducer from './connectors-reducer';

export const reducer =  combinedReducer({
    elements: elementsReducer,
    properties: flowPropertiesReducer,
    variables: variablesReducer,
    formulas: formulasReducer,
    canvasElements: canvasElementsReducer,
    connectors: connectorsReducer
});