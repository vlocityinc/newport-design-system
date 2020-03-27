import { LightningElement, api, track } from 'lwc';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import {
    ALL_PROCESS_TYPE,
    getProcessTypesWithIcons,
    sortProcessTypes
} from 'builder_platform_interaction/processTypeLib';

export default class ProcessTypesVerticalNavigation extends LightningElement {
    /**
     * All process types
     * @return {Array} array of all the process types
     */
    @api
    get processTypes() {
        return this.state.processTypes;
    }

    set processTypes(processTypes) {
        this.state.processTypes = processTypes ? processTypes.slice() : processTypes;
        sortProcessTypes(this.state.processTypes);
        this.state.items = getProcessTypesWithIcons([ALL_PROCESS_TYPE].concat(this.processTypes || []));
    }

    @api
    get items() {
        return this.state.items;
    }

    /**
     * Select(ed) process type name
     * @return {String} select(ed) process type name
     */
    @api
    selectedProcessType = ALL_PROCESS_TYPE.name;

    @track
    state = {
        processTypes: [],
        items: []
    };

    /**
     * Handler for process type selection
     * @param {Object} event - navigation select event
     * @param {string} event.detail.name - selected process type name
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.dispatchEvent(new ProcessTypeSelectedEvent(event.detail.name));
    }
}
