/**
 * Used by fixed layout canvas to support selection mode.
 */

import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'alcselection';

interface AlcSelectionEventDetail {
    canvasElementGuidsToSelect: Guid[];
    canvasElementGuidsToDeselect: Guid[];
    selectableGuids: Guid[];
    topSelectedGuid: Guid | null;
    allowAllDisabledElements: boolean;
}
export class AlcSelectionEvent extends CustomEvent<AlcSelectionEventDetail> {
    constructor(
        canvasElementGuidsToSelect: Guid[],
        canvasElementGuidsToDeselect: Guid[],
        selectableGuids: Guid[],
        topSelectedGuid: Guid | null,
        allowAllDisabledElements = false
    ) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                topSelectedGuid,
                allowAllDisabledElements
            }
        });
    }
}
