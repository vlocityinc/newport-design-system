import { NodeOperationType } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './alcNodeMenuLabels';

const SUBFLOW = 'Subflow';

export const ELEMENT_ACTION_CONFIG = {
    ADD_FAULT_ACTION: {
        icon: 'utility:level_down',
        label: LABELS.addFaultActionLabel,
        value: 'ADD_FAULT_ACTION'
    },
    COPY_ACTION: {
        icon: 'utility:copy_to_clipboard',
        label: LABELS.copyActionLabel,
        value: 'COPY_ACTION'
    },
    CUT_ACTION: {
        icon: 'utility:cut',
        label: LABELS.cutActionLabel,
        value: 'CUT_ACTION'
    },
    CUT_BRANCH_ELEMENT_ACTION: {
        buttonIcon: 'utility:cut',
        buttonIconPosition: 'left',
        buttonTextLabel: LABELS.cutFooterActionLabel,
        buttonTextTitle: LABELS.cutFooterActionTitle,
        buttonVariant: 'brand',
        value: 'CUT_ELEMENT_ACTION'
    },
    DELETE_ACTION: {
        icon: 'utility:delete',
        iconVariant: 'error',
        label: LABELS.deleteActionLabel,
        value: 'DELETE_ACTION'
    },
    DELETE_BRANCH_ELEMENT_ACTION: {
        buttonIcon: 'utility:delete',
        buttonIconPosition: 'left',
        buttonTextLabel: LABELS.deleteFooterActionLabel,
        buttonTextTitle: LABELS.deleteFooterActionTitle,
        buttonVariant: 'destructive',
        value: 'DELETE_BRANCH_ELEMENT_ACTION'
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
    OPEN_SUBFLOW_ACTION: {
        icon: 'utility:new_window',
        label: LABELS.openReferenceFlowTitle,
        value: 'OPEN_SUBFLOW_ACTION'
    }
};

const getFooterData = (operationType: NodeOperationType) => {
    return operationType === 'cut'
        ? ELEMENT_ACTION_CONFIG.CUT_BRANCH_ELEMENT_ACTION
        : operationType === 'delete'
        ? ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION
        : ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION;
};

export const getMenuConfiguration = (
    { label, description, elementType },
    operationType,
    canHaveFaultConnector,
    elementHasFault,
    disableDeleteElements
) => {
    const nodeActions = disableDeleteElements
        ? [ELEMENT_ACTION_CONFIG.COPY_ACTION]
        : [ELEMENT_ACTION_CONFIG.COPY_ACTION, ELEMENT_ACTION_CONFIG.CUT_ACTION, ELEMENT_ACTION_CONFIG.DELETE_ACTION];

    if (elementType === SUBFLOW) {
        nodeActions.push(ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION);
    }

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
        footer: getFooterData(operationType)
    };

    return menuConfiguration;
};
