import { LightningElement, api, track } from 'lwc';
import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    PROCESS_TYPES_ICONS,
    ALL_PROCESS_TYPE,
    createProcessTypeTile
} from 'builder_platform_interaction/processTypeLib';

import { loadAllSupportedFeatures } from 'builder_platform_interaction/preloadLib';

import {
    LABELS
} from './newFlowModalBodyLabels';

function createRecommendedItems(processTypes) {
    const result = processTypes.filter(processType => PROCESS_TYPES_ICONS.FEATURED.has(processType.name))
        .map((processType, index) => {
            const tile = createProcessTypeTile(processTypes, processType.name, index === 0);
            return tile;
        });
    return result;
}

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
        // the selected template
        selectedTemplate: null,
        // true if the featured (process type) is selected
        isProcessType: false,
        errorMessage: null,
        processTypes: [],
        processTypesFetched: false,
        recommendedItems: null,
        activeTab: TAB_RECOMMENDED
    };

    @api
    footer;

    @api
    get selectedProcessType() {
        return this.state.selectedProcessType;
    }

    connectedCallback() {
        this.state.processTypesFetched = false;
        fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES)
            .then(processTypes => {
                loadAllSupportedFeatures(processTypes);
                this.state.processTypesFetched = true;
                this.state.processTypes = processTypes;
                this.state.recommendedItems = createRecommendedItems(processTypes);
                const selectedItem = this.state.recommendedItems.find(item => item.isSelected);
                if (selectedItem) {
                    this.updateSelectedTemplate(true, selectedItem.itemId);
                }
            })
            .catch(() => {
                this.state.processTypesFetched = true;
                this.handleCannotRetrieveProcessTypes();
            });
    }

    set isProcessType(value) {
        this.state.isProcessType = value || false;
    }
    /**
     * @returns true if the selected template is the process type (in featured section)
     */
    @api
    get isProcessType() {
        switch (this.state.activeTab) {
        case TAB_RECOMMENDED:
            return true;
        case TAB_TEMPLATES:
            return this.state.isProcessType;
        default:
        }
        return null;
    }

    /**
     * @returns the selected template
     */
    @api
    get selectedTemplate() {
        switch (this.state.activeTab) {
            case TAB_RECOMMENDED:
                return this.state.recommendedItems ? this.state.recommendedItems.find(item => item.isSelected).itemId : null;
            case TAB_TEMPLATES:
                return this.state.selectedTemplate;
            default:
            }
            return null;
    }

    /**
     * set the error message
     *
     * @param {String} value the error message
     */
    set errorMessage(value) {
        this.state.errorMessage = value || '';
    }

    @api
    get errorMessage() {
        return this.state.errorMessage;
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
     * Handler for template selection
     * @param {Object} event - template changed event
     */
    handleSelectTemplate(event) {
        event.stopPropagation();
        this.updateSelectedTemplate(
            event.detail.isProcessType,
            event.detail.id
        );
        if (this.isResetErrorMessageNeeded()) {
            this.resetErrorMessage();
        }
    }

    handleSelectRecommendedItem(event) {
        event.stopPropagation();
        const selectedItem = event.detail.items.find(item => item.isSelected);
        const deselectedItem = event.detail.items.find(item => !item.isSelected);
        if (deselectedItem && !selectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, true);
            return;
        }
        if (deselectedItem) {
            this.setRecommendedItemIsSelected(deselectedItem.id, false);
        }
        if (selectedItem) {
            this.setRecommendedItemIsSelected(selectedItem.id, true);
            this.updateSelectedTemplate(true, selectedItem.id);
        }
    }

    setRecommendedItemIsSelected(itemId, isSelected) {
        const index = this.state.recommendedItems.findIndex(
            item => item.itemId === itemId
        );
        // This is a hacky way of triggering re-render of <visual-picker-list/>.
        // Needs to be fixed at the picker level.
        this.state.recommendedItems[index].isSelected = !isSelected;
        this.state.recommendedItems[index].isSelected = isSelected;
    }

    updateSelectedTemplate(isProcessType, selectedTemplate) {
        this.state.selectedTemplate = selectedTemplate;
        this.state.isProcessType = isProcessType;
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
        return this.state.selectedTemplate !== '';
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
