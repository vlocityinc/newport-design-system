// @ts-nocheck
import { BaseCommand } from './baseCommand';
import zoomInCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomInCommandLabel';
const commandName = 'zoomin';
export class ZoomInCommand extends BaseCommand {
    /**
     * Command to zoom in the canvas
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, zoomInCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
