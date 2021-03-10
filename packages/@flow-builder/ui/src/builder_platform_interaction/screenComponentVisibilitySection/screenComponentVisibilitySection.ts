import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { isConditionalFieldVisibilitySupported } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME } from 'builder_platform_interaction/screenEditorUtils';

export default class ScreenComponentVisibilitySection extends LightningElement {
    @api
    field;

    @api
    accordionSectionLabel = LABELS.componentVisibilitySectionTitle;

    @api
    visibilityLogicComboboxLabel;

    accordionSectionName = SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME;

    get conditionalFieldVisibilityAllowed() {
        return isConditionalFieldVisibilitySupported(getProcessType());
    }
}
