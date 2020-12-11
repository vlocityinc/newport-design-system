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
    private _field;
    expandedSectionNames = [];
    labels = LABELS;

    @api
    editorParams;

    set field(value) {
        this._field = value;
        if (hasScreenFieldVisibilityCondition(this._field) && this.expandedSectionNames.length === 0) {
            this.expandedSectionNames = [SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
    }

    @api
    get field() {
        return this._field;
    }

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        this.dispatchEvent(addCurrentValueToEvent(event, this.field));
    };
}
