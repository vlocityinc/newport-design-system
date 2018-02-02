/**
 * Add an item to an array and return a new array. It is shallow copy of the array.
 * @param {Array} arr array to be modified
 * @param {Object} newItem item to be added in the array
 * @return {Array} new array with updated item
 */
export function addItem(arr, newItem) {
    if (newItem) {
        arr = [...arr, newItem];
    }
    return arr;
}

/**
 * insert an item at the specific location in an array and return a new array. It is shallow copy of the array.
 * @param {Array} arr array to be modified
 * @param {Object} newItem item to be added in the array
 * @param {Number} itemAt where new item needs to be inserted
 * @return {Array} new array with updated item
 */
export function insertItem(arr, newItem, itemAt) {
    if (newItem && itemAt !== undefined && itemAt >= 0 && itemAt <= arr.length) {
        arr = [...arr.slice(0, itemAt), newItem, ...arr.slice(itemAt)];
    }
    return arr;
}

/**
 * Delete an item at the specified location and return a new array. It is shallow copy of a new array.
 * @param {Array} arr array to be modified
 * @param {Number} itemAt of item to be deleted
 * @return {Array} new updated array
 */
export function deleteItem(arr, itemAt) {
    if (itemAt !== undefined && itemAt >= 0 && itemAt <= arr.length) {
        arr = [...arr.slice(0, itemAt), ...arr.slice(itemAt + 1)];
    }
    return arr;
}
