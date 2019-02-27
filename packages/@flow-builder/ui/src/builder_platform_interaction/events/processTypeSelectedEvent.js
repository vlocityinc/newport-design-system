/**
 * Used to indicate a new item has been selected inside the process types vertical navigation
 */
const eventName = 'processtypeselected';

export class ProcessTypeSelectedEvent {
    constructor(name) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name
            }
        });
    }
    static EVENT_NAME = eventName;
}