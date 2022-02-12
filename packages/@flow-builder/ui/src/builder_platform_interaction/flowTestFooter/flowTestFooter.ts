import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, track } from 'lwc';
const { checkCloseCallback } = commonUtils;

export default class FlowTestFooter extends LightningElement {
    @api flowTestButtons;
    @api closeModalCallback;
    @track _panelInstance;
    @track state = {
        flowTestButtonOneDisabled: false,
        flowTestButtonTwoDisabled: false
    };

    closeModal = (closeCallback = true) => {
        if (checkCloseCallback(this.closeModalCallback, closeCallback)) {
            this.closeModalCallback();
        }
    };

    handleFlowTestButtonOneClick() {
        let validationErrors = [];
        if (this._panelInstance != null) {
            const body = this._panelInstance.get('v.body')[0];
            validationErrors = body.validate();
            // If no validation errors then save the flow test
            if (!validationErrors || validationErrors.length === 0) {
                this.flowTestButtons.flowTestButtonOne.buttonCallback();
            } else {
                // ToDo: separate task to show validation errors on vertical nav
            }
        }
        this.closeModal(this.flowTestButtons.flowTestButtonOne.closeCallback);
    }

    handleFlowTestButtonTwoClick() {
        if (typeof this.flowTestButtons.flowTestButtonTwo.buttonCallback === 'function') {
            this.flowTestButtons.flowTestButtonTwo.buttonCallback();
        }

        this.closeModal(this.flowTestButtons.flowTestButtonTwo.closeCallback);
    }

    @api disableButtons() {
        this.state.flowTestButtonOneDisabled = true;
        this.state.flowTestButtonTwoDisabled = true;
    }

    @api disableFlowTestButtonOne() {
        this.state.flowTestButtonOneDisabled = true;
    }

    @api panelInstance(modal) {
        this._panelInstance = modal;
    }
}
