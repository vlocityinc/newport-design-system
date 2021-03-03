import { LightningElement, track, api } from 'lwc';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './screenEditorAutomaticFieldPaletteLabels';
import { containsMatcher } from 'builder_platform_interaction/filterLib';
import { ExtraTypeInfo, FieldDataType, getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { createAddAutomaticScreenFieldEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import {
    getFieldByGuid,
    getScreenFieldName,
    SCREEN_EDITOR_GUIDS,
    setDragFieldValue
} from 'builder_platform_interaction/screenEditorUtils';
import Combobox from 'builder_platform_interaction/combobox';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { CrudFilter } from 'builder_platform_interaction/selectors';

const SUPPORTED_FIELD_DATA_TYPES = [
    FieldDataType.String,
    FieldDataType.Int,
    FieldDataType.Double,
    FieldDataType.DateTime,
    FieldDataType.Date,
    FieldDataType.Boolean
];

const createEditFilter = (field: FieldDefinition): boolean => field.creatable || field.editable;
const dataTypeRelatedFilter = (field: FieldDefinition): boolean =>
    SUPPORTED_FIELD_DATA_TYPES.includes(field.fieldDataType as FieldDataType) ||
    field.extraTypeInfo === ExtraTypeInfo.PlainTextarea;
const noRelationshipFilter = (field: FieldDefinition): boolean => field.relationshipName === null;
// check on extraTypeInfo because in some cases (e.g. Account Name), field.compoundFieldName is set to e.g. Name and those are field that we can and want to support
const noCompoundFieldFilter = (field: FieldDefinition): boolean =>
    field.compoundFieldName === null ||
    (field.extraTypeInfo === ExtraTypeInfo.SwitchablePersonName &&
        field.compoundFieldName === 'Name' &&
        field.apiName === 'Name');
const supportedAutomaticFieldFilter = (field: FieldDefinition): boolean =>
    createEditFilter(field) &&
    dataTypeRelatedFilter(field) &&
    noRelationshipFilter(field) &&
    noCompoundFieldFilter(field);

export default class ScreenEditorAutomaticFieldPalette extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-screen-editor-automatic-field-palette';
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
    showNoItemsIllustration = true;
    sobjectPickerErrorMessage?: String | null;
    entityName = '';
    showErrorMessageRelatedToFieldFetching = false;
    showNoFieldIllustration = false;
    showSpinner = false;
    labels = LABELS;
    crudFilter: CrudFilter = ({ createable, updateable }) => createable || updateable;

    private isRecordVariableSetViaApi = false;
    private hasNewRecordVariable = false;

    @api
    searchPattern?: string | null;

    @track
    state: { recordVariable: string; supportedEntityFields: FieldDefinition[] } = {
        recordVariable: '',
        supportedEntityFields: []
    };

    get sObjectPickerRowIndex(): String {
        return generateGuid();
    }

    get searchInputPlaceholder(): String {
        return format(LABELS.filterFieldsPlaceHolderLabel, this.entityName);
    }

    @api
    paletteData: ScreenPaletteSection[] = [];

    @api
    get showNoItemIllustrationContainer() {
        return this.showNoItemsIllustration;
    }

    @api
    get showNoFieldIllustrationContainer() {
        return this.showNoFieldIllustration;
    }

    get showLoadingFieldsSpinner() {
        return this.showSpinner;
    }

    @api
    get recordVariable() {
        return this.state.recordVariable;
    }

    @api
    setRecordVariableAndResetPill(value: string) {
        this.isRecordVariableSetViaApi = true;
        this.setRecordVariableAndErrorMessage(value, null);
    }

    /**
     * Handler for "SObjectReference" element property changes
     * @param {object} event
     */
    handleSObjectReferenceChangedEvent(event: SObjectReferenceChangedEvent) {
        event.stopPropagation();
        this.setRecordVariableAndErrorMessage(event.detail.value, event.detail.error);
    }

    private setRecordVariableAndErrorMessage(recordVariable, errorMessage: string | null) {
        this.sobjectPickerErrorMessage = errorMessage;
        if (this.state.recordVariable !== recordVariable) {
            this.state.recordVariable = recordVariable;
            this.hasNewRecordVariable = true;
            this.searchPattern = null;
            if (
                this.state.recordVariable != null &&
                this.state.recordVariable !== '' &&
                this.sobjectPickerErrorMessage == null
            ) {
                this.updateFields();
                this.showNoItemsIllustration = false;
            } else {
                this.showNoItemsIllustration = true;
            }
        }
    }

    /**
     * Get the fields of the selected entity and set the state accordingly
     */
    updateFields() {
        if (this.state.recordVariable) {
            const resource = getElementByGuid(this.state.recordVariable)!;
            this.entityName = resource.subtype!;
            this.showSpinner = true;
            fetchFieldsForEntity(this.entityName)
                .then((fields) => {
                    this.showErrorMessageRelatedToFieldFetching = false;
                    this.state.supportedEntityFields = this.filterSupportedFields(fields);
                    this.showNoFieldIllustration = this.state.supportedEntityFields.length === 0;
                    this.buildModel();
                })
                .catch(() => {
                    this.showErrorMessageRelatedToFieldFetching = true;
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
    }

    filterSupportedFields(entityFields) {
        return (Object.values(entityFields) as FieldDefinition[]).filter((field) =>
            supportedAutomaticFieldFilter(field)
        );
    }

    /**
     * Populate section/items data for inner palette component
     */
    buildModel(fieldNamePattern?: String | null) {
        const requiredSection: ScreenPaletteSection = {
            guid: generateGuid(),
            label: LABELS.paletteSectionRequiredFieldsLabel,
            _children: []
        };
        const optionalSection: ScreenPaletteSection = {
            guid: generateGuid(),
            label: LABELS.paletteSectionOptionalFieldsLabel,
            _children: []
        };
        const fieldsToAddToPalette =
            fieldNamePattern && fieldNamePattern.trim().length > 0
                ? this.state.supportedEntityFields.filter((field) =>
                      containsMatcher(field, 'label', fieldNamePattern.trim())
                  )
                : this.state.supportedEntityFields;

        const currentRecordVariable = this.recordVariable;
        fieldsToAddToPalette.forEach((field) => {
            const item: ScreenAutomaticFieldPaletteItem = {
                apiName: field.apiName,
                description: field.label,
                guid: generateGuid(),
                iconName: getDataTypeIcons(field.dataType, 'utility'),
                label: field.label,
                fieldTypeName: getScreenFieldName(field)!,
                objectFieldReference: `${currentRecordVariable}.${field.apiName}`
            };
            if (field.required && field.fieldDataType !== FieldDataType.Boolean) {
                requiredSection._children.push(item);
            } else {
                optionalSection._children.push(item);
            }
        });
        this.buildPaletteDataWithSections([requiredSection, optionalSection]);
    }

    /**
     * Resets palette data and adds given sections if not empty
     * @param {ScreenPaletteSection[]}  paletteSections to add to palette data
     */
    buildPaletteDataWithSections(paletteSections: ScreenPaletteSection[]) {
        this.paletteData = [];
        paletteSections.forEach((paletteSection) => {
            if (paletteSection._children.length > 0) {
                this.paletteData.push(paletteSection);
            }
        });
    }

    /**
     * Rebuild palette data when a new search term is given as input
     */
    handleSearch(event) {
        const filterValue = event.target.value;
        this.searchPattern = filterValue ? filterValue : null;
        this.buildModel(this.searchPattern);
    }

    /**
     * Show no item illustration when SObject picker is cleared with pill (X) click
     */
    handlePillRemoved(event) {
        event.stopPropagation();
        this.state.recordVariable = '';
        this.showNoItemsIllustration = true;
    }

    handlePaletteItemClickedEvent = (event) => {
        // Clicking on an element from the palette should add the corresponding field
        // type to the canvas.
        const fieldGuid = event.detail.guid;
        const field = getFieldByGuid(this.paletteData, fieldGuid) as ScreenAutomaticFieldPaletteItem;
        const addFieldEvent = createAddAutomaticScreenFieldEvent(field.fieldTypeName, field.objectFieldReference);
        this.dispatchEvent(addFieldEvent);
        event.stopPropagation();
    };

    handleDragStart(event) {
        // Dragging an element could mean user wants to add the corresponding
        // field type to the canvas. Figure out which field type user wants
        // to add.
        const { key: fieldGuid } = JSON.parse(event.dataTransfer.getData('text'));
        const field = getFieldByGuid(this.paletteData, fieldGuid) as ScreenAutomaticFieldPaletteItem;
        const fieldTypeName = field.fieldTypeName;
        event.dataTransfer.setData(
            'text',
            JSON.stringify({ fieldTypeName, objectFieldReference: field.objectFieldReference })
        );
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('dragStartLocation', SCREEN_EDITOR_GUIDS.PALETTE); // Needed for safari browser. effectAllowed always resolves to 'all' and it is not supported by safari.
        setDragFieldValue(fieldTypeName);
    }

    renderedCallback() {
        if (this.isRecordVariableSetViaApi && this.hasNewRecordVariable) {
            this.isRecordVariableSetViaApi = false;
            this.hasNewRecordVariable = false;
            this.resetPill();
        }
    }

    /**
     * @returns the Object selection combobox
     * @private
     */
    private getObjectCombobox(): Combobox | null {
        return this.template
            .querySelector(SObjectOrSObjectCollectionPicker.SELECTOR)
            ?.shadowRoot.querySelector(FerovResourcePicker.SELECTOR)
            ?.shadowRoot.querySelector(BaseResourcePicker.SELECTOR)
            ?.shadowRoot.querySelector(Combobox.SELECTOR);
    }

    /**
     * As we can change the current object via the canvas selection,
     * this function allows to update accordingly the pill
     * @private
     */
    private resetPill() {
        const combobox = this.getObjectCombobox();
        if (combobox) {
            combobox.errorMessage = null;
            if (combobox.hasPill) {
                combobox.resetPill();
            }
        }
    }
}
