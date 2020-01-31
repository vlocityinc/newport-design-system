import { LightningElement, api } from 'lwc';
import { LABELS } from './headerLabels';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';

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
    builderIcon;

    @api
    builderName;

    @api focus() {
        const headerFocusableElement = this.template.querySelector('[href].test-back-url');
        if (headerFocusableElement) {
            headerFocusableElement.focus();
        }
    }

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

    get headerHelpUrl() {
        if (this.helpUrl) {
            return this.helpUrl;
        }
        return null;
    }

    get iconName() {
        return this.builderIcon || 'utility:flow';
    }

    get name() {
        return this.builderName || LABELS.appNameText;
    }

    /**
     * @return {String} the css class for badge
     */
    get badgeClasses() {
        let classes = 'slds-align-middle slds-m-left_xx-small';
        if (!this.grayPill) {
            classes = `${classes} slds-theme_info`;
        }
        return classes;
    }

    handleClickHelp() {
        logInteraction(`help-button`, 'header', null, 'click');
    }
}
