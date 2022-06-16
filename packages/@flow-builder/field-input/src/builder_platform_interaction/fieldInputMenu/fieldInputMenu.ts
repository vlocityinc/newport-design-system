import { NewResourceEvent } from 'builder_platform_interaction/events';
import { menuContextItemAll } from 'builder_platform_interaction/fieldInputUtils';
import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuLabels';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    viewContainer: 'builder_platform_interaction-field-input-menu-view-container'
};
export default class FieldInputMenu extends withKeyboardInteractions(LightningElement) {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);
    labels = LABELS;

    isFocusTrapEnabled = false;

    // TODO (W-10397619): This boolean will be updated in Amelie's filter story. Default to true for now.
    showFooter = true;

    // TODO: a11y support will be done as part of another PR
    getKeyboardInteractions() {
        return [];
    }

    @api contextItems: FieldInput.MenuContextItem[] = [menuContextItemAll];

    get currentView() {
        return this.contextItems.at(-1);
    }

    get headerMode() {
        return this.isAllResources() ? 'allResources' : 'traversal';
    }

    get breadcrumbs(): FieldInput.Breadcrumb[] {
        if (this.isAllResources()) {
            return [];
        }

        return this.contextItems.slice(1).map((contextItem: FieldInput.MenuContextItem, index: number) => {
            const { label } = contextItem;

            return {
                id: `${index}`,
                label: label || ''
            };
        });
    }

    handleFocusIn() {
        this.isFocusTrapEnabled = true;
    }

    handleFooterClick(event) {
        event.preventDefault();
        this.dispatchEvent(new NewResourceEvent(null, false));
    }

    isAllResources() {
        return this.contextItems.length === 1;
    }

    @api focus() {
        // skip the header when moving focusing on the menu
        this.dom.viewContainer.focus();
    }
}
