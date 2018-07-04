/**
 * Used to report a update on 'LoopCollection' and 'LoopVariableErrorMessage'
 */
const eventName = 'loopcollectionchanged';


export class LoopCollectionChangedEvent {
    constructor(collectionValue = null, collectionError = null, loopVariableErrorMessage = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                collectionValue,
                collectionError,
                loopVariableErrorMessage
            }
        });
    }

    static EVENT_NAME = eventName;
}