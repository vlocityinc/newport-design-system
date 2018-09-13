import { LightningElement, api} from 'lwc';
import { LABELS } from "./headerLabels";


export default class Header extends LightningElement {
    @api
    flowName

    @api
    flowVersion

    @api
    backUrl

    @api
    helpUrl

    get labels() {
        return LABELS;
    }

    get fileNameAndVersion() {
        if (this.flowName && this.flowVersion) {
            return this.flowName + LABELS.versionLabelText + this.flowVersion;
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