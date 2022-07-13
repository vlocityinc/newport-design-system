import { invokeKeyboardHelpDialog } from 'builder_platform_interaction/builderUtils';
import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
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
    private _builderName;
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
    get builderName() {
        return this._builderName;
    }

    set builderName(builderName) {
        this._builderName = builderName;
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
    guardrailsParams;

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
        } else {
            document.title = this.name;
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
