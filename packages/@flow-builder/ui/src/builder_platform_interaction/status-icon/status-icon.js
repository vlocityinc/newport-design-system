import { Element, api, createElement, track } from 'engine';
import { showCustomOverlay } from 'lightning-overlay-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import StatusIconSummary from 'builder_platform_interaction-status-icon-summary';

const dotPrefixForClass = ".";

export default class StatusIcon extends Element {
    internalMessages = [];
    panelInstance = undefined;
    panelHidden = true;

    @api type = 'error'; // Can only be error or warning as of now
    @track isIconVisible = false;
    @api direction = 'south'; // other options : north, east & west
    @api headerforsummary; // header for summary / body of panel
    @api showOnlyNumberOfErrors = false;

    @api get messages() {
        return this.internalMessages;
    }

    @api set messages(msgs = []) {
        this.internalMessages = msgs.map(error => {
            return {
                message: error.messages,
                guid: generateGuid()
            };
        });

        if (this.internalMessages && this.internalMessages.length > 0) {
            this.isIconVisible = true;
            if (this.panelInstance) {
                this.showPanelFunction();
            } else {
                this.createPanel();
            }
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
     * @returns {Promise} resolves to close the panel instance, rejects if the instnace doesn't exist
     */
    @api closePanelInstance() {
        return new Promise((resolve, reject) => {
            if (this.panelInstance) {
                resolve(this.closePanelFunction && this.closePanelFunction());
            } else {
                reject("Panel instance doesnt exist");
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
     * Handle Icon click : event handler for clicking on icon button. Acts as a toggle to show/hide the panel and create it for the very first time.
     */
    handleIconClick() {
        if (this.panelInstance && !this.panelHidden) {
            this.hidePanelFunction();
        } else if (this.panelInstance && this.panelHidden) {
            this.showPanelFunction();
        } else {
            this.createPanel();
        }
    }

    /**
     * Binds the internal show / hide / close functions for panel
     * @param {Object} panel : panel instance
     */
    bindInternalFunctions = (panel) => {
        this.showPanelFunction = () => {
            panel.show().then(() => {
                this.panelHidden = false;
            });
        };
        this.hidePanelFunction = () => {
            panel.hide().then(() => {
                this.panelHidden = true;
            });
        };
        this.closePanelFunction = () => {
            this.panelInstance = null; // Get rid of the access to the older instance
            panel.close().then(() => {
                this.panelHidden = true;
            });
        };
    }

    /**
     * creates a ui panel of type panel with the given params and sets statusIconSummary in the body of the panel
     */
    createPanel() {
        const statusIconSummaryComponent = createElement('builder_platform_interaction-status-icon-summary', {is: StatusIconSummary});
        statusIconSummaryComponent.header = this.headerforsummary;
        statusIconSummaryComponent.messages = this.internalMessages;
        statusIconSummaryComponent.type = this.type;
        statusIconSummaryComponent.showOnlyNumberOfErrors = this.showOnlyNumberOfErrors;
        showCustomOverlay({
            panelType: 'panel',
            body: statusIconSummaryComponent,
            direction: this.direction,
            showPointer: true,
            padding: 2,
            referenceSelector: dotPrefixForClass + this.classForIcon,
        }).then(panel => {
            this.panelInstance = panel;
            this.panelHidden = false;
            this.bindInternalFunctions(panel);
            statusIconSummaryComponent.handleClickCallback = this.hidePanelFunction;
        }).catch(errorMessages => {
            throw new Error('Status Icon Panel creation failed : ' + errorMessages);
        });
    }
}