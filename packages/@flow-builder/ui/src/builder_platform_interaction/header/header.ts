import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './headerLabels';
import { invokeKeyboardHelpDialog } from 'builder_platform_interaction/builderUtils';

const { logInteraction } = loggingUtils;

const DEBUG_STATUS = {
    FINISHED: 'FINISHED',
    PAUSED: 'WAITING',
    ERROR: 'ERROR'
};

const BACK_TOOLTIP_CONST = 'slds-popover  slds-nubbin_top slds-popover_tooltip custom-tooltip';

export default class Header extends LightningElement {
    @api
    flowName;

    @api
    flowVersion;

    @api
    runInMode;

    @api
    backUrl;

    @api
    helpUrl;

    @api
    trailheadUrl;

    @api
    trailblazerCommunityUrl;

    @api
    builderIcon;

    @api
    builderName;

    @api
    guardrailsParams;

    @api
    interviewLabel;

    @api
    showInterviewLabel;

    @api
    showDebugStatus;

    @api
    debugInterviewStatus;

    @api focus() {
        const headerFocusableElement = this.template.querySelector('[href].test-back-url');
        if (headerFocusableElement) {
            headerFocusableElement.focus();
        }
    }

    @track isGuardrailsEnabled = orgHasFlowBuilderGuardrails();

    @track backTooltipClass = BACK_TOOLTIP_CONST + ' slds-fall-into-ground';

    get labels() {
        return LABELS;
    }

    get flowNameAndVersionTitle() {
        if (this.flowName && this.flowVersion) {
            return this.flowName + LABELS.versionLabelText + this.flowVersion;
        }
        return null;
    }

    get currentFlowName() {
        if (this.flowName && this.flowVersion) {
            return this.flowName;
        }
        return null;
    }

    get flowVersionNumber() {
        if (this.flowName && this.flowVersion) {
            return LABELS.versionLabelText + this.flowVersion;
        }
        return null;
    }

    get isSystemMode() {
        return this.runInMode === 'SystemModeWithSharing' || this.runInMode === 'SystemModeWithoutSharing';
    }

    get systemModeLabel() {
        return LABELS.systemModeLabelText;
    }

    get iconName() {
        return this.builderIcon || 'utility:flow';
    }

    get name() {
        return this.builderName || LABELS.appNameText;
    }

    get formattedInterviewLabel() {
        return LABELS.interviewLabelTitle + this.interviewLabel;
    }

    get interviewStatus() {
        const interviewStatus = this.debugInterviewStatus;
        if (interviewStatus === DEBUG_STATUS.FINISHED) {
            return LABELS.debugBadgeCompleted;
        } else if (interviewStatus === DEBUG_STATUS.PAUSED) {
            return LABELS.debugBadgePaused;
        }
        return LABELS.debugBadgeError;
    }

    get debugBadgeClass() {
        let badgeClass = 'slds-align-middle slds-m-left_xx-small test-debug-badge';
        const interviewStatus = this.debugInterviewStatus;
        if (interviewStatus === DEBUG_STATUS.FINISHED) {
            badgeClass += ' slds-theme_success';
        } else if (interviewStatus === DEBUG_STATUS.ERROR) {
            badgeClass += ' slds-theme_error';
        } else if (interviewStatus === DEBUG_STATUS.PAUSED) {
            badgeClass += ' slds-theme_warning';
        }
        return badgeClass;
    }
    /**
     * @return {String} the css class for badge
     */
    get badgeClasses() {
        let classes = 'slds-align-middle slds-m-left_xx-small';
        if (!this.grayPill) {
            classes = `${classes} slds-badge_lightest`;
        }
        return classes;
    }

    handleClickHelp() {
        this.logHeaderInteraction('help-button');
    }

    handleClickTrailhead() {
        this.logHeaderInteraction('trailhead-button');
    }

    handleClickTrailblazerCommunity() {
        this.logHeaderInteraction('trailblazer-community-button');
    }

    handleClickKeyboardHelp() {
        this.logHeaderInteraction('keyboard-help-button');
        invokeKeyboardHelpDialog();
    }

    handleClickViewGuardrails() {
        this.logHeaderInteraction('view-guardrails-button');
    }

    handleClickMuteGuardrails() {
        this.logHeaderInteraction(
            this.guardrailsParams.running ? 'unmute-guardrails-button' : 'mute-guardrails-button'
        );
    }

    logHeaderInteraction(menuItem) {
        logInteraction(menuItem, 'header', null, 'click');
    }

    handleBackFocus() {
        this.backTooltipClass = BACK_TOOLTIP_CONST + ' slds-rise-from-ground ';
    }
    handleBackBlur() {
        this.backTooltipClass = BACK_TOOLTIP_CONST + ' slds-fall-into-ground ';
    }
}
