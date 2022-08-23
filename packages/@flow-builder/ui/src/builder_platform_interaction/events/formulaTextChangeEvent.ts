const eventName = 'formulatextchange';

export class FormulaTextChangeEvent extends CustomEvent<any> {
    constructor(value: string | null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}
