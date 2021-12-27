// @ts-nocheck
import areYouSure from '@salesforce/label/FlowBuilderAlertModal.areYouSure';
import clearVariableConfirmation from '@salesforce/label/FlowBuilderAlertModal.clearVariableConfirmation';
import confirm from '@salesforce/label/FlowBuilderAlertModal.confirm';
import cancelButton from '@salesforce/label/FlowBuilderCommonPropertyEditor.cancelButton';
import automatic from '@salesforce/label/FlowBuilderRecordEditor.automatic';
import manual from '@salesforce/label/FlowBuilderRecordEditor.manual';
import manuallySelectFields from '@salesforce/label/FlowBuilderRecordEditor.manuallySelectFields';
/* Labels */
import variableAndFieldMappingLabel from '@salesforce/label/FlowBuilderRecordEditor.variableAndFieldMappingLabel';
import { VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';

export const LABELS = {
    variableAndFieldMappingLabel,
    automatic,
    manuallySelectFields,
    manual,
    clearVariableConfirmation,
    confirm,
    areYouSure,
    cancelButton
};

export const VARIABLE_AND_FIELD_MAPPING_OPTIONS = [
    {
        label: LABELS.automatic,
        value: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
    },
    {
        label: LABELS.manuallySelectFields,
        value: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
    },
    {
        label: LABELS.manual,
        value: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
    }
];
