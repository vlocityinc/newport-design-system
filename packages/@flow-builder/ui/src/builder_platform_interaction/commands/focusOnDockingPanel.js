import { BaseCommand } from './baseCommand';
import dockingPanelFocusLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.dockingPanelFocusLabel';
export class FocusOnDockingPanelCommand extends BaseCommand {
    /**
     * Command to shift focus to docking panel
     */
    constructor(callback) {
        super(callback, 'focusOnDockingPanel', dockingPanelFocusLabel, false);
    }
}
