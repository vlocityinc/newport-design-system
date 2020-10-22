import { LightningElement, api, track } from 'lwc';
import { LABELS } from './sortOptionListLabels';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { AddSortOptionItemEvent, DeleteSortOptionItemEvent } from 'builder_platform_interaction/events';
import { format } from 'builder_platform_interaction/commonUtils';
import { Guid } from 'builder_platform_interaction/flowModel';

type SortOption = {
    sortField: { value: string | null; error: string | null };
    sortOrder: { value: string | null; error: string | null };
    nullsLast: boolean;
    rowIndex?: Guid | null;
};

export default class SortOptionList extends LightningElement {
    labels = LABELS;
    @track
    _sortOptions: SortOption[] = [];

    @track
    _recordEntityName = '';

    /**
     * true if sorting on sObject collections
     */
    @api
    isSobject;

    /**
     * the maximum rows
     */
    @api
    maxSortFields = 3;

    /**
     * @param entityName the selected entity name
     */
    set recordEntityName(entityName: string) {
        this._recordEntityName = entityName;
    }

    @api
    get recordEntityName() {
        return this._recordEntityName;
    }

    /**
     * @param options the selected sort options
     */
    set sortOptions(options: SortOption[]) {
        this._sortOptions = options;
        // update tooltip on 'Add button'
        this.updateTooltip();
    }

    @api
    get sortOptions() {
        return this._sortOptions;
    }

    /**
     * get the sortOrder and nullsLast when sorting on primitive collections
     */
    get primitiveSortOption() {
        if (!this.isSobject && this.sortOptions.length > 0) {
            return this.sortOptions[0];
        }
        return hydrateWithErrors({
            sortField: null,
            sortOrder: null,
            nullsLast: true
        });
    }

    /**
     * show delete icon button
     */
    get showDelete() {
        return this.isSobject && this._sortOptions.length > 1;
    }

    updateTooltip() {
        const sortList = this.template.querySelector('builder_platform_interaction-list');
        if (sortList) {
            const addBtn = sortList.shadowRoot.querySelector('.addButton');
            if (addBtn) {
                addBtn.title =
                    this._sortOptions.length === this.maxSortFields
                        ? format(this.labels.maxItem, this.maxSortFields)
                        : '';
            }
        }
    }
    /**
     * handle event when adding the sort option
     * @param event the add sort option
     */
    handleAddSortOption(event: CustomEvent) {
        event.stopPropagation();
        const addSortOptionEvent = new AddSortOptionItemEvent(event.detail.index);
        this.dispatchEvent(addSortOptionEvent);
    }

    /**
     * handle event when deleting the sort option
     * @param event the delete sort option
     */
    handleDeleteSortOption(event: CustomEvent) {
        event.stopPropagation();
        const deleteSortOptionEvent = new DeleteSortOptionItemEvent(event.detail.index);
        this.dispatchEvent(deleteSortOptionEvent);
    }
}
