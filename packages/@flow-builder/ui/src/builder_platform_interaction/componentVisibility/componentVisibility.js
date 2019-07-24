import { LightningElement, api } from 'lwc';
import {
    UpdateConditionEvent,
    UpdateConditionLogicEvent,
    DeleteConditionEvent
} from 'builder_platform_interaction/events';
import {
    getConditionsWithPrefixes,
    showDeleteCondition
} from 'builder_platform_interaction/conditionListUtils';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import {
    showPopover,
    hidePopover
} from 'builder_platform_interaction/builderUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './componentVisibilityLabels';

// maximum number of visibility conditions allowed
const MAX_CONDITIONS = 10;

/**
 * Component displayed in the "Component Visibility" screen editor section.
 *
 * Displays a "narrow" version of the condition list component.
 */
export default class ComponentVisibility extends LightningElement {
    @api
    guid;

    @api
    visibilityRule;

    labels = LABELS;
    showDeleteConditionButton = false;
    conditionLogicOptions = [
        {
            value: CONDITION_LOGIC.NO_CONDITIONS,
            label: this.labels.noConditionsLabel
        },
        {
            value: CONDITION_LOGIC.AND,
            label: this.labels.andConditionLogicLabel
        },
        { value: CONDITION_LOGIC.OR, label: this.labels.orConditionLogicLabel },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: this.labels.customConditionLogicLabel
        }
    ];

    // used to display the popover at a given index after rendering
    _popoverIndex = -1;

    // Workaround to deal with the onclick event of the "Add Condition" button which bubbles out
    // of the ConditionList component
    _addConditionClicked = false;

    get conditionsWithPrefixes() {
        const { conditions, conditionLogic } = this.visibilityRule;
        const res = getConditionsWithPrefixes(conditionLogic, conditions);
        return res;
    }

    get showDeleteCondition() {
        return showDeleteCondition(this.visibilityRule.conditions);
    }

    get showConditions() {
        return (
            this.visibilityRule.conditionLogic.value !==
            CONDITION_LOGIC.NO_CONDITIONS
        );
    }

    get maxConditions() {
        return MAX_CONDITIONS;
    }

    /**
     * Displays the popover on render if we have a popover index
     */
    renderedCallback() {
        if (this._popoverIndex !== -1) {
            this.displayPopover(this._popoverIndex);
        }
    }

    /**
     * Hides the popover when the component is removed
     */
    disconnectedCallback() {
        hidePopover();
    }

    /**
     * Hides the popover when we click on the delete button for a condition
     */
    handleDeleteCondition = () => {
        this._popoverIndex = -1;
        // delete any new condition that might be present
        this.deleteNewCondition();
        hidePopover();
    };

    /**
     * Cancels the onclick event fired when clicking on the add button.
     * @param {Event} event onclick event that is fired when clicking on the component
     */
    handleOnClick = event => {
        // hack to prevent the onclick event generated when clicking the add button from hiding the popover
        if (this._addConditionClicked) {
            this._addConditionClicked = false;
            event.stopPropagation();
        }
    };

    /**
     * Handles when the "Add Condition" button is clicked.
     * Displays the popover for the new condition.
     * @param {AddConditionEvent} event the condition logic change event
     */
    handleAddCondition = event => {
        if (this.isLastConditionNew()) {
            // if we already have a "New Condition", don't do anything
            event.stopPropagation();
        } else {
            //  displays the popover for the "New Condition" that will be added by the reducer
            this._popoverIndex = this.visibilityRule.conditions.length;
            hidePopover();
        }

        // hack to deal with the onclick event that is fired when clicking on the add button
        this._addConditionClicked = true;
    };

    /**
     * Handles changes to the condition logic value.
     * @param {PropertyChangedEvent} event the condition logic change event
     * @fires UpdateConditionLogicEvent
     */
    handlePropertyChanged = event => {
        event.stopPropagation();

        const conditionLogic = event.detail.value;

        if (!this.showConditions) {
            // automatically display the popover for the "New Condition" that will be added by the reducer
            this._popoverIndex = 0;
        } else if (conditionLogic === CONDITION_LOGIC.NO_CONDITIONS) {
            // hides the popover if we switch to no conditions
            this._popoverIndex = -1;
        }

        // makes sure the popover is redisplayed
        hidePopover();

        this.dispatchEvent(
            new UpdateConditionLogicEvent(this.guid, conditionLogic)
        );
    };

    /**
     * Displays the popover for the condition that was clicked on.
     * @param {Event} event the onclick event
     * @fires DeleteConditionEvent when a "New Condition" was displayed
     */
    handleClickCondition = event => {
        event.stopPropagation();

        // only do something when we clicked on a different condition
        const index = parseInt(event.currentTarget.dataset.index, 10);
        if (index !== this._popoverIndex) {
            this._popoverIndex = index;
            this.displayPopover(this._popoverIndex);

            // delete any new condtion that was present
            this.deleteNewCondition();
        }
    };

    /**
     * Handles when the user clicks "Done" in the ConditionEditorPopover.
     * The popover guarantees this is only invoked if the condition doesn't have any errors.
     * @param {number} index the index of the edited condition
     * @param {Object} condition the condition that was edited
     * @fires UpdateConditionEvent
     */
    handleDone = (index, condition) => {
        this.dispatchEvent(
            new UpdateConditionEvent(this.guid, index, condition)
        );
        this._popoverIndex = -1;
        hidePopover();
    };

    /**
     * Handles then case when the popover is closed by clicking out.
     * Deletes any "New Condition" that was being edited.
     * @fires DeleteConditionEvent
     */
    handleClosePopover = panel => {
        if (panel.closedBy === 'closeOnClickOut') {
            this.deleteNewCondition();
            this._popoverIndex = -1;
        }
    };

    /**
     * Checks if the last condition is new
     * @returns true if the last condition is new
     */
    isLastConditionNew() {
        const { conditions } = this.visibilityRule;
        const lastCondition =
            conditions.length > 0 ? conditions[conditions.length - 1] : null;
        return lastCondition && this.isConditionNew(lastCondition);
    }

    /**
     * Deletes a condition at a given index
     * @param {number} index of the condition to delete
     * @fires DeleteConditionEvent
     */
    deleteCondition(index) {
        this.dispatchEvent(new DeleteConditionEvent(this.guid, index));
    }

    /**
     * Deletes the new condition if it is present
     * @fires DeleteConditionEvent
     */
    deleteNewCondition() {
        if (this.isLastConditionNew()) {
            const lastIndex = this.visibilityRule.conditions.length - 1;
            this.deleteCondition(lastIndex);
        }
    }

    /**
     * Checks if a condition is new
     * @param {Object} condition the condition to check
     * @returns true if the condition is new
     */
    isConditionNew(condition) {
        return condition[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value === '';
    }

    /**
     * Displays the ConditionEditorPopover
     * @param {number} index of condition used to anchor the popover
     */
    displayPopover(index) {
        // hide the popover if it is alreay opened
        hidePopover();

        const nth = index + 1;
        const referenceElement = this.template.querySelector(
            '.slds-list__item:nth-child(' + nth + ') div.condition-container'
        );

        showPopover(
            'builder_platform_interaction:conditionEditorPopover',
            {
                condition: this.visibilityRule.conditions[index],
                handleDone: condition => this.handleDone(index, condition),
                lhsLabelHelpText: this.labels.resourcePickerLabelHelpText,
                rhsLabelHelpText: this.labels.resourcePickerLabelHelpText
            },
            {
                referenceElement,
                direction: 'west',
                closeOnClickOut: true,
                onClose: this.handleClosePopover
            }
        );
    }
}
