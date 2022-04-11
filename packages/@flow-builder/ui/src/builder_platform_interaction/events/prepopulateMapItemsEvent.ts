const eventName = 'prepopulatemapitems';

export class PrepopulateMapItemsEvent extends CustomEvent<any> {
    constructor(
        outputObjectType: string,
        outputFields: object,
        currentItemGuid: string | undefined,
        inputObjectType: string,
        inputFields: object
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                outputObjectType,
                outputFields,
                currentItemGuid,
                inputObjectType,
                inputFields
            }
        });
    }

    static EVENT_NAME = eventName;
}
