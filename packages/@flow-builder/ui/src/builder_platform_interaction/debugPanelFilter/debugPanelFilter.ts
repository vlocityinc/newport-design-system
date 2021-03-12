import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelFilterLabels';
import { DebugPanelFilterEvent } from 'builder_platform_interaction/events';

export default class debugPanelFilter extends LightningElement {
    @api fromEmailDebugging;
    value: string[] = [];
    showOptions = false;
    filterOpenPopoverAltText = LABELS.filterOpenPopoverAltText;
    filterPopoverAltText = LABELS.filterPopoverAltText;
    filterClosePopoverAltText = LABELS.filterClosePopoverAltText;
    filterOptions = [
        {
            label: LABELS.govLimFilter,
            value: LABELS.govLimFilter,
            isSelected: false
        },
        {
            label: LABELS.transactionFilter,
            value: LABELS.transactionFilter,
            isSelected: false
        }
    ];

    _selectedOptions = LABELS.basicFilter;

    get selectedOptions() {
        return this._selectedOptions;
    }

    get options() {
        if (this.fromEmailDebugging) {
            return this.filterOptions.filter((e) => e.label !== LABELS.govLimFilter);
        }
        return this.filterOptions;
    }

    handleDropdown() {
        this.showOptions = !this.showOptions;
    }

    handleChange(e) {
        this.value = Object.assign([], e.detail.value);
        if (this.value.length === 0) {
            this._selectedOptions = LABELS.basicFilter;
            this.dispatchEvent(new DebugPanelFilterEvent());
        } else {
            this._selectedOptions = this.value.join(', ');
            this.filterOptions = this.filterOptions.map((e) => {
                switch (e.label) {
                    case LABELS.govLimFilter:
                        e.isSelected = this.value.includes(LABELS.govLimFilter);
                        break;
                    case LABELS.transactionFilter:
                        e.isSelected = this.value.includes(LABELS.transactionFilter);
                        break;
                    default:
                        e.isSelected = false;
                }
                return e;
            });
            this.dispatchEvent(new DebugPanelFilterEvent(this.filterOptions));
        }
    }
}
