import { BaseCommand } from './baseCommand';
import zoomToViewCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomToViewCommandLabel';
export class ZoomToViewCommand extends BaseCommand {
    /**
     * Command to zoom-to-view the canvas
     */
    constructor(callback) {
        super(callback, 'zoomtoview', zoomToViewCommandLabel, false);
    }
}
