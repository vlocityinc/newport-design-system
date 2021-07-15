import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ACTION_TYPE } from 'builder_platform_interaction/flowMetadata';
import Menu from 'builder_platform_interaction/menu';
import { LABELS } from './stageStepMenuLabels';
import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';

/**
 * The add step menu overlay. It is displayed when clicking on the Add Step button.
 */
export default class StageStepMenu extends Menu {
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
                        guid: 'autolaunched-step',
                        action: ACTION_TYPE.STEP_BACKGROUND,
                        label: LABELS.autolaunchedStep,
                        description: LABELS.autolaunchedStepDescription,
                        iconName: 'standard:flow',
                        iconSize: 'small',
                        iconVariant: 'inverse'
                    },
                    {
                        guid: 'work-step',
                        action: ACTION_TYPE.STEP_INTERACTIVE,
                        label: LABELS.workStep,
                        description: LABELS.workStepDescription,
                        iconName: 'standard:marketing_actions',
                        iconSize: 'small',
                        iconVariant: 'inverse'
                    }
                ]
            }
        ]
    };

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
