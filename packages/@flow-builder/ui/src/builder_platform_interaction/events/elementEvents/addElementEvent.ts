import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Used to open an empty property editor for the given element type
 */
const eventName = 'addelement';
interface AddElementEventDetail {
    elementType: string;
    elementSubtype?: string;
    locationX?: number;
    locationY?: number;
    actionType?: string;
    actionName?: string;
    parent?: string;
    // connection source information for the alc when adding an element
    alcConnectionSource?: ConnectionSource;
    // used to designate focus to the property editor
    designateFocus?: boolean;
    flowName?: string;
}
export class AddElementEvent extends CustomEvent<AddElementEventDetail> {
    constructor(detail: AddElementEventDetail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
