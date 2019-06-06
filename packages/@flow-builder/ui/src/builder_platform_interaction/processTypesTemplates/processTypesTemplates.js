import { LightningElement, api, track } from 'lwc';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ALL_PROCESS_TYPE, getProcessTypeIcon, getTemplates, cacheTemplates, getProcessTypeTile } from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { LABELS } from 'builder_platform_interaction/processTypeLib';
import { TemplateChangedEvent, CannotRetrieveTemplatesEvent } from 'builder_platform_interaction/events';

const TEMPLATES = 'templates';
const PROCESS_TYPES_TILES = 'processTypesTiles';

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

    @track state = {
        templates: [], // an array of Template that are fetched for the selected process type
        processTypesTiles: [], // an array of process type tiles
    };
    @track displaySpinner = false;

    selectedTemplate = '';
    selectedProcessTypeTile = '';
    _processType = '';

    /**
     * @param newValue the selected process type to fetch the templates
     */
    set processType(newValue) {
        this._processType = newValue || '';
        this.selectedTemplate = '';
        this.getProcessTypesTiles();
        this.fetchTemplates();
    }

    @api
    get processType() {
        return this._processType;
    }

    /**
     * @returns true if there is no templates
     */
    get hasNoTemplates() {
        return this.state.templates.length === 0;
    }

    /**
     * fetch the templates
     */
    fetchTemplates() {
        // this.state.templates = [];
        // check if we can get the templates from cache
        const cachedTemplates = getTemplates(this._processType);
        if (!cachedTemplates) {
            const processTypes = [];
            if (this._processType === ALL_PROCESS_TYPE.name) {
                // get all process types
                const allProcessTypes = getProcessTypes();
                if (allProcessTypes) {
                    allProcessTypes.forEach(type => {
                        processTypes.push(type.name);
                    });
                }
            } else {
                processTypes.push(this._processType);
            }
            if (processTypes.length > 0) {
                this.displaySpinner = true;
                // fetch templates
                fetchOnce(SERVER_ACTION_TYPE.GET_TEMPLATES, {processTypes}, {disableErrorModal: true}).then((data) => {
                    this.state.templates = this.mapToTemplates(data);
                    // caches the returned templates to avoid calling to server when changing the process type
                    cacheTemplates(this._processType, data);
                    this.displaySpinner = false;
                }).catch(() => {
                    this.displaySpinner = false;
                    this.fireCannotRetrieveTemplatesEvent();
                });
            }
        } else {
            this.state.templates = this.mapToTemplates(cachedTemplates);
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
            const isSelected = (itemId === this.selectedTemplate);
            return {itemId, label: flowVer.Label, iconName: getProcessTypeIcon(flowVer.ProcessType), description: flowVer.Description, isSelected};
        });
    }

    /**
     * get the process types tiles for the selected process type
     */
    getProcessTypesTiles() {
        if (this._processType === ALL_PROCESS_TYPE.name) {
            const allProcessTypes = getProcessTypes();
            if (allProcessTypes) {
                this.state.processTypesTiles = [getProcessTypeTile(FLOW_PROCESS_TYPE.FLOW, true), getProcessTypeTile(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, false)];
                this.selectedProcessTypeTile = FLOW_PROCESS_TYPE.FLOW;
            }
        } else {
            this.state.processTypesTiles = [getProcessTypeTile(this._processType, true)];
            this.selectedProcessTypeTile = this._processType;
        }
        this.fireSelectedTemplateChangedEvent(this.selectedProcessTypeTile, true);
    }

    get hasProcessTypesTiles() {
        return this.state.processTypesTiles.length > 0;
    }

    /**
     * Handler for template selection
     * @param {Object} event - visual picker list changed event
     */
    handleTemplateChanged(event) {
        this.handleTemplateOrProcessTypeTileChanged(event, TEMPLATES);
    }

    /**
     * Handler for process type tile selection
     * @param {Object} event - visual picker list changed event
     */
    handleProcessTypeTileChanged(event) {
        this.handleTemplateOrProcessTypeTileChanged(event, PROCESS_TYPES_TILES);
    }

    handleTemplateOrProcessTypeTileChanged(event, templatesOrProcessTypeTiles) {
        event.stopPropagation();
        const items = event.detail.items;
        const isProcessType = templatesOrProcessTypeTiles === PROCESS_TYPES_TILES;
        items.forEach(item => {
            const index = this.state[templatesOrProcessTypeTiles].findIndex(template => template.itemId === item.id);
            this.state[templatesOrProcessTypeTiles][index].isSelected = item.isSelected;
            const selectedTemplateOrProcessTypeTile = isProcessType ? 'selectedProcessTypeTile' : 'selectedTemplate';
            const unselectedTemplateOrProcessTypeTile = isProcessType ? 'selectedTemplate' : 'selectedProcessTypeTile';
            if (item.isSelected) {
                this[selectedTemplateOrProcessTypeTile] = item.id;
                this.fireSelectedTemplateChangedEvent(item.id, isProcessType);
                // unselect selected template/process type tile if select the process type tile/template
                if (this[unselectedTemplateOrProcessTypeTile] !== '') {
                    const foundTemplate = this.state[isProcessType ? TEMPLATES : PROCESS_TYPES_TILES].find(template => template.itemId === this[unselectedTemplateOrProcessTypeTile]);
                        if (foundTemplate) {
                            foundTemplate.isSelected = false;
                        }
                        this[unselectedTemplateOrProcessTypeTile] = '';
                }
            } else if (items.length === 1) {
                // make sure there is always a template or a process type tile is selected
                this.state[templatesOrProcessTypeTiles][index].isSelected = true;
                this[selectedTemplateOrProcessTypeTile] = item.id;
                this.fireSelectedTemplateChangedEvent(item.id, isProcessType);
            }
        });
    }

    fireSelectedTemplateChangedEvent(selectedId, isProcessType) {
        this.dispatchEvent(new TemplateChangedEvent(selectedId, isProcessType));
    }

    fireCannotRetrieveTemplatesEvent() {
        this.dispatchEvent(new CannotRetrieveTemplatesEvent());
    }
}