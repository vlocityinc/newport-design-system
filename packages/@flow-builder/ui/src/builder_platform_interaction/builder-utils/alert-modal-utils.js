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

    return { alertModalHeader, alertModalBody, alertModalFooter };
};

export const invokeAlertModal = (data) => {
    const { alertModalHeader, alertModalBody, alertModalFooter } = getModalHeaderBodyAndFooter(data);

    showCustomOverlay({
        modal: 'modal',
        header: alertModalHeader,
        body: alertModalBody,
        footer: alertModalFooter,
    }).then(modal => {
        alertModalFooter.closeModalCallback = () => {
            modal.close();
        };
    }).catch(errorMessages => {
        throw new Error('Alert Modal creation failed : ' + errorMessages);
    });
};