import { NewResourceEvent } from 'builder_platform_interaction/events';
import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, track } from 'lwc';
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

    handleFooterClick(event) {
        event.preventDefault();
        this.dispatchEvent(new NewResourceEvent(null, false));
    }

    @track _contextItems: FieldInput.MenuContextItem[] = [undefined];

    @track headerInfo = {
        mode: 'allResources',
        breadcrumbs: [] as FieldInput.Breadcrumb[]
    };

    handleFocusIn() {
        this.isFocusTrapEnabled = true;
    }

    getBreadcrumbs(): FieldInput.Breadcrumb[] {
        return this._contextItems.slice(1).map((contextItem: FieldInput.MenuContextItem) => {
            const { label, value } = contextItem!;

            // TODO: find better expressions for name and id
            return {
                label,
                name: value || label,
                id: value || label
            };
        });
    }

    updateHeaderInfo() {
        const isAllResources = this._contextItems.length === 1;
        const breadcrumbs = !isAllResources ? this.getBreadcrumbs() : [];

        const headerInfoMode = isAllResources ? 'allResources' : 'traversal';

        this.headerInfo = {
            mode: headerInfoMode,
            breadcrumbs
        };
    }

    @api set contextItems(contextItems: FieldInput.MenuContextItem[]) {
        this._contextItems = contextItems;
        this.updateHeaderInfo();
    }

    get contextItems() {
        return this._contextItems;
    }

    @api focus() {
        // skip the header when moving focusing on the menu
        this.dom.viewContainer.focus();
    }
}
