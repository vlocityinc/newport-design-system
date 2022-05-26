import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuViewContainerLabels';
import { getViewProps } from './utils';

/**
 * View Container for the Field Input Menu.
 * Renders the right Menu View for the given context.
 */
export default class FieldInputMenuViewContainer extends LightningElement {
    labels = LABELS;

    @api contextItems!: FieldInput.MenuContextItem[];

    get viewProps(): FieldInput.MenuViewProps {
        return getViewProps(this.contextItems);
    }
}
