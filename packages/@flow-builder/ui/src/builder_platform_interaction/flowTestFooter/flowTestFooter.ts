import { dehydrate } from 'builder_platform_interaction/dataMutationLib';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { translateUIModelToFlowTest } from 'builder_platform_interaction/translatorLib';
import { api, LightningElement } from 'lwc';
const { checkCloseCallback } = commonUtils;

export default class FlowTestFooter extends LightningElement {
    @api flowTestButtons;
    @api closeModalCallback;
    @api panelInstance;
    @api testMode;

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
                this.flowTestButtons.flowTestButtonOne.buttonCallback();
                const dehydratedObj = dehydrate(deepCopy(body.get('v.flowTestObject')));
                const flowTest = translateUIModelToFlowTest(dehydratedObj);
                const params = {
                    flowTest,
                    saveType: this.testMode
                };
                fetch(SERVER_ACTION_TYPE.SAVE_FLOW_TEST, this.saveFlowTestCallback, params);
            } else {
                // ToDo: separate task to show validation errors on vertical nav
            }
        }
    }

    saveFlowTestCallback = () => {
        // ToDo: implement save flow test callback
    };

    handleFlowTestButtonTwoClick() {
        if (typeof this.flowTestButtons.flowTestButtonTwo.buttonCallback === 'function') {
            this.flowTestButtons.flowTestButtonTwo.buttonCallback();
        }

        this.closeModal(this.flowTestButtons.flowTestButtonTwo.closeCallback);
    }
}
