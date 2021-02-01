import { api, LightningElement } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';

export default class ScreenAutomaticFieldPropertiesEditor extends LightningElement {
    labels = LABELS;

    @api
    field!: UI.ScreenField;

    get link() {
        return '/lightning/setup/ObjectManager/home';
    }

    get displayedFields() {
        return [
            {
                key: 'fieldName',
                label: this.labels.automaticFieldFieldName,
                value: this.fieldName
            },
            {
                key: 'fieldLabel',
                label: this.labels.automaticFieldFieldLabel,
                value: this.fieldLabel
            },
            {
                key: 'dataType',
                label: this.labels.automaticFieldDataType,
                value: this.dataType
            },
            {
                key: 'object',
                label: this.labels.automaticFieldObject,
                value: this.object
            },
            {
                key: 'isRequired',
                label: this.labels.automaticFieldIsRequired,
                value: this.isRequired
            }
        ];
    }

    private get fieldName() {
        const fieldNames = sanitizeGuid(this.field.objectFieldReference!).fieldNames;
        return fieldNames === undefined ? '' : fieldNames.pop();
    }

    private get fieldLabel() {
        return this.field.type.label;
    }

    private get dataType() {
        return this.field.type.type;
    }

    private get object() {
        const element = getElementByGuid(sanitizeGuid(this.field.objectFieldReference!).guidOrLiteral);
        return element === undefined ? '' : element.subtype;
    }

    private get isRequired() {
        return this.field.isRequired
            ? this.labels.automaticFieldIsRequiredTrue
            : this.labels.automaticFieldIsRequiredFalse;
    }
}
