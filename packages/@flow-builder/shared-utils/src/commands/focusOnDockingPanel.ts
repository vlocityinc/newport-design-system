// @ts-nocheck
import { BaseCommand } from './baseCommand';
import dockingPanelFocusLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.dockingPanelFocusLabel';
const commandName = 'focusOnDockingPanel';
export class FocusOnDockingPanelCommand extends BaseCommand {
    /**
     * Command to shift focus to docking panel
     */
    constructor(callback) {
        super(callback, commandName, dockingPanelFocusLabel, false);
    }
    static COMMAND_NAME = commandName;
}
