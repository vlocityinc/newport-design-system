import { LightningElement, api } from 'lwc';
import {
    createScreenElementSelectedEvent,
    createScreenElementDeletedEvent,
    createScreenElementKeyboardInteractionEvent
} from 'builder_platform_interaction/events';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    MOVING_CLASS,
    SELECTED_CLASS,
    HOVERING_CLASS,
    DRAGGING_CLASS,
    CONTAINER_DIV_SELECTOR,
    booleanAttributeValue,
    setDragFieldValue,
    CANVAS_SCREEN_GUIDS,
    ScreenCanvasKeyboardInteractions
} from 'builder_platform_interaction/screenEditorUtils';
import * as screenEditorUtils from 'builder_platform_interaction/screenEditorUtils';
import { Keys } from 'builder_platform_interaction/contextualMenuUtils';
const HIGHLIGHT_SELECTOR = '.highlight';

/*
 * Selection frame with a header and support for deleting components
 */
export default class ScreenEditorHighlight extends LightningElement {
    @api screenElement;
    @api property;
    @api preventEvents = false;
    @api displayIcons = false;
    @api draggable = false;
    @api selected = false;
    @api isInKeyboardReorderableMode; // whether this component is being reordered with keyboard

    isKeyboardReorderingStopped = false;
    hovering = false;

    labels = LABELS;

    private isAutomaticScreenField = false;

    renderedCallback() {
        /* reset focus on an element after a move has been started, stopped, completed, or cancelled */
        if (this.isInKeyboardReorderableMode || this.isKeyboardReorderingStopped) {
            /* we need to keep the following in a promise or the focus might not get set properly */
            Promise.resolve().then(() => {
                this.setFocusOnElement();
                if (this.isKeyboardReorderingStopped) {
                    this.isKeyboardReorderingStopped = false;
                }
            });
        }
    }

    get classList() {
        return `highlight slds-is-relative ${booleanAttributeValue(this, 'selected') ? SELECTED_CLASS : ''} ${
            booleanAttributeValue(this, 'hovering') ? HOVERING_CLASS : ''
        } ${booleanAttributeValue(this, 'isInKeyboardReorderableMode') ? MOVING_CLASS : ''}`;
    }

    get tabIndex() {
        if (this.preventEvents) {
            return -1;
        }
        // this is a section, so users should be able to tab into its child components
        return 0;
    }

    get isElementWithVisibilityConditions() {
        return (
            this.screenElement.visibilityRule &&
            this.screenElement.visibilityRule.conditions &&
            this.screenElement.visibilityRule.conditions.length > 0
        );
    }

    get isDraggable() {
        return booleanAttributeValue(this, 'draggable');
    }

    get shouldPreventEvents() {
        return booleanAttributeValue(this, 'preventEvents');
    }

    get shouldDisplayIcons() {
        return booleanAttributeValue(this, 'displayIcons');
    }

    get highlightIcon() {
        return (
            (this.screenElement && this.screenElement.type && this.screenElement.type.icon) || 'utility:connected_apps'
        );
    }

    get ariaLabel() {
        return this.screenElement?.name?.value;
    }

    setFocusOnElement() {
        const elementToFocus = this.template.querySelector(HIGHLIGHT_SELECTOR);
        elementToFocus?.focus();
    }

    connectedCallback() {
        this.isAutomaticScreenField = this.screenElement && screenEditorUtils.isAutomaticField(this.screenElement);
    }

    /**
     * Fires screen element selected event if component not selected
     */
    fireComponentSelectedEvent() {
        if (!this.selected) {
            this.dispatchEvent(createScreenElementSelectedEvent(this.screenElement, this.property));
        }
    }

    /**
     * Fires a keyboard interaction event
     *
     * @param {string} interaction - Type of keyboard intteraction on screen component
     */
    fireKeyboardInteractionEvent(interaction) {
        this.dispatchEvent(createScreenElementKeyboardInteractionEvent(this.screenElement.guid, interaction));
        if (
            interaction === ScreenCanvasKeyboardInteractions.Stop ||
            interaction === ScreenCanvasKeyboardInteractions.Cancel
        ) {
            this.isKeyboardReorderingStopped = true;
        }
    }

    handleSelected = (event) => {
        event.stopPropagation();
        this.fireComponentSelectedEvent();
    };

    handleDelete = (event) => {
        event.stopPropagation();
        this.dispatchEvent(createScreenElementDeletedEvent(this.screenElement, this.property));
    };

    handleMouseOver = (event) => {
        event.stopPropagation();
        this.hovering = true;
    };

    handleMouseOut = (event) => {
        event.stopPropagation();
        this.hovering = false;
    };

    handleDragStart(event) {
        event.stopPropagation();
        this.template.querySelector(CONTAINER_DIV_SELECTOR).classList.add(DRAGGING_CLASS);
        event.dataTransfer.effectAllowed = 'move';
        // Cannot use a different attribute here because only 'text' works in IE
        event.dataTransfer.setData('text', this.screenElement.guid);
        setDragFieldValue(this.screenElement.fieldType);
    }

    handleDragEnd(/* event */) {
        this.template.querySelector(CONTAINER_DIV_SELECTOR).classList.remove(DRAGGING_CLASS);
    }

    handleKeyDown(event) {
        event.stopPropagation();
        if (!this.isInKeyboardReorderableMode) {
            switch (event.key) {
                case Keys.Enter:
                    this.fireComponentSelectedEvent();
                    break;
                case Keys.Space:
                    event.preventDefault();
                    if (
                        this.property !== CANVAS_SCREEN_GUIDS.HEADER_GUID &&
                        this.property !== CANVAS_SCREEN_GUIDS.FOOTER_GUID
                    ) {
                        this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Start);
                    }
                    break;
                case Keys.Backspace:
                case Keys.Delete:
                    this.dispatchEvent(createScreenElementDeletedEvent(this.screenElement, this.property));
                    break;
                default:
                // No special handling for any other keys.
            }
        } else {
            let preventDefaultEvent = true;
            switch (event.key) {
                case Keys.ArrowDown:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Down);
                    break;
                case Keys.ArrowUp:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Up);
                    break;
                case Keys.ArrowLeft:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Left);
                    break;
                case Keys.ArrowRight:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Right);
                    break;
                case Keys.Space:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Stop);
                    break;
                case Keys.Escape:
                    this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Cancel);
                    break;
                default:
                    preventDefaultEvent = false;
            }
            if (preventDefaultEvent) {
                event.preventDefault();
            }
        }
    }

    handleFocus() {
        /* we fire an event when the component is not moving to avoid dispatching the event
            multiple times as we manually put the focus on the component again and again */
        if (
            this.property !== CANVAS_SCREEN_GUIDS.HEADER_GUID &&
            this.property !== CANVAS_SCREEN_GUIDS.FOOTER_GUID &&
            !this.isInKeyboardReorderableMode
        ) {
            // dispatch an event to get the info needed to construct the aria description for this component
            this.fireKeyboardInteractionEvent(ScreenCanvasKeyboardInteractions.Focus);
        }
    }
}
