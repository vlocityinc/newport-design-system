interface DeleteBranchElementEventDetail {
    selectedElementGUID: UI.Guid[];
    selectedElementType: UI.ElementType;
    childIndexToKeep?: number | null;
    parentGUID?: UI.Guid;
}

const eventName = 'deletebranchelement';
export class DeleteBranchElementEvent extends CustomEvent<DeleteBranchElementEventDetail> {
    constructor(
        selectedElementGUID: UI.Guid[],
        selectedElementType: UI.ElementType,
        childIndexToKeep?: number | null,
        parentGUID?: UI.Guid
    ) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedElementGUID,
                selectedElementType,
                childIndexToKeep,
                parentGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}
