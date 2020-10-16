const eventName = 'inputsnextbehaviorchanged';

export class InputsNextBehaviorChangeEvent {
    constructor(option: 'Remember' | 'Recalculate') {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                option
            }
        });
    }

    static EVENT_NAME = eventName;
}
