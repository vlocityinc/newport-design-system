import { LightningElement, api, track } from 'lwc';

export default class ModalFooter extends LightningElement {
    @api buttons;
    @api closeModalCallback;

    @track state = {
        buttonOneDisabled: false,
        buttonTwoDisabled: false,
    };

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

    @api disableButtons() {
        this.state.buttonOneDisabled = true;
        this.state.buttonTwoDisabled = true;
    }
}