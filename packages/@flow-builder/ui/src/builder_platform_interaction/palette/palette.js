import { Element, api, track } from 'engine';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */
export default class Palette extends Element {
    @api
    get data() {
        return this.rows;
    }

    @api
    set data(value) {
        this.original = value;
        this.init(value);
    }

    @track rows = [];

    original = [];
    collapsedSections = {};
    itemMap = {};

    /**
     * Sets up the internal state used to render the tree.
     *
     * @param {Array}
     *            data The lightning-tree-grid data
     */
    init(data) {
        const rows = this.flatten(data);
        this.rows = rows;
        this.itemMap = this.createItemMap(rows);
    }

    /**
     * This takes an array in the shape of lightning-tree-grid data and flattens
     * all sections and their children into a one dimensional array. This is
     * useful for generating the markup for a table including the aria level,
     * posinset, and setsize attributes.
     *
     * @param {Array}
     *            data The lightning-tree-grid data
     * @returns {Array} List of tree rows
     */
    flatten(data) {
        return this.createLevel(data, 1);
    }

    /**
     * Creates siblings at the given level of the tree.
     *
     * @param {Array}
     *            data The lightning-tree-grid-data
     * @param {number}
     *            level The tree depth of the given data
     * @returns {Array} List of tree rows
     */
    createLevel(data, level) {
        let rows = [];

        for (let i = 0; i < data.length; i++) {
            if (this.isSection(data[i])) {
                rows = rows.concat(this.createSection(data[i], level, i + 1, data.length));
            } else {
                rows.push(this.createItem(data[i], level, i + 1, data.length));
            }
        }

        return rows;
    }

    /**
     * Creates an expandable/collapsible palette section. Collapsed sections
     * will not show their children.
     *
     * @param {Object}
     *            section The lightning-tree-grid data
     * @param {number}
     *            level The tree depth of the given data
     * @param {number}
     *            posinset The position in the current level
     * @param {number}
     *            setsize The size of the current level
     * @returns {Array} List of tree rows
     */
    createSection(section, level, posinset, setsize) {
        let rows = [];

        const key = section.guid;
        const expanded = !this.collapsedSections[key];
        const row = {
            isSection: true,
            key,
            level,
            posinset,
            setsize,
            label: section.label,
            expanded
        };
        rows.push(row);

        // Only include child items from expanded sections.
        if (expanded) {
            rows = rows.concat(this.createLevel(section._children, level + 1, key));
        }

        return rows;
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
    createItem(item, level, posinset, setsize) {
        const key = item.guid;
        const row = {
            isSection: false,
            key,
            level,
            posinset,
            setsize,
            label: item.label,
            elementType: item.elementType,
            iconName: item.iconName,
            description: item.description
        };
        return row;
    }

    /**
     * A section always has a non-empty _children array.
     *
     * @param {Object}
     *            data The lightning-tree-grid data
     * @returns {boolean} true if data._children is non-empty
     */
    isSection(data) {
        return Array.isArray(data._children) && data._children.length;
    }

    /**
     * This maps unique identifiers back to the row data. This is helpful when
     * handling events and all we have is the dom element.
     *
     * @param {Array}
     *            rows The flattened row data
     * @returns {Object} A mapping of tree node identifier to its row data
     */
    createItemMap(rows) {
        const itemMap = {};
        rows.forEach((row) => {
            itemMap[row.key] = row;
        });
        return itemMap;
    }

    /**
     * When toggling a section, we need to flatten the original data again using
     * the updated collapsed sections state.
     *
     * @param {Event}
     *            event A section toggle event
     */
    handleToggleSection(event) {
        const collapsed = !event.detail.expanded;
        this.collapsedSections[event.detail.sectionKey] = collapsed;
        this.init(this.original);
    }
}