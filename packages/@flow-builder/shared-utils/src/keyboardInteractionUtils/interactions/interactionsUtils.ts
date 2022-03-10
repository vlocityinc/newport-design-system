export enum Direction {
    Up = 'up',
    Down = 'down'
}

/**
 * Finds the next item in a list going up or down
 *
 * @param items - The list items
 * @param currItem - The current item in the list
 * @param direction - The direction to navigate
 * @param shouldWrap - Whether the navigation should wrap
 * @returns the next active element
 */
export function getNextItem<T>(items: T[], currItem: T, direction: Direction, shouldWrap = true): T {
    const currIndex = items.findIndex((item) => item === currItem);
    let nextIndex = direction === Direction.Down ? currIndex + 1 : currIndex - 1;

    // check if wraps and update accordingly
    if (nextIndex >= items.length) {
        nextIndex = shouldWrap ? 0 : currIndex;
    } else if (nextIndex < 0) {
        nextIndex = shouldWrap ? items.length - 1 : currIndex;
    }

    return items[nextIndex];
}
