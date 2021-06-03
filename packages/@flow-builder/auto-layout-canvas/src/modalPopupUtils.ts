// @ts-nocheck
// eslint-disable-next-line lwc-core/no-interop-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';

/**
 * @constant state of callback result
 * @type {Object}
 */
const STATE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

const MODAL = 'modal';
const UI_CREATE_PANEL = 'ui:createPanel';

export enum modalBodyVariant {
    WARNING_ON_CANVAS_MODE_TOGGLE
}

export enum modalFooterVariant {
    PROMPT
}

/**
 * @param {string} cmpName component name descriptor
 * @param {object} attr attributes for the component
 * @returns {Promise} which resolves with a successful component creation or rejects with an errorMessage
 */
const createComponentPromise = (cmpName, attr) => {
    return new Promise((resolve, reject) => {
        createComponent(cmpName, attr, (newCmp, status, errorMessage) => {
            if (status === STATE.SUCCESS) {
                resolve(newCmp);
            } else if (status === STATE.ERROR) {
                reject(errorMessage);
            }
        });
    });
};

const invokeModalWithComponentsOnCreate = (modal, data) => {
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
 */
export const invokeModal = (data) => {
    const modalHeaderPromise = createComponentPromise('builder_platform_interaction:modalHeaderForAutoLayout', {
        headerTitle: data.headerData.headerTitle,
        headerVariant: data.headerData.headerVariant
    });
    const modalBodyPromise = createComponentPromise('builder_platform_interaction:modalBodyForAutoLayout', {
        bodyTextOne: data.bodyData.bodyTextOne,
        bodyTextTwo: data.bodyData.bodyTextTwo,
        bodyVariant: data.bodyData.bodyVariant,
        bodyTwoVariant: data.bodyData.showBodyTwoVariant
    });
    const modalFooterPromise = createComponentPromise('builder_platform_interaction:modalFooterForAutoLayout', {
        buttons: data.footerData,
        footerVariant: data.footerData.footerVariant
    });

    Promise.all([modalHeaderPromise, modalBodyPromise, modalFooterPromise])
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
                    closeAction: (modal) => {
                        let skipCloseAction = false;
                        if (data.closeCallback) {
                            skipCloseAction = data.closeCallback();
                        }
                        if (!skipCloseAction) {
                            modal.close();
                        }
                    }
                },
                onCreate: (modal) => {
                    invokeModalWithComponentsOnCreate(modal, data);
                }
            };
            dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
        })
        .catch((errorMessage) => {
            throw new Error('Modal creation failed : ' + errorMessage);
        });
};
