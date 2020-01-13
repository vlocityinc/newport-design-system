import { LightningElement, api, track } from 'lwc';
import {
    ALL_PROCESS_TYPE,
    getProcessTypeIcon,
    getTemplates,
    cacheTemplates,
    createProcessTypeTile
} from 'builder_platform_interaction/processTypeLib';
import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';

import {
    TemplateChangedEvent,
    CannotRetrieveTemplatesEvent
} from 'builder_platform_interaction/events';

import spinnerAlternativeText from '@salesforce/label/FlowBuilderEditor.spinnerAlternativeText';

const LABELS = {
    spinnerAlternativeText
};

export default class ProcessTypesTemplates extends LightningElement {
    labels = LABELS;
    /**
     * @typedef {Object} Template
     *
     * @property {String} itemId
     * @property {String} label
     * @property {String} iconName
     * @property {String} description
     */

    @api
    selectedItem;

    @api
    get processTypes() {
        return this.state.processTypes;
    }

    set processTypes(value) {
        this.state.processTypes = value;
        this.updateProcessTypeTiles();
    }

    @track
    state = {
        processTypes: null,
        templates: [], // an array of Template that are fetched for the selected process type
        processTypesTiles: [], // an array of process type tiles,
        items: [] // a union of templates and process type tiles
    };

    @track
    displaySpinner = false;

    selectedItemId;
    selectedItemIsTemplate;

    _processType;

    /**
     * @param newValue the selected process type to fetch the templates
     */
    set processType(newValue) {
        if (this._processType === newValue) {
            return;
        }

        this._processType = newValue;
        this.selectedItemId = null;
        this.selectedItemIsTemplate = null;
        this.updateProcessTypeTiles();
        if (!this._processType) {
            this.state.templates = [];
            this.updateItems();
        }
    }

    @api
    get processType() {
        return this._processType;
    }

    get showGetTemplates() {
        return (!this.state.templates || this.state.templates.length === 0) && this._processType;
    }

    /**
     * fetch the templates
     */
    fetchTemplates() {
        // this.state.templates = [];
        // check if we can get the templates from cache
        const cachedTemplates = getTemplates(this._processType);
        if (!cachedTemplates && this._processType) {
            let processTypes;
            if (this._processType === ALL_PROCESS_TYPE.name) {
                // get all process types
                processTypes = this.state.processTypes.map(type => type.name);
            } else {
                processTypes = [this._processType];
            }
            if (processTypes && processTypes.length > 0) {
                this.displaySpinner = true;
                // fetch templates
                fetchOnce(
                    SERVER_ACTION_TYPE.GET_TEMPLATES,
                    { processTypes },
                    { disableErrorModal: true }
                )
                    .then(data => {
                        this.state.templates = this.mapToTemplates(data);
                        this.updateItems();
                        // caches the returned templates to avoid calling to server when changing the process type
                        cacheTemplates(this.state.processTypes, this._processType, data);
                        this.displaySpinner = false;
                    })
                    .catch(() => {
                        this.displaySpinner = false;
                        this.fireCannotRetrieveTemplatesEvent();
                    });
            }
        } else {
            this.state.templates = this.mapToTemplates(cachedTemplates);
            this.updateItems();
        }
    }

    /**
     * @typedef {Object} FlowVersionDescriptor
     *
     * @property {String} EnumOrID
     * @property {String} ProcessType
     * @property {String} Status
     * @property {String} IsTemplate
     * @property {String} VersionNumber
     * @property {String} Description
     * @property {String} Label
     */

    /**
     * @param data an array of FlowVersionDescriptor
     * @return (Template[]) an array of Template
     */
    mapToTemplates(data) {
        return data.map(flowVer => {
            const itemId = flowVer.EnumOrID;
            const isSelected = itemId === this.selectedTemplate;
            return {
                itemId,
                label: flowVer.Label,
                iconName: getProcessTypeIcon(flowVer.ProcessType),
                description: flowVer.Description,
                isSelected,
                isTemplate: true
            };
        });
    }

    /**
     * get the process types tiles for the selected process type
     */
    updateProcessTypeTiles() {
        if (this.state.processTypes && this.state.processTypes.length > 0 && this._processType) {
            this.fetchTemplates();
            if (this._processType === ALL_PROCESS_TYPE.name) {
                this.state.processTypesTiles = this.state.processTypes.map((processType, index) =>
                    createProcessTypeTile(this.processTypes, processType.name, index === 0));

                if (this.state.processTypes.length > 0) {
                    this.selectedItemId = this.state.processTypes[0].name;
                }
            } else {
                this.state.processTypesTiles = [
                    createProcessTypeTile(this.processTypes, this._processType, true)
                ];
                this.selectedItemId = this._processType;
            }
            this.selectedItemIsTemplate = false;
            this.fireSelectedTemplateChangedEvent(this.selectedItemId, true);
        } else {
            this.state.processTypesTiles = [];
        }
        this.updateItems();
    }

    updateItems() {
        this.state.items = this.state.processTypesTiles.concat(this.state.templates);
    }

    select(itemId) {
        const index = this.state.items.findIndex(
            template => template.itemId === itemId
        );
        const item = this.state.items[index];
        this.state.items[index].isSelected = false;
        this.state.items[index].isSelected = true;
        this.state.selectedItemId = itemId;
        this.state.selectedItemIsTemplate = item.isTemplate;
        this.fireSelectedTemplateChangedEvent(itemId, !item.isTemplate);
    }

    deselect(itemId) {
        const index = this.state.items.findIndex(
            template => template.itemId === itemId
        );
        this.state.items[index].isSelected = true;
        this.state.items[index].isSelected = false;
        this.state.selectedItemId = null;
        this.state.selectedItemIsTemplate = null;
    }

    handleTemplateOrProcessTypeTileChanged(event) {
        event.stopPropagation();
        const deselectedItem = event.detail.items.find(item => !item.isSelected);
        const selectedItem = event.detail.items.find(item => item.isSelected);
        if (deselectedItem && !selectedItem) {
            this.select(deselectedItem.id);
            return;
        }

        if (deselectedItem) {
            this.deselect(deselectedItem.id);
        }
        if (selectedItem) {
            this.select(selectedItem.id);
        }
    }

    fireSelectedTemplateChangedEvent(selectedId, isProcessType) {
        this.dispatchEvent(new TemplateChangedEvent(selectedId, isProcessType));
    }

    fireCannotRetrieveTemplatesEvent() {
        this.dispatchEvent(new CannotRetrieveTemplatesEvent());
    }
}
