// @ts-nocheck
import { ParameterListRowItem } from 'builder_platform_interaction/elementFactory';

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

export class PropertyChangedEvent extends CustomEvent<PropertyChangedEventDetail | ParameterListRowItem> {
    constructor(
        propertyName: string,
        value,
        error: string | null = null,
        guid?: string | null,
        oldValue?: string,
        listIndex?: Number,
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
