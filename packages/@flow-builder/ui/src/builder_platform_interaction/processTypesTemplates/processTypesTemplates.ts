// @ts-nocheck
import spinnerAlternativeText from '@salesforce/label/FlowBuilderEditor.spinnerAlternativeText';
import { CannotRetrieveTemplatesEvent, TemplateChangedEvent } from 'builder_platform_interaction/events';
import {
    ALL_PROCESS_TYPE,
    cacheTemplates,
    createFlowEntryTilesForTemplates,
    getTemplates
} from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { api, LightningElement, track } from 'lwc';

export default class ProcessTypesTemplates extends LightningElement {
    LABELS = {
        spinnerAlternativeText
    };

    @api
    radioGroupName;

    @api
    get processTypes() {
        return this.state.processTypes;
    }

    set processTypes(value) {
        this.state.processTypes = value;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.selectedItem = null;
        this.updateTiles();
    }

    @api
    get blankItems() {
        return this.state.blankItems;
    }

    set blankItems(value) {
        this.state.blankItems = value;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.selectedItem = null;
        this.updateTiles();
    }

    @api
    get processType() {
        return this.state.processType;
    }

    set processType(newValue) {
        if (this.state.processType !== newValue) {
            this.state.processType = newValue;
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.selectedItem = null;
            this.updateTiles();
        }
    }

    @api
    get selectedItem() {
        return this.state.selectedItem;
    }

    set selectedItem(value) {
        if (this.state.selectedItem !== value) {
            this.state.selectedItem = value;
            let detail;
            if (value) {
                value.isSelected = false;
                value.isSelected = true;
                detail = value.templateId || {
                    processType: this.state.selectedItem.processType,
                    defaultTriggerType: this.state.selectedItem.defaultTriggerType
                };
            }
            this.dispatchEvent(new TemplateChangedEvent(detail));
        }
    }

    @track
    state = {
        processTypes: null,
        processType: null,
        blankItems: [],
        templates: [], // an array of Template that are fetched for the selected process type
        templatesLoading: false,
        processTypesTiles: [] // an array of process type tiles
    };

    get items() {
        return this.state.processTypesTiles.concat(this.state.templates);
    }

    get showGetTemplates() {
        return (!this.state.templates || this.state.templates.length === 0) && this.state.processType;
    }

    updateTiles() {
        this.updateBlankTiles();
        this.updateTemplateTiles();
        this.updateSelectedItem();
    }

    updateBlankTiles() {
        let blankItems = this.state.blankItems;
        if (blankItems && blankItems.length > 0 && this.processType) {
            if (this.processType !== ALL_PROCESS_TYPE.name) {
                blankItems = blankItems.filter((item) => item.processType === this.processType);
            }
            this.state.processTypesTiles = blankItems.map((item) => ({ ...item }));
        } else {
            this.state.processTypesTiles = [];
        }
    }

    updateTemplateTiles() {
        // check if we can get the templates from cache
        const templates = getTemplates(this.processType);
        if (!templates) {
            this.state.templates = [];
            this.fetchTemplates();
        } else {
            this.state.templates = createFlowEntryTilesForTemplates(templates);
        }
    }

    fetchTemplates() {
        if (!this.processType || !this.state.processTypes || this.state.processTypes.length === 0) {
            return;
        }

        const processTypes =
            this.processType !== ALL_PROCESS_TYPE.name
                ? [this.processType]
                : this.state.processTypes.map((type) => type.name);
        if (!processTypes || processTypes.length === 0) {
            return;
        }

        if (this.state.templatesLoading) {
            return;
        }

        this.state.templatesLoading = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_TEMPLATES, { processTypes }, { disableErrorModal: true })
            .then((data) => {
                this.state.templatesLoading = false;
                // caches the returned templates to avoid calling to server when changing the process type
                cacheTemplates(this.state.processTypes, this.processType, data);
                this.updateTemplateTiles();
                this.updateSelectedItem();
            })
            .catch(() => {
                this.state.templatesLoading = false;
                this.dispatchEvent(new CannotRetrieveTemplatesEvent());
            });
    }

    updateSelectedItem() {
        const items = this.items;
        let selectedItem = this.selectedItem;
        // Make sure the selected item is present in the current tile set and
        // re-select it in case the current tile set has changed.
        if (selectedItem) {
            selectedItem = items ? items.find((i) => i.itemId === selectedItem.itemId) : null;
        }
        // Select the first item, if none are selected.
        if (!selectedItem && items && items.length > 0) {
            selectedItem = items[0];
        }
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.selectedItem = selectedItem;
    }

    select(itemId) {
        const item = this.items.find((template) => template.itemId === itemId);
        item.isSelected = false;
        item.isSelected = true;
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.selectedItem = item;
    }

    deselect(itemId) {
        const item = this.items.find((template) => template.itemId === itemId);
        item.isSelected = true;
        item.isSelected = false;
    }

    handleTemplateOrProcessTypeTileChanged(event) {
        event.stopPropagation();
        const deselectedItem = event.detail.items.find((item) => !item.isSelected);
        const selectedItem = event.detail.items.find((item) => item.isSelected);
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
}
