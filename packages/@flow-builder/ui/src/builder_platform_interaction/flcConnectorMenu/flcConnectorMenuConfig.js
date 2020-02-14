/* I am just leaving this here for now so we know what elements we want to configure as we build this out
export const NodeType = {
    ROOT: { label: '', value: ELEMENT_TYPE.ROOT },
    SCREEN: { label: 'Screen', value: 'Screen' },
    ACTION: {
        label: 'Action',
        value: 'custom_notification'
    },
    SUB_FLOW: { label: 'Sub Flow', value: 'flow' },
    DECISION: {
        label: 'Decision',
        value: 'Decision'
    },
    ASSIGNMENT: {
        label: 'Assignment',
        value: 'assignment'
    },
    LOOP: { label: 'Loop', value: 'loop' },
    RECORD_CREATE: {
        label: 'Record Create',
        value: 'record_create'
    },
    RECORD_UPDATE: {
        label: 'Record Update',
        value: 'record_update'
    },
    RECORD_LOOKUP: {
        label: 'Record Lookup',
        value: 'record_lookup'
    },
    RECORD_DELETE: {
        label: 'Record Delete',
        value: 'record_delete'
    },
    END: {
        label: 'End',
        value: ELEMENT_TYPE.END_ELEMENT
    },
    START: { label: 'Start', value: 'START_ELEMENT' }
};
*/

export const MenuConfiguration = {
    sections: [
        {
            heading: '',
            items: [
                {
                    description: 'Paste copied element(s)',
                    icon: '/assets/icons/utility-sprite/svg/symbols.svg#paste',
                    iconClass: 'slds-icon slds-icon_small utility_icon icon-padding',
                    separator: true,
                    style: 'slds-icon_container slds-icon-standard-textbox',
                    title: 'Paste'
                }
            ],
            label: 'Paste Section'
        },
        {
            heading: 'Interaction',
            items: [
                {
                    description: 'Screens for capturing input1',
                    icon: '/assets/icons/standard-sprite/svg/symbols.svg#screen',
                    iconClass: 'slds-icon slds-icon_small utility_icon',
                    style: 'slds-icon_container slds-icon-standard-screen',
                    title: 'Screen'
                },
                {
                    description: 'Screens for capturing input2',
                    icon: '/assets/icons/standard-sprite/svg/symbols.svg#screen',
                    iconClass: 'slds-icon slds-icon_small utility_icon',
                    style: 'slds-icon_container slds-icon-standard-screen',
                    title: 'Screen'
                }
            ],
            label: 'Interaction'
        },
        {
            heading: 'Flow Control',
            items: [
                {
                    description: 'Store values for later use in your flow1',
                    icon: '/assets/icons/standard-sprite/svg/symbols.svg#assignment',
                    iconClass: 'slds-icon slds-icon_small utility_icon',
                    style: 'slds-icon_container slds-icon-standard-assignment',
                    title: 'Decision'
                }
            ],
            label: 'Flow Control'
        }
    ]
};
