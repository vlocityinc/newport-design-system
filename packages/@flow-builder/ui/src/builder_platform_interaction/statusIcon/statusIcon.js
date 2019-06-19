import { LightningElement, api, track } from 'lwc';
import {
    isPopoverOpen,
    hidePopover,
    showPopover,
    getPopoverReferenceElement
} from 'builder_platform_interaction/builderUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { LABELS } from './statusIconLabels';

const dotPrefixForClass = '.';

export default class StatusIcon extends LightningElement {
    internalMessages = [];

    @track isIconVisible = false;

    @api type; // Can only be error or warning as of now
    @api direction = 'south'; // other options : north, east & west
    @api headerforsummary; // header for summary / body of panel
    @api showOnlyNumberOfErrors = false;
    @api closeOnClickOut = false; // close when we click out of the popover
    @api showTotalCounts = false;
    @api showSections = false;

    @api get messages() {
        return this.internalMessages;
    }

    set messages(msgs) {
        this.createSections(msgs);

        if (this.allCount > 0) {
            this.isIconVisible = true;
        } else {
            this.isIconVisible = false;
        }
    }

    constructor() {
        super();
        this.classForIcon = 'statusIcon-' + generateGuid(); // This is needed to uniquely identify the specific instance of status icon in the dom
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
        const panelHidden = !isPopoverOpen();
        if (this.type === 'warning') {
            if (this.messages.length > 1) {
                title = panelHidden
                    ? LABELS.statusIconShowWarningPluralTitle
                    : LABELS.statusIconHideWarningPluralTitle;
            } else {
                title = panelHidden
                    ? LABELS.statusIconShowWarningSingularTitle
                    : LABELS.statusIconHideWarningSingularTitle;
            }
        } else if (this.messages.length > 1) {
            title = panelHidden
                ? LABELS.statusIconShowErrorPluralTitle
                : LABELS.statusIconHideErrorPluralTitle;
        } else {
            title = panelHidden
                ? LABELS.statusIconShowErrorSingularTitle
                : LABELS.statusIconHideErrorSingularTitle;
        }
        return title;
    }

    /**
     * @param {object} msgs - messages based off the type
     * @returns {object} createSections : based of msgs
     */
    createSections(msgs) {
        if (!msgs) {
            msgs = {};
        }
        this.allCount = 0;
        this.internalMessages = Object.keys(msgs).map(section => {
            let sectionHeader = section;
            let sectionInfo = '';
            this.allCount += msgs[section].length;
            if (this.type === 'warning') {
                sectionHeader =
                    section === 'INFO'
                        ? LABELS.generalWarningSectionTitle
                        : LABELS.validationWarningsSectionTitle;
                sectionInfo =
                    section === 'INFO'
                        ? LABELS.generalWarningSectionInfo
                        : LABELS.validationWarningsSectionInfo;
            }
            return {
                title: sectionHeader,
                sectionInfo,
                guid: generateGuid(),
                messages: msgs[section].map(msg => {
                    return {
                        message: msg,
                        guid: generateGuid()
                    };
                })
            };
        });
    }

    /**
     * @returns {Object} the reference element for the popover
     */
    getReferenceElement() {
        return this.template.querySelector(
            dotPrefixForClass + this.classForIcon
        );
    }

    /**
     * Handle Icon click : event handler for clicking on icon button. Acts as a toggle to show/hide the panel and create it for the very first time.
     */
    handleIconClick() {
        if (
            isPopoverOpen() &&
            this.getReferenceElement() === getPopoverReferenceElement()
        ) {
            // if the popover is open for the same reference element, close it
            hidePopover();
        } else {
            this.createPanel();
        }
    }

    /**
     * creates a ui panel of type panel with the given params and sets statusIconSummary in the body of the panel
     */
    @api
    createPanel() {
        // if the popover is already open, close it so that its contents get refreshed
        if (isPopoverOpen()) {
            hidePopover();
        }

        const header = this.headerforsummary;
        const sections = this.internalMessages;
        const type = this.type;
        const allCount = this.allCount;
        const showOnlyNumberOfErrors = this.showOnlyNumberOfErrors;
        const showTotalCounts = this.showTotalCounts;
        const showSections = this.showSections;
        const direction = this.direction;
        const referenceElement = this.getReferenceElement();
        const handleClickCallback = hidePopover;
        showPopover(
            'builder_platform_interaction:statusIconSummary',
            {
                header,
                sections,
                type,
                showOnlyNumberOfErrors,
                allCount,
                showTotalCounts,
                showSections,
                handleClickCallback
            },
            { referenceElement, direction }
        );
    }
}
