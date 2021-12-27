// @ts-nocheck
import deleteNodesCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.deleteNodesCommandLabel';
import { BaseCommand } from './baseCommand';
const commandName = 'deletenodes';
export class DeleteNodesCommand extends BaseCommand {
    /**
     * Command to delete nodes in the canvas
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, deleteNodesCommandLabel, false);
    }
    static COMMAND_NAME = commandName;
}
