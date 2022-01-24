import { getSObjectOrApexReference, SORTABLE_FILTER } from 'builder_platform_interaction/collectionProcessorLib';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { UpdateCollectionProcessorEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import {
    isSObjectOrApexClass,
    SObjectOrApexReference,
    SortElement,
    SortOption,
    SortOutput,
    SORT_OUTPUT_OPTION
} from 'builder_platform_interaction/sortEditorLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByGuidFromState } from 'builder_platform_interaction/storeUtils';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './sortEditorLabels';
import { sortReducer } from './sortReducer';

export default class SortEditor extends LightningElement {
    @track sortElement: SortElement = {
        collectionReference: { value: null, error: null },
        limit: { value: null, error: null },
        sortOptions: []
    };
    @track showOptions = false;
    @track sObjectOrApexReference: SObjectOrApexReference = { value: null };
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
        this.sObjectOrApexReference = getSObjectOrApexReference(this._collectionVariable);
        this._sortOptions = this.sortElement.sortOptions;
    }

    updateSortOutput(selectedOutput: string) {
        this._sortOutput.selectedOutput.value = selectedOutput;
        this._sortOutput.limit = this.sortElement.limit;
    }

    updateQueriedFields() {
        if (isSObjectOrApexClass(this.sObjectOrApexReference) && this._collectionVariable) {
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

    // input collection filter: sObject, primitive, and apex type
    get collectionProcessorFilter() {
        return SORTABLE_FILTER;
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
     *
     * @returns {string} name
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
     *
     * @returns errors
     */
    @api
    validate() {
        const event = {
            type: VALIDATE_ALL,
            collectionReference: this.sortElement.collectionReference.value,
            selectedOutput: this._sortOutput.selectedOutput.value,
            isSObjectOrApexClass: isSObjectOrApexClass(this.sObjectOrApexReference)
        };
        this.sortElement = sortReducer(this.sortElement, event);
        return getErrorsFromHydratedElement(this.sortElement);
    }

    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        this._collectionVariable = event.detail.value
            ? getVariableOrField(event.detail.value, Store.getStore().getCurrentState().elements)
            : null;
        this.sortElement = sortReducer(this.sortElement, event);
        this.showOptions = this.sortElement.collectionReference.value !== null;
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.sortElement));
        this.updateSortOptions();
        this.updateQueriedFields();
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
