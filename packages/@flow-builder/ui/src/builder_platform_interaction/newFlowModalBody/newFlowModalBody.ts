// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { loadAllSupportedFeatures } from 'builder_platform_interaction/preloadLib';
import { LABELS } from './newFlowModalBodyLabels';
import { setProcessTypes } from 'builder_platform_interaction/systemLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const TAB_RECOMMENDED = 'recommended';
const TAB_TEMPLATES = 'templates';

const enrichItems = (items) =>
    items.map((item) => {
        let itemId;
        if (item.flow) {
            if (typeof item.flow === 'string') {
                itemId = item.flow;
            } else {
                itemId = JSON.stringify(item.flow);
            }
        } else {
            itemId = item.processType + (item.defaultTriggerType ? '-' + item.defaultTriggerType : '');
        }
        return {
            itemId,
            iconName: item.icon,
            ...item
        };
    });

export default class NewFlowModalBody extends LightningElement {
    labels = LABELS;
    TAB_RECOMMENDED = TAB_RECOMMENDED;
    TAB_TEMPLATES = TAB_TEMPLATES;

    @track
    state = {
        // the selected process type in process type navigation tree
        selectedProcessType: ALL_PROCESS_TYPE.name,
        processTypes: [],
        processTypesLoading: false,
        items: null,
        itemsLoading: false,
        recommendedItems: null,
        selectedRecommendedItem: null,
        activeTab: TAB_RECOMMENDED,
        selectedTemplatesItem: null
    };

    @api
    get builderType() {
        return this.state.builderType;
    }

    set builderType(value) {
        if (this.state.builderType !== value) {
            this.state.builderType = value;
            this.fetchFlowEntries();
        }
    }

    @api
    showRecommended;

    @api
    showAll;

    @api
    footer;

    @api
    get selectedProcessType() {
        return this.state.selectedProcessType;
    }

    @api
    get selectedItem() {
        switch (this.state.activeTab) {
            case TAB_RECOMMENDED:
                return this.state.selectedRecommendedItem;
            case TAB_TEMPLATES:
                return this.state.selectedTemplatesItem;
            default:
                throw new Error('Invalid tab ' + this.state.activeTab);
        }
    }

    get showAllTab() {
        return this.showAll || !this.showRecommended; // Always show the All/Templates tab if all other tabs are hidden
    }

    get showSpinner() {
        return this.state.processTypesLoading || this.state.itemsLoading;
    }

    connectedCallback() {
        this.fetchProcessTypes();
    }

    /**
     * Helper function to display toast
     *
     * @param message the toast message to display
     * @param variant the toast variant
     */
    showToast(message: string, variant: string) {
        const toastEvent = new ShowToastEvent({
            variant,
            message
        });
        this.dispatchEvent(toastEvent);
    }

    /**
     * Handler for process type selection
     *
     * @param {Object} event - selected process type event
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.state.selectedProcessType = event.detail.name;
    }

    /**
     * Handler for templates tab selection
     *
     * @param {Object} event - item changed event
     */
    handleSelectTemplatesItem(event) {
        event.stopPropagation();
        this.state.selectedTemplatesItem = event.detail;
    }

    /**
     * Handler for recommended tab selection
     *
     * @param {Object} event - item changed event
     */
    handleSelectRecommendedItem(event) {
        event.stopPropagation();
        const selectedItem = event.detail.items.find((item) => item.isSelected);
        const deselectedItem = event.detail.items.find((item) => !item.isSelected);
        if (deselectedItem && !selectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, true);
            return;
        }
        let selectedRecommendedItem;
        if (deselectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, false);
        }
        if (selectedItem) {
            selectedRecommendedItem = this.state.recommendedItems.find((item) => item.itemId === selectedItem.id);
            this.setRecommendedItemIsSelected(selectedItem.id, true);
        }
        this.state.selectedRecommendedItem = selectedRecommendedItem;
    }

    setRecommendedItemIsSelected(itemId, isSelected) {
        const selectedItem = this.state.recommendedItems.find((item) => item.itemId === itemId);
        // This is a hacky way of triggering re-render of <visual-picker-list/>.
        // Needs to be fixed at the picker level.
        selectedItem.isSelected = !isSelected;
        selectedItem.isSelected = isSelected;
    }

    /**
     * Handle the error when fetching templates
     *
     * @param event
     */
    handleCannotRetrieveTemplates(event) {
        event.stopPropagation();
        this.showToast(this.labels.errorLoadingTemplates, 'error');
    }

    handleTabActive(event) {
        this.state.activeTab = event.target.value;
    }

    fetchProcessTypes() {
        this.state.processTypesLoading = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES, { builderType: this.builderType })
            .then((processTypes) => {
                setProcessTypes(processTypes);
                loadAllSupportedFeatures(processTypes);
                this.state.processTypesLoading = false;
                this.state.processTypes = processTypes;
            })
            .catch(() => {
                this.state.processTypesLoading = false;
                this.footer.disableButtons();
                this.showToast(this.labels.errorLoadingProcessTypes, 'error');
            });
    }

    fetchFlowEntries() {
        this.state.itemsLoading = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_ENTRIES, {
            builderType: this.builderType
        })
            .then((items) => {
                this.state.itemsLoading = false;
                this.state.items = enrichItems(items);

                // Collect all items for the Recommended tab
                this.state.recommendedItems = this.state.items
                    .filter((item) => item.recommended)
                    .map((item) => ({ ...item }));

                // Select the first recommended item
                if (this.state.recommendedItems && this.state.recommendedItems.length > 0) {
                    this.state.selectedRecommendedItem = this.state.recommendedItems[0];
                    this.state.selectedRecommendedItem.isSelected = true;
                }

                // Remove recommended templates:
                // they will be shown along with other templates on the Templates tab.
                this.state.items = this.state.items.filter(
                    (item) => !(item.recommended && typeof item.flow === 'string')
                );
            })
            .catch(() => {
                this.state.itemsLoading = false;
                this.footer.disableButtons();
                this.showToast(this.labels.errorLoadingFlowEntries, 'error');
            });
    }
}
