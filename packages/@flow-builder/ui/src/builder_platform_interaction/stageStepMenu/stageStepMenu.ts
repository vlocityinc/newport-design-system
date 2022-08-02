import { getTabKeyInteraction } from 'builder_platform_interaction/alcComponentsUtils';
import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE, FLOW_ELEMENT_SUBTYPE } from 'builder_platform_interaction/flowMetadata';
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
    menuConfiguration;

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

        const elementSubtype = currentTarget.getAttribute('element-subtype')!;
        const actionType =
            elementSubtype === FLOW_ELEMENT_SUBTYPE.InteractiveStep
                ? ACTION_TYPE.STEP_INTERACTIVE
                : elementSubtype === FLOW_ELEMENT_SUBTYPE.BackgroundStep
                ? ACTION_TYPE.STEP_BACKGROUND
                : undefined;

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype,
            actionType,
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

    connectedCallback(): void {
        super.connectedCallback();

        if (this.menuConfiguration === undefined) {
            const sortedStepSubtypeKeys = Object.keys(elementTypeToConfigMap)
                .filter((key) => {
                    const config = elementTypeToConfigMap[key];
                    const isStepSubtype = config.isElementSubtype && config.elementType === ELEMENT_TYPE.STAGE_STEP;
                    return isStepSubtype;
                })
                .sort();

            const menuItems = sortedStepSubtypeKeys.map((key) => {
                const { labels, nodeConfig, elementSubtype } = elementTypeToConfigMap[key];
                const { singular } = labels!;
                const { description, iconName, iconBackgroundColor } = nodeConfig!;
                const iconClasses = `slds-float_left slds-m-right_small ${iconBackgroundColor}`;

                return {
                    elementSubtype,
                    iconClasses,
                    label: singular,
                    description,
                    iconName,
                    iconSize: 'small',
                    iconVariant: 'inverse',
                    get tooltip() {
                        return `${singular}: ${description}`;
                    }
                };
            });

            this.menuConfiguration = {
                sections: [
                    {
                        guid: 'steps',
                        header: LABELS.steps,
                        items: menuItems
                    }
                ]
            };
        }
    }
}
