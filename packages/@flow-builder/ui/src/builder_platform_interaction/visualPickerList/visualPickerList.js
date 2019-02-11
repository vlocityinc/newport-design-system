import { LightningElement, api } from 'lwc';
import { VisualPickerListChangedEvent } from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const NUMBER_OF_COLUMNS_DEFAULT_VALUE = 2;

export default class VisualPickerList extends LightningElement {
    @api
    title;

    /**
     * true to allow selecting multiple items
     **/
    @api
    allowMultipleSelection = false;

    /**
     * @typedef {Object} VisualPickerItem
     * @property {String} label  the item's label
     * @property {String} [description]  the item's description
     * @property {boolean} isSelected   true if the item is selected
     * @property {String} [iconName]   the item's icon
     * @property {String} itemId     the item's id
     */

    /**
     * List of VisualPickerItem
     *
     */
    @api
    items = [];

    _numberOfColumns;

    _checkAllowMultipleSelection = false;

    /**
     * number of visual picker items per row
     *
     */
    set numberOfColumns(value) {
        this._numberOfColumns = parseInt(value, 10);
        if (isNaN(this._numberOfColumns)) {
            this._numberOfColumns = NUMBER_OF_COLUMNS_DEFAULT_VALUE;
        }
    }

    @api
    get numberOfColumns() {
        return this._numberOfColumns || NUMBER_OF_COLUMNS_DEFAULT_VALUE;
    }

    renderedCallback() {
        if (!this._checkAllowMultipleSelection) {
            this.checkAllowMultipleSelection();
        }
    }

    checkAllowMultipleSelection() {
        const selectedItems = this.items.filter(item => item.isSelected);
        if (selectedItems.length > 1 && !this.allowMultipleSelection) {
            throw new Error('Can not select more than 1 item');
        }
        this._checkAllowMultipleSelection = true;
    }

    get itemsPerRow() {
        const results = [];
        let i = 0;
        // looping through the array until we have reached the final index
        while (i < this.items.length) {
            const chunkedItems = {rowIndex: generateGuid(), items: this.items.slice(i, i += this.numberOfColumns)} || {};
            results.push(chunkedItems);
        }
        return results;
    }

    handleItemChanged(event) {
        event.stopPropagation();
        const changedItems = [];
        if (event.detail.isSelected) {
            // unselect the prev selected item if allowMultipleSelection is false
            if (!this.allowMultipleSelection) {
                const prevSelectedItem = this.items.find(item => item.isSelected);
                if (prevSelectedItem) {
                    changedItems.push({id: prevSelectedItem.itemId, isSelected: false});
                }
            }
        }
        changedItems.push({id: event.detail.id, isSelected: event.detail.isSelected});
        this.dispatchEvent(new VisualPickerListChangedEvent(changedItems));
    }
}