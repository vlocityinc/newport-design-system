import { Element, api, track, unwrap } from 'engine';
import { loopReducer } from './loop-reducer';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

const LOOP_PROPERTIES = {
    COLLECTION_VARIABLE: 'collectionReference',
    LOOP_VARIABLE: 'assignNextValueToReference',
    ITERATION_ORDER: 'iterationOrder'
};
// TODO: use labels W-4960986
const VARIABLE_LABEL = 'Variable';
const COLLECTION_VAR_PLACEHOLDER = 'Find a collection variable...';
const LOOP_VAR_PLACEHOLDER = 'Find a variable...';
const ITERATION_ORDER_ASCENDING = 'Asc';
const ITERATION_ORDER_DECENDING = 'Desc';
// TODO: Separate this in 2 error messages in W-4961131
const VARIABLE_ERROR_MESSAGE = null;
const VARIABLE_LITERALS_ALLOWED = false;
const VARIABLE_REQUIRED = true;
const VARIABLE_DISABLED = false;

const COLLECTION_VAR_ELEMENT_CONFIG = {
    elementType: ELEMENT_TYPE.LOOP,
    isCollection: true
};

export default class LoopEditor extends Element {
    /**
     * internal state for the loop editor
     */
    @track loopElement;

    @api
    get node() {
        return this.loopElement;
    }

    @api
    set node(newValue) {
        this.loopElement = newValue || {};
        this._collectionVariable = getElementByGuid(getValueFromHydratedItem(this.loopElement.collectionReference));
        this._loopVariable = getElementByGuid(getValueFromHydratedItem(this.loopElement.assignNextValueToReference));
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.loopElement);
    }

    /**
     * public api function to run the rules from loop validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.loopElement = loopReducer(this.loopElement, event);
        return getErrorsFromHydratedElement(this.loopElement);
    }

    /**
     * Gets the developer name of the collection variable in the loop element
     * The name is in the {!name} format
     * @returns {String} name
     */
    get collectionVariable() {
        if (this._collectionVariable) {
            return {
                text: addCurlyBraces(this._collectionVariable.name),
                displayText: addCurlyBraces(this._collectionVariable.name),
                value: this.loopElement.collectionReference
            };
        }
        return '';
    }

    get loopVariable() {
        if (this._loopVariable) {
            return {
                text: addCurlyBraces(this._loopVariable.name),
                displayText: addCurlyBraces(this._loopVariable.name),
                value: this.loopElement.assignNextValueToReference
            };
        }
        return '';
    }

    get collectionVariableElementConfig() {
        return COLLECTION_VAR_ELEMENT_CONFIG;
    }

    get loopVariableElementConfig() {
        const collectionVariableDataType = this._collectionVariable ? this._collectionVariable.dataType : 'String';
        return {
            elementType: ELEMENT_TYPE.LOOP,
            dataType: collectionVariableDataType
        };
    }

    // TODO: use labels W-4960986
    get collectionVariableComboboxConfig() {
        const collectionVariableDataTypeForValidation = this._collectionVariable ? this._collectionVariable.dataType : 'String';
        return BaseResourcePicker.getComboboxConfig(
            VARIABLE_LABEL,
            COLLECTION_VAR_PLACEHOLDER,
            VARIABLE_ERROR_MESSAGE,
            VARIABLE_LITERALS_ALLOWED,
            VARIABLE_REQUIRED,
            VARIABLE_DISABLED,
            collectionVariableDataTypeForValidation
        );
    }

    // TODO: use labels W-4960986
    get loopVariableComboboxConfig() {
        // TODO: Fix isDisabled to be updated on ItemSelectedEvent
        const isDisabled = !this._collectionVariable;
        // The validation for the 'String' dataType will never happen because the combobox will be disabled
        // but the combobox config requires a non-empty string there
        const loopVariableDataTypeForValidation = isDisabled ? 'String' : this._collectionVariable.dataType;
        return BaseResourcePicker.getComboboxConfig(
            VARIABLE_LABEL,
            LOOP_VAR_PLACEHOLDER,
            VARIABLE_ERROR_MESSAGE,
            VARIABLE_LITERALS_ALLOWED,
            VARIABLE_REQUIRED,
            isDisabled,
            loopVariableDataTypeForValidation
        );
    }

    get iterationOrderOptions() {
        return [{ 'label': 'First to last', 'value': ITERATION_ORDER_ASCENDING }, { 'label': 'Last to first', 'value': ITERATION_ORDER_DECENDING }];
    }

    get iterationOrderValue() {
        return this.loopElement.iterationOrder ? this.loopElement.iterationOrder.value : ITERATION_ORDER_ASCENDING;
    }

    handleEvent(event) {
        event.stopPropagation();
        this.loopElement = loopReducer(this.loopElement, event);
    }

    handleCollectionVariablePropertyChanged(event) {
        event.stopPropagation();
        // TODO: in W-5079245 replace this and get the data needed directly from the event
        this._collectionVariable = getElementByGuid(event.detail.item.value);
        event.detail.propertyName = LOOP_PROPERTIES.COLLECTION_VARIABLE;
        this.loopElement = loopReducer(this.loopElement, event);
    }

    handleLoopVariablePropertyChanged(event) {
        event.stopPropagation();
        // TODO: in W-5079245 replace this and get the data needed directly from the event
        this._loopVariable = getElementByGuid(event.detail.item.value);
        event.detail.propertyName = LOOP_PROPERTIES.LOOP_VARIABLE;
        this.loopElement = loopReducer(this.loopElement, event);
    }

    handleLoopIterationOrderChanged(event) {
        event.stopPropagation();
        const iterationOrderChangedEvent = new PropertyChangedEvent(LOOP_PROPERTIES.ITERATION_ORDER, event.detail.value, null);
        this.loopElement = loopReducer(this.loopElement, iterationOrderChangedEvent);
    }
}