// @ts-nocheck
const eventName = 'dynamictypemappingchange';

export class DynamicTypeMappingChangeEvent {
    constructor({ typeName, typeValue, error, rowIndex, isConfigurable }) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                typeName,
                typeValue,
                error,
                rowIndex,
                isConfigurable
            }
        });
    }

    static EVENT_NAME = eventName;
}
