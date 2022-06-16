import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuViewContainerLabels';
import { getViewProps } from './utils';

/**
 * View Container for the Field Input Menu.
 * Renders the right Menu View for the given context.
 */
export default class FieldInputMenuViewContainer extends LightningElement {
    static delegatesFocus = true;
    labels = LABELS;

    @api view!: FieldInput.MenuItemView;

    get viewProps() {
        return getViewProps(this.view);
    }
}
