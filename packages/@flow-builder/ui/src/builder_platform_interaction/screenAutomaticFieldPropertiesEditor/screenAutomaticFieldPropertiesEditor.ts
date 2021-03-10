import { api, LightningElement } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { getValueFromHydratedItem, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME,
    ScreenFieldName
} from 'builder_platform_interaction/screenEditorUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import automaticFieldLogicComboboxLabel from '@salesforce/label/FlowBuilderComponentVisibility.automaticFieldLogicComboboxLabel';

export default class ScreenAutomaticFieldPropertiesEditor extends LightningElement {
    private static INTEGER_NUMBER_VALUES = { integer: 8, scale: 0 };
    private static TEXT_AREA_MAX_LENGTH = 255;

    private labels = LABELS;
    private _field;

    objectManagerLink = '';
    visibilityLogicComboboxLabel = automaticFieldLogicComboboxLabel;

    set field(value) {
        this._field = value;
        this.expandedSectionNames = hasScreenFieldVisibilityCondition(this._field!)
            ? SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
            : '';
    }

    @api
    get field() {
        return this._field;
    }

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
                key: 'autofield-field-name',
                label: this.labels.automaticFieldFieldName,
                value: this.fieldName
            },
            {
                key: 'autofield-field-label',
                label: this.labels.automaticFieldFieldLabel,
                value: this.fieldLabel
            },
            {
                key: 'autofield-datatype',
                label: this.labels.automaticFieldDataType,
                value: this.dataType
            },
            {
                key: 'autofield-object',
                label: this.labels.automaticFieldObject,
                value: this.object
            },
            {
                key: 'autofield-required',
                label: this.labels.automaticFieldIsRequired,
                value: this.isRequired
            },
            {
                key: 'autofield-createable',
                label: this.labels.automaticFieldIsCreateable,
                value: this.isCreateable
            },
            {
                key: 'autofield-updateable',
                label: this.labels.automaticFieldIsUpdateable,
                value: this.isUpdateable
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
                const length = this.field.length!;
                if (length <= ScreenAutomaticFieldPropertiesEditor.TEXT_AREA_MAX_LENGTH) {
                    dataType = format(this.labels.automaticFieldDataTypeTextArea, length);
                } else {
                    dataType = format(this.labels.automaticFieldDataTypeLongTextArea, length);
                }
                break;
            }
            case ScreenFieldName.Number: {
                const precision = this.field.precision!;
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
                // Happens when user doesn't have access to referenced entity/field
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
        const required = this.field!.isRequired;
        if (required === undefined) {
            // Happens when user doesn't have access to referenced entity/field
            return '';
        }
        return required ? this.labels.automaticFieldIsRequiredTrue : this.labels.automaticFieldIsRequiredFalse;
    }

    private get isCreateable() {
        const createable = this.field.isCreateable;
        if (createable === undefined) {
            // Happens when user doesn't have access to referenced entity/field
            return '';
        }
        return createable ? this.labels.automaticFieldIsCreateableTrue : this.labels.automaticFieldIsCreateableFalse;
    }

    private get isUpdateable() {
        const updateable = this.field.isUpdateable;
        if (updateable === undefined) {
            // Happens when user doesn't have access to referenced entity/field
            return '';
        }
        return updateable ? this.labels.automaticFieldIsUpdateableTrue : this.labels.automaticFieldIsUpdateableFalse;
    }

    private setObjectManagerUrl(data) {
        const entity = getEntity(this.object);
        if (entity === undefined) {
            // Happens when user doesn't have access to referenced entity
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
