const eventName = 'updatesortcollectionoutput';

export class UpdateSortCollectionOutputEvent {
    constructor(selectedOutput: string | null, limit: number | null, error: string | null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                selectedOutput,
                limit,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
