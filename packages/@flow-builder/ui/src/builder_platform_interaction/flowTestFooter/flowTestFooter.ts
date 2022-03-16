import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { checkCloseCallback } = commonUtils;

export default class FlowTestFooter extends LightningElement {
    @api flowTestButtons;
    @api closeModalCallback;
    @api panelInstance;

    flowTestButtonOneDisabled = false;

    closeModal = (closeCallback = true) => {
        if (checkCloseCallback(this.closeModalCallback, closeCallback)) {
            this.closeModalCallback();
        }
    };

    handleFlowTestButtonOneClick() {
        let validationErrors = [];
        if (this.panelInstance != null) {
            const body = this.panelInstance.get('v.body')[0];
            validationErrors = body.validate();
            // If no validation errors then save the flow test
            if (!validationErrors || validationErrors.length === 0) {
                body.save();
            }
        }
    }

    handleFlowTestButtonTwoClick() {
        if (typeof this.flowTestButtons.flowTestButtonTwo.buttonCallback === 'function') {
            this.flowTestButtons.flowTestButtonTwo.buttonCallback();
        }
        this.closeModal(this.flowTestButtons.flowTestButtonTwo.closeCallback);
    }

    @api disableFlowTestButtonOne(disable: boolean) {
        this.flowTestButtonOneDisabled = disable;
    }
}
