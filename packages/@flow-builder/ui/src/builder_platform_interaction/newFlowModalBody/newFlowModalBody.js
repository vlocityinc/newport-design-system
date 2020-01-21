import { LightningElement, api, track } from 'lwc';
import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    ALL_PROCESS_TYPE,
    createRecommendedItems
} from 'builder_platform_interaction/processTypeLib';
import {
    loadAllSupportedFeatures
} from 'builder_platform_interaction/preloadLib';
import {
    LABELS
} from './newFlowModalBodyLabels';

const TAB_RECOMMENDED = 'recommended';
const TAB_TEMPLATES = 'templates';

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
        recommendedItems: null,
        selectedRecommendedItem: null,
        activeTab: TAB_RECOMMENDED,
        selectedTemplatesItem: null
    };

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
     * @param {String} value the error message
     */
    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value) {
        this.state.errorMessage = value || '';
    }

    connectedCallback() {
        this.state.processTypesLoading = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES)
            .then(processTypes => {
                loadAllSupportedFeatures(processTypes);
                this.state.processTypesLoading = false;
                this.state.processTypes = processTypes;
                this.state.recommendedItems = createRecommendedItems(processTypes);
                if (this.state.recommendedItems && this.state.recommendedItems.length > 0) {
                    this.state.selectedRecommendedItem = this.state.recommendedItems[0];
                    this.state.selectedRecommendedItem.isSelected = true;
                }
            })
            .catch(() => {
                this.state.processTypesLoading = false;
                this.handleCannotRetrieveProcessTypes();
            });
    }

    /**
     * Handler for process type selection
     * @param {Object} event - selected process type event
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.state.selectedProcessType = event.detail.name;
        if (this.isResetErrorMessageNeeded()) {
            this.resetErrorMessage();
        }
    }

    /**
     * Handler for templates tab selection
     * @param {Object} event - item changed event
     */
    handleSelectTemplatesItem(event) {
        event.stopPropagation();
        this.state.selectedTemplatesItem = event.detail;
        if (this.isResetErrorMessageNeeded()) {
            this.resetErrorMessage();
        }
    }

    /**
     * Handler for recommended tab selection
     * @param {Object} event - item changed event
     */
    handleSelectRecommendedItem(event) {
        event.stopPropagation();
        const selectedItem = event.detail.items.find(item => item.isSelected);
        const deselectedItem = event.detail.items.find(item => !item.isSelected);
        if (deselectedItem && !selectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, true);
            return;
        }
        let selectedRecommendedItem;
        if (deselectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, false);
        }
        if (selectedItem) {
            selectedRecommendedItem = this.state.recommendedItems.find(item => item.itemId === selectedItem.id);
            this.setRecommendedItemIsSelected(selectedItem.id, true);
        }
        this.state.selectedRecommendedItem = selectedRecommendedItem;
        if (this.isResetErrorMessageNeeded()) {
            this.resetErrorMessage();
        }
    }

    setRecommendedItemIsSelected(itemId, isSelected) {
        const selectedItem = this.state.recommendedItems.find(item => item.itemId === itemId);
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

    /**
     * Handle the error when fetching process types
     */
    handleCannotRetrieveProcessTypes() {
        this.state.errorMessage = LABELS.errorLoadingProcessTypes;
        this.footer.disableButtons();
    }

    handleTabActive(event) {
        this.state.activeTab = event.target.value;
    }
}
