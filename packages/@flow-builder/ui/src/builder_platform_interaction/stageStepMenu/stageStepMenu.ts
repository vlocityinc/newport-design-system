import { getTabKeyInteraction } from 'builder_platform_interaction/alcComponentsUtils';
import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api } from 'lwc';
import { LABELS } from './stageStepMenuLabels';

/**
 * The add step menu overlay. It is displayed when clicking on the Add Step button.
 */
export default class StageStepMenu extends AlcMenu {
    labels = LABELS;

    @api
    node;

    // configuration for menu items
    menuConfiguration = {
        sections: [
            {
                guid: 'steps',
                header: LABELS.steps,
                items: [
                    {
                        guid: 'background-step',
                        action: ACTION_TYPE.STEP_BACKGROUND,
                        label: LABELS.backgroundStepLabel,
                        description: LABELS.autolaunchedStepDescription,
                        iconName: 'standard:flow',
                        iconSize: 'small',
                        iconVariant: 'inverse',
                        get tooltip() {
                            return this.label + ': ' + this.description;
                        }
                    },
                    {
                        guid: 'interactive-step',
                        action: ACTION_TYPE.STEP_INTERACTIVE,
                        label: LABELS.interactiveStepLabel,
                        description: LABELS.workStepDescription,
                        iconName: 'standard:marketing_actions',
                        iconSize: 'small',
                        iconVariant: 'inverse',
                        get tooltip() {
                            return this.label + ': ' + this.description;
                        }
                    }
                ]
            }
        ]
    };

    override getKeyboardInteractions() {
        return [...super.getKeyboardInteractions(), getTabKeyInteraction(() => this.handleTab())];
    }

    /**
     * Adds StageStep of the type specified by the attributes of the selected element.
     *
     * @param currentTarget the menu option (step) to select/create
     * @param designateFocus used to signify that focus should be directed to the property editor panel
     */
    override doSelectMenuItem(currentTarget: HTMLElement, designateFocus = true) {
        super.doSelectMenuItem(currentTarget);

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            actionType: currentTarget.getAttribute('action')!,
            parent: this.node?.guid,
            designateFocus
        });

        this.dispatchEvent(addItemEvent);
    }

    /**
     * Dispatches a FocusOutEvent event
     *
     * @fires FocusOutEvent
     */
    dispatchFocusOutEvent() {
        this.dispatchEvent(new FocusOutEvent(true));
    }

    /**
     * Handler for the tab key interaction: closes the step menu
     */
    handleTab() {
        this.dispatchFocusOutEvent();
    }

    override handleEscape() {
        this.dispatchFocusOutEvent();
    }

    /**
     * No-op; overrides the super class implementation
     */
    override closeMenu() {}
}
