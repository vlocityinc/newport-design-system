import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { ComboboxStateChangedEvent, UpdateRelatedRecordFieldsChangeEvent } from 'builder_platform_interaction/events';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import { api, LightningElement, track } from 'lwc';

/**
 * A combobox to retrieve and select related record field for a given entity
 */
export default class RelatedRecordFieldsPicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-related-record-fields-picker';

    @track
    private state = {
        recordEntityName: '',
        value: '',
        errorMessage: ''
    };

    relatedRecordFieldsElementConfig = {};

    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value: string) {
        this.state.errorMessage = value;
    }

    @api
    label?: string;

    @api
    placeholder?: string;

    /**
     * Unique guid for the picker
     *
     * @type {string}
     */
    @api
    rowIndex?: string;

    element: any = undefined;

    /**
     * @param {string} entityName the selected entity name (from select object combobox)
     */
    set recordEntityName(entityName) {
        this.state.recordEntityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.state.recordEntityName;
    }

    @api
    get sobjectCollectionCriterion() {
        return SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
    }

    /**
     * @param {string} value the selected sObject or sObject collection variable
     */
    set value(value) {
        this.state.value = value;
        this.element = getResourceByUniqueIdentifier(this.state.value);
    }

    @api
    get value() {
        return this.state.value;
    }

    /**
     * @returns {Object | string} the value of the combobox (item or displayText)
     */
    get displayText() {
        if (this.element) {
            return {
                text: this.element.name,
                displayText: addCurlyBraces(this.element.name),
                value: this.state.value
            };
        }
        return this.state.value;
    }

    /**
     * create the combobox config
     *
     * @returns {ComboboxConfig} the combobox config
     */
    @api
    get relatedRecordFieldsComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label,
            this.placeholder,
            this.state.errorMessage,
            false, // literalsAllowed
            true, // required
            false, // disabled
            '', // type
            true, // enableFieldDrilldown
            true, // allowSObjectFields,
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            '',
            true // includeEntityRelatedRecordFields
        );
    }

    /**
     * handle event when changing the selected related field
     *
     * @param event the comboboxstatechanged event
     */
    handleRelatedRecordFieldsVariableChanged(event: ComboboxStateChangedEvent) {
        event.stopPropagation();
        const newValue = event.detail.item ? event.detail.item.value : event.detail.displayText;
        const subType = event.detail.item?.subtype;

        const referenceChangedEvent = new UpdateRelatedRecordFieldsChangeEvent(newValue, subType, event.detail.error);
        this.dispatchEvent(referenceChangedEvent);
    }
}
