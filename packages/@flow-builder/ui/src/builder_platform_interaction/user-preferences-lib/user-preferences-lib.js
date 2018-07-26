import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { getUserPreferences } from 'builder_platform_interaction-context-lib';

const WELCOME_MAT_KEY = 'showWelcomeMat';
const RELEASE_216 = 'r216';

let userPreferences = {};

/**
 * Set the user preference for showing the welcome mat
 * @param {Boolean} welcomeMatPreference value to set
 */
export function setWelcomeMatPreference(welcomeMatPreference) {
    userPreferences[WELCOME_MAT_KEY] = {};
    userPreferences[WELCOME_MAT_KEY][RELEASE_216] = welcomeMatPreference;
    commitUserPreferences();
}

/**
 * Get the user preference for showing the welcome mat
 * @returns {Boolean} show the welcome mat or not
 */
export function getWelcomeMatPreference() {
    let welcomeMatPreference = true;
    userPreferences = getUserPreferences() || {};
    if (userPreferences && userPreferences[WELCOME_MAT_KEY]) {
        welcomeMatPreference = userPreferences[WELCOME_MAT_KEY][RELEASE_216];
    }
    return welcomeMatPreference;
}

function commitUserPreferences() {
    fetch(SERVER_ACTION_TYPE.SET_USER_PREFERENCES, commitUserPreferencesCallback, { preferences: userPreferences });
}

function commitUserPreferencesCallback({error} = {}) {
    if (error) {
        // TODO: handle error case
    } else {
        // do nothing
    }
}