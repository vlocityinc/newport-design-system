import { hidePopover } from 'builder_platform_interaction/builderUtils';
import { dehydrate } from 'builder_platform_interaction/dataMutationLib';
import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
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
    @api flowTestListViewCallback;

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
                const dehydratedObj = dehydrate(deepCopy(body.get('v.flowTestObject')));
                const flowTest = translateUIModelToFlowTest(dehydratedObj);
                this.saveTest(flowTest, this.testMode, body);
            }
        }
    }

    saveTest = async (flowTest, saveType, body) => {
        body.set('v.showWaitingSpinner', true);
        try {
            const data = await fetchPromise(SERVER_ACTION_TYPE.SAVE_FLOW_TEST, {
                flowTest,
                saveType
            });
            this.saveFlowTestCallback({ data });
        } finally {
            body.set('v.showWaitingSpinner', false);
        }
    };

    saveFlowTestCallback = ({ data }) => {
        if (data.isSuccess) {
            this.flowTestListViewCallback();
            hidePopover();
        } else if (!data.isSuccess) {
            // ToDo: Add popover to show server side validation failures.
            // Dependent on work in UI Tier API to return those failures.
        }
    };

    handleFlowTestButtonTwoClick() {
        if (typeof this.flowTestButtons.flowTestButtonTwo.buttonCallback === 'function') {
            this.flowTestButtons.flowTestButtonTwo.buttonCallback();
        }

        this.closeModal(this.flowTestButtons.flowTestButtonTwo.closeCallback);
    }
}
