import { api, LightningElement } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { getValueFromHydratedItem, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { getEntity } from 'builder_platform_interaction/sobjectLib';

export default class ScreenAutomaticFieldPropertiesEditor extends LightningElement {
    private static INTEGER_NUMBER_VALUES = { integer: 8, scale: 0 };
    private static TEXT_AREA_MAX_LENGTH = 255;

    labels = LABELS;

    @api
    field;

    objectManagerLink: String = '';

    constructor() {
        super();
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_OBJECT_MANAGER_URLS, {
            disableErrorModal: true
        }).then((data) => this.setObjectManagerUrl(data));
    }

    get helptext() {
        return getValueFromHydratedItem(this.field.helpText);
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
        const fieldNames = sanitizeGuid(this.field.objectFieldReference).fieldNames;
        return fieldNames === undefined ? '' : fieldNames.pop();
    }

    private get fieldLabel() {
        return this.field.type.label;
    }

    private get dataType() {
        let dataType: String;
        switch (this.field.type.name) {
            case ScreenFieldName.DateTime: {
                dataType = this.labels.automaticFieldDataTypeDateTime;
                break;
            }
            case ScreenFieldName.Date: {
                dataType = this.labels.automaticFieldDataTypeDate;
                break;
            }
            case ScreenFieldName.TextBox: {
                const length = this.field.length;
                dataType = format(this.labels.automaticFieldDataTypeText, length);
                break;
            }
            case ScreenFieldName.LargeTextArea: {
                const length = this.field.length;
                if (length <= ScreenAutomaticFieldPropertiesEditor.TEXT_AREA_MAX_LENGTH) {
                    dataType = format(this.labels.automaticFieldDataTypeTextArea, length);
                } else {
                    dataType = format(this.labels.automaticFieldDataTypeLongTextArea, length);
                }
                break;
            }
            case ScreenFieldName.Number: {
                const precision = this.field.precision;
                if (precision === 0) {
                    // Specific case where the number is an INTEGER
                    // This type is available only on OOTB object/field
                    // ex: Account.NumberOfEmployees
                    dataType = format(
                        this.labels.automaticFieldDataTypeNumber,
                        ScreenAutomaticFieldPropertiesEditor.INTEGER_NUMBER_VALUES.integer,
                        ScreenAutomaticFieldPropertiesEditor.INTEGER_NUMBER_VALUES.scale
                    );
                } else {
                    const scale = this.field.scale;
                    const integer = precision - scale;
                    dataType = format(this.labels.automaticFieldDataTypeNumber, integer, scale);
                }
                break;
            }
            case ScreenFieldName.Checkbox: {
                dataType = this.labels.automaticFieldDataTypeCheckbox;
                break;
            }
            default: {
                dataType = '';
                break;
            }
        }
        return dataType;
    }

    private get object() {
        const element = getElementByGuid(sanitizeGuid(this.field.objectFieldReference).guidOrLiteral);
        return element === undefined ? '' : element.subtype;
    }

    private get isRequired() {
        return this.field.isRequired
            ? this.labels.automaticFieldIsRequiredTrue
            : this.labels.automaticFieldIsRequiredFalse;
    }

    private setObjectManagerUrl(data) {
        const entity = getEntity(this.object);
        if (entity === undefined) {
            return;
        }
        if (getPreferredExperience() === CLASSIC_EXPERIENCE) {
            if (entity.custom) {
                this.objectManagerLink = data.classicCustomObject;
            } else {
                this.objectManagerLink = format(data.classicStandardObject, entity.apiName);
            }
        } else {
            this.objectManagerLink = format(data.lightningObjectManager, entity.apiName);
        }
    }
}
