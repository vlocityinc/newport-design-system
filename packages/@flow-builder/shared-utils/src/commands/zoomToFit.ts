// @ts-nocheck
import { BaseCommand } from './baseCommand';
import zoomToFitCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomToFitCommandLabel';
const commandName = 'zoomtofit';
export class ZoomToFitCommand extends BaseCommand {
    /**
     * Command to zoom-to-fit the canvas
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, zoomToFitCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
