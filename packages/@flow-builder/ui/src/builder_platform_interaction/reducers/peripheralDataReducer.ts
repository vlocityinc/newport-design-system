// @ts-nocheck
import { UPDATE_APEX_CLASSES, UPDATE_ENTITIES } from 'builder_platform_interaction/actions';
import { combinedReducer } from 'builder_platform_interaction/storeLib';

/**
 * @param state
 * @param action
 */
function apexClassesReducer(state, action) {
    switch (action.type) {
        case UPDATE_APEX_CLASSES:
            return action.payload;
        default:
            return state;
    }
}

/**
 * @param state
 * @param action
 */
function entitiesReducer(state, action) {
    return action.type === UPDATE_ENTITIES ? action.payload : state;
}

export const peripheralDataReducer = combinedReducer({
    apexClasses: apexClassesReducer,
    entities: entitiesReducer
});
