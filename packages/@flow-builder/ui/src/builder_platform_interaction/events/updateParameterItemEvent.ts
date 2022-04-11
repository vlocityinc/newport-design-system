const eventName = 'updateparameteritem';

type UpdateParameterItemEventDetail = {
    isInput: boolean;
    rowIndex: string | null;
    name: string;
    value: string | null;
    valueDataType: string | null;
    error: string | null;
};

export class UpdateParameterItemEvent extends CustomEvent<UpdateParameterItemEventDetail> {
    constructor(
        isInput: boolean,
        rowIndex: string | null,
        name: string,
        value: string | null = null,
        valueDataType: string | null = null,
        error: string | null = null
    ) {
        super(eventName, {
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
