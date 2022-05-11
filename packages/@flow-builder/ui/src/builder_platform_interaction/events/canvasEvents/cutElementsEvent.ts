interface CutElementsEventDetail {
    guids: UI.Guid[];
    childIndexToKeep?: number | null;
    parentGUID?: UI.Guid;
}

const eventName = 'cutelements';
export class CutElementsEvent extends CustomEvent<CutElementsEventDetail> {
    constructor(guids: UI.Guid[], childIndexToKeep?: number | null, parentGUID?: UI.Guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guids,
                childIndexToKeep,
                parentGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}
