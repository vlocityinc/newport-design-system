/**
 * A set of utility functions to manipulate combobox menu data, which could be grouped, as if the menu was flat, with
 * all menu levels expanded to form one flat list.
 * The functions accept indexes and sizes of a flattened menu and apply them to the grouped menu.
 * The functions include extraction of a subset of items from a menu, menu length calculation and a swap
 * of one item with another.
 */

/**
 * Creates a menu subset, which includes menu items from the start up to the specified size. The function counts menu items as
 * if the menu was flat.
 * @param menuData - menu data to create a subset of
 * @param {number} size - number of items to include in the menu subset
 * @return {{menu: array, length: number}} - menu subset and its actual length
 */
export function sliceMenu(menuData, size) {
    const result = [];
    let counter = 0;
    if (!Array.isArray(menuData) || !menuData || !size || size <= 0) {
        return {
            menu: [],
            length: 0
        };
    }
    // Iterate over the first level of menu items, until the required size is reached
    for (const item of menuData) {
        // If a menu item has a submenu, then iterate over it
        if (item.items) {
            const itemCopy = Object.assign({}, item);
            itemCopy.items = [];
            result.push(itemCopy);
            counter++;
            if (size <= counter) {
                break;
            }

            for (const subitem of item.items) {
                itemCopy.items.push(subitem);
                counter++;
                if (size <= counter) {
                    break;
                }
            }
        } else {
            result.push(item);
            counter++;
        }

        if (size <= counter) {
            break;
        }
    }
    return {
        menu: result,
        length: counter
    };
}

/**
 * Computes a length of a grouped menu as if it was flat.
 * @param {Array} - grouped or flat menu
 * @returns {number} - flattened menu length
 */
export function getMenuLength(menu) {
    return menu && typeof menu.filter === 'function'
        ? menu
              .filter(item => !!item.items)
              .reduce((length, item) => length + item.items.length, menu.length)
        : 0;
}

/**
 * Replaces one menu item with another in a multi-level menu list. An index of an item to be replaced is specified for
 * a flattened menu, where all menu levels are expanded to form one flat list.
 * @param {Array} menu - grouped or flat menu.
 * @param {number} index - flat index
 * @param {function} callback - a function to get a new item to replace the item at the index.
 */
export function setSelectableMenuItem(menu, index, callback) {
    const result = findMenuItemContainer(menu, index);
    if (result) {
        const { container, containerIndex } = result;
        container[containerIndex] = callback(container[containerIndex]);
    }
}

/**
 * Finds a container and an index in the container of a selectable menu item, which is the closest to a menu item at a specified flat index.
 * @param {Arrray} menu - grouped or flat menu
 * @param (number} index - index of a target menu item in a flattened menu
 * @returns {{ container: array, containerIndex: number }}
 */
function findMenuItemContainer(menu, index) {
    let counter = 0;
    for (let i = 0; i < menu.length; i++) {
        const item = menu[i];
        if (counter === index) {
            return findSelectableMenuItem(menu, i);
        }

        counter++;

        if (item.items) {
            const subitem = findMenuItemContainer(item.items, index - counter);
            if (subitem) {
                const { container, containerIndex } = subitem;
                let result = findSelectableMenuItem(container, containerIndex);
                if (!result) {
                    result = findSelectableMenuItem(menu, i);
                    if (!result) {
                        result = subitem;
                    }
                }
                return result;
            }
            counter += item.items.length;
        }
    }
    return undefined;
}

/**
 * Finds a menu item that is selectable, starting from the specified index, first traversing down the menu list
 * and then up, if no selectable item is found below the starting index.
 */
function findSelectableMenuItem(menu, index) {
    let result = findNextSelectableMenuItem(menu, index);
    if (!result) {
        result = findPrevSelectableMenuItem(menu, index - 1);
    }
    return result;
}

function findNextSelectableMenuItem(menu, start = 0) {
    for (let i = start; i < menu.length; i++) {
        const item = menu[i];
        if (isSelectable(item)) {
            return {
                container: menu,
                containerIndex: i
            };
        }
        if (item.items) {
            const result = findNextSelectableMenuItem(item.items);
            if (result) {
                return result;
            }
        }
    }
    return undefined;
}

function findPrevSelectableMenuItem(menu, end) {
    if (!end) {
        end = menu.length - 1;
    }
    for (let i = end; i >= 0 && i < menu.length; i--) {
        const item = menu[i];
        if (item.items) {
            const result = findPrevSelectableMenuItem(item.items);
            if (result) {
                return result;
            }
        }

        if (isSelectable(item)) {
            return {
                container: menu,
                containerIndex: i
            };
        }
    }
    return undefined;
}

function isSelectable(item) {
    // CC from https://git.soma.salesforce.com/aura/lightning-global/blob/0144983925257245fc98bf061ddfa95873127678/ui-lightning-components/src/main/modules/lightning/baseCombobox/baseCombobox.js#L344-L345
    return item && ['option-card', 'option-inline'].indexOf(item.type) >= 0;
}
