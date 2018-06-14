export const SCREEN_EDITOR_EVENT_NAME = {
    SCREEN_FIELD_ADDED: 'addscreenfield',
    SCREEN_ELEMENT_DELETED: 'screenelementdeleted',
    SCREEN_ELEMENT_DESELECTED: 'screenelementdeselected',
    SCREEN_ELEMENT_SELECTED: 'screenelementselected',
    SCREEN_NODE_SELECTED: 'screennodeselected'
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
export function createScreenEditorEvent(type, detail = {}, cancelable = true, composed = true, bubbles = true) {
    const event = new Event(type, {cancelable, composed, bubbles});
    event.detail = detail;
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
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED, {typeName, position});
}

/**
 * Creates an event to be fired when the user clicks the delete button for a screen element in the canvas
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @returns {event} The event
 */
export function createScreenElementDeletedEvent(screenElement, property) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED, {screenElement, property});
}

/**
 * Creates an event to be fired when the user deselects a screen element in the canvas (clicks in an empty space to clear whatever is selected)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @returns {event} The event
 */
export function createScreenElementDeselectedEvent(screenElement) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DESELECTED, {screenElement});
}

/**
 * Creates an event to be fired by the canvas when the user selects a screen element (header, footer or screen field)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @returns {event} The event
 */
export function createScreenElementSelectedEvent(screenElement, property) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, {screenElement, property});
}

/**
 * Creates an event to be fired when the user selects to display the screen property editor in the property editor container (the 'screen' link in the right panel)
 * Includes the screen field being deselected as 'screenElement'
 * @param {object} screenElement - The previously selected element
 * @returns {event} The event
 */
export function createScreenNodeSelectedEvent(screenElement) {
    return createScreenEditorEvent(SCREEN_EDITOR_EVENT_NAME.SCREEN_NODE_SELECTED, {screenElement});
}