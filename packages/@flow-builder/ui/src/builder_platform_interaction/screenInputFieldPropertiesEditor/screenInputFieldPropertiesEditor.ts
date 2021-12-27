// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';
import { api, LightningElement } from 'lwc';

const FRP_CONFIG = {
    allowLiterals: true,
    collection: false,
    elementType: ELEMENT_TYPE.SCREEN
};

/*
 * Screen element property editor for input fields.
 */
export default class ScreenInputFieldPropertiesEditor extends LightningElement {
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

    get defaultValueResourcePickerConfig() {
        return FRP_CONFIG;
    }

    get isCheckbox() {
        return this.field.dataType === 'Boolean';
    }

    get isScaleEnabled() {
        return this.field.dataType === 'Number' || this.field.dataType === 'Currency';
    }

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
