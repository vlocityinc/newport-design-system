/**
 * Used by components to indicate that a property of the business element they represent
 * has changed
 */
const eventName = 'propertychanged';

type PropertyChangedEventDetail = {
    propertyName: string;
    value;
    error: string | null;
    guid?: string | null;
    oldValue?: string;
    listIndex?: Number;
    dataType?: string | null;
    ignoreValidate?: boolean;
};

type ValueWithError = {
    value: string;
    error: string;
};

type ParameterListRowItem = {
    rowIndex: UI.Guid;
    name: string | ValueWithError;
    value: string | ValueWithError;
    valueDataType: string;
    warnings?: string[];
    // When coming from the api
    dataType?: string;
    subtype?: string;
    isCollection?: boolean;
    maxOccurs?: number;
};

export class PropertyChangedEvent extends CustomEvent<PropertyChangedEventDetail | ParameterListRowItem> {
    constructor(
        propertyName: string,
        value,
        error: string | null = null,
        guid?: string | null,
        oldValue?: string,
        listIndex?: number,
        dataType?: string | null,
        ignoreValidate = false
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName,
                value,
                error,
                guid,
                oldValue,
                listIndex,
                dataType,
                ignoreValidate
            }
        });
    }

    static EVENT_NAME = eventName;
}
