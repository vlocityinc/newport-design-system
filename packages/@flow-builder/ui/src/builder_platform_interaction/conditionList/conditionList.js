import { LightningElement, api, track } from 'lwc';
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './conditionListLabels';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    CUSTOM_LOGIC: '.customLogic'
};

const defaultLogicalOperator = CONDITION_LOGIC.AND;

/**
 * Usage: <builder_platform_interaction-logic-list></builder_platform_interaction-logic-list>
 */
export default class ConditionList extends LightningElement {
    @track state = {
        conditions: [],
        conditionLogicComboBoxValue: null,
        conditionLogic: null,
        showCustomLogicInput: false
    };

    labels = LABELS;

    @track
    showErrorMessageIfBlank = this.labels.cannotBeBlankError;

    /**
     * @typedef {Object} conditionLogicOption
     * @property {module:flow-metadata.CONDITION_LOGIC} value
     * @property {string} label
     */

    /**
     * @type conditionLogicOption[]
     */
    @api conditionLogicOptions;

    @api get conditions() {
        return this.state.conditions;
    }

    set conditions(conditions) {
        this.state.conditions = conditions;
    }

    @api get conditionLogic() {
        return this.state.conditionLogic;
    }

    set conditionLogic(conditionLogic) {
        if (conditionLogic) {
            this.state.conditionLogic = conditionLogic;

            this.processConditionLogic(this.state.conditionLogic.value);
        }
    }

    @api
    maxConditions;

    @api
    parentGuid;

    @api
    logicComboboxLabel;

    @api
    containerElementType;

    /**
     * @type {module:MenuDataGenerator.MenuData}
     */
    @api
    fields;

    /**
     * Specifies the variant of the condition list component
     * @type string (narrow | default)
     */
    @api
    variant;

    get conditionLogicContainerClasses() {
        const classes = ['slds-form-element', 'slds-m-bottom_small'];

        if (this.variant !== 'narrow') {
            classes.push('slds-size_1-of-3');
        }

        return classes.join(' ');
    }

    processConditionLogic(value) {
        this.state.conditionLogicComboBoxValue = value;
        this.state.showCustomLogicInput = false;

        if (
            !Object.values(CONDITION_LOGIC).find(logicValue => {
                return value === logicValue;
            })
        ) {
            // Select the custom logic option in the dropdown
            this.state.conditionLogicComboBoxValue =
                CONDITION_LOGIC.CUSTOM_LOGIC;
            // And show the custom logic input
            this.state.showCustomLogicInput = true;
        }
    }

    /**
     * Whether the conditions list will be rendered - true unless no conditions are needed
     * @return {null|boolean} whether the condition list will be displayed
     */
    get isConditionListVisible() {
        return (
            this.state.conditionLogic &&
            this.state.conditionLogic.value === CONDITION_LOGIC.NO_CONDITIONS
        );
    }

    /** Sets the CustomValidity if there is a valid error message.
     * @param {Object} element - the input component
     * @param {Object} error - the error
     */
    setInputErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /** After rendering the condition logic component we are setting the error
     * via setCustomValidity, except initial rendering.
     */
    renderedCallback() {
        if (this.state.conditionLogic) {
            const conditionLogicInput = this.template.querySelector(
                SELECTORS.CUSTOM_LOGIC
            );
            this.setInputErrorMessage(
                conditionLogicInput,
                this.state.conditionLogic.error
            );
        }
    }

    /**
     * @param {string} logicalOperator the logical operator we will use to build the custom logic
     * (should be either 'and' or 'or')
     * @return {string} Default logic string which is all conditions separate by AND or OR.
     * E.g. For three conditions and logicalOperator AND, '1 AND 2 AND 3' is returned
     */
    getDefaultCustomLogicString(logicalOperator) {
        logicalOperator = logicalOperator.toUpperCase();

        let customLogic = '1';
        for (let i = 2; i <= this.state.conditions.length; i++) {
            customLogic += ` ${logicalOperator} ${i}`;
        }

        return customLogic;
    }

    handleConditionLogicChange(event) {
        let newLogicValue = event.detail.value;
        if (newLogicValue === CONDITION_LOGIC.CUSTOM_LOGIC) {
            let logicalOperator = this.state.conditionLogicComboBoxValue;
            if (logicalOperator === CONDITION_LOGIC.NO_CONDITIONS) {
                logicalOperator = defaultLogicalOperator;
            }
            newLogicValue = this.getDefaultCustomLogicString(logicalOperator);
        }

        const propertyChangedEvent = new PropertyChangedEvent(
            'conditionLogic',
            newLogicValue,
            null,
            this.parentGuid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    handleCustomLogicFocusOut(event) {
        const value = event.target.value;

        const propertyChangedEvent = new PropertyChangedEvent(
            'conditionLogic',
            value,
            null,
            this.parentGuid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * @param {object} event - AddListItemEvent to add a condition at the end of the list
     */
    handleAddCondition(event) {
        event.stopPropagation();

        const addConditionEvent = new AddConditionEvent(this.parentGuid);

        this.dispatchEvent(addConditionEvent);
    }

    /**
     * @param {object} event - DeleteListItemEvent to delete a condition at the given index
     */
    handleDeleteCondition(event) {
        event.stopPropagation();

        const deleteConditionEvent = new DeleteConditionEvent(
            this.parentGuid,
            event.detail.index
        );

        this.dispatchEvent(deleteConditionEvent);
    }

    /**
     * @param {object} event - UpdateListItemEvent to update a property value in the condition at the given index
     */
    handleUpdateCondition(event) {
        event.stopPropagation();

        const updateConditionEvent = new UpdateConditionEvent(
            this.parentGuid,
            event.detail.index,
            event.detail.value,
            event.detail.error
        );

        this.dispatchEvent(updateConditionEvent);
    }
}
