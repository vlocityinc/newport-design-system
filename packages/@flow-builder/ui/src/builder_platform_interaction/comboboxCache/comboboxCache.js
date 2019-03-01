import { mutateFlowResourceToComboboxShape } from "builder_platform_interaction/expressionUtils";
import { apexVariablesSelector } from "builder_platform_interaction/selectors";
import { Store } from 'builder_platform_interaction/storeLib';

/**
 * Caches which are the same across all comboboxes
 */

const parentElementCache = {};
let apexClassesCached = false;

/**
 * Add a parent element in combobox shape to the cache
 * @param {String} key the devName/displayText of the menu item
 * @param {MenuItem} value the parent element in combobox shape
 */
export const addToParentElementCache = (key, value) => {
    if (value && value.hasNext) {
        parentElementCache[key] = value;
    } else {
        throw Error(`hasNext must be true for items in this cache!`);
    }
};

/**
 * Search the cache for an element with the given devName/displayText
 * @param {String} key the devName/displayText of the menu item
 * @returns {MenuItem} the parent element in combobox shape. Undefined if no item found
 */
export const getElementFromParentElementCache = (key) => {
    if (!parentElementCache[key] && !apexClassesCached) {
        apexVariablesSelector(Store.getStore().getCurrentState()).forEach(el => {
            const menuItem = mutateFlowResourceToComboboxShape(el);
            parentElementCache[menuItem.displayText] = menuItem;
        });
        apexClassesCached = true;
    }
    return parentElementCache[key];
};