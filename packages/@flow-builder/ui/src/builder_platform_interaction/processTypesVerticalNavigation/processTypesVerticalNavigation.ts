// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import {
    ALL_PROCESS_TYPE,
    getProcessTypesWithIcons,
    sortProcessTypes
} from 'builder_platform_interaction/processTypeLib';

export default class ProcessTypesVerticalNavigation extends LightningElement {
    _processTypes = [];

    /**
     * All process types
     *
     * @returns {Array} array of all the process types
     */
    @api
    get processTypes() {
        return this._processTypes;
    }

    set processTypes(newVal) {
        const processTypes = newVal ? newVal.slice() : [];
        sortProcessTypes(processTypes);
        this._processTypes = getProcessTypesWithIcons([ALL_PROCESS_TYPE].concat(processTypes));
    }

    /**
     * Select(ed) process type name
     */
    @api
    selectedProcessType = ALL_PROCESS_TYPE.name;

    /**
     * Handler for process type selection
     *
     * @param {Object} event - navigation select event
     * @param {string} event.detail.name - selected process type name
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.dispatchEvent(new ProcessTypeSelectedEvent(event.detail.name));
    }
}
