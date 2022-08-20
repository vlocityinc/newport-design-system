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
    return newCustomEvent<FieldInput.MenuSelectItemEventDetail>('selectitem', { item });
}

/**
 * Creates a new ShowMenuEvent
 *
 * @param show - Whether to show the menu
 * @returns A show menu event
 */
export function newShowMenuEvent(show: boolean) {
    return newCustomEvent<FieldInput.ShowMenuEventDetail>('showmenu', { show });
}
/**
 * The "All" menu context item
 */
export const menuContextItemAll: FieldInput.MenuContextItem = { type: 'All', name: 'All' } as const;
