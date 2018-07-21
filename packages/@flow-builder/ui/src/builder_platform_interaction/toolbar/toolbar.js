import { Element, api } from 'engine';
import { RunFlowEvent, DebugFlowEvent, SaveFlowEvent, SaveFlowAsEvent } from 'builder_platform_interaction-events';
import { LABELS } from './toolbar-labels';

const ACTIVE = 'Active';
const OBSOLETE = 'Obsolete';
const DRAFT = 'Draft';
const INVALID_DRAFT = 'InvalidDraft';

/**
 * Toolbar component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Toolbar extends Element {
    @api flowStatus;
    @api isRunDebugDisabled;
    @api isSaveDisabled;
    @api isSaveAsDisabled;
    @api errors;

    labels = LABELS;

    statusLabelAndTitle = {
        [ACTIVE]: {
            label: this.labels.activeLabel,
            title: this.labels.activeTitle
        },
        [OBSOLETE]: {
            label: this.labels.deactivatedLabel,
            title: this.labels.deactivatedTitle
        },
        [DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        },
        [INVALID_DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        }
    };

    get statusBadgeLabel() {
        return this.statusLabelAndTitle[this.flowStatus].label;
    }

    get statusBadgeTitle() {
        return this.statusLabelAndTitle[this.flowStatus].title;
    }

    get statusBadgeClasses() {
        let classes = 'status-badge slds-align-middle slds-m-left_xx-small';
        if (this.flowStatus === ACTIVE) {
            classes = `${classes} slds-theme_success`;
        }
        return classes;
    }

    headerTitleForSummary = LABELS.errorPopOverHeader;

    handleRun(event) {
        event.preventDefault();
        const runFlowEvent = new RunFlowEvent();
        this.dispatchEvent(runFlowEvent);
    }

    handleDebug(event) {
        event.preventDefault();
        const debugFlowEvent = new DebugFlowEvent();
        this.dispatchEvent(debugFlowEvent);
    }

    /**
     * Event handler for click event on save button.
     * It dispatches an event named save which can be handled by parent component
     * @param {Object} event - Save button click event
     */
    handleSave(event) {
        event.preventDefault();
        const saveEvent = new SaveFlowEvent();
        this.dispatchEvent(saveEvent);
    }

    handleSaveAs(event) {
        event.preventDefault();
        const saveAsEvent = new SaveFlowAsEvent();
        this.dispatchEvent(saveAsEvent);
    }
}