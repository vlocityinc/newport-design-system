import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ACTION_TYPE } from 'builder_platform_interaction/flowMetadata';
import Menu from 'builder_platform_interaction/menu';
import { LABELS } from './stageStepMenuLabels';
import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { KeyboardInteractions } = keyboardInteractionUtils;

/**
 * The add step menu overlay. It is displayed when clicking on the Add Step button.
 */
export default class StageStepMenu extends Menu {
    labels = LABELS;

    @api
    node;

    // Used for testing purposes
    @api
    keyboardInteractions;

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
                        iconVariant: 'inverse'
                    },
                    {
                        guid: 'interactive-step',
                        action: ACTION_TYPE.STEP_INTERACTIVE,
                        label: LABELS.interactiveStepLabel,
                        description: LABELS.workStepDescription,
                        iconName: 'standard:marketing_actions',
                        iconSize: 'small',
                        iconVariant: 'inverse'
                    }
                ]
            }
        ]
    };

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    /**
     * Adds StageStep of the type specified by the attributes of the selected element.
     *
     * @param currentTarget
     * @param designateFocus
     */
    doSelectMenuItem(currentTarget: HTMLElement, designateFocus = false) {
        super.doSelectMenuItem(currentTarget);

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            actionType: currentTarget.getAttribute('action')!,
            parent: this.node && this.node.guid,
            designateFocus
        });

        this.dispatchEvent(addItemEvent);
    }

    handleTabCommand() {
        this.dispatchEvent(new FocusOutEvent(true));
    }
}
