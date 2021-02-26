export enum ScreenEditorEventName {
    AutomaticScreenFieldAdded = 'addautomaticscreenfield',
    ScreenFieldAdded = 'addscreenfield',
    ScreenElementDeleted = 'screenelementdeleted',
    ScreenElementMoved = 'screenelementmoved',
    ScreenElementDeselected = 'screenelementdeselected',
    ScreenElementSelected = 'screenelementselected',
    ScreenNodeSelected = 'screennodeselected',
    ChoiceAdded = 'choiceadded',
    ChoiceChanged = 'choicechanged',
    ChoiceDisplayChanged = 'choicedisplaychanged',
    ChoiceDeleted = 'choicedeleted',
    ColumnWidthChanged = 'columnwidthchanged',
    ChoiceReset = 'choicereset'
}

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
 * @param {string} parentGuid - The guid of the new field's parent, i.e. a column
 * @returns {event} The event
 */
export function createAddScreenFieldEvent(typeName: string, position?: number, parentGuid?: string) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenFieldAdded, {
        typeName,
        position,
        parentGuid
    });
}

/**
 * Creates an event to be fired when the user adds an automatic field to the canvas
 * @param {string} typeName - The type of the field to add
 * @param {number} position - The position in the canvas
 * @param {string} parentGuid - The guid of the new field's parent, i.e. a column
 * @returns {event} The event
 */
export function createAddAutomaticScreenFieldEvent(
    typeName: string,
    objectFieldReference: string,
    position?: number,
    parentGuid?: string
) {
    return createScreenEditorEvent(ScreenEditorEventName.AutomaticScreenFieldAdded, {
        typeName,
        objectFieldReference,
        position,
        parentGuid
    });
}

/**
 * Creates an event to be fired when the user clicks the delete button for a screen element in the canvas
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @param {string} parentGuid - The guid of the deleted field's parent, i.e. a column
 * @param {function} callback - Function called after the delete occurs successfully
 * @returns {event} The event
 */
export function createScreenElementDeletedEvent(screenElement, property, parentGuid = null, callback = () => {}) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenElementDeleted, {
        screenElement,
        property,
        parentGuid,
        callback
    });
}

/**
 * Creates an event to be fired when the user drags and drops a screen element from one location in the canvas to another
 * @param {string} sourceGuid - The guid of the screen element being moved
 * @param {string} destinationParentGuid - The guid of the screen element to which the source element is being moved
 * @param {number} destinationIndex - The position at which the source element should be inserted within the parent
 * @returns {event} The event
 */
export function createScreenElementMovedEvent(sourceGuid, destinationParentGuid, destinationIndex) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenElementMoved, {
        sourceGuid,
        destinationParentGuid,
        destinationIndex
    });
}

/**
 * Creates an event to be fired when the user deselects a screen element in the canvas (clicks in an empty space to clear whatever is selected)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @returns {event} The event
 */
export function createScreenElementDeselectedEvent(screenElement) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenElementDeselected, { screenElement });
}

/**
 * Creates an event to be fired by the canvas when the user selects a screen element (header, footer or screen field)
 * @param {object} screenElement - The screen element, either a screen or a screen field
 * @param {string} property - Applies only for when screenElement is a SCREEN, and it marks the property to toggle (showHeader or showFooter)
 * @returns {event} The event
 */
export function createScreenElementSelectedEvent(screenElement, property) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenElementSelected, { screenElement, property });
}

/**
 * Creates an event to be fired when the user selects to display the screen property editor in the property editor container (the 'screen' link in the right panel)
 * Includes the screen field being deselected as 'screenElement'
 * @param {object} screenElement - The previously selected element
 * @returns {event} The event
 */
export function createScreenNodeSelectedEvent(screenElement) {
    return createScreenEditorEvent(ScreenEditorEventName.ScreenNodeSelected, { screenElement });
}

/**
 * Creates an event to be fired when the user wants to add a choice to a choice screen field.
 * @param {object} screenElement - The screen field to add the choice to.
 * @param {number} position - The position at which the choice should be added.
 */
export function createChoiceAddedEvent(screenElement, position) {
    return createScreenEditorEvent(ScreenEditorEventName.ChoiceAdded, {
        screenElement,
        position
    });
}

/**
 * Creates an event to be fired when the user wants to change a choice of a choice screen field.
 * @param {*} screenElement
 * @param {*} newValue
 * @param {*} position
 */
export function createChoiceChangedEvent(screenElement, newValue, position) {
    return createScreenEditorEvent(ScreenEditorEventName.ChoiceChanged, {
        screenElement,
        newValue,
        position
    });
}

/**
 * Creates an event to be fired when the user wants to change display type of a choice screen field.
 * @param {*} screenElement - The choice screen field to change display type of
 * @param {*} newDisplayType - New display type to which display of choice screen field should change to
 */
export function createChoiceDisplayChangedEvent(screenElement, newDisplayType) {
    return createScreenEditorEvent(ScreenEditorEventName.ChoiceDisplayChanged, {
        screenElement,
        newDisplayType
    });
}

/**
 * Creates an event to be fired when the user wants to delete a choice from a choice screen field.
 * @param {*} screenElement
 * @param {*} position
 */
export function createChoiceDeletedEvent(screenElement, position) {
    return createScreenEditorEvent(ScreenEditorEventName.ChoiceDeleted, {
        screenElement,
        position
    });
}

/**
 * Creates an event to be fired when the user wants to change the width of a column.
 * @param {string} columnGuid - The guid of the column whose width is changing
 * @param {number} columnWidth - The column's new width
 * @param {string} sectionGuid - The guid of the column's parent section
 */
export function createColumnWidthChangedEvent(columnGuid, columnWidth, sectionGuid) {
    return createScreenEditorEvent(ScreenEditorEventName.ColumnWidthChanged, {
        columnGuid,
        columnWidth,
        sectionGuid
    });
}
