const eventName = 'updatesortoptionitem';

export class UpdateSortOptionItemEvent extends CustomEvent<any> {
    constructor(propertyName, optionIndex = 0, value, error) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName,
                optionIndex,
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
