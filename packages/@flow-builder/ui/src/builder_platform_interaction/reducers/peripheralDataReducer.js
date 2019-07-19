import {
    UPDATE_APEX_CLASSES
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

export const peripheralDataReducer = combinedReducer({
    apexClasses: apexClassesReducer
});