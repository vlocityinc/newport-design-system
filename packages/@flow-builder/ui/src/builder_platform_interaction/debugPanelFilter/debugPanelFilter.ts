import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelFilterLabels';
import { DebugPanelFilterEvent } from 'builder_platform_interaction/events';

export default class debugPanelFilter extends LightningElement {
    @api selections;
    filterOpenPopoverAltText = LABELS.filterOpenPopoverAltText;

    handleDropdown() {
        this.dispatchEvent(new DebugPanelFilterEvent());
    }
}
