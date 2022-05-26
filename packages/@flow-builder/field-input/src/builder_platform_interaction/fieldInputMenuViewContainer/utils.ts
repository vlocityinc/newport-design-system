import { LABELS } from './fieldInputMenuViewContainerLabels';

/**
 * Get the view props for the current view
 *
 * @param contextItems - The context items
 * @returns The view props for the current view
 */
export const getViewProps = (contextItems: FieldInput.MenuContextItem[]): FieldInput.MenuViewProps => {
    const lastContextItem = contextItems.at(-1)!;

    if (lastContextItem == null) {
        return getAllViewProps();
    }

    switch (lastContextItem.viewType) {
        case 'ObjectFields':
            return getObjectFieldsViewProps(lastContextItem);
        case 'PicklistValues':
            return getPicklistValuesViewProps(contextItems);
        default:
            return {
                missingViewType: lastContextItem.viewType
            };
    }
};

/**
 * Get the Object Fields view props
 *
 * @param item - The menu item
 * @returns The props for the Object Fields view
 */
function getObjectFieldsViewProps(item: FieldInput.MenuItem): FieldInput.ObjectFieldsViewProps {
    return { isObjectFieldsView: true, objectApiName: item.subtype!, ariaLabel: 'TBD' };
}

/**
 * Get the Picklist Values view props
 *
 * @param contextItems - The context items
 * @returns The props for the Picklist Values view
 */
function getPicklistValuesViewProps(contextItems: FieldInput.MenuContextItem[]): FieldInput.PicklistValuesViewProps {
    const [beforeLastItem, item] = contextItems.slice(-2);

    const objectApiName = beforeLastItem!.subtype;

    const fieldApiName = `${objectApiName}:${item!.name}`;

    // TODO: fix this hardcoded stuff
    const recordTypeId = '012RO00000055zsYAA';

    return {
        isPicklistValuesView: true,
        fieldApiName,
        recordTypeId,
        ariaLabel: 'TBD'
    };
}

/**
 * Get the All view props
 *
 * @returns The props for the All view
 */
function getAllViewProps(): FieldInput.AllViewProps {
    return {
        isAllView: true,
        ariaLabel: LABELS.allResources
    };
}
