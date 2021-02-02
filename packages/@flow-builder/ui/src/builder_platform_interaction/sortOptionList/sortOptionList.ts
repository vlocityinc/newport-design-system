import { LightningElement, api, track } from 'lwc';
import { LABELS } from './sortOptionListLabels';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { AddSortOptionItemEvent, DeleteSortOptionItemEvent } from 'builder_platform_interaction/events';
import { format } from 'builder_platform_interaction/commonUtils';
import { SortOption, SObjectOrApexReference, isSObjectOrApexClass } from 'builder_platform_interaction/sortEditorLib';

export default class SortOptionList extends LightningElement {
    labels = LABELS;
    @track
    _sortOptions: SortOption[] = [];

    @track
    _sObjectOrApexReference: SObjectOrApexReference = { value: null };

    /**
     * the maximum rows
     */
    @api
    maxSortFields = 3;

    @api
    queriedFields;

    @track
    selectedFields: string[] = [];

    /**
     * @param ref the record entity name or apex class name
     */
    set sobjectOrApexReference(ref: SObjectOrApexReference) {
        this._sObjectOrApexReference = ref;
    }

    @api
    get sobjectOrApexReference(): SObjectOrApexReference {
        return this._sObjectOrApexReference;
    }

    /**
     * @param options the selected sort options
     */
    set sortOptions(options: SortOption[]) {
        this._sortOptions = options || [];
        // update tooltip on 'Add button'
        this.updateTooltip();
        // avoid duplicated fields
        this.selectedFields = [];
        this._sortOptions.forEach((option) => {
            if (option.sortField && option.sortField.value) {
                this.selectedFields.push(option.sortField.value);
            }
        });
    }

    @api
    get sortOptions(): SortOption[] {
        return this._sortOptions;
    }

    get isSObjectOrApexClass() {
        return isSObjectOrApexClass(this._sObjectOrApexReference);
    }

    /**
     * get the sortOrder and doesPutEmptyStringAndNullFirst when sorting on primitive collections
     */
    get primitiveSortOption(): SortOption {
        if (!this.isSObjectOrApexClass && this.sortOptions.length > 0) {
            return this.sortOptions[0];
        }
        return hydrateWithErrors({
            sortField: null,
            sortOrder: null,
            doesPutEmptyStringAndNullFirst: false
        });
    }

    /**
     * show delete icon button
     */
    get showDelete(): boolean {
        return this.isSObjectOrApexClass && this._sortOptions.length > 1;
    }

    updateTooltip() {
        const sortList = this.template.querySelector('builder_platform_interaction-list');
        if (sortList) {
            const addBtn = sortList.shadowRoot.querySelector('lightning-button');
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
