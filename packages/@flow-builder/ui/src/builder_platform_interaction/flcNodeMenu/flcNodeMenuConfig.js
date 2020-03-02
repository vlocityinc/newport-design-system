const COPY_LABEL = 'Copy Element';
const DELETE_LABEL = 'Delete Element';

export const Actions = {
    Delete: 'delete'
};

const deleteActionConfig = {
    assetLocation: '/assets/icons/utility-sprite/svg/symbols.svg#delete',
    class: 'slds-icon slds-icon-text-error slds-icon_x-small slds-icon-text-default slds-m-right_x-small',
    icon: 'utility:delete',
    label: DELETE_LABEL,
    value: 'delete'
};

export const MenuConfiguration = {
    Start: {
        Header: {
            title: 'Start Element',
            description: 'Start Description Here'
        },
        Body: {
            NodeActions: []
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    Decision: {
        Header: {
            title: 'Decision Element',
            description: 'Decision Description Here'
        },
        Body: {
            NodeActions: [deleteActionConfig]
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    Pause: {
        Header: {
            title: 'Wait Element',
            description: 'Wait Description Here'
        },
        Body: {
            NodeActions: [deleteActionConfig]
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    Screen: {
        Header: {
            title: 'Screen Element',
            description: 'This is a screen element for user interactions'
        },
        Body: {
            NodeActions: [
                {
                    assetLocation: '/assets/icons/utility-sprite/svg/symbols.svg#copy',
                    class: 'slds-icon slds-icon_x-small slds-icon-text-default slds-m-right_x-small',
                    icon: 'utility:copy',
                    label: COPY_LABEL,
                    value: 'copy'
                },
                deleteActionConfig
            ]
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    End: {
        Header: {
            title: 'End Element',
            description: 'End Description Here'
        },
        Body: {
            NodeActions: []
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    }
};
