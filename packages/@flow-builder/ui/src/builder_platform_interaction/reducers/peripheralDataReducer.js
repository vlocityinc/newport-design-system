import {
    UPDATE_APEX_CLASSES,
    UPDATE_ENTITIES
} from 'builder_platform_interaction/actions';
import { combinedReducer } from 'builder_platform_interaction/storeLib';

function apexClassesReducer(state, action) {
    switch (action.type) {
        case UPDATE_APEX_CLASSES:
            return action.payload;
        default:
            return state;
    }
}

function entitiesReducer(state, action) {
    return action.type === UPDATE_ENTITIES ? action.payload : state;
}

export const peripheralDataReducer = combinedReducer({
    apexClasses: apexClassesReducer,
    entities: entitiesReducer
});
