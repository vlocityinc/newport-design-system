import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import Combobox from 'builder_platform_interaction/combobox';
import { createAddAutomaticScreenFieldEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';
import { containsMatcher } from 'builder_platform_interaction/filterLib';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import {
    getFieldByGuid,
    getScreenFieldName,
    SCREEN_EDITOR_GUIDS,
    setDragFieldValue
} from 'builder_platform_interaction/screenEditorUtils';
import { CrudFilter } from 'builder_platform_interaction/selectors';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { fetchFieldsForEntity, getEntity } from 'builder_platform_interaction/sobjectLib';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './screenEditorAutomaticFieldPaletteLabels';
import { getAutomaticFieldIcon, isAutomaticFieldRequired } from './screenEditorAutomaticFieldPaletteUtils';
const { format } = commonUtils;

export default class ScreenEditorAutomaticFieldPalette extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-screen-editor-automatic-field-palette';
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
    showNoItemsIllustration = true;
    sobjectPickerErrorMessage?: string | null;

    showErrorMessageRelatedToFieldFetching = false;
    showNoFieldIllustration = false;
    showSpinner = false;
    labels = LABELS;
    knowledgeArticleLink = '';
    crudFilter: CrudFilter = ({ createable, updateable }) => createable || updateable;

    _searchPattern?: string | null;
    isRecordVariableSetViaApi?: boolean;

    @api
    get searchPattern() {
        return this._searchPattern;
    }

    set searchPattern(newVal) {
        this._searchPattern = newVal;
    }

    @track entityLabel?: string;

    @track
    state: { recordVariable: string; supportedEntityFields: FieldDefinition[] } = {
        recordVariable: '',
        supportedEntityFields: []
    };

    get sObjectPickerRowIndex(): String {
        return generateGuid();
    }

    get searchInputPlaceholder(): String {
        return format(LABELS.filterFieldsPlaceHolderLabel, this.entityLabel);
    }

    _paletteData: ScreenPaletteSection[] = [];

    @api
    get paletteData() {
        return this._paletteData;
    }

    set paletteData(newVal) {
        this._paletteData = newVal;
    }

    @api
    get showNoItemIllustrationContainer() {
        return this.showNoItemsIllustration;
    }

    get showLoadingFieldsSpinner() {
        return this.showSpinner;
    }

    @api
    get recordVariable() {
        return this.state.recordVariable;
    }

    @api
    get knowledgeArticleUrl() {
        return this.knowledgeArticleLink;
    }

    @api
    setRecordVariableAndResetPill(value: string) {
        this.isRecordVariableSetViaApi = true;
        this.setRecordVariableAndErrorMessage(value, null);
        this.resetPill();
    }

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_BETA_URLS).then(({ automaticFieldKnowledgeArticle }) => {
            this.knowledgeArticleLink = automaticFieldKnowledgeArticle;
        });
    }

    /**
     * Handler for "SObjectReference" element property changes
     *
     * @param event SObjectReferenceChangedEvent custom event
     */
    handleSObjectReferenceChangedEvent(event: SObjectReferenceChangedEvent) {
        event.stopPropagation();
        this.setRecordVariableAndErrorMessage(event.detail.value, event.detail.error);
    }

    private setRecordVariableAndErrorMessage(recordVariable, errorMessage: string | null) {
        if (this.sobjectPickerErrorMessage === errorMessage && this.state.recordVariable === recordVariable) {
            return;
        }
        this.sobjectPickerErrorMessage = errorMessage;
        this.state.recordVariable = recordVariable;
        this._searchPattern = null;
        if (
            this.state.recordVariable != null &&
            this.state.recordVariable !== '' &&
            this.sobjectPickerErrorMessage == null
        ) {
            const resource = getElementByGuid(this.state.recordVariable)!;
            const entityName = resource.subtype!;
            this.entityLabel = getEntity(entityName)?.entityLabel;
            this.updateFields(entityName);
            this.showNoItemsIllustration = false;
        } else {
            this.showNoItemsIllustration = true;
        }
    }

    /**
     * Get the fields of the selected entity and set the state accordingly
     *
     * @param entityName entity name (eg: Account)
     */
    private updateFields(entityName: string) {
        this.showSpinner = true;
        fetchFieldsForEntity(entityName)
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

    filterSupportedFields(entityFields) {
        return (Object.values(entityFields) as FieldDefinition[]).filter((field) => field.supportedByAutomaticField);
    }

    /**
     * Populate section/items data for inner palette component
     *
     * @param fieldNamePattern filtered term entered
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
                iconName: getAutomaticFieldIcon(field),
                label: field.label,
                fieldTypeName: getScreenFieldName(field)!,
                objectFieldReference: `${currentRecordVariable}.${field.apiName}`
            };
            if (isAutomaticFieldRequired(field)) {
                requiredSection._children.push(item);
            } else {
                optionalSection._children.push(item);
            }
        });
        this.buildPaletteDataWithSections([requiredSection, optionalSection]);
    }

    /**
     * Resets palette data and adds given sections if not empty
     *
     * @param paletteSections to add to palette data
     */
    buildPaletteDataWithSections(paletteSections: ScreenPaletteSection[]) {
        this._paletteData = [];
        paletteSections.forEach((paletteSection) => {
            if (paletteSection._children.length > 0) {
                this.paletteData.push(paletteSection);
            }
        });
    }

    /**
     * Rebuild palette data when a new search term is given as input
     *
     * @param event custom event dispatched on new search
     */
    handleSearch(event) {
        const filterValue = event.target.value;
        this._searchPattern = filterValue ? filterValue : null;
        this.buildModel(this.searchPattern);
    }

    /**
     * Show no item illustration when SObject picker is cleared with pill (X) click
     *
     * @param event custom event dispatched on the pill removal of the entered sObject variable
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

    /**
     * @returns the Object selection combobox
     * @private
     */
    private getObjectCombobox(): Combobox | null {
        // @ts-ignore TODO: remove me
        return this.template
            .querySelector(SObjectOrSObjectCollectionPicker.SELECTOR)
            ?.shadowRoot.querySelector(FerovResourcePicker.SELECTOR)
            ?.shadowRoot.querySelector(BaseResourcePicker.SELECTOR)
            ?.shadowRoot.querySelector(Combobox.SELECTOR);
    }

    /**
     * As we can change the current object via the canvas selection,
     * this function allows to update accordingly the pill
     *
     * @private
     */
    private resetPill() {
        const combobox = this.getObjectCombobox();
        if (combobox) {
            combobox.errorMessage = null;
            combobox.resetPill();
        }
    }
}
