import { BaseCommand } from './baseCommand';
import displayShortcutsCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.displayShortcutsCommandLabel';
export class DisplayShortcutsCommand extends BaseCommand {
    /**
     * Command to display shortcuts list
     */
    constructor(callback) {
        super(callback, 'displayshortcuts', displayShortcutsCommandLabel, false);
    }
}
