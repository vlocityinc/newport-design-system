import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { isConditionalFieldVisibilitySupported } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';

export default class ScreenComponentVisibilitySection extends LightningElement {
    @api
    field;

    labels = LABELS;

    get conditionalFieldVisibilityAllowed() {
        return isConditionalFieldVisibilitySupported(getProcessType());
    }

    connectedCallback() {}
}
