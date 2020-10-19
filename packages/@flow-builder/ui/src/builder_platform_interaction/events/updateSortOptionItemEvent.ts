const eventName = 'updatesortoptionitem';

export class UpdateSortOptionItemEvent {
    constructor(propertyName, optionIndex = 0, value, error) {
        return new CustomEvent(eventName, {
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
