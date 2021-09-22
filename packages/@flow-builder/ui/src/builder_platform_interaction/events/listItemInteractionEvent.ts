import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'listiteminteraction';

enum ListItemInteractionType {
    Select,
    Click,
    Blur
}

interface ListItemInteractionEventDetail {
    itemId: Guid;
    interactionType: ListItemInteractionType;
}

export class ListItemInteractionEvent extends CustomEvent<ListItemInteractionEventDetail> {
    constructor(itemId: Guid, interactionType: ListItemInteractionType) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                itemId,
                interactionType
            }
        });
    }

    static EVENT_NAME = eventName;
    static Type = ListItemInteractionType;
}
