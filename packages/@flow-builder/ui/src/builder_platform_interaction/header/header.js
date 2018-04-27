import { Element, api} from 'engine';

/**
 * Header component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Avinash Kasipathy
 * @since 214
 */
export default class Header extends Element {
    // TODO: Import Localization Labels & getter for the component to use that.
    // TODO: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004ftBbIAI/view
    headerLabels = {
        appName: 'Flow Builder',
        backLabel: 'Back',
        helpLabel: 'Help'
    };

    @api
    flowName

    @api
    flowVersion

    @api
    backUrl

    @api
    helpUrl

    // TODO: Import Localization Labels & getter for the -V.
    // TODO: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004ftBbIAI/view
    get fileNameAndVersion() {
        if (this.flowName && this.flowVersion) {
            return this.flowName + " - V" + this.flowVersion;
        }
        return null;
    }

    get headerBackUrl() {
        if (this.backUrl) {
            return this.backUrl;
        }
        return null;
    }

    get headerHelpUrl() {
        if (this.helpUrl) {
            return this.helpUrl;
        }
        return null;
    }
}