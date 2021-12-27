// @ts-nocheck
import shiftFocusBackwardCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.shiftFocusBackwardCommandLabel';
import { BaseCommand } from './baseCommand';
const commandName = 'shiftfocusbackward';
export class ShiftFocusBackwardCommand extends BaseCommand {
    /**
     * Command to shift focus backward among the editor panels (header, toolbar, toolbox, canvas)
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, shiftFocusBackwardCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
