import { invokeKeyboardHelpDialog } from 'builder_platform_interaction/builderUtils';
import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { FlowTestResultStatusType } from 'builder_platform_interaction/systemLib';
import { classSet } from 'lightning/utils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './headerLabels';

const { logInteraction } = loggingUtils;

export const DEBUG_STATUS = {
    FINISHED: 'FINISHED',
    PAUSED: 'WAITING',
    ERROR: 'ERROR',
    STARTED: 'STARTED'
};

const BACK_TOOLTIP_CONST = 'slds-popover  slds-nubbin_top slds-popover_tooltip custom-tooltip';

export default class Header extends LightningElement {
    static delegatesFocus = true;

    private _flowName;
    private _flowVersion;
    grayPill: any;

    @api
    get flowName() {
        return this._flowName;
    }

    set flowName(flowName) {
        this._flowName = flowName;
        this.updateDocumentTitle();
    }

    @api
    get flowVersion() {
        return this._flowVersion;
    }

    set flowVersion(flowVersion) {
        this._flowVersion = flowVersion;
        this.updateDocumentTitle();
    }

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

    @api
    testStatus;

    @api
    testLabel;

    @api
    showTestStatus;

    @api
    overriddenFlow;

    @api focus() {
        const headerFocusableElement = this.template.querySelector('[href].test-back-url') as any;
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

    get showLabel() {
        if (this.showInterviewLabel || this.showTestStatus) {
            return true;
        }
        return false;
    }

    // TODO move all test and debug logic out of header into editor as referenced in W-10863011
    /**
     * @returns {string} the formatted header label.
     */
    get formattedHeaderLabel() {
        if (this.showTestStatus) {
            return this.formattedTestLabel();
        }
        return this.formattedInterviewLabel();
    }

    /**
     * @returns {string} the formatted css class for the header label
     */
    get cssClassForHeaderLabel() {
        return classSet('slds-builder-header__item slds-p-horizontal_medium slds-truncate').add({
            'test-flowTest-label': this.showTestStatus,
            'test-interview-label': this.showInterviewLabel
        });
    }

    /**
     * @returns {string} the formatted interview label
     */
    formattedInterviewLabel() {
        return LABELS.interviewLabelTitle + this.interviewLabel;
    }

    /**
     * @returns {string} the formatted test label
     */
    formattedTestLabel() {
        return LABELS.testLabelTitle + this.testLabel;
    }

    /**
     * @returns {boolean} wheter a debug or test badge is to be displayed or not
     */
    get showBadgeStatus() {
        if (this.showDebugStatus || this.showTestStatus) {
            return true;
        }
        return false;
    }

    /**
     * @returns {string} the badge label for the badge which is displayed
     */
    get badgeStatus() {
        if (this.showDebugStatus) {
            return this.interviewStatus();
        }
        return this.testStatusLabel();
    }

    /**
     * @returns {string} the label for the flow debug run to be displayed
     */
    interviewStatus() {
        const interviewStatus = this.debugInterviewStatus;
        if (interviewStatus === DEBUG_STATUS.FINISHED) {
            return LABELS.debugBadgeCompleted;
        } else if (interviewStatus === DEBUG_STATUS.PAUSED) {
            return LABELS.debugBadgePaused;
        } else if (interviewStatus === DEBUG_STATUS.ERROR) {
            return LABELS.debugBadgeError;
        }

        return LABELS.debugBadgeNotTriggered;
    }

    /**
     * @returns {string} the label for the flow test to be displayed
     */
    testStatusLabel() {
        const testStatus = this.testStatus;
        if (testStatus === FlowTestResultStatusType.PASS) {
            return LABELS.testBadgePass;
        } else if (testStatus === FlowTestResultStatusType.FAIL) {
            return LABELS.testBadgeFail;
        } else if (testStatus === FlowTestResultStatusType.ERROR) {
            return LABELS.testBadgeError;
        }
        return '';
    }

    /**
     * @returns {string} the class for the badge to be displayed for debugging and testing
     */
    get badgeClass() {
        if (this.showDebugStatus) {
            return this.debugBadgeClass();
        }
        return this.testBadgeClass();
    }

    /**
     * @returns {string} the class for the test badge
     */
    testBadgeClass() {
        return classSet('slds-align-middle slds-m-left_xx-small test-flowtest-badge').add({
            'slds-theme_success': this.testStatus === FlowTestResultStatusType.PASS,
            'slds-theme_error':
                this.testStatus === FlowTestResultStatusType.ERROR || this.testStatus === FlowTestResultStatusType.FAIL
        });
    }

    /**
     * @returns {string} the class for the flow debug badge
     */
    debugBadgeClass() {
        const badgeClass = 'slds-align-middle slds-m-left_xx-small test-debug-badge';
        const interviewStatus = this.debugInterviewStatus;
        if (interviewStatus === DEBUG_STATUS.FINISHED) {
            return `${badgeClass} slds-theme_success`;
        } else if (interviewStatus === DEBUG_STATUS.PAUSED || interviewStatus === DEBUG_STATUS.STARTED) {
            return `${badgeClass} slds-theme_warning`;
        } else if (interviewStatus === DEBUG_STATUS.ERROR) {
            return `${badgeClass} slds-theme_error`;
        }
        return badgeClass;
    }
    /**
     * @returns {string} the css class for badge
     */
    get badgeClasses() {
        let classes = 'slds-align-middle slds-m-left_xx-small';
        if (!this.grayPill) {
            classes = `${classes} slds-badge_lightest`;
        }
        return classes;
    }

    updateDocumentTitle() {
        if (this.currentFlowName && this.flowVersionNumber) {
            document.title = `${this.currentFlowName}${this.flowVersionNumber}`;
        }
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
