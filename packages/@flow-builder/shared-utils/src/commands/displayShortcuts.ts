// @ts-nocheck
import displayShortcutsCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.displayShortcutsCommandLabel';
import { BaseCommand } from './baseCommand';
const commandName = 'displayshortcuts';
export class DisplayShortcutsCommand extends BaseCommand {
    /**
     * Command to display shortcuts list
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, displayShortcutsCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
