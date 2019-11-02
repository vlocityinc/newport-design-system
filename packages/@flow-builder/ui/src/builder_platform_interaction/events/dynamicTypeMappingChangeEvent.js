const eventName = 'dynamictypemappingchange';

export class DynamicTypeMappingChangeEvent {
    constructor({typeName, typeValue, error, rowIndex}) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                typeName,
                typeValue,
                error,
                rowIndex
            }
        });
    }

    static EVENT_NAME = eventName;
}
