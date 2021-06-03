// @ts-nocheck
import { BaseCommand } from './baseCommand';
import zoomOutCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomOutCommandLabel';
const commandName = 'zoomout';
export class ZoomOutCommand extends BaseCommand {
    /**
     * Command to zoom out the canvas
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, zoomOutCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
