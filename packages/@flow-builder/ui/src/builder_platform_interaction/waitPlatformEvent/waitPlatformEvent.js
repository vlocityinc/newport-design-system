import { LightningElement } from 'lwc';
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { LABELS } from "./waitPlatformEventLabels";

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    outputParameterItem = {
        label: LABELS.platformEventOutputLabel,
        iconName: 'utility:events',
    };

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        // TODO: W-5395889 only available platform events should be returned here.
        return BaseResourcePicker.getComboboxConfig(
            LABELS.eventLabel,
            LABELS.selectEventLabel,
            null,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    handleResourceChanged(event) {
        event.stopPropagation();
        // do nothing for now
    }
}