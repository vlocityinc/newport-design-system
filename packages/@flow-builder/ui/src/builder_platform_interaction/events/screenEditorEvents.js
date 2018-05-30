export const screenEventNames = {
    screenElementDeletedEvent: 'screenelementdeleted',
    screenElementDeselectedEvent: 'screenelementdeselected',
    screenElementSelectedEvent: 'screenelementselected',
    screenNodeSelectedEvent: 'screennodeselected'
};


/**
 * Parent class of all screen editor events
 */
class ScreenEditorEvent extends CustomEvent {
    constructor(eventName, detail = {}, cancelable = true, composed = true, bubbles = true) {
        super(eventName, {cancelable, composed, bubbles, detail});

        this.eventName = eventName;
        for (const key in detail) {
            if (detail.hasOwnProperty(key)) {
                Object.defineProperty(this, key, {
                    get() {
                        return detail[key];
                    },
                    set() {
                        throw new Error('Event properties are read-only');
                    }
                });
            }
        }
    }
}

/**
 * Fired when the user clicks the delete button for a screen element in the canvas
 */
export class ScreenElementDeletedEvent extends ScreenEditorEvent {
    constructor(screenElement, property) {
        super(screenEventNames.screenElementDeletedEvent, {screenElement, property});
    }
}

/**
 * Fired when the user deselects a screen element in the canvas (clicks in an empty space to clear whatever is selected)
 */
export class ScreenElementDeselectedEvent extends ScreenEditorEvent {
    constructor(screenElement) {
        super(screenEventNames.screenElementDeselectedEvent, {screenElement});
    }
}

/**
 * Fired by the canvas when the user selects a screen element (header, footer or screen field)
 */
export class ScreenElementSelectedEvent extends ScreenEditorEvent {
    constructor(screenElement, property) {
        super(screenEventNames.screenElementSelectedEvent, {screenElement, property});
    }
}

/**
 * Fired when the user selects to display the screen property editor in the property editor container (the 'screen' link in the right panel)
 * Includes the screen field being deselected as 'screenElement'
 */
export class ScreenNodeSelectedEvent extends ScreenEditorEvent {
    constructor(screenElement) {
        super(screenEventNames.screenNodeSelectedEvent, {screenElement});
    }
}
