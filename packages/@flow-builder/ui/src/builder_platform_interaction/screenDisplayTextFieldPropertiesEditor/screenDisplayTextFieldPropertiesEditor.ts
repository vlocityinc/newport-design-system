// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';

/*
 * Screen element property editor
 */
export default class ScreenDisplayTextFieldPropertiesEditor extends LightningElement {
    @api field;
    labels = LABELS;

    @api
    editorParams;

    get expandedSectionNames() {
        if (hasScreenFieldVisibilityCondition(this)) {
            return [SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
        return [];
    }

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        this.dispatchEvent(addCurrentValueToEvent(event, this.field));
    };
}
