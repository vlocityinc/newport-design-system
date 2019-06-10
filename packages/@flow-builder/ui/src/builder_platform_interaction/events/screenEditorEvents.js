export const SCREEN_EDITOR_EVENT_NAME = {
    SCREEN_FIELD_ADDED: 'addscreenfield',
    SCREEN_ELEMENT_DELETED: 'screenelementdeleted',
    SCREEN_ELEMENT_DESELECTED: 'screenelementdeselected',
    SCREEN_ELEMENT_SELECTED: 'screenelementselected',
    SCREEN_NODE_SELECTED: 'screennodeselected',
    CHOICE_ADDED: 'choiceadded',
    CHOICE_CHANGED: 'choicechanged',
    CHOICE_DELETED: 'choicedeleted'
};

/**
 * Factory function for screen events
 * @param {string} type - The type of the event
 * @param {object} detail - The detail of the event
 * @param {boolean} cancelable - Should the event be cancelable
 * @param {boolean} composed - Should the event propagate across the shadow DOM boundary
 * @param {boolean} bubbles - Should the event bubble up
 * @returns {event} The event
 */
export function createScreenEditorEvent(
    type,
    detail = {},
    cancelable = true,
    composed = true,
    bubbles = true
) {
    const event = new CustomEvent(type, {
        detail,
        cancelable,
        composed,
        bubbles
    });

    // Adds shortcuts for keys inside event.detail, so they can be accessed as event.x instead
    // of event.detail.x.
    for (const key in detail) {
        if (detail.hasOwnProperty(key)) {
            Object.defineProperty(event, key, {
                get() {
                    return detail[key];
                },
                set() {
                    throw new Error('Event properties are read-only');
                }
            });
        }
    }
    return event;
}

/**
 * Creates an event to be fired when the user adds an element to the canvas
 * @param {string} typeName - The type of the field to add
 * @param {number} position - The position in the canvas
 * @returns {event} The event
 */
export function createAddScreenFieldEvent(typeName, position) {
    return createScreenEditorEvent(
        SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED,
        { typeName, position }
    );
}

/**
 * Creates an event to be fired when the user clicks the delete button for a screen element in the canvas
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @returns {event} The event
 */
export function createScreenElementDeletedEvent(screenElement, property) {
    return createScreenEditorEvent(
        SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED,
        { screenElement, property }
    );
}

/**
 * Creates an event to be fired when the user deselects a screen element in the canvas (clicks in an empty space to clear whatever is selected)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @returns {event} The event
 */
export function createScreenElementDeselectedEvent(screenElement) {
    return createScreenEditorEvent(
        SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DESELECTED,
        { screenElement }
    );
}

/**
 * Creates an event to be fired by the canvas when the user selects a screen element (header, footer or screen field)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @returns {event} The event
 */
export function createScreenElementSelectedEvent(screenElement, property) {
    return createScreenEditorEvent(
        SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED,
        { screenElement, property }
    );
}

/**
 * Creates an event to be fired when the user selects to display the screen property editor in the property editor container (the 'screen' link in the right panel)
 * Includes the screen field being deselected as 'screenElement'
 * @param {object} screenElement - The previously selected element
 * @returns {event} The event
 */
export function createScreenNodeSelectedEvent(screenElement) {
    return createScreenEditorEvent(
        SCREEN_EDITOR_EVENT_NAME.SCREEN_NODE_SELECTED,
        { screenElement }
    );
}

/**
 * Creates an event to be fired when the user wants to add a choice to a choice screen field.
 * @param {object} screenElement - The screen field to add the choice to.
 * @param {number} position - The position at which the choice should be added.
 */
export function createChoiceAddedEvent(screenElement, position) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.CHOICE_ADDED, {
        screenElement,
        position
    });
}

/**
 * Creates an event to be fired when the user wants to change a choice of a choice creen field.
 * @param {*} screenElement
 * @param {*} newValue
 * @param {*} position
 */
export function createChoiceChangedEvent(screenElement, newValue, position) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED, {
        screenElement,
        newValue,
        position
    });
}

/**
 * Creates an event to be fired when the user wants to delete a choice from a choice screen field.
 * @param {*} screenElement
 * @param {*} position
 */
export function createChoiceDeletedEvent(screenElement, position) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.CHOICE_DELETED, {
        screenElement,
        position
    });
}
