const eventName = 'updatetestassertion';

type UpdateTestAssertionEventDetail = {
    index: number;
    isExpressionChanged: boolean;
    isMessageChanged: boolean;
    expression?: any;
    message?: string;
};

export class UpdateTestAssertionEvent extends CustomEvent<UpdateTestAssertionEventDetail> {
    constructor(index: number, isExpressionChanged: boolean, isMessageChanged: boolean, expression?, message?) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index,
                expression,
                isExpressionChanged,
                message,
                isMessageChanged
            }
        });
    }

    static EVENT_NAME = eventName;
}
