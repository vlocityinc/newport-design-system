// @ts-nocheck
import { BaseCommand } from './baseCommand';
import displayShortcutsCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.displayShortcutsCommandLabel';
const commandName = 'displayshortcuts';
export class DisplayShortcutsCommand extends BaseCommand {
    /**
     * Command to display shortcuts list
     */
    constructor(callback) {
        super(callback, commandName, displayShortcutsCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
