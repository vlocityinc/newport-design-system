import { Element, api } from 'engine';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { INPUT_FIELD_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';

/*
 * Screen element property editor for input fields.
 */
export default class ScreenInputFieldPropertiesEditor extends Element {
    @api field;
    labels = LABELS;

    /* Figure out if the value really changed, and if it did refire the event including the old value */
    handlePropertyChanged = (event) => {
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        const currentValue = property && this.field[property] && this.field[property].value;
        if (currentValue !== newValue) {
            this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, this.field[property]));
        }
        event.stopPropagation();
    }

    get dataTypeList() {
        return Object.values(INPUT_FIELD_DATA_TYPE);
    }

    get dataTypePickerValue() {
        return  {
            dataType : getValueFromHydratedItem(this.field.type.name),
            scale : null,
            isCollection : false
        };
    }


    get isScaleEnabled() {
        const fieldType = getValueFromHydratedItem(this.field.type.name);
        return fieldType === 'Number' || fieldType === 'Currency';
    }

    /**
     * Indicates if the field's subtype property should be editable or not.
     */
    get isSubTypeDisabled() {
        // TODO - W-4947221 figure out if this is a field edit (then it should be true) or field create (then it should be false).
        return false;
    }
}