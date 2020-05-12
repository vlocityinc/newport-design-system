// @ts-nocheck
import { BaseCommand } from './baseCommand';
import deleteNodesCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.deleteNodesCommandLabel';
export class DeleteNodesCommand extends BaseCommand {
    /**
     * Command to delete nodes in the canvas
     */
    constructor(callback) {
        super(callback, 'deletenodes', deleteNodesCommandLabel, false);
    }
}
