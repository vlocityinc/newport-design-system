import { LightningElement, api, track } from 'lwc';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './scheduledPathsEditorLabels';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { scheduledPathsReducer } from './scheduledPathsReducer';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { RECORD_TRIGGER_TYPE_LABEL_LOOKUP } from 'builder_platform_interaction/triggerTypeLib';
import { SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

const EMPTY_SCHEDULED_PATH_LABEL = LABELS.emptyScheduledPathLabel;
const IMMEDIATE_SCHEDULED_PATH_LABEL = LABELS.immediateScheduledPathLabel;
const IMMEDIATE_SCHEDULED_PATH_ID = 'immediateScheduledPath';
const SELECTORS = {
    ADD_BUTTON: 'builder_platform_interaction-reorderable-vertical-navigation lightning-button-icon',
    SCHEDULED_PATH: 'builder_platform_interaction-scheduled-path'
};

export default class ScheduledPathsEditor extends LightningElement {
    @track activeScheduledPathId;
    @track startElement;
    isAddingFirstScheduledPath = false;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.startElement;
    }

    /**
     * public api function to run the rules from scheduled path validation library
     *
     * @returns {object} list of errors
     */
    @api validate() {
        const event = <CustomEvent>{ type: VALIDATE_ALL };
        this.startElement = scheduledPathsReducer(this.startElement, event);
        return getErrorsFromHydratedElement(this.startElement);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue;
        if (
            !this.activeScheduledPathId &&
            this.startElement.scheduledPaths &&
            this.startElement.scheduledPaths.length > 0
        ) {
            this.activeScheduledPathId = this.startElement.scheduledPaths[0].guid;
        }
    }

    get immediateScheduledPathDetailsLabel() {
        return format(
            LABELS.immediateScheduledPathDetailsDescription2,
            RECORD_TRIGGER_TYPE_LABEL_LOOKUP[getValueFromHydratedItem(this.startElement.recordTriggerType)]
        );
    }

    get scheduledPathsWithImmediateTrigger() {
        let scheduledPathsWithImmediateTrigger: {
            element: { guid: string };
            label: string;
            isDraggable: boolean;
        }[] = [];
        if (this.startElement.scheduledPaths) {
            scheduledPathsWithImmediateTrigger = this.startElement.scheduledPaths.map((scheduledPath) => {
                return {
                    element: scheduledPath,
                    label:
                        scheduledPath.label && scheduledPath.label.value
                            ? scheduledPath.label.value
                            : EMPTY_SCHEDULED_PATH_LABEL,
                    isDraggable: false,
                    hasErrors: getErrorsFromHydratedElement(scheduledPath).length > 0
                };
            });
        }
        scheduledPathsWithImmediateTrigger.unshift({
            element: {
                guid: IMMEDIATE_SCHEDULED_PATH_ID
            },
            label: IMMEDIATE_SCHEDULED_PATH_LABEL,
            isDraggable: false
        });
        return scheduledPathsWithImmediateTrigger;
    }

    handleAddScheduledPath(event) {
        event.stopPropagation();
        this.addScheduledPath();

        // Select the newly added scheduled path
        const scheduledPaths = this.startElement.scheduledPaths;
        this.activeScheduledPathId = scheduledPaths[scheduledPaths.length - 1].guid;

        // Focus on the newly selected scheduled path ( focus on the name/label field )
        const scheduledPath = this.template.querySelector(SELECTORS.SCHEDULED_PATH);
        if (scheduledPath) {
            scheduledPath.focus();
        } else {
            // Scheduled path will be null when adding one for the first time.
            // For this case we need to wait for the renderedCallback before shifting focus
            this.isAddingFirstScheduledPath = true;
        }
    }

    /**
     *
     * @param event - property changed event coming from scheduled path component
     */
    handlePropertyChangedEvent(event: CustomEvent) {
        event.stopPropagation();
        this.startElement = scheduledPathsReducer(this.startElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    /**
     * Handles deletion and sets focus to the first scheduled path or immediate scheduled path (if deletion was successful)
     *
     * @param {object} event - deleteScheduledPathEvent
     */
    handleDeleteScheduledPath(event) {
        event.stopPropagation();
        const originalNumberOfScheduledPaths = this.startElement.scheduledPaths.length;
        this.startElement = scheduledPathsReducer(this.startElement, event);
        if (this.startElement.scheduledPaths.length < originalNumberOfScheduledPaths) {
            if (this.startElement.scheduledPaths.length === 0) {
                this.activeScheduledPathId = IMMEDIATE_SCHEDULED_PATH_ID;
            } else {
                this.activeScheduledPathId = this.startElement.scheduledPaths[0].guid;
            }
        }
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));

        // Move focus to the active scheduled path post deletion
        // If "Run Immediately" path is the active path (happens when all scheduled paths have been deleted)
        // then move focus to the add button, else move it to the active scheduled path
        if (this.activeScheduledPathId === IMMEDIATE_SCHEDULED_PATH_ID) {
            this.template.querySelector(SELECTORS.ADD_BUTTON).focus();
        } else {
            this.template.querySelector(SELECTORS.SCHEDULED_PATH)?.focus();
        }
    }

    get isImmediateScheduledPath() {
        return this.activeScheduledPathId === IMMEDIATE_SCHEDULED_PATH_ID;
    }

    get isrunAsyncScheduledPath() {
        return (
            this.startElement.scheduledPaths.find((el) => el.guid === this.activeScheduledPathId).pathType?.value ===
            SCHEDULED_PATH_TYPE.RUN_ASYNC
        );
    }

    addScheduledPath() {
        const event = new CustomEvent(PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_SCHEDULED_PATH, {});
        this.startElement = scheduledPathsReducer(this.startElement, event);
    }

    get activeScheduledPath() {
        return this.startElement.scheduledPaths
            ? this.startElement.scheduledPaths.find(
                  (scheduledPath) => scheduledPath.guid === this.activeScheduledPathId
              )
            : null;
    }

    handleScheduledPathSelected(event) {
        event.stopPropagation();
        this.activeScheduledPathId = event.detail.itemId;
    }

    renderedCallback() {
        // Moving the focus to the scheduled path details section after the first path has been added.
        // We need to wait for the UI to re-render before shifting focus
        if (this.isAddingFirstScheduledPath) {
            this.template.querySelector(SELECTORS.SCHEDULED_PATH).focus();
            this.isAddingFirstScheduledPath = false;
        }
    }
}
