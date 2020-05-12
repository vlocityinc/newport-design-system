// @ts-nocheck
import { BaseCommand } from './baseCommand';
import shiftFocusForwardCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.shiftFocusForwardCommandLabel';
export class ShiftFocusForwardCommand extends BaseCommand {
    /**
     * Command to shift focus forward among the editor panels (header, toolbar, toolbox, canvas)
     */
    constructor(callback) {
        super(callback, 'shiftfocusforward', shiftFocusForwardCommandLabel, false);
    }
}
