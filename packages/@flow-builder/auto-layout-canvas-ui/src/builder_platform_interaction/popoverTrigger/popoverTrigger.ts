import { api, LightningElement } from 'lwc';
import { dispatchPrivateItemRegister } from 'builder_platform_interaction/alcComponentsUtils';
import { PopoverTriggerEvent } from 'builder_platform_interaction/alcEvents';

/**
 * Default PopoverTrigger implementation
 */
export default class PopoverTrigger extends LightningElement {
    // the label info for the trigger
    @api
    labelInfo;

    // the icon info for the trigger
    @api
    iconInfo;

    // ie, if the menu is opened
    @api
    isTriggered = false;

    /**
     * Moves focus to the trigger button
     */
    @api
    focus = () => {
        this.template.querySelector('button').focus();
    };

    get iconName() {
        const { open, close } = this.iconInfo;
        return this.isTriggered ? open : close;
    }

    get buttonLabel() {
        const { open, close } = this.labelInfo;
        return this.isTriggered ? open : close;
    }

    connectedCallback() {
        // registers the trigger instance with its popover parent
        dispatchPrivateItemRegister(this);
    }

    /**
     * Dispatches a PopoverTriggerEvent when triggered
     *
     * @param e - A triggering event
     * @event PopoverTriggerEvent when the trigger is activated
     */
    handleClick(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(new PopoverTriggerEvent());
    }
}
