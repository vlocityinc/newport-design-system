import { createElement } from 'engine';
import { showCustomOverlay } from 'lightning-overlay-utils';
import AlertModalHeader from 'builder_platform_interaction-alert-modal-header';
import AlertModalBody from 'builder_platform_interaction-alert-modal-body';
import AlertModalFooter from 'builder_platform_interaction-alert-modal-footer';

const getModalHeaderBodyAndFooter = (data) => {
    const alertModalHeader = createElement('builder_platform_interaction-alert-modal-header', {
        is: AlertModalHeader
    });

    const alertModalBody = createElement('builder_platform_interaction-alert-modal-body', {
        is: AlertModalBody
    });

    const alertModalFooter = createElement('builder_platform_interaction-alert-modal-footer', {
        is: AlertModalFooter
    });

    alertModalHeader.headerTitle = data.headerData.headerTitle;
    alertModalBody.bodyTextOne = data.bodyData.bodyTextOne;
    alertModalBody.bodyTextTwo = data.bodyData.bodyTextTwo;
    alertModalBody.listSectionHeader = data.bodyData.listSectionHeader;
    alertModalBody.listSectionItems = data.bodyData.listSectionItems;
    alertModalFooter.buttons = data.footerData;
    const alertModalCloseCallback = data.closeCallback;
    return { alertModalHeader, alertModalBody, alertModalFooter, alertModalCloseCallback };
};

// TODO: Rename this to something more generic since it's being used both for alert and confirmation modals.
export const invokeAlertModal = (data) => {
    const { alertModalHeader, alertModalBody, alertModalFooter, alertModalCloseCallback } = getModalHeaderBodyAndFooter(data);

    showCustomOverlay({
        modal: 'modal',
        header: alertModalHeader,
        body: alertModalBody,
        footer: alertModalFooter,
        closeCallback: alertModalCloseCallback
    }).then(modal => {
        alertModalFooter.closeModalCallback = () => {
            modal.close();
        };
    }).catch(errorMessages => {
        throw new Error('Alert Modal creation failed : ' + errorMessages);
    });

    return { alertModalHeader, alertModalBody, alertModalFooter, alertModalCloseCallback };
};