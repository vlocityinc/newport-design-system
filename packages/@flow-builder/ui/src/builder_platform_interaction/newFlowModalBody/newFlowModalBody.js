import { LightningElement, api, track } from 'lwc';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { setProcessTypes, getProcessTypes } from 'builder_platform_interaction/systemLib';

export default class NewFlowModalBody extends LightningElement {
    @track state = {
            // the selected process type in process type navigation tree
            selectedProcessType: ALL_PROCESS_TYPE.name,
            // the selected template
            selectedTemplate: '',
            // true if the featured (process type) is selected
            isProcessType: false,
            processTypesFetched: false,
    };

    processTypes = [];

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES, {}).then((data) => {
            setProcessTypes(data);
            this.processTypes = getProcessTypes();
            this.state.processTypesFetched = true;
        }).catch(() => {
            this.state.processTypesFetched = true;
        });
    }

    /**
     * @returns true if the selected template is the process type (in featured section)
     */
    @api
    get isProcessType() {
        return this.state.isProcessType;
    }

    /**
     * @returns the selected template
     */
    @api
    get selectedTemplate() {
        return this.state.selectedTemplate;
    }

    /**
     * @returns the selected process type
     */
    @api
    get selectedProcessType() {
        return this.state.selectedProcessType;
    }

    /**
     * Handler for process type selection
     * @param {Object} event - selected process type event
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.state.selectedProcessType = event.detail.name;
    }

    /**
     * Handler for template selection
     * @param {Object} event - template changed event
     */
    handleSelectTemplate(event) {
        event.stopPropagation();
        this.updateSelectedTemplate(event.detail.isProcessType, event.detail.id);
    }

    updateSelectedTemplate(isProcessType, selectedTemplate) {
        this.state.selectedTemplate = selectedTemplate;
        this.state.isProcessType = isProcessType;
    }
}