import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuViewContainerLabels';
import { getViewProps } from './utils';

/**
 * View Container for the Field Input Menu.
 * Renders a menu view.
 */
export default class FieldInputMenuViewContainer extends LightningElement {
    static delegatesFocus = true;
    labels = LABELS;

    /* the current view that is rendered */
    @api view!: FieldInput.MenuItemView;

    /* allow params rules */
    @api rules?: RuleMap;

    /* menu config */
    @api config!: FieldInput.MenuConfig;

    /* the field input context */
    @api context!: FieldInput.Context;

    get viewProps() {
        return getViewProps(this.view);
    }
}
