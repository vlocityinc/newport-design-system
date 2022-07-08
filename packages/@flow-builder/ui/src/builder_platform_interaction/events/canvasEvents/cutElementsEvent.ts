interface CutElementsEventDetail {
    guids: UI.Guid[];
    childIndexToKeep?: number;
}

const eventName = 'cutelements';
export class CutElementsEvent extends CustomEvent<CutElementsEventDetail> {
    constructor(guids: UI.Guid[], childIndexToKeep?: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guids,
                childIndexToKeep
            }
        });
    }

    static EVENT_NAME = eventName;
}
