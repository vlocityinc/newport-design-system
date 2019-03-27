import { LightningElement, api} from 'lwc';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE, getProcessTypesWithIcons, PROCESS_TYPES_ICONS } from 'builder_platform_interaction/processTypeLib';

const SELECTORS = {
    VERTICAL_NAVIGATION_OVERFLOW: 'lightning-vertical-navigation-overflow',
    VERTICAL_NAVIGATION_OVERFLOW_BUTTON : '.slds-nav-vertical__action_overflow',
    VERTICAL_NAVIGATION_ITEM_ICON : 'lightning-vertical-navigation-item-icon',
    VERTICAL_NAVIGATION_ITEM_ICON_ANCHOR: 'a.slds-nav-vertical__action',
};
// Specific style to truncate label
const TRUNCATE_DISPLAY_STYLE = "display:inline-block;";
const TRUNCATE_SLDS_CSS_CLASS = "slds-truncate";

export default class ProcessTypesVerticalNavigation extends LightningElement {
    /**
     * All unfiltered process types
     * @return {Array} array of all the process types
     */
    @api
    processTypes;

    /**
     * Select(ed) process type name
     * @return {String} select(ed) process type name
     */
    @api
    selectedProcessType = ALL_PROCESS_TYPE.name;

    /**
     * Has some other process types?
     * @return {Boolean} true if other process types exist false otherwise
     */
    get hasOtherProcessTypes() {
        return this.otherProcessTypes && this.otherProcessTypes.length;
    }

    /**
     * @typedef {Object} ProcessTypeWithIcon
     *
     * @property {String} name
     * @property {String} label
     * @property {String} iconName
     */

    /**
     * Get the "featured" process types with their corresponding icon (or default if none found)
     * @return {ProcessTypeWithIcon[]} array of "featured" process types with corresponding icon or default one (fallback) if none foundd
     */
    @api
    get featuredProcessTypes() {
        return getProcessTypesWithIcons(this.processTypes, PROCESS_TYPES_ICONS.FEATURED,
            processType => PROCESS_TYPES_ICONS.FEATURED.has(processType.name),
            filteredProcessTypes => filteredProcessTypes.unshift(ALL_PROCESS_TYPE));
    }

    /**
     * Get the "other" process types with their corresponding icon (or default if none found)
     * @return {ProcessTypeWithIcon[]} array of "other" process types with corresponding icon or default one (fallback) if none foundd
     */
    @api
    get otherProcessTypes() {
        if (!this._otherProcessTypes) {
            this._otherProcessTypes = getProcessTypesWithIcons(this.processTypes, PROCESS_TYPES_ICONS.OTHERS,
            processType => !PROCESS_TYPES_ICONS.FEATURED.has(processType.name));
        }
        return this._otherProcessTypes;
    }

    /**
     * Handler for process type selection
     * @param {Object} event - navigation select event
     * @param {string} event.detail.name - selected process type name
     */
    handleSelectProcessType(event) {
        event.stopPropagation();
        this.dispatchEvent(new ProcessTypeSelectedEvent(event.detail.name));
    }

    /**
     * Expand "other" process types section
     */
    expandOtherSection() {
        const toggleButtonOverFlow = this.template.querySelector(SELECTORS.VERTICAL_NAVIGATION_OVERFLOW).shadowRoot.querySelector(SELECTORS.VERTICAL_NAVIGATION_OVERFLOW_BUTTON);
        if (toggleButtonOverFlow) {
            toggleButtonOverFlow.dispatchEvent(new Event('click'));
        }
    }

    /**
     * Truncate process type label if needed via CSS
     * {@link ProcessTypesVerticalNavigation#TRUNCATE_DISPLAY_STYLE}, {@link ProcessTypesVerticalNavigation#TRUNCATE_SLDS_CSS_CLASS}
     */
    truncateLabels() {
        const verticalActions = this.template.querySelectorAll(SELECTORS.VERTICAL_NAVIGATION_ITEM_ICON);
        if (verticalActions) {
            verticalActions.forEach(verticalAction => {
                const anchor = verticalAction.shadowRoot.querySelector(SELECTORS.VERTICAL_NAVIGATION_ITEM_ICON_ANCHOR);
                if (anchor) {
                    anchor.setAttribute("style", TRUNCATE_DISPLAY_STYLE);
                    anchor.className += ` ${TRUNCATE_SLDS_CSS_CLASS}`;
                }
            });
        }
    }

    /**
     * Used to expand "other" process types section and truncate process type label if needed via CSS
     * {@link ProcessTypesVerticalNavigation#TRUNCATED_LABEL_STYLE}
     */
    renderedCallback() {
        if (!this._isInitialized) {
            this.expandOtherSection();
            this.truncateLabels();
            this._isInitialized = true;
        }
    }
}