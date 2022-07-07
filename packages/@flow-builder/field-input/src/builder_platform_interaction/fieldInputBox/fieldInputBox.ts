import {
    getEnterKeyInteraction,
    getEscapeKeyInteraction,
    scheduleTask
} from 'builder_platform_interaction/alcComponentsUtils';
import { newCustomEvent } from 'builder_platform_interaction/events';
import { newShowMenuEvent } from 'builder_platform_interaction/fieldInputUtils';
import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './fieldInputBoxLabels';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputBox extends withKeyboardInteractions(LightningElement) {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    @track searchText = '';

    _selectedItem: FieldInput.MenuItem | undefined;

    @track pill;

    get hasPill() {
        return this.pill != null ? 'has-pill' : '';
    }

    get labels() {
        return {
            inputLabel: this.config?.labels?.inputLabel ?? LABELS.comboBoxLabel,
            inputPlaceholder: this.config?.labels?.inputPlaceholder ?? LABELS.placeholderText,
            iconAlt: LABELS.searchAltText,
            iconTitle: LABELS.searchAltText
        };
    }

    @api config: FieldInput.MenuInputBoxConfig | undefined;

    @api set selectedItem(selectedItem: FieldInput.MenuItem | undefined) {
        if (selectedItem != null) {
            this._selectedItem = selectedItem;
            this.searchText = '';
            this.pill = { label: selectedItem.label, iconName: 'standard:account' };
        } else {
            this._selectedItem = undefined;
            this.pill = undefined;
            this.searchText = '';
        }
    }
    get selectedItem() {
        return this._selectedItem;
    }

    focusOnInput = () => {
        this.template.querySelector<HTMLInputElement>('input')?.focus();
    };

    getKeyboardInteractions() {
        return [getEscapeKeyInteraction(this.handleEscape), getEnterKeyInteraction(this.handleEnterKey)];
    }

    handleEnterKey = () => {
        this.dispatchShowMenu(true);
    };

    handleEscape = () => {
        this.dispatchShowMenu(false);
    };

    dispatchShowMenu(show: boolean) {
        this.dispatchEvent(newShowMenuEvent(show));
    }

    handleChange(evt) {
        this.searchText = evt.target.value;
    }

    handlePillRemove(event) {
        //  should restore breadcrumb context
        event.preventDefault();
        this.unselectItem();
        scheduleTask(() => this.focusOnInput());
    }

    handlePillClick(event) {
        this.handlePillRemove(event);
    }

    handleInputFocus() {
        this.dispatchShowMenu(true);
    }

    unselectItem() {
        this.dispatchEvent(newCustomEvent('unselectitem'));
    }
}
