import { newCustomEvent } from 'builder_platform_interaction/events';

// TODO: look into this:
//   menuItem.hasNext =
//         (!shouldDisableHasNext(dataType, traversalConfig) && supportsTraversalOfElement(resource)) ||
//         (isComplexType(dataType) && !resource.isCollection);

export * from './fieldInputMenuDataGenerator';
export * from './fieldInputMenuDataRetrieval';

/**
 * Creates a new MenuSelectItemEvent
 *
 * @param item - A menu item
 * @returns A new MenuSelectItemEvent
 */
export function newMenuSelectItemEvent(item: FieldInput.MenuItem) {
    return newCustomEvent<FieldInput.MenuSelectItemEventDetail>('fieldinputmenuselectitem', { item });
}

/**
 * The "All" menu context item
 */
export const menuContextItemAll: FieldInput.MenuContextItem = { type: 'All' } as const;
