// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { loadAllSupportedFeatures } from 'builder_platform_interaction/preloadLib';
import { LABELS } from './newFlowModalBodyLabels';
import { setProcessTypes } from 'builder_platform_interaction/systemLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';

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
        errorMessage: null,
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

    /**
     * set the error message
     *
     * @param {string} value the error message
     */
    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value) {
        this.state.errorMessage = value || '';
    }

    get showAllTab() {
        return this.showAll || !this.showRecommended; // Always show the All/Templates tab if all other tabs are hidden
    }

    get showSpinner() {
        return this.state.processTypesLoading || this.state.itemsLoading;
    }

    get showErrorMessage() {
        return !this.showSpinner && !!this.errorMessage;
    }

    connectedCallback() {
        this.fetchProcessTypes();
    }

    /**
     * Handler for process type selection
     *
     * @param {Object} event - selected process type event
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.state.selectedProcessType = event.detail.name;

        if (this.isResetErrorMessageNeeded() && this.state.activeTab === TAB_TEMPLATES) {
            this.resetErrorMessage();
        }
    }

    /**
     * Handler for templates tab selection
     *
     * @param {Object} event - item changed event
     */
    handleSelectTemplatesItem(event) {
        event.stopPropagation();
        this.state.selectedTemplatesItem = event.detail;
        if (this.isResetErrorMessageNeeded() && this.state.activeTab === TAB_TEMPLATES) {
            this.resetErrorMessage();
        }
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
        if (this.isResetErrorMessageNeeded() && this.state.activeTab === TAB_RECOMMENDED) {
            this.resetErrorMessage();
        }
    }

    setRecommendedItemIsSelected(itemId, isSelected) {
        const selectedItem = this.state.recommendedItems.find((item) => item.itemId === itemId);
        // This is a hacky way of triggering re-render of <visual-picker-list/>.
        // Needs to be fixed at the picker level.
        selectedItem.isSelected = !isSelected;
        selectedItem.isSelected = isSelected;
    }

    /**
     * close the notification error popup
     */
    handleCloseErrorMessage() {
        this.resetErrorMessage();
    }

    /**
     * Handle the error when fetching templates
     *
     * @param event
     */
    handleCannotRetrieveTemplates(event) {
        this.state.errorMessage = LABELS.errorLoadingTemplates;
        event.stopPropagation();
    }

    isResetErrorMessageNeeded() {
        return !!this.selectedItem;
    }

    resetErrorMessage() {
        this.state.errorMessage = '';
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
                this.state.errorMessage = LABELS.errorLoadingProcessTypes;
                this.footer.disableButtons();
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
                this.state.errorMessage = LABELS.errorLoadingFlowEntries;
                this.footer.disableButtons();
            });
    }
}
