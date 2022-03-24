import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestDetailsLabels';

export const MAX_DEV_NAME_LENGTH = 128;

export default class FlowTestDetails extends LightningElement {
    labels = LABELS;
    @api triggerSaveType;
    @api label;
    @api devName;
    @api description;
    @api guid;
    @api runPathValue;
    @api testTriggerType;
    @api mode;
    @api devNamePrefix;

    devNameCharLimit = MAX_DEV_NAME_LENGTH;

    get isEditTestMode() {
        return this.mode === FlowTestMode.Edit;
    }

    // Allowed dropdown options for test run (will be expanded to scheduled paths later)
    get runPathOptions() {
        return [{ label: LABELS.runImmediatelyPath, value: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH }];
    }

    // Allowed radio button options
    get saveTriggerOptions() {
        return [
            { label: LABELS.flowTestCreateLabel, value: FLOW_TRIGGER_SAVE_TYPE.CREATE },
            { label: LABELS.flowTestUpdateLabel, value: FLOW_TRIGGER_SAVE_TYPE.UPDATE }
        ];
    }

    get isCreateOrUpdateTriggerValue() {
        return (
            this.triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.CREATE ||
            this.triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.UPDATE
        );
    }

    get isCreateAndUpdateTriggerValue() {
        return this.triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE;
    }

    handleTrigTypeChangeWithEvent(event) {
        event.stopPropagation();
        const triggerChangedEvent = new PropertyChangedEvent('testTriggerType', event.detail.value, null);
        this.dispatchEvent(triggerChangedEvent);
    }
}
