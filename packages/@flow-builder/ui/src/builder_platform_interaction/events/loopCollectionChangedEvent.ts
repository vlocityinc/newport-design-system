/**
 * Used to report a update on 'LoopCollection' and 'LoopVariableErrorMessage'
 */
const eventName = 'loopcollectionchanged';

export class LoopCollectionChangedEvent extends CustomEvent<any> {
    constructor(
        collectionValue = null,
        collectionError = null,
        loopVariableValue = null,
        loopVariableErrorMessage = null
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                collectionValue,
                collectionError,
                loopVariableValue,
                loopVariableErrorMessage
            }
        });
    }

    static EVENT_NAME = eventName;
}
