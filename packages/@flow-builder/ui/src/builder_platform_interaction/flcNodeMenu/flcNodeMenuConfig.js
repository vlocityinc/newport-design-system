import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const CONTEXTUAL_MENU_MODE = {
    BASE_ACTIONS_MODE: 'BASE_ACTIONS_MODE',
    DELETE_BRANCH_ELEMENT_MODE: 'DELETE_BRANCH_ELEMENT_MODE'
};

export const ELEMENT_ACTION_CONFIG = {
    COPY_ACTION: {
        icon: 'utility:copy',
        label: 'Copy Element',
        value: 'COPY_ACTION'
    },
    DELETE_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: 'Delete Element',
        value: 'DELETE_ACTION'
    },
    DELETE_END_ELEMENT_ACTION: {
        icon: 'utility:reply',
        iconVariant: 'error',
        label: 'Delete Element and Reconnect',
        value: 'DELETE_ACTION'
    },
    EDIT_DETAILS_ACTION: {
        buttonText: 'Edit Details',
        buttonVariant: 'brand',
        value: 'EDIT_DETAILS_ACTION'
    },
    DELETE_BRANCH_ELEMENT_ACTION: {
        buttonIcon: 'utility:delete',
        buttonIconPosition: 'left',
        buttonText: 'Delete',
        buttonVariant: 'destructive',
        value: 'DELETE_BRANCH_ELEMENT_ACTION'
    }
};

const getFooterData = contextualMenuMode => {
    const actionConfig =
        contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE
            ? ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION
            : ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION;
    const buttonIcon = actionConfig.buttonIcon;
    const buttonIconPosition = actionConfig.buttonIconPosition;
    const buttonText = actionConfig.buttonText;
    const buttonVariant = actionConfig.buttonVariant;

    return { buttonIcon, buttonIconPosition, buttonText, buttonVariant };
};

export const getMenuConfiguration = ({ elementType, label, description }, contextualMenuMode) => {
    let nodeActions = [];
    if (elementType === ELEMENT_TYPE.END_ELEMENT) {
        nodeActions = [ELEMENT_ACTION_CONFIG.DELETE_END_ELEMENT_ACTION];
    } else {
        nodeActions = [ELEMENT_ACTION_CONFIG.COPY_ACTION, ELEMENT_ACTION_CONFIG.DELETE_ACTION];
    }

    const menuConfiguration = {
        header: {
            label,
            description
        },
        body: {
            nodeActions
        }
    };

    if (elementType !== ELEMENT_TYPE.END_ELEMENT) {
        const footerData = getFooterData(contextualMenuMode);
        menuConfiguration.footer = footerData;
    }

    return menuConfiguration;
};
