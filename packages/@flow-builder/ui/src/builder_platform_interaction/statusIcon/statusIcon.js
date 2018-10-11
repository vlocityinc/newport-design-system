import {
    LightningElement,
    api,
    track
} from 'lwc';
import { invokePopover } from 'builder_platform_interaction/builderUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { LABELS } from './statusIconLabels';
const dotPrefixForClass = '.';

export default class StatusIcon extends LightningElement {
    internalMessages = [];
    panelInstance = undefined;

    @track isIconVisible = false;
    @track panelHidden = true;

    @api type = 'error'; // Can only be error or warning as of now
    @api direction = 'south'; // other options : north, east & west
    @api headerforsummary; // header for summary / body of panel
    @api showOnlyNumberOfErrors = false;

    @api get messages() {
        return this.internalMessages;
    }

    set messages(msgs = []) {
        this.internalMessages = msgs.map(error => {
            return {
                message: error.messages,
                guid: generateGuid()
            };
        });

        // Closing the panel if it was previously open and errors got updated
        if (this.panelInstance && this.closePanelFunction) {
            this.closePanelFunction();
        }

        if (this.internalMessages && this.internalMessages.length > 0) {
            this.isIconVisible = true;
            this.createPanel();
        } else {
            this.isIconVisible = false;
        }
    }

    /**
     * Public method to get the panel Instance
     * @returns {Object} panelInstance
     */
    @api getPanelInstance() {
        return this.panelInstance;
    }

    /**
     * Public method to close the panel instance
     * @returns {Promise} resolves to close the panel instance, rejects if the instance doesn't exist
     */
    @api closePanelInstance() {
        return new Promise((resolve, reject) => {
            if (this.panelInstance) {
                resolve(this.closePanelFunction && this.closePanelFunction());
            } else {
                reject('Panel instance doesnt exist');
            }
        });
    }

    constructor() {
        super();
        this.classForIcon =  'statusIcon-' + generateGuid(); // This is needed to uniquely identify the specific instance of status icon in the dom
    }

    /**
     * @returns {string} iconNameFromType : based on type (eg: utility:error or utility:warning)
     */
    get iconNameFromType() {
        return 'utility:' + this.type;
    }

    /**
     * @returns {string} iconClassFromType: css class for icon (eg: slds-icon-text-error)
     */
    get iconClassFromType() {
        return 'slds-icon-text-' + this.type;
    }

    /**
     * @returns {string} iconTitle - dynamic title based on type of status icon and state of popover being open or close
     */
    get iconTitle() {
        let title;
        if (this.type === 'warning') {
            title = this.panelHidden ? LABELS.statusIconShowWarningTitle : LABELS.statusIconHideWarningTitle;
        } else {
            title = this.panelHidden ? LABELS.statusIconShowErrorTitle : LABELS.statusIconHideErrorTitle;
        }
        return title;
    }

    /**
     * Handle Icon click : event handler for clicking on icon button. Acts as a toggle to show/hide the panel and create it for the very first time.
     */
    handleIconClick() {
        if (this.panelInstance && !this.panelHidden) {
            this.closePanelFunction();
        } else {
            this.createPanel();
        }
    }

    /**
     * Helper method to handle closing of the panel on esc key or when clicking 'X'
     */
    closePanelFunction = () => {
        if (this.panelInstance) {
            this.panelInstance.close();
            this.panelInstance = null; // Get rid of the access to the older instance
            this.panelHidden = true;
        }
    };

    /**
     * Used to create the status-icon-summary component
     * @param {Object} panel - Invoked panel
     * @param {Object} statusIconSummaryComponent - status-icon-summary component created inside the panel
     */
    onCreatePanel = (panel, statusIconSummaryComponent) => {
        this.panelInstance = panel;
        this.panelHidden = false;
        statusIconSummaryComponent.handleClickCallback = this.closePanelFunction;
    };

    /**
     * Used to destroy the panel on esc key
     */
    onDestroyPanel = () => {
        this.closePanelFunction();
    };

    /**
     * creates a ui panel of type panel with the given params and sets statusIconSummary in the body of the panel
     */
    createPanel() {
        const header = this.headerforsummary;
        const messages = this.internalMessages;
        const type = this.type;
        const showOnlyNumberOfErrors = this.showOnlyNumberOfErrors;
        const direction = this.direction;
        const referenceSelector = dotPrefixForClass + this.classForIcon + ' lightning-button-icon';
        const createPanel = this.onCreatePanel;
        const destroyPanel = this.onDestroyPanel;
        invokePopover('builder_platform_interaction:statusIconSummary', { header, messages, type, showOnlyNumberOfErrors }, { direction, referenceSelector, createPanel, destroyPanel });
    }

    /**
     * We are setting the id on lightning button icon in renderedCallback
     * This is a temporary fix until W-5445508 is resolved
     */
    renderedCallback() {
        const lightningButtonIcon = this.template.querySelector('lightning-button-icon');
        if (lightningButtonIcon && lightningButtonIcon.id === "") {
            lightningButtonIcon.id = generateGuid();
        }
    }
}