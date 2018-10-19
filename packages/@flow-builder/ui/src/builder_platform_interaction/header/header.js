import { LightningElement, api} from 'lwc';
import { LABELS } from "./headerLabels";
import { BackEvent } from 'builder_platform_interaction/events';


export default class Header extends LightningElement {
    @api
    flowName

    @api
    flowVersion

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

    get headerHelpUrl() {
        if (this.helpUrl) {
            return this.helpUrl;
        }
        return null;
    }

    handleBack(event) {
        event.preventDefault();
        const backEvent = new BackEvent();
        this.dispatchEvent(backEvent);
    }
}