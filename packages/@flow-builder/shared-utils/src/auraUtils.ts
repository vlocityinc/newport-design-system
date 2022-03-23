/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line lwc-core/no-interop-create, lwc-core/no-interop-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';

export enum modalBodyVariant {
    WARNING_ON_CANVAS_MODE_TOGGLE
}

export enum modalFooterVariant {
    PROMPT
}

/**
 * @constant state of callback result
 * @type {Object}
 */
const STATE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

/**
 * @constant Panel type  used for modals.
 * @type {string}
 */
const MODAL = 'modal';

/**
 * @constant
 * @type {string}
 */
const UI_CREATE_PANEL = 'ui:createPanel';

/**
 * @param {string} cmpName component name descriptor
 * @param {object} attr attributes for the component
 * @returns {Promise} which resolves with a successful component creation or rejects with an errorMessage
 */
const createComponentPromise = (cmpName: string, attr: any) => {
    return new Promise((resolve, reject) => {
        createComponent(cmpName, attr, (newCmp: any, status: any, errorMessage: any) => {
            if (status === STATE.SUCCESS) {
                resolve(newCmp);
            } else if (status === STATE.ERROR) {
                reject(errorMessage);
            }
        });
    });
};

const invokeModalWithComponentsOnCreate = (modal: any, data: any) => {
    const modalFooter = modal.get('v.footer')[0];
    if (data.closeModalCallback) {
        modalFooter.set('v.closeModalCallback', () => {
            data.closeModalCallback(modal);
        });
    } else {
        modalFooter.set('v.closeModalCallback', modal.close);
    }
    return modalFooter;
};

/**
 * Invokes the modal and creates the alert/confirmation modal inside it
 *
 * @param {object} data - contains data for modal header/body/footer
 * @returns The Modal
 */
export const invokeModal = (data: InvokeModalData) => {
    const modalHeaderPromise = createComponentPromise('builder_platform_interaction:modalHeader', {
        headerTitle: data.headerData.headerTitle,
        headerVariant: data.headerData.headerVariant
    });
    const modalBodyPromise = createComponentPromise('builder_platform_interaction:modalBody', {
        bodyTextOne: data.bodyData.bodyTextOne,
        bodyTextTwo: data.bodyData.bodyTextTwo,
        listSectionHeader: data.bodyData.listSectionHeader,
        listSectionItems: data.bodyData.listSectionItems,
        listWarningItems: data.bodyData.listWarningItems,
        bodyVariant: data.bodyData.bodyVariant,
        showBodyTwoVariant: data.bodyData.showBodyTwoVariant,
        invocableApexActions: data.bodyData.invocableApexActions
    });
    const modalFooterPromise = createComponentPromise('builder_platform_interaction:modalFooter', {
        buttons: data.footerData,
        footerVariant: data.footerData.footerVariant
    });

    return invokeModalWithComponents(
        data,
        modalHeaderPromise,
        modalBodyPromise,
        modalFooterPromise,
        invokeModalWithComponentsOnCreate
    );
};

/**
 * Invokes modals with the specified header, body, and footer promises.
 *
 * @param data - contains data for modal header/body/footer
 * @param modalHeaderPromise - the promise for the header.
 * @param modalBodyPromise - the promise for the body.
 * @param modalFooterPromise - the promise for footer.
 * @param onCreate - function to apply specific behavior on create
 * @returns a Promise when completed
 */
export const invokeModalWithComponents = (
    data: any,
    modalHeaderPromise: any,
    modalBodyPromise: any,
    modalFooterPromise: any,
    onCreate = invokeModalWithComponentsOnCreate
) => {
    return Promise.all([modalHeaderPromise, modalBodyPromise, modalFooterPromise])
        .then((newComponents) => {
            const createPanelEventAttributes = {
                panelType: MODAL,
                visible: true,
                panelConfig: {
                    header: newComponents[0],
                    body: newComponents[1],
                    footer: newComponents[2],
                    modalClass: data.modalClass || '',
                    headerClass: data.headerClass || '',
                    bodyClass: data.bodyClass || '',
                    footerClass: data.footerClass || '',
                    flavor: data.flavor || '',
                    closeAction: (modal: any) => {
                        let skipCloseAction = false;
                        if (data.closeCallback) {
                            skipCloseAction = data.closeCallback();
                        }
                        if (!skipCloseAction) {
                            modal.close();
                        }
                    }
                },
                onCreate: (modal: any) => {
                    onCreate(modal, data);
                }
            };
            dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
        })
        .catch((errorMessage) => {
            throw new Error('Modal creation failed : ' + errorMessage);
        });
};
