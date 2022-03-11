import { hidePopover } from 'builder_platform_interaction/builderUtils';
import { dehydrate } from 'builder_platform_interaction/dataMutationLib';
import { fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { BUILDER_MODE } from 'builder_platform_interaction/systemLib';
import { translateUIModelToFlowTest } from 'builder_platform_interaction/translatorLib';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestFooterLabels';

const { checkCloseCallback } = commonUtils;
const { format } = commonUtils;

export default class FlowTestFooter extends LightningElement {
    @api flowTestButtons;
    @api closeModalCallback;
    @api panelInstance;
    @api testMode;
    @api flowTestListViewCallback;
    @api builderMode;

    labels = LABELS;
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
                const dehydratedObj = this.dehydrateFlowTestObject(deepCopy(body.get('v.flowTestObject')));
                const flowTest = translateUIModelToFlowTest(dehydratedObj);
                this.saveTest(flowTest, this.testMode, body);
            }
        }
    }

    dehydrateFlowTestObject(data) {
        const dehydratedObj = dehydrate(data);
        dehydratedObj.testInitialRecordData = dehydrate(dehydratedObj.testInitialRecordData);
        dehydratedObj.testUpdatedRecordData = dehydrate(dehydratedObj.testUpdatedRecordData);
        return dehydratedObj;
    }

    saveTest = async (flowTest, saveType, body) => {
        body.set('v.showWaitingSpinner', true);
        try {
            const data = await fetchPromise(SERVER_ACTION_TYPE.SAVE_FLOW_TEST, {
                flowTest,
                saveType
            });
            this.saveFlowTestCallback({ data }, flowTest);
        } finally {
            body.set('v.showWaitingSpinner', false);
        }
    };

    saveFlowTestCallback = ({ data }, flowTest) => {
        if (data.isSuccess) {
            if (this.builderMode === BUILDER_MODE.DEBUG_MODE) {
                hidePopover();
                this.showToast(format(LABELS.flowTestFromDebuggerSavedSuccess, flowTest.metadata.label), 'success');
            } else {
                this.flowTestListViewCallback();
                hidePopover();
            }
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

    showToast = (message: string, variant: string, mode?: string) => {
        const toastEvent = new ShowToastEvent({
            message,
            variant,
            mode
        });
        this.dispatchEvent(toastEvent);
    };
    @api disableFlowTestButtonOne(disable: boolean) {
        this.flowTestButtonOneDisabled = disable;
    }
}
