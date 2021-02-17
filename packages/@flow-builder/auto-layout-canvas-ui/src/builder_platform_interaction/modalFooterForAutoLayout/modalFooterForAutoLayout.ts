import { LightningElement, api } from 'lwc';

export default class ModalFooterForAutoLayout extends LightningElement {
    @api buttons;
    @api closeModalCallback;
    @api keyMap;
    _buttonOneClass;
    _buttonTwoClass;

    @api
    get buttonOneClass() {
        return this.assignButtonClass(this._buttonOneClass);
    }

    set buttonOneClass(value) {
        this._buttonOneClass = value;
    }

    @api
    get buttonTwoClass() {
        return this.assignButtonClass(this._buttonTwoClass);
    }

    set buttonTwoClass(value) {
        this._buttonTwoClass = value;
    }

    assignButtonClass(buttonClass) {
        return buttonClass ? buttonClass : 'slds-m-left_x-small slds-float_right';
    }

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
