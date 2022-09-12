const viewDispatchMap = {
    All: { isAllView: true },
    ObjectFields: { isObjectFieldsView: true, objectApiName: 'Account' }, // figure out how to get entityName from $Record
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
    return viewDispatch != null ? { ...view, ...viewDispatch } : { missingViewType: view.type };
};
