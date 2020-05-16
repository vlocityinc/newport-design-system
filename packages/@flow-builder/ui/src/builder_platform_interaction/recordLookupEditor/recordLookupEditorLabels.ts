// @ts-nocheck
import {
    NUMBER_RECORDS_TO_STORE,
    WAY_TO_STORE_FIELDS,
    VARIABLE_AND_FIELD_MAPPING_VALUES
} from 'builder_platform_interaction/recordEditorLib';
/* Labels */
import getRecordsOfObjectType from '@salesforce/label/FlowBuilderRecordEditor.getRecordsOfObjectType';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import recordLookupTitle from '@salesforce/label/FlowBuilderRecordEditor.recordLookupTitle';
import filterRhsLabel from '@salesforce/label/FlowBuilderRecordEditor.variable';
import lookupAssignmentTitleFormat from '@salesforce/label/FlowBuilderRecordEditor.lookupAssignmentTitleFormat';
import firstRecordLabel from '@salesforce/label/FlowBuilderRecordEditor.firstRecord';
import allRecordsLabel from '@salesforce/label/FlowBuilderRecordEditor.allRecords';
import togetherInsObjectVariable from '@salesforce/label/FlowBuilderRecordEditor.togetherInsObjectVariable';
import separateVariable from '@salesforce/label/FlowBuilderRecordEditor.separateVariable';
import storeFieldsSelectionLabel from '@salesforce/label/FlowBuilderRecordEditor.storeFieldsSelectionLabel';
import wayToStoreFieldsLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionWhereToStoreRecordsLabel';
import assignNullValuesIfNoRecordsFoundLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionAssignNullIfNoRecordFoundLabel';
import numberRecordsToStoreLabel from '@salesforce/label/FlowBuilderRecordEditor.selectionHowManyRecordsToStoreLabel';
import variableAndFieldMappingLabel from '@salesforce/label/FlowBuilderRecordEditor.variableAndFieldMappingLabel';
import automatic from '@salesforce/label/FlowBuilderRecordEditor.automatic';
import manuallySelectFields from '@salesforce/label/FlowBuilderRecordEditor.manuallySelectFields';
import manual from '@salesforce/label/FlowBuilderRecordEditor.manual';

export const LABELS = {
    getRecordsOfObjectType,
    object,
    objectPlaceholder,
    recordLookupTitle,
    filterRhsLabel,
    lookupAssignmentTitleFormat,
    firstRecordLabel,
    allRecordsLabel,
    togetherInsObjectVariable,
    separateVariable,
    storeFieldsSelectionLabel,
    wayToStoreFieldsLabel,
    assignNullValuesIfNoRecordsFoundLabel,
    numberRecordsToStoreLabel,
    variableAndFieldMappingLabel,
    automatic,
    manuallySelectFields,
    manual
};

export const NUMBER_RECORDS_OPTIONS = [
    {
        label: LABELS.firstRecordLabel,
        value: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
    },
    {
        label: LABELS.allRecordsLabel,
        value: NUMBER_RECORDS_TO_STORE.ALL_RECORDS
    }
];

export const WAY_TO_STORE_FIELDS_OPTIONS = [
    {
        label: LABELS.togetherInsObjectVariable,
        value: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
    },
    {
        label: LABELS.separateVariable,
        value: WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
    }
];

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
