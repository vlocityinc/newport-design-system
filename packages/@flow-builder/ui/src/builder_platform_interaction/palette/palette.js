import { LightningElement, api, track, unwrap } from 'lwc';
import { PaletteItemChevronClickedEvent } from 'builder_platform_interaction/events';
import { flatten } from './paletteLib';
import { LABELS } from './paletteLabels';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */
export default class Palette extends LightningElement {
    @api iconSize;

    @api
    // eslint-disable-next-line lwc/valid-api
    get data() {
        return this.rows;
    }

    set data(value) {
        this.original = value;
        this.init();
    }

    @api
    get itemsDraggable() {
        return this.draggableItems;
    }

    set itemsDraggable(value) {
        this.draggableItems = value === 'true';
    }

    @api
    get detailsButton() {
        return this.showResourceDetails;
    }

    set detailsButton(value) {
        this.showResourceDetails = value === 'true';
    }

    @api
    get showSectionItemCount() {
        return this.showItemCount;
    }

    set showSectionItemCount(value) {
        this.showItemCount = value === 'true';
        this.init();
    }

    @track rows = [];
    @track draggableItems = false;
    @track showItemCount = false;
    @track showResourceDetails = false;

    labels = LABELS;
    original = [];
    collapsedSections = {};
    itemMap = {};

    /**
     * Sets up the internal state used to render the tree.
     */
    init() {
        // TODO: If lightning-tree-grid doesn't satisfy our requirements and we
        // end up getting stuck with using palette, we should consider making
        // resources-lib give us data in a format that works without needing to
        // flatten it here.
        const options = {
            collapsedSections: this.collapsedSections,
            showSectionItemCount: this.showItemCount
        };
        const rows = flatten(this.original, options);
        this.rows = rows;
        this.itemMap = this.createItemMap(rows);
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
        const key = event.currentTarget.dataset.key;
        this.collapsedSections[key] = !this.collapsedSections[key];
        this.init();
    }

    /**
     * Dispatches an event which opens the resource details panel.
     *
     * @param {Event}
     *            event A resource details button click event
     */
    handleResourceDetailsClick(event) {
        const guid = event.currentTarget.dataset.guid;
        const iconName = event.currentTarget.dataset.iconName;
        const paletteItemChevronClickedEvent = new PaletteItemChevronClickedEvent(guid, iconName);
        this.dispatchEvent(paletteItemChevronClickedEvent);
    }

    /**
     * Handler for when an element is dragged.
     *
     * @param {Object}
     *            event drag start event
     */
    handleDragStart(event) {
        const referenceElement = event.currentTarget;
        const item = this.itemMap[referenceElement.dataset.key];

        // Only items in the map should be considered draggable.
        if (!item) {
            event.dataTransfer.effectAllowed = 'none';
            return;
        }

        // TODO: The drag image should be a large version of the element icon.
        // TODO: The setDragImage function is not supported in IE11, we'll need
        // to create our own polyfill since the Raptor team doesn't plan on
        // creating one in the near future.
        const paletteItem = referenceElement.querySelector('builder_platform_interaction-palette-item');
        const dragElement = paletteItem.iconElement;
        event.dataTransfer.setData('text', item.elementType);
        if (event.dataTransfer.setDragImage && dragElement) {
            event.dataTransfer.setDragImage(unwrap(dragElement), 0, 0);
        }
        event.dataTransfer.effectAllowed = 'copy';
    }
}
