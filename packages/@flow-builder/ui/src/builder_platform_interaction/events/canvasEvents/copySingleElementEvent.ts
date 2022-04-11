interface CopySingleElementEventDetail {
    elementGuid: UI.Guid;
}

const eventName = 'copysingleelement';
export class CopySingleElementEvent extends CustomEvent<CopySingleElementEventDetail> {
    constructor(elementGuid) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                elementGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
