import automaticFieldLogicComboboxLabel from '@salesforce/label/FlowBuilderComponentVisibility.automaticFieldLogicComboboxLabel';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { getValueFromHydratedItem, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { ExtraTypeInfo, FieldDataType } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    hasScreenFieldVisibilityCondition,
    isFieldCompound,
    isFieldCompoundAddress,
    isFieldCompoundName,
    ScreenFieldName,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME,
    TEXT_AREA_MAX_LENGTH
} from 'builder_platform_interaction/screenEditorUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { api, LightningElement } from 'lwc';
const { format } = commonUtils;

export default class ScreenAutomaticFieldPropertiesEditor extends LightningElement {
    private static INTEGER_NUMBER_VALUES = { integer: 8, scale: 0 };

    private labels = LABELS;
    private _field;

    private getFieldTypeName = (): ScreenFieldName => {
        return this._field?.type.name;
    };

    objectManagerLink = '';
    visibilityLogicComboboxLabel: string = automaticFieldLogicComboboxLabel;
    expandedSectionNames?: string;

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

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_OBJECT_MANAGER_URLS, {
            disableErrorModal: true
        }).then((data) => this.setObjectManagerUrl(data));
    }

    get helptext(): string {
        return getValueFromHydratedItem(this.field.helpText);
    }

    get entityFieldDataType(): string {
        return this.field.entityFieldDataType;
    }

    get entityFieldExtraTypeInfo(): string {
        return this.field.entityFieldExtraTypeInfo;
    }

    get displayedFields(): Array<{ key: string; label: string; value: string }> {
        const displayedFieldsResult = [
            {
                key: 'autofield-object',
                label: this.labels.automaticFieldObject,
                value: this.object
            },
            {
                key: 'autofield-field-label',
                label: this.labels.automaticFieldFieldLabel,
                value: this.fieldLabel
            },
            {
                key: 'autofield-field-name',
                label: this.labels.automaticFieldFieldName,
                value: this.fieldName
            },
            {
                key: 'autofield-datatype',
                label: this.labels.automaticFieldDataType,
                value: this.dataType
            },
            {
                key: 'autofield-required',
                label: this.labels.automaticFieldIsRequired,
                value: this.isRequired
            }
        ];
        // Hide updateable/create info for compound fields
        if (!isFieldCompound(this.field)) {
            displayedFieldsResult.push(
                {
                    key: 'autofield-updateable',
                    label: this.labels.automaticFieldIsUpdateable,
                    value: this.isUpdateable
                },
                {
                    key: 'autofield-createable',
                    label: this.labels.automaticFieldIsCreateable,
                    value: this.isCreateable
                }
            );
        }
        return displayedFieldsResult;
    }

    private get fieldName(): string {
        const fieldNames = sanitizeGuid(this.field.objectFieldReference).fieldNames;
        return fieldNames === undefined ? '' : <string>fieldNames.pop();
    }

    private get fieldLabel(): string {
        return this.field.type.label;
    }

    private get dataType() {
        let dataType: string;
        switch (this.getFieldTypeName()) {
            case ScreenFieldName.DateTime: {
                dataType = this.labels.automaticFieldDataTypeDateTime;
                break;
            }
            case ScreenFieldName.Date: {
                dataType = this.labels.automaticFieldDataTypeDate;
                break;
            }
            case ScreenFieldName.TextBox: {
                if (this.entityFieldDataType === FieldDataType.Phone) {
                    dataType = this.labels.automaticFieldDataTypePhone;
                } else if (this.entityFieldDataType === FieldDataType.Email) {
                    dataType = this.labels.automaticFieldDataTypeEmail;
                } else if (isFieldCompoundName(this.field)) {
                    dataType = this.labels.automaticFieldDataTypePersonName;
                } else if (isFieldCompoundAddress(this.field)) {
                    dataType = this.labels.automaticFieldDataTypeAddress;
                } else {
                    dataType = format(this.labels.automaticFieldDataTypeText, this.field.length);
                }
                break;
            }
            case ScreenFieldName.LargeTextArea: {
                const length = this.field.length!;
                if (length <= TEXT_AREA_MAX_LENGTH) {
                    dataType = format(this.labels.automaticFieldDataTypeTextArea, length);
                } else {
                    dataType = format(this.labels.automaticFieldDataTypeLongTextArea, length);
                }
                break;
            }
            case ScreenFieldName.Number: {
                const { precision } = this.field!;
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
                    const { scale } = this.field;
                    dataType = format(this.labels.automaticFieldDataTypeNumber, precision - scale, scale);
                }
                break;
            }
            case ScreenFieldName.Checkbox: {
                dataType = this.labels.automaticFieldDataTypeCheckbox;
                break;
            }
            case ScreenFieldName.DropdownBox: {
                dataType = this.labels.automaticFieldDataTypePicklist;
                break;
            }
            default: {
                // Happens when user doesn't have access to referenced entity/field
                dataType = '';
            }
        }
        return dataType;
    }

    private get object(): string {
        const element = getElementByGuid(sanitizeGuid(this.field.objectFieldReference).guidOrLiteral);
        return element === undefined ? '' : <string>element.subtype;
    }

    private get isRequired(): string {
        const required = this.field!.isRequired;
        if (required === undefined) {
            // Happens when user doesn't have access to referenced entity/field
            return '';
        }
        return (required && this.getFieldTypeName() !== ScreenFieldName.Checkbox) ||
            this.entityFieldExtraTypeInfo === ExtraTypeInfo.SwitchablePersonName
            ? this.labels.automaticFieldIsRequiredTrue
            : this.labels.automaticFieldIsRequiredFalse;
    }

    private get isCreateable(): string {
        const createable = this.field.isCreateable;
        if (createable === undefined) {
            // Happens when user doesn't have access to referenced entity/field
            return '';
        }
        return createable ? this.labels.automaticFieldIsCreateableTrue : this.labels.automaticFieldIsCreateableFalse;
    }

    private get isUpdateable(): string {
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
