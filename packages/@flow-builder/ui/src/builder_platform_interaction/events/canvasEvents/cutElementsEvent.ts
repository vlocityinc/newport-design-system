interface CutElementsEventDetail {
    guids: UI.Guid[];
    childIndexToKeep?: number | null;
}

const eventName = 'cutelements';
export class CutElementsEvent extends CustomEvent<CutElementsEventDetail> {
    constructor(guids: UI.Guid[], childIndexToKeep?: number | null) {
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
