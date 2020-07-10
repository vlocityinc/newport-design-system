import { LightningElement, api } from 'lwc';
import { LABELS } from './welcomeMatBodyLabels';

export default class WelcomeMatBody extends LightningElement {
    @api processType;
    @api triggerType;
    @api createCallback;
    @api closeCallback;

    get labels() {
        return LABELS;
    }

    createFreeFormCanvas = () => {
        this.createCallback(this.processType, this.triggerType, false);
        this.closeCallback();
    };

    createAutoLayoutCanvas = () => {
        this.createCallback(this.processType, this.triggerType, true);
        this.closeCallback();
    };
}
