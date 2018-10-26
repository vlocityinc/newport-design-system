import { LABELS } from './paletteLabels';

/**
 * A section always has a non-empty _children array.
 *
 * @param {Object}
 *            row The data row to analyze
 * @returns {boolean} true if data._children is non-empty
 */
export function isSection(row) {
    return Array.isArray(row._children) && (row._children.length > 0);
}

/**
 * Creates a palette item. These are the elements that have click actions,
 * hovers, drag & drop, etc.
 *
 * @param {Object}
 *            item The lightning-tree-grid data
 * @param {number}
 *            level The tree depth of the given data
 * @param {number}
 *            posinset The position in the current level
 * @param {number}
 *            setsize The size of the current level
 * @returns {Object} A tree row representing a palette item
 */
export function createItem(item, level, posinset, setsize) {
    const key = item.guid;
    const description = item.description ? item.description : '';
    const row = {
        isSection: false,
        key,
        level,
        posinset,
        setsize,
        label: item.label,
        description,
        elementType: item.elementType,
        iconName: item.iconName
    };
    return row;
}

/**
 * Creates an expandable/collapsible palette section. Collapsed sections will
 * not show their children.
 *
 * @param {Object}
 *            section The lightning-tree-grid data
 * @param {Object}
 *            options Object with a map containing sections that should hide
 *            their children and a flag which tells us if we need to display
 *            counts
 * @param {number}
 *            level The tree depth of the given data
 * @param {number}
 *            posinset The position in the current level
 * @param {number}
 *            setsize The size of the current level
 * @returns {Array} List of tree rows
 */
export function createSection(section, options, level, posinset, setsize) {
    let rows = [];

    const key = section.guid;
    const id = section.label;
    const expanded = !options.collapsedSections[id];
    const visibleItems = section._children.length;

    // TODO: Might not be good for i18n.
    const label = options.showSectionItemCount ? section.label + ' (' + visibleItems + ')' : section.label;

    // TODO: Might not be good for i18n.
    const prefix = expanded ? LABELS.palleteSectionToggleCollapseText : LABELS.palleteSectionToggleExpandText;
    const toggleAlternativeText = prefix + ' ' + section.label;

    const row = {
        isSection: true,
        id,
        key,
        level,
        posinset,
        setsize,
        toggleAlternativeText,
        label,
        expanded,
        visibleItems
    };
    rows.push(row);

    // Only include child items from expanded sections.
    if (expanded) {
        rows = rows.concat(createLevel(section._children, options, level + 1));
    }

    return rows;
}

/**
 * Creates siblings at the given level of the tree.
 *
 * @param {Array}
 *            data The lightning-tree-grid-data
 * @param {Object}
 *            options Object with a map containing sections that should hide
 *            their children and a flag which tells us if we need to display
 *            counts
 * @param {number}
 *            level The tree depth of the given data
 * @returns {Array} List of tree rows
 */
export function createLevel(data, options, level) {
    let rows = [];

    for (let i = 0; i < data.length; i++) {
        if (isSection(data[i])) {
            rows = rows.concat(createSection(data[i], options, level, i + 1, data.length));
        } else {
            rows.push(createItem(data[i], level, i + 1, data.length));
        }
    }

    return rows;
}

/**
 * This takes an array in the shape of lightning-tree-grid data and flattens all
 * sections and their children into a one dimensional array. This is useful for
 * generating the markup for a table including the aria level, posinset, and
 * setsize attributes.
 *
 * @param {Array}
 *            data The lightning-tree-grid data
 * @param {Object}
 *            options Object with a map containing sections that should hide
 *            their children and a flag which tells us if we need to display
 *            counts
 * @returns {Array} List of tree rows
 */
export function flatten(data, options) {
    return createLevel(data, options, 1);
}
