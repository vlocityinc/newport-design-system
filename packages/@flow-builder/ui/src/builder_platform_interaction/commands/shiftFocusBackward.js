// @ts-nocheck
import { BaseCommand } from './baseCommand';
import shiftFocusBackwardCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.shiftFocusBackwardCommandLabel';
export class ShiftFocusBackwardCommand extends BaseCommand {
    /**
     * Command to shift focus backward among the editor panels (header, toolbar, toolbox, canvas)
     */
    constructor(callback) {
        super(callback, 'shiftfocusbackward', shiftFocusBackwardCommandLabel, false);
    }
}
