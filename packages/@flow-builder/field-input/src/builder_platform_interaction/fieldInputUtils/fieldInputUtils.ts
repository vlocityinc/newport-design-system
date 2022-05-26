/**
 * @param viewType - The view type
 * @returns true if there is a next view for the view type
 */
export function hasNext(viewType: FieldInput.MenuItemViewType): boolean {
    return viewType !== 'None' && viewType !== 'MenuItemViewTypeTbd';
}

// TODO: look into this:
//   menuItem.hasNext =
//         (!shouldDisableHasNext(dataType, traversalConfig) && supportsTraversalOfElement(resource)) ||
//         (isComplexType(dataType) && !resource.isCollection);

export * from './fieldInputMenuDataGenerator';
export * from './fieldInputMenuDataRetrieval';
