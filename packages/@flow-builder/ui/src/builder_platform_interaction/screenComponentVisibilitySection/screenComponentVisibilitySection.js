import { LightningElement, api } from 'lwc';

import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getSupportedFeatures } from 'builder_platform_interaction/systemLib';
import { FLOW_SUPPORTED_FEATURES } from 'builder_platform_interaction/flowMetadata';

export default class ScreenComponentVisibilitySection extends LightningElement {
    @api
    field;

    labels = LABELS;

    get conditionalFieldVisibilityAllowed() {
        return getSupportedFeatures().has(
            FLOW_SUPPORTED_FEATURES.CONDITIONAL_FIELD_VISIBILITY
        );
    }

    connectedCallback() {}
}
