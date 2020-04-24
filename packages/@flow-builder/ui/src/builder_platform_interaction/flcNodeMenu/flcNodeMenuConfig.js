import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

// TODO: FLC use real labels
const deleteFaultLabel = 'Delete Fault';
const addFaultLabel = 'Add Fault';
const deleteLabel = 'Delete';
const copyElementLabel = 'Copy Element';
const deleteElementLabel = 'Delete Element';
const deleteElementAndReconnectLabel = 'Delete Element and Reconnect';
const editDetailsLabel = 'Edit Details';

export const CONTEXTUAL_MENU_MODE = {
    BASE_ACTIONS_MODE: 'BASE_ACTIONS_MODE',
    DELETE_BRANCH_ELEMENT_MODE: 'DELETE_BRANCH_ELEMENT_MODE'
};

export const ELEMENT_ACTION_CONFIG = {
    COPY_ACTION: {
        icon: 'utility:copy',
        label: copyElementLabel,
        value: 'COPY_ACTION'
    },
    DELETE_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: deleteElementLabel,
        value: 'DELETE_ACTION'
    },
    DELETE_END_ELEMENT_ACTION: {
        icon: 'utility:reply',
        iconVariant: 'error',
        label: deleteElementAndReconnectLabel,
        value: 'DELETE_ACTION'
    },
    EDIT_DETAILS_ACTION: {
        buttonText: editDetailsLabel,
        buttonVariant: 'brand',
        value: 'EDIT_DETAILS_ACTION'
    },
    DELETE_BRANCH_ELEMENT_ACTION: {
        buttonIcon: 'utility:delete',
        buttonIconPosition: 'left',
        buttonText: deleteLabel,
        buttonVariant: 'destructive',
        value: 'DELETE_BRANCH_ELEMENT_ACTION'
    },
    ADD_FAULT_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: addFaultLabel,
        value: 'ADD_FAULT_ACTION'
    },
    DELETE_FAULT_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: deleteFaultLabel,
        value: 'DELETE_FAULT_ACTION'
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

export const getMenuConfiguration = (
    { elementType, label, description, canHaveFaultConnector },
    contextualMenuMode,
    elementHasFault
) => {
    let nodeActions = [];
    if (elementType === ELEMENT_TYPE.END_ELEMENT) {
        nodeActions = [ELEMENT_ACTION_CONFIG.DELETE_END_ELEMENT_ACTION];
    } else {
        nodeActions = [ELEMENT_ACTION_CONFIG.COPY_ACTION, ELEMENT_ACTION_CONFIG.DELETE_ACTION];

        if (canHaveFaultConnector) {
            nodeActions.push(
                elementHasFault ? ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION : ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION
            );
        }
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
