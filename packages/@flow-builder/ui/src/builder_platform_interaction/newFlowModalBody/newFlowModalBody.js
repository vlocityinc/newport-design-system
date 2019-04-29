import { LightningElement, api, track } from 'lwc';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { setProcessTypes, getProcessTypes } from 'builder_platform_interaction/systemLib';
import { LABELS } from 'builder_platform_interaction/processTypeLib';

export default class NewFlowModalBody extends LightningElement {
    labels = LABELS;

    @track state = {
            // the selected process type in process type navigation tree
            selectedProcessType: ALL_PROCESS_TYPE.name,
            // the selected template
            selectedTemplate: '',
            // true if the featured (process type) is selected
            isProcessType: false,
            processTypesFetched: false,
            errorMessage: '',
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

    set isProcessType(value) {
        this.state.isProcessType = value || false;
    }
    /**
     * @returns true if the selected template is the process type (in featured section)
     */
    @api
    get isProcessType() {
        return this.state.isProcessType;
    }

    set selectedTemplate(value) {
        this.state.selectedTemplate = value || '';
    }
    /**
     * @returns the selected template
     */
    @api
    get selectedTemplate() {
        return this.state.selectedTemplate;
    }

    set selectedProcessType(value) {
        this.state.selectedProcessType = value || ALL_PROCESS_TYPE.name;
    }
    /**
     * @returns the selected process type
     */
    @api
    get selectedProcessType() {
        return this.state.selectedProcessType;
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
        this.resetErrorTypeAndMessage();
    }

    /**
     * Handler for template selection
     * @param {Object} event - template changed event
     */
    handleSelectTemplate(event) {
        event.stopPropagation();
        this.updateSelectedTemplate(event.detail.isProcessType, event.detail.id);
        this.resetErrorTypeAndMessage();
    }

    updateSelectedTemplate(isProcessType, selectedTemplate) {
        this.state.selectedTemplate = selectedTemplate;
        this.state.isProcessType = isProcessType;
    }

    handleCloseErrorMessage() {
        this.resetErrorTypeAndMessage();
    }

    resetErrorTypeAndMessage() {
        this.state.errorMessage = '';
    }
}