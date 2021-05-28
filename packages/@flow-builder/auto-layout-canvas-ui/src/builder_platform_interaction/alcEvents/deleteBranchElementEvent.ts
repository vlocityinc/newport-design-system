import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';
interface DeleteBranchElementEventDetail {
    selectedElementGUID: Guid[];
    selectedElementType: string;
    childIndexToKeep?: number | null;
    parentGUID?: Guid;
}

const eventName = 'deletebranchelement';
export class DeleteBranchElementEvent extends CustomEvent<DeleteBranchElementEventDetail> {
    constructor(
        selectedElementGUID: Guid[],
        selectedElementType: string,
        childIndexToKeep?: number | null,
        parentGUID?: Guid
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
