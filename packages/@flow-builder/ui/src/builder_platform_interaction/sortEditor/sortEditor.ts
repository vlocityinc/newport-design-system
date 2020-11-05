import { LightningElement, api, track } from 'lwc';
import { sortReducer } from './sortReducer';
import { LABELS } from './sortEditorLabels';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { getValueFromHydratedItem, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { addCurlyBraces, removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { CollectionReferenceChangedEvent, UpdateCollectionProcessorEvent } from 'builder_platform_interaction/events';
import { SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';
import { SortElement, SortOption, SortOutput } from 'builder_platform_interaction/sortEditorLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByGuidFromState } from 'builder_platform_interaction/storeUtils';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const FLOW_COLLECTION_VAR_ELEMENT_CONFIG = {
    // whether or not apex collection from anonymous automatic outputs are allowed
    allowsApexCollAnonymousAutoOutput: false,
    selectorConfig: {
        isCollection: true,
        sortable: true
    }
};

export default class SortEditor extends LightningElement {
    @track sortElement: SortElement = {
        collectionReference: { value: null, error: null },
        limit: { value: null, error: null },
        sortOptions: []
    };
    @track showOptions = false;
    @track isSobject = false;
    @track recordEntityName = '';
    @track resourceDisplayText = '';
    @track _sortOptions: SortOption[] = [];
    @track _sortOutput: SortOutput = {
        selectedOutput: { value: null, error: null },
        limit: { value: null, error: null }
    };

    @track
    queriedFields;

    @api
    get elementInfo() {
        return this.sortElement;
    }

    set elementInfo(value) {
        if (value) {
            this.sortElement = value;
        }
        // sortOptions
        if (this.sortElement.collectionReference && this.sortElement.collectionReference.value) {
            this._collectionVariable = getVariableOrField(
                this.sortElement.collectionReference.value,
                Store.getStore().getCurrentState().elements
            );
            this.updateSortOptions();
        } else {
            this._collectionVariable = null;
        }
        this.updateQueriedFields();
        this.showOptions = this._collectionVariable !== null;
        // sortOutput
        if (this.sortElement.limit && this.sortElement.limit.value) {
            this.updateSortOutput(SORT_OUTPUT_OPTION.CUSTOM);
        }
    }

    get labels() {
        return LABELS;
    }

    updateSortOptions() {
        if (this._collectionVariable) {
            this.isSobject = this._collectionVariable.dataType === 'SObject';
            this.recordEntityName = this._collectionVariable.subtype;
            this.resourceDisplayText = this.isSobject ? this._collectionVariable.subtype : null;
        }
        this._sortOptions = this.sortElement.sortOptions;
    }

    updateSortOutput(selectedOutput: string) {
        this._sortOutput.selectedOutput.value = selectedOutput;
        this._sortOutput.limit = this.sortElement.limit;
    }

    updateQueriedFields() {
        if (this.isSobject && this._collectionVariable) {
            const element = getElementByGuidFromState(
                Store.getStore().getCurrentState(),
                this._collectionVariable.guid
            );
            if (element && element.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
                this.queriedFields = element.queriedFields;
            }
        } else {
            this.queriedFields = null;
        }
    }

    get collectionVariableElementConfig() {
        return FLOW_COLLECTION_VAR_ELEMENT_CONFIG;
    }

    get collectionVariableComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.flowCollection,
            this.labels.flowCollectionPlaceholder,
            this.elementInfo.collectionReference.error,
            false,
            true,
            false,
            '',
            true,
            true
        );
    }

    get sortOptions() {
        return this._sortOptions;
    }

    get sortOutput() {
        return this._sortOutput;
    }
    /**
     * Gets the developer name of the collection variable
     * The name is in the {!name} format
     * @returns {String} name
     */
    get collectionVariable() {
        if (this._collectionVariable) {
            return {
                text: addCurlyBraces(this._collectionVariable.name),
                displayText: addCurlyBraces(this._collectionVariable.name),
                value: getValueFromHydratedItem(this.sortElement.collectionReference)
            };
        }
        return '';
    }

    /**
     * Validate the sort editor. This method will be called in the upper editor.
     */
    @api
    validate() {
        const event = {
            type: VALIDATE_ALL,
            collectionReference: this.sortElement.collectionReference.value,
            selectedOutput: this._sortOutput.selectedOutput.value,
            isSObject: this.isSobject
        };
        this.sortElement = sortReducer(this.sortElement, event);
        return getErrorsFromHydratedElement(this.sortElement);
    }

    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        this._collectionVariable = event.detail.item ? this.mutateComboboxItem(event.detail.item) : null;
        this.showOptions = this._collectionVariable !== null;
        // update collectionVariable
        const collectionValue = event.detail.item ? event.detail.item.value : null;
        const sortCollectionChangedEvent = new CollectionReferenceChangedEvent(collectionValue, event.detail.error);
        this.sortElement = sortReducer(this.sortElement, sortCollectionChangedEvent);
        // dispatch event to the parent editor
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.sortElement));
        this.updateSortOptions();
        this.updateQueriedFields();
    }

    /**
     * Mutate the combobox menu item to shape needed for loop variable/collection variable.
     * @param item combobox menu item
     * @return the object needed to populate loop variable/collection variable.
     */
    mutateComboboxItem(item) {
        return {
            name: removeCurlyBraces(item.displayText),
            guid: item.value,
            dataType: item.dataType,
            subtype: item.subtype ? item.subtype : null
        };
    }

    handleSortOptionChanged(event: CustomEvent) {
        event.stopPropagation();
        this.sortElement = sortReducer(this.sortElement, event);
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.sortElement));
        this.updateSortOptions();
    }

    handleSortOutputChanged(event: CustomEvent) {
        event.stopPropagation();
        this.sortElement = sortReducer(this.sortElement, event);
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.sortElement));
        this.updateSortOutput(event.detail.selectedOutput);
    }
}
