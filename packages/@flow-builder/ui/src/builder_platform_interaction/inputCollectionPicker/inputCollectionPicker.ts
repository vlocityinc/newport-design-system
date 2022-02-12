import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { CollectionProcessorFilter } from 'builder_platform_interaction/collectionProcessorLib';
import { addCurlyBraces, removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CollectionReferenceChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { Store } from 'builder_platform_interaction/storeLib';
import { api, LightningElement, track } from 'lwc';

/**
 * A component to get the primitive/sobject collections, used in collection processor editors: sort, map, filter
 */
export default class InputCollectionPicker extends LightningElement {
    @api
    label = '';
    @api
    placeholder = '';
    @api
    sobjectOnly = false;
    @api
    entityConstraint = null;
    @api
    collectionProcessorFilter?: CollectionProcessorFilter;
    @track
    _collectionReference;

    /**
     * Gets the collection reference value
     *
     * @returns {Object} collection reference {value, error}
     */
    @api
    get collectionReference() {
        return this._collectionReference;
    }

    set collectionReference(value) {
        if (value) {
            this._collectionReference = value;
        }
        if (this._collectionReference && this._collectionReference.value) {
            this._collectionVariable = getVariableOrField(
                this._collectionReference.value,
                Store.getStore().getCurrentState().elements
            );
        } else {
            this._collectionVariable = null;
        }
    }

    get errorMessage() {
        return this._collectionReference ? this._collectionReference.error : '';
    }
    /**
     * Gets the element config
     *
     * @returns {Object} element config
     */
    get collectionVariableElementConfig() {
        let elementConfig = {
            // whether or not apex collection from anonymous automatic outputs are allowed
            allowsApexCollAnonymousAutoOutput: false,
            selectorConfig: {
                dataType: '',
                entityName: '',
                isCollection: true,
                collectionProcessorFilter: this.collectionProcessorFilter
            }
        };
        // not support primitive types
        if (this.sobjectOnly) {
            elementConfig = Object.assign(elementConfig, {
                allowedParamTypes: {
                    SObject: [
                        {
                            paramType: 'Data',
                            dataType: FLOW_DATA_TYPE.SOBJECT.value,
                            canBeSobjectField: 'CannotBe',
                            canBeSystemVariable: 'CanBe',
                            canBeApexProperty: 'CanBe'
                        }
                    ]
                }
            });
            elementConfig.selectorConfig.dataType = FLOW_DATA_TYPE.SOBJECT.value;
            if (this.entityConstraint) {
                elementConfig.selectorConfig.entityName = this.entityConstraint;
            }
        }

        return elementConfig;
    }

    /**
     * Gets the combobox config
     *
     * @returns {Object} combobox config
     */
    get collectionVariableComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label,
            this.placeholder,
            this.errorMessage,
            false,
            true,
            false,
            this.sobjectOnly ? FLOW_DATA_TYPE.SOBJECT.value : '',
            true,
            false
        );
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
                value: getValueFromHydratedItem(this._collectionReference)
            };
        }
        return '';
    }

    get elementType() {
        return ELEMENT_TYPE.COLLECTION_PROCESSOR;
    }

    /**
     * Handle the collection reference change event
     *
     * @param event combobox change event
     */
    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        this._collectionVariable = event.detail.item ? this.mutateComboboxItem(event.detail.item) : null;
        const collectionValue = event.detail.item ? event.detail.item.value : null;
        this.dispatchEvent(new CollectionReferenceChangedEvent(collectionValue, event.detail.error));
    }

    /**
     * Mutate the combobox menu item to shape needed for loop variable/collection variable.
     *
     * @param item combobox menu item
     * @returns the object needed to populate loop variable/collection variable.
     */
    mutateComboboxItem(item) {
        return {
            name: removeCurlyBraces(item.displayText),
            guid: item.value,
            dataType: item.dataType,
            subtype: item.subtype ? item.subtype : null
        };
    }
}
