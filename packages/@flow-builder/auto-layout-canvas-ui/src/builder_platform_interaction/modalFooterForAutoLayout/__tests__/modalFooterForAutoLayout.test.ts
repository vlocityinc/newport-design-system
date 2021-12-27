// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import ModalFooterForAutoLayout from 'builder_platform_interaction/modalFooterForAutoLayout';
import { createElement } from 'lwc';

const closeModalCallback = jest.fn();

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-modal-footer-for-auto-layout', {
        is: ModalFooterForAutoLayout
    });
    el.closeModalCallback = closeModalCallback;
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Show buttons', () => {
    it('should show button one and its label when buttonOne exists', () => {
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonOne: {
                    buttonLabel: 'button 1'
                }
            }
        });
        const button1 = testModalFooter.shadowRoot.querySelector('lightning-button');
        expect(button1).toBeDefined();
        expect(button1.label).toEqual('button 1');
    });
    it('should show button two when buttonOne exists', () => {
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonTwo: {
                    buttonLabel: 'button 2'
                }
            }
        });
        const button2 = testModalFooter.shadowRoot.querySelector('lightning-button');
        expect(button2).toBeDefined();
        expect(button2.label).toEqual('button 2');
    });
    it('should show no button when buttons is empty', () => {
        const testModalFooter = createComponentForTest({
            buttons: {}
        });
        const buttons = testModalFooter.shadowRoot.querySelectorAll('lightning-button');
        expect(buttons.length).toBe(0);
    });
});

describe('Click buttons', () => {
    it('Clicking on button one should invoke the call back if there exists one', () => {
        const callback = jest.fn();
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonOne: {
                    buttonLabel: 'button 1',
                    buttonCallback: callback
                }
            }
        });
        const button1 = testModalFooter.shadowRoot.querySelector('lightning-button');
        button1.click();
        expect(callback).toHaveBeenCalled();
    });
    it('Clicking on button one should close the modal if there is not call back', () => {
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonOne: {
                    buttonLabel: 'button 1',
                    closeCallback: true
                }
            }
        });
        const button1 = testModalFooter.shadowRoot.querySelector('lightning-button');
        button1.click();
        expect(closeModalCallback).toHaveBeenCalled();
    });
    it('Clicking on button two should invoke the call back if there exists one', () => {
        const callback = jest.fn();
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonTwo: {
                    buttonLabel: 'button 2',
                    buttonCallback: callback
                }
            }
        });
        const button2 = testModalFooter.shadowRoot.querySelector('lightning-button');
        button2.click();
        expect(callback).toHaveBeenCalled();
    });
    it('Clicking on button two should close the modal if there is not call back', () => {
        const testModalFooter = createComponentForTest({
            buttons: {
                buttonTwo: {
                    buttonLabel: 'button 2',
                    closeCallback: true
                }
            }
        });
        const button2 = testModalFooter.shadowRoot.querySelector('lightning-button');
        button2.click();
        expect(closeModalCallback).toHaveBeenCalled();
    });
});
