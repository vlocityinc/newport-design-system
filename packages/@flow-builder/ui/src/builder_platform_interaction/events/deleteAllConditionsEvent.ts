const eventName = 'deleteallconditions';

type DeleteAllConditionsEventDetail = {
    parentGUID: UI.Guid;
};

export class DeleteAllConditionsEvent extends CustomEvent<DeleteAllConditionsEventDetail> {
    constructor(parentGUID) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}
