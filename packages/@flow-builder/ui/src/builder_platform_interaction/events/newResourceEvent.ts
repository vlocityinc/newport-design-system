/**
 * Fired to open the new resource panel.
 */
const eventName = 'addnewresource';

type NewResourceInfo = {
    userProvidedText?: string | null;
    resourceTypes?: {} | null;
    dataType?: string | null;
    newResourceTypeLabel?: string | null;
    newResource?: {} | null;
};

type NewResourceEventDetail = {
    position: null;
    viaLeftPanel: boolean;
    newResourceInfo: NewResourceInfo | null;
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
            newResource: null
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
