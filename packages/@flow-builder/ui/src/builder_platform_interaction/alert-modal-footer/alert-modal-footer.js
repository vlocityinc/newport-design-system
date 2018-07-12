import { Element, api } from 'engine';

export default class AlertModalFooter extends Element {
    @api buttons;
    @api closeModalCallback;

    closeModal = (closeCallback = true) => {
        if (typeof this.closeModalCallback === 'function' && closeCallback === true) {
            this.closeModalCallback();
        }
    };

    handleButtonOneClick() {
        if (typeof this.buttons.buttonOne.buttonCallback === 'function') {
            this.buttons.buttonOne.buttonCallback();
        }

        this.closeModal(this.buttons.buttonOne.closeCallback);
    }

    handleButtonTwoClick() {
        if (typeof this.buttons.buttonTwo.buttonCallback === 'function') {
            this.buttons.buttonTwo.buttonCallback();
        }

        this.closeModal(this.buttons.buttonTwo.closeCallback);
    }
}