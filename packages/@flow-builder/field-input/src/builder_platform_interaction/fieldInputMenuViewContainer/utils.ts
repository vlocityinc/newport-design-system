const viewDispatchMap = {
    All: { isAllView: true },
    ObjectFields: { isObjectFieldsView: true },
    PicklistValues: { isPicklistValuesView: true },
    Mock: { isMockView: true }
} as const;

/**
 * Augments a MenuItemView with a `isXX` dispatch property
 *
 * @param view - The menu item view
 * @returns The augmented menu item view
 */
export const getViewProps = (view: FieldInput.MenuItemView) => {
    const viewDispatch = viewDispatchMap[view.type];
    const viewObj = { ...view, ...viewDispatch };
    switch (view.type) {
        case 'All':
        case 'PicklistValues':
            return viewObj;
        case 'ObjectFields':
            return { ...viewObj, objectApiName: 'Account' }; // figure out how to get entityName from $Record
        default:
            return {
                missingViewType: view.type
            };
    }
};
