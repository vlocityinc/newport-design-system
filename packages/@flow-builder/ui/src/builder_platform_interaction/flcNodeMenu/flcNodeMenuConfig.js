const COPY_LABEL = 'Copy Element';
const DELETE_LABEL = 'Delete Element';

export const Actions = {
    Create: 'Create Records',
    Delete: 'delete',
    Get: 'Get Records',
    Update: 'Update Records'
};

const { Create, Delete, Get, Update } = Actions;

const deleteActionConfig = {
    assetLocation: '/assets/icons/utility-sprite/svg/symbols.svg#delete',
    class: 'slds-icon slds-icon-text-error slds-icon_x-small slds-icon-text-default slds-m-right_x-small',
    icon: 'utility:delete',
    label: DELETE_LABEL,
    value: 'delete'
};

export const MenuConfiguration = {
    Action: {
        Header: {
            title: 'Action',
            description: 'Action Description Here'
        },
        Body: {
            NodeActions: []
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    Assignment: {
        Header: {
            title: 'Assignment Element',
            description: 'Assignment Description Here'
        },
        Body: {
            NodeActions: [deleteActionConfig]
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    },
    [Create]: {
        Header: {
            title: 'Create Record',
            description: 'Create Record Description Here'
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
    [Delete]: {
        Header: {
            title: 'Delete Record',
            description: 'Delete Record Description Here'
        },
        Body: {
            NodeActions: []
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
    },
    [Get]: {
        Header: {
            title: 'Lookup Record',
            description: 'Lookup Record Description Here'
        },
        Body: {
            NodeActions: []
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
    [Update]: {
        Header: {
            title: 'Update Record',
            description: 'Update Record Description Here'
        },
        Body: {
            NodeActions: []
        },
        Footer: {
            buttonText: 'Edit Details'
        }
    }
};
