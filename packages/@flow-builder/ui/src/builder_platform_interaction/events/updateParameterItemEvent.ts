// @ts-nocheck
const eventName = 'updateparameteritem';

type UpdateParameterItemEventDetail = {
    isInput: boolean;
    rowIndex: string;
    name: string;
    value: string;
    valueDataType: string;
    error: string;
};

export class UpdateParameterItemEvent extends CustomEvent<UpdateParameterItemEventDetail> {
    constructor(
        isInput: boolean,
        rowIndex: string,
        name: string,
        value: string | null = null,
        valueDataType: string | null = null,
        error: string | null = null
    ) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isInput,
                rowIndex,
                name,
                value,
                valueDataType,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
