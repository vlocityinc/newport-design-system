const eventName = 'dynamictypemappingchange';

export class DynamicTypeMappingChangeEvent extends CustomEvent<any> {
    constructor({ typeName, typeValue, error, rowIndex, isConfigurable }) {
        super(eventName, {
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
