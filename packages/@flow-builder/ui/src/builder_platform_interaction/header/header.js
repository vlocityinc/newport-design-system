import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './headerLabels';
import { invokeKeyboardHelpDialog } from 'builder_platform_interaction/builderUtils';

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

    @api focus() {
        const headerFocusableElement = this.template.querySelector('[href].test-back-url');
        if (headerFocusableElement) {
            headerFocusableElement.focus();
        }
    }

    @track isGuardrailsEnabled = orgHasFlowBuilderGuardrails();

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

    get assistiveName() {
        return this.name + ': ';
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
}
