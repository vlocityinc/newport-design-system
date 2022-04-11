const eventName = 'updatesortcollectionoutput';

export class UpdateSortCollectionOutputEvent extends CustomEvent<any> {
    constructor(selectedOutput: string | null, limit: number | null, error: string | null) {
        super(eventName, {
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
