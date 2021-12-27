// @ts-nocheck
import dockingPanelFocusLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.dockingPanelFocusLabel';
import { BaseCommand } from './baseCommand';
const commandName = 'focusOnDockingPanel';
export class FocusOnDockingPanelCommand extends BaseCommand {
    /**
     * Command to shift focus to docking panel
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, dockingPanelFocusLabel, false);
    }
    static COMMAND_NAME = commandName;
}
