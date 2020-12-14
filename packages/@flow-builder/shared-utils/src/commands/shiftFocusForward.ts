// @ts-nocheck
import { BaseCommand } from './baseCommand';
import shiftFocusForwardCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.shiftFocusForwardCommandLabel';
const commandName = 'shiftfocusforward';
export class ShiftFocusForwardCommand extends BaseCommand {
    /**
     * Command to shift focus forward among the editor panels (header, toolbar, toolbox, canvas)
     */
    constructor(callback) {
        super(callback, commandName, shiftFocusForwardCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
