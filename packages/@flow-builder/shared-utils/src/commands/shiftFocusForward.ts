// @ts-nocheck
import shiftFocusForwardCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.shiftFocusForwardCommandLabel';
import { BaseCommand } from './baseCommand';
const commandName = 'shiftfocusforward';
export class ShiftFocusForwardCommand extends BaseCommand {
    /**
     * Command to shift focus forward among the editor panels (header, toolbar, toolbox, canvas)
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, shiftFocusForwardCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
