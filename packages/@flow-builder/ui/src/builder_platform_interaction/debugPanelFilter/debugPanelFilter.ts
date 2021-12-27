import { DebugPanelFilterEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';
import { LABELS } from './debugPanelFilterLabels';

export default class debugPanelFilter extends LightningElement {
    @api selections;
    filterOpenPopoverAltText = LABELS.filterOpenPopoverAltText;

    handleDropdown() {
        this.dispatchEvent(new DebugPanelFilterEvent());
    }
}
