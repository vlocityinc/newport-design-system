// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';

const FRP_CONFIG = {
    allowLiterals: true,
    collection: false,
    elementType: ELEMENT_TYPE.SCREEN
};

/*
 * Screen element property editor for input fields.
 */
export default class ScreenInputFieldPropertiesEditor extends LightningElement {
    @api field;
    labels = LABELS;

    @api
    editorParams;

    get defaultValueResourcePickerConfig() {
        return FRP_CONFIG;
    }

    get isCheckbox() {
        return this.field.dataType === 'Boolean';
    }

    get isScaleEnabled() {
        return this.field.dataType === 'Number' || this.field.dataType === 'Currency';
    }

    get expandedSectionNames() {
        if (hasScreenFieldVisibilityCondition(this.field)) {
            return [SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
        return [];
    }

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
