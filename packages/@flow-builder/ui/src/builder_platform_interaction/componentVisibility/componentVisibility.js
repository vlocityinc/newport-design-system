import { LightningElement, api } from 'lwc';
import {
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

// TODO:
// const MAX_CONDITIONS = 10;

/**
 * Component displeyd in the "Component Visibility" screen editor section.
 *
 * Displays a "narrow" version of the condition list component.
 * See
 */
export default class ComponentVisibility extends LightningElement {
    @api
    guid;
    @api
    visibility;

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

    // Used to tract the index of the displayed popover.
    // If the popover is not displayed, then the value will be -1.
    _popoverIndex = -1;

    // Workaround to deal with the onclick event of the "Add Condition" button which bubbles up
    _addConditionClicked = false;

    get conditionLogic() {
        return this.visibility.conditionLogic;
    }

    get conditionsWithPrefixes() {
        const { conditions, conditionLogic } = this.visibility;
        const res = getConditionsWithPrefixes(conditionLogic, conditions);
        return res;
    }

    get showDeleteCondition() {
        return showDeleteCondition(this.visibility.conditions);
    }

    get showConditions() {
        return (
            this.visibility.conditionLogic.value !==
            CONDITION_LOGIC.NO_CONDITIONS
        );
    }

    renderedCallback() {
        // when rendering, display the popover at the right index if applicable
        if (this._popoverIndex !== -1) {
            this.displayPopover(this._popoverIndex);
        }
    }

    disconnectedCallback() {
        // hide the popover when the component is unmounted
        hidePopover();
    }

    /**
     * Called when a condition is deleted.
     * Hide the popover and let the delete event bubble up.
     */
    handleDeleteCondition = () => {
        this._popoverIndex = -1;
        hidePopover();
    };

    /**
     * The onclick of the add button bubbles up so we need to handle it so that doesn't get closed.
     * @param {event} the onclick event
     */
    handleOnClick = event => {
        if (this._addConditionClicked) {
            this._addConditionClicked = false;
            event.stopPropagation();
        }
    };

    /**
     * The onclick of the add button bubbles up so we need to handle it so that doesn't get closed.
     * @param {AddConditionEvent} the add condition event
     */
    handleAddCondition = event => {
        if (this.isLastConditionNew()) {
            // cancel the event we we already are displaying a new condition
            event.stopPropagation();
        } else {
            // add +1 to the popoverIndex to account for the "New Condition" that will be created by the reducer
            this._popoverIndex = this.visibility.conditions.length;
            hidePopover();
        }
        this._addConditionClicked = true;
    };

    /**
     * Called when the condition logic property changes
     */
    handlePropertyChanged = event => {
        const { propertyName, value } = event.detail;

        if (propertyName === 'conditionLogic') {
            event.stopPropagation();

            const conditionLogic = value;

            if (!this.showConditions) {
                // if we are not displaying conditions, then the reducer will add a "New Condition", and
                //  we need to display the popover for it
                this._popoverIndex = 0;
            } else if (conditionLogic === CONDITION_LOGIC.NO_CONDITIONS) {
                // hide the popover when we dont' display conditions
                this._popoverIndex = -1;
            }

            hidePopover();

            this.dispatchEvent(
                new UpdateConditionLogicEvent(this.guid, conditionLogic)
            );
        }
    };

    /**
     * Called when the user clicks on a condition
     */
    handleClickCondition = event => {
        event.stopPropagation();

        const index = parseInt(event.currentTarget.dataset.index, 10);

        // if the popover is opened and we clicked on another condition, display that condition
        // if the current condition in the popover is new, remove it
        if (index !== this._popoverIndex) {
            this._popoverIndex = index;
            this.displayPopover(this._popoverIndex);

            this.removeNewCondition();
        }
    };

    /**
     * Called when the user presses "Done" in the popover
     */
    handleDone = (/* index, condition */) => {
        // this.dispatchEvent(
        //     new UpdateConditionEvent(this.guid, index, condition)
        // );
        // this._popoverIndex = -1;
        // hidePopover();
    };

    /**
     * Called when the popover is closed
     */
    handleClosePopover = panel => {
        // if the popover was closed by clicking out, we need to update the _popoverIndex variable
        // and remove the new condition displayed if applicable
        if (panel.closedBy === 'closeOnClickOut') {
            this.removeNewCondition();
            this._popoverIndex = -1;
        }
    };

    /**
     * @returns true if the last condition is a "New Condition"
     */
    isLastConditionNew() {
        const { conditions } = this.visibility;
        const lastCondition =
            conditions.length > 0 ? conditions[conditions.length - 1] : null;
        return lastCondition && this.isConditionNew(lastCondition);
    }

    /**
     * Deletes a condition by firing a DeleteConditionEvent
     * @param {*} index the index of the condition to delete
     */
    deleteCondition(index) {
        this.dispatchEvent(new DeleteConditionEvent(this.guid, index));
    }

    /**
     * This removes the "New Condition" if it is present.
     */
    removeNewCondition() {
        if (this.isLastConditionNew()) {
            const lastIndex = this.visibility.conditions.length - 1;
            this.deleteCondition(lastIndex);
        }
    }

    /**
     * Checks if the condition is a "New Condition".  A new condition is a condition that has not yet
     * been validated.
     * @return true if the condition is a "New Condition"
     */
    isConditionNew(condition) {
        return condition[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value === '';
    }

    /**
     * Displays the popover at for a given condition index
     * @param {number} index the index of the condition we want to display the popover for
     */
    displayPopover(index) {
        hidePopover();
        const nth = index + 1;
        const referenceElement = this.template.querySelector(
            '.slds-list__item:nth-child(' + nth + ') div.condition-container'
        );

        showPopover(
            'builder_platform_interaction:conditionEditorPopover',
            {
                condition: this.visibility.conditions[index],
                handleDone: condition => this.handleDone(index, condition)
            },
            {
                referenceElement,
                direction: 'west',
                closeOnClickOut: true,
                onClose: this.handleClosePopover,
                showCloseButton: false
            }
        );
    }
}
