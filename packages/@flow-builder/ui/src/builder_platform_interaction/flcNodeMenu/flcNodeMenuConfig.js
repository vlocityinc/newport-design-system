import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const elementActionsConfig = {
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
    }
};

export const getMenuConfiguration = ({ elementType, label, description }) => {
    const nodeActions =
        elementType === ELEMENT_TYPE.START_ELEMENT
            ? []
            : elementType === ELEMENT_TYPE.END_ELEMENT
            ? [elementActionsConfig.DELETE_ACTION]
            : Object.values(elementActionsConfig);

    const footerData = {
        buttonText: 'Edit Details'
    };

    const menuConfiguration = {
        header: {
            label,
            description
        },
        body: {
            NodeActions: nodeActions
        }
    };

    if (elementType !== ELEMENT_TYPE.END_ELEMENT) {
        menuConfiguration.footer = footerData;
    }

    return menuConfiguration;
};
