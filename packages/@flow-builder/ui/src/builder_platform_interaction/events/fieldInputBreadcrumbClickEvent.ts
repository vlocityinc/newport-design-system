type FieldInputBreadcrumbClickEventDetail = {
    // index of the current breadcrumb clicked (0 based)
    index: number;
};

/**
 * Custom event dispatched on field input breadcrumb click
 */
export class FieldInputBreadcrumbClickEvent extends CustomEvent<FieldInputBreadcrumbClickEventDetail> {
    constructor(index: number) {
        super(FieldInputBreadcrumbClickEvent.EVENT_NAME, {
            bubbles: true,
            composed: true,
            detail: {
                index
            }
        });
    }
    static EVENT_NAME = 'fieldinputbreadcrumbclick';
}
