// @ts-nocheck
import zoomInCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomInCommandLabel';
import { BaseCommand } from './baseCommand';
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
