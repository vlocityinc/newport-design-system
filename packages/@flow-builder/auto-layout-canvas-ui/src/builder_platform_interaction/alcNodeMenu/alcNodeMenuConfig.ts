import { LABELS } from './alcNodeMenuLabels';

export const CONTEXTUAL_MENU_MODE = {
    BASE_ACTIONS_MODE: 'BASE_ACTIONS_MODE',
    DELETE_BRANCH_ELEMENT_MODE: 'DELETE_BRANCH_ELEMENT_MODE'
};

export const ELEMENT_ACTION_CONFIG = {
    COPY_ACTION: {
        icon: 'utility:copy_to_clipboard',
        label: LABELS.copyActionLabel,
        value: 'COPY_ACTION'
    },
    DELETE_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: LABELS.deleteActionLabel,
        value: 'DELETE_ACTION'
    },
    ADD_FAULT_ACTION: {
        icon: 'utility:level_down',
        label: LABELS.addFaultActionLabel,
        value: 'ADD_FAULT_ACTION'
    },
    DELETE_FAULT_ACTION: {
        icon: 'utility:level_down',
        iconVariant: 'error',
        label: LABELS.deleteFaultActionLabel,
        value: 'DELETE_FAULT_ACTION'
    },
    EDIT_DETAILS_ACTION: {
        buttonTextLabel: LABELS.editDetailsFooterActionLabel,
        buttonTextTitle: LABELS.editDetailsFooterActionTitle,
        buttonVariant: 'brand',
        value: 'EDIT_DETAILS_ACTION'
    },
    DELETE_BRANCH_ELEMENT_ACTION: {
        buttonIcon: 'utility:delete',
        buttonIconPosition: 'left',
        buttonTextLabel: LABELS.deleteFooterActionLabel,
        buttonTextTitle: LABELS.deleteFooterActionTitle,
        buttonVariant: 'destructive',
        value: 'DELETE_BRANCH_ELEMENT_ACTION'
    }
};

const getFooterData = (contextualMenuMode) => {
    return contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE
        ? ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION
        : ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION;
};

export const getMenuConfiguration = (
    { label, description },
    contextualMenuMode,
    canHaveFaultConnector,
    elementHasFault,
    disableDeleteElements
) => {
    const nodeActions = disableDeleteElements
        ? [ELEMENT_ACTION_CONFIG.COPY_ACTION]
        : [ELEMENT_ACTION_CONFIG.COPY_ACTION, ELEMENT_ACTION_CONFIG.DELETE_ACTION];

    if (canHaveFaultConnector && !elementHasFault) {
        nodeActions.push(ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION);
    } else if (elementHasFault && !disableDeleteElements) {
        nodeActions.push(ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION);
    }

    const menuConfiguration = {
        header: {
            label,
            description
        },
        body: {
            nodeActions
        },
        footer: getFooterData(contextualMenuMode)
    };

    return menuConfiguration;
};
