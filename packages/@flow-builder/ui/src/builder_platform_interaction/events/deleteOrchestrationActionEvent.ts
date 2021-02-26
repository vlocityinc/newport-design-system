import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';

const eventName = 'deleteorchestrationaction';

type DeleteOrchestrationActionEventDetail = {
    guid: UI.Guid;
    actionCategory: ORCHESTRATED_ACTION_CATEGORY;
};

export class DeleteOrchestrationActionEvent extends CustomEvent<DeleteOrchestrationActionEventDetail> {
    constructor(guid, actionCategory) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                guid,
                actionCategory
            }
        });
    }

    static EVENT_NAME = eventName;
}
