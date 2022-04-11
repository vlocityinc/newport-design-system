import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { hidePopover, showPopover } from 'builder_platform_interaction/builderUtils';
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import {
    DeleteConditionEvent,
    UpdateConditionEvent,
    UpdateConditionLogicEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { focusUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './componentVisibilityLabels';

// maximum number of visibility conditions allowed
const MAX_CONDITIONS = 10;

const CONDITION_LOGIC_OPTIONS = [
    {
        value: CONDITION_LOGIC.NO_CONDITIONS,
        label: LABELS.noConditionsLabel
    },
    {
        value: CONDITION_LOGIC.AND,
        label: LABELS.andConditionLogicLabel
    },
    {
        value: CONDITION_LOGIC.OR,
        label: LABELS.orConditionLogicLabel
    },
    {
        value: CONDITION_LOGIC.CUSTOM_LOGIC,
        label: LABELS.customConditionLogicLabel
    }
];

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

    showDeleteConditionButton = false;
    conditionLogicOptions = CONDITION_LOGIC_OPTIONS;

    // used to display the popover at a given index after rendering
    private _popoverIndex = -1;

    // Workaround to deal with the onclick event of the "Add Condition" button which bubbles out
    // of the ConditionList component
    private _addConditionClicked = false;

    private _logicComboboxLabel: string | null = null;

    // The saved active element, to restore focus, to when closing the condition editor popup
    private savedActiveElement: HTMLElement | undefined;

    get logicComboboxLabel() {
        return this._logicComboboxLabel || LABELS.logicComboboxLabel;
    }

    @api
    set logicComboboxLabel(label) {
        this._logicComboboxLabel = label;
    }

    get conditionsWithPrefixes() {
        const { conditions, conditionLogic } = this.visibilityRule;
        return getConditionsWithPrefixes(conditionLogic, conditions);
    }

    get showDeleteCondition() {
        return showDeleteCondition(this.visibilityRule.conditions);
    }

    get showConditions() {
        return this.visibilityRule.conditionLogic.value !== CONDITION_LOGIC.NO_CONDITIONS;
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
     *
     * @param {Event} event onclick event that is fired when clicking on the component
     */
    handleOnClick = (event) => {
        // hack to prevent the onclick event generated when clicking the add button from hiding the popover
        if (this._addConditionClicked) {
            this._addConditionClicked = false;
            event.stopPropagation();
        }
    };

    /**
     * Handles when the "Add Condition" button is clicked.
     * Displays the popover for the new condition.
     *
     * @param {AddConditionEvent} event the condition logic change event
     */
    handleAddCondition = (event) => {
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
     *
     * @param {PropertyChangedEvent} event the condition logic change event
     * @fires UpdateConditionLogicEvent
     */
    handlePropertyChanged = (event) => {
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

        this.dispatchEvent(new UpdateConditionLogicEvent(this.guid, conditionLogic));
    };

    /**
     * Get a condition list item at a given index
     *
     * @param index - The index for the item
     * @returns The condition list item at the specified index
     */
    getConditionListItem(index: number) {
        return this.template.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST_ITEM)[
            index
        ] as HTMLElement;
    }

    /**
     * Displays the popover for the condition that was clicked on.
     *
     * @param event the onclick event
     * @fires DeleteConditionEvent when a "New Condition" was displayed
     */
    handleClickCondition = (event) => {
        event.stopPropagation();

        // only do something when we clicked on a different condition
        const index = parseInt(event.currentTarget.dataset.index, 10);

        this.savedActiveElement = this.getConditionListItem(index);

        if (index !== this._popoverIndex) {
            this._popoverIndex = index;
            this.displayPopover(this._popoverIndex);
            // delete any new condition that was present
            this.deleteNewCondition();
        }
    };

    /**
     * Handles when the user clicks "Done" in the ConditionEditorPopover.
     * The popover guarantees this is only invoked if the condition doesn't have any errors.
     *
     * @param index - The index of the edited condition
     * @param condition -The condition that was edited
     * @fires UpdateConditionEvent
     */
    handleDone = (index: number, condition: UI.Condition) => {
        this.dispatchEvent(new UpdateConditionEvent(this.guid, index, condition));
        this._popoverIndex = -1;

        // set the savedActiveElement to the new list item
        this.savedActiveElement = this.getConditionListItem(index);

        this.returnFocus();
        hidePopover({
            closedBy: 'closeOnDone'
        });
    };

    /**
     * Handles then case when the popover is closed by clicking out.
     * Deletes any "New Condition" that was being edited.
     *
     * @param panel
     * @fires DeleteConditionEvent
     */
    handleClosePopover = (panel) => {
        if (panel.closedBy !== 'closeOnDone') {
            this.deleteNewCondition();
            this._popoverIndex = -1;
        }

        this.returnFocus();
    };

    /**
     * Returns the focus to any saved active element
     */
    returnFocus() {
        // Using setTimeout to work around the double aura popover issue
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.savedActiveElement?.focus();
            this.savedActiveElement = undefined;
        }, 500);
    }

    /**
     * Checks if the last condition is new
     *
     * @returns true if the last condition is new
     */
    isLastConditionNew() {
        const { conditions } = this.visibilityRule;
        const lastCondition = conditions.length > 0 ? conditions[conditions.length - 1] : null;
        return lastCondition && this.isConditionNew(lastCondition);
    }

    /**
     * Deletes a condition at a given index
     *
     * @param {number} index of the condition to delete
     * @fires DeleteConditionEvent
     */
    deleteCondition(index) {
        this.dispatchEvent(new DeleteConditionEvent(this.guid, index));
    }

    /**
     * Deletes the new condition if it is present
     *
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
     *
     * @param {Object} condition the condition to check
     * @returns true if the condition is new
     */
    isConditionNew(condition) {
        return condition[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value === '';
    }

    /**
     * Displays the ConditionEditorPopover
     *
     * @param {number} index of condition used to anchor the popover
     */
    displayPopover(index) {
        // hide the popover if it is already opened
        hidePopover();

        // if we haven't set a savedActiveElement, then use the element that currently has the focus
        if (this.savedActiveElement == null) {
            this.savedActiveElement = focusUtils.getElementWithFocus();
        }

        const nth = index + 1;
        const referenceElement = this.template.querySelector(
            '.slds-list__item:nth-child(' + nth + ') div.condition-container'
        );

        showPopover(
            'builder_platform_interaction:conditionEditorPopover',
            {
                condition: this.visibilityRule.conditions[index],
                handleDone: (condition) => this.handleDone(index, condition)
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
