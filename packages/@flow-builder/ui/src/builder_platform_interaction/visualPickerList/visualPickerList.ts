// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { VisualPickerListChangedEvent } from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const NUMBER_OF_COLUMNS_DEFAULT_VALUE = 2;

/**
 * @param items
 * @param size
 */
function splitItems(items, size) {
    const results = [];
    if (items) {
        // looping through the array until we have reached the final index
        for (let i = 0; i < items.length; i += size) {
            results.push({
                rowIndex: generateGuid(),
                items: items.slice(i, i + size)
            });
        }
    }
    return results;
}

export default class VisualPickerList extends LightningElement {
    @api
    title;

    /**
     * true to allow selecting multiple items
     */
    @api
    allowMultipleSelection = false;

    @api
    focusOnRerendering = false;

    @api
    radioGroupName;

    /**
     * @typedef {Object} VisualPickerItem
     * @property {string} label  the item's label
     * @property {string} [description]  the item's description
     * @property {boolean} isSelected   true if the item is selected
     * @property {string} [iconName]   the item's icon
     * @property {string} itemId     the item's id
     */
    @track
    state = {
        items: [],
        itemsPerRow: [],
        numberOfColumns: NUMBER_OF_COLUMNS_DEFAULT_VALUE,
        checkAllowMultipleSelection: false
    };

    /**
     * List of VisualPickerItem
     *
     */
    @api
    get items() {
        return this.state.items;
    }

    set items(value) {
        this.state.items = value;
        this.state.itemsPerRow = splitItems(this.state.items, this.numberOfColumns);
    }

    /**
     * number of visual picker items per row
     *
     */
    @api
    get numberOfColumns() {
        return this.state.numberOfColumns;
    }

    set numberOfColumns(value) {
        this.state.numberOfColumns = parseInt(value, 10);
        if (isNaN(this.state.numberOfColumns) || this.state.numberOfColumns <= 0) {
            this.state.numberOfColumns = NUMBER_OF_COLUMNS_DEFAULT_VALUE;
        }
    }

    renderedCallback() {
        if (!this.state.checkAllowMultipleSelection) {
            this.checkAllowMultipleSelection();
        }
    }

    checkAllowMultipleSelection() {
        const selectedItems = this.items.filter((item) => item.isSelected);
        if (selectedItems.length > 1 && !this.allowMultipleSelection) {
            throw new Error('Can not select more than 1 item');
        }
        this.state.checkAllowMultipleSelection = true;
    }

    get itemsPerRow() {
        return this.state.itemsPerRow;
    }

    handleItemChanged(event) {
        event.stopPropagation();
        const changedItems = [];
        if (event.detail.isSelected) {
            // unselect the prev selected item if allowMultipleSelection is false
            if (!this.allowMultipleSelection) {
                const prevSelectedItem = this.items.find((item) => item.isSelected);
                if (prevSelectedItem) {
                    changedItems.push({
                        id: prevSelectedItem.itemId,
                        isSelected: false
                    });
                }
            }
        }
        changedItems.push({
            id: event.detail.id,
            isSelected: event.detail.isSelected
        });
        this.dispatchEvent(new VisualPickerListChangedEvent(changedItems));
    }
}
