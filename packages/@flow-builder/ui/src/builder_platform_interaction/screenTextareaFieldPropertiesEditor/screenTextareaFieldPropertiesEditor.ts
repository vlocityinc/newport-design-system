// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import {
    LIGHTNING_INPUT_VARIANTS,
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';

/*
 * Screen element property editor for the text area field.
 */
export default class ScreenTextareaFieldPropertiesEditor extends LightningElement {
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
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };

    /* Handle change of Default Value resource picker */
    handleDefaultValueChanged(event) {
        const propChangedEvent = new PropertyChangedEvent(
            'defaultValue',
            event.detail.value,
            event.detail.error,
            null,
            this.field.defaultValue,
            undefined,
            event.detail.dataType
        );
        // This lets the next event handler know that the default value should be treated like a string
        // if it's not a reference and it's not null.
        propChangedEvent.detail.defaultValueDataType = 'String';
        this.dispatchEvent(propChangedEvent);
        event.stopPropagation();
    }

    get resourceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.fieldDefaultValue, // Label
            LABELS.resourcePickerPlaceholder, // Placeholder
            null, // errorMessage
            true, // literalsAllowed
            false, // required
            false, // disabled
            this.field.dataType, // type
            false, // enableFieldDrilldown
            LIGHTNING_INPUT_VARIANTS.STANDARD
        ); // variant
    }
}
