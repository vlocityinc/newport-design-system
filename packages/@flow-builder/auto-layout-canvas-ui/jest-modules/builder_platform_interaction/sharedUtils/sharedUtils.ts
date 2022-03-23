const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils/sharedUtils');
const commands = jest.requireActual('builder_platform_interaction/sharedUtils/commands');
const lwcUtils = jest.requireActual('builder_platform_interaction/sharedUtils/lwcUtils');
const { focusUtils } = jest.requireActual('builder_platform_interaction/sharedUtils');

const mockKeyboardInteractionUtils = jest.requireActual(
    'builder_platform_interaction_mocks/sharedUtils/keyboardInteractionUtils'
);
const auraUtils = jest.requireActual('builder_platform_interaction/sharedUtils/auraUtils');
const actionUtils = jest.requireActual('builder_platform_interaction/sharedUtils/actionUtils');

let keyboardInteractionUtils = jest.requireActual('builder_platform_interaction/sharedUtils/keyboardInteractionUtils');
const { KeyboardInteractions, withKeyboardInteractions } = mockKeyboardInteractionUtils;

keyboardInteractionUtils = { ...keyboardInteractionUtils, KeyboardInteractions, withKeyboardInteractions };

const { loggingUtils, storeUtils, commonUtils } = sharedUtils;

const Keys = keyboardInteractionUtils.Keys;

export {
    loggingUtils,
    keyboardInteractionUtils,
    commands,
    storeUtils,
    commonUtils,
    lwcUtils,
    auraUtils,
    Keys,
    focusUtils,
    actionUtils
};
