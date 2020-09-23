const eventName = 'clearhighlightedpath';
export class ClearHighlightedPathEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {}
        });
    }

    static EVENT_NAME = eventName;
}
