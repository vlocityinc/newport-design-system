/**
 * Fired to open the new resource panel.
 */
const eventName = 'addnewresource';

type NewResourceEventDetail = {
    position: null;
    viaLeftPanel: boolean;
    newResourceInfo: UI.NewResourceInfo | null;
};

export class NewResourceEvent extends CustomEvent<NewResourceEventDetail> {
    event: any;
    constructor(
        position = null,
        viaLeftPanel = false,
        newResourceInfo = {
            userProvidedText: null,
            resourceTypes: null,
            dataType: null,
            newResourceTypeLabel: null,
            newResource: null,
            preValidationNeeded: false
        }
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,

            detail: {
                position,
                viaLeftPanel,
                newResourceInfo
            }
        });
    }

    static EVENT_NAME = eventName;
}
