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
 *            collapsedSections A map containing sections that should hide their
 *            children
 * @param {number}
 *            level The tree depth of the given data
 * @param {number}
 *            posinset The position in the current level
 * @param {number}
 *            setsize The size of the current level
 * @returns {Array} List of tree rows
 */
export function createSection(section, collapsedSections, level, posinset, setsize) {
    let rows = [];

    const key = section.guid;
    const expanded = !collapsedSections[key];
    const visibleItems = section._children.length;
    const row = {
        isSection: true,
        key,
        level,
        posinset,
        setsize,
        label: section.label,
        expanded,
        visibleItems
    };
    rows.push(row);

    // Only include child items from expanded sections.
    if (expanded) {
        rows = rows.concat(createLevel(section._children, collapsedSections, level + 1));
    }

    return rows;
}

/**
 * Creates siblings at the given level of the tree.
 *
 * @param {Array}
 *            data The lightning-tree-grid-data
 * @param {Object}
 *            collapsedSections A map containing sections that should hide their
 *            children
 * @param {number}
 *            level The tree depth of the given data
 * @returns {Array} List of tree rows
 */
export function createLevel(data, collapsedSections, level) {
    let rows = [];

    for (let i = 0; i < data.length; i++) {
        if (isSection(data[i])) {
            rows = rows.concat(createSection(data[i], collapsedSections, level, i + 1, data.length));
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
 *            collapsedSections A map containing sections that should hide their
 *            children
 * @returns {Array} List of tree rows
 */
export function flatten(data, collapsedSections) {
    return createLevel(data, collapsedSections, 1);
}
