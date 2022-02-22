const eventName = 'formulachanged';

export class FormulaChangedEvent {
    constructor(value: string | null, error: string | null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
