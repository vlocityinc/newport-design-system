// @ts-nocheck
import { BaseCommand } from './baseCommand';
import zoomToViewCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomToViewCommandLabel';
const commandName = 'zoomtoview';
export class ZoomToViewCommand extends BaseCommand {
    /**
     * Command to zoom-to-view the canvas
     */
    constructor(callback) {
        super(callback, commandName, zoomToViewCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
