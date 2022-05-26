import { hasNext } from 'builder_platform_interaction/fieldInputUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement, track } from 'lwc';

const selectors = { inputBox: 'builder_platform_interaction-field-input-box' };

const ALL_CONTEXT_ITEM: FieldInput.MenuContextItem = undefined;

export default class FieldInput extends LightningElement {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    @track
    contextItems: FieldInput.MenuContextItem[] = [ALL_CONTEXT_ITEM];

    /* The currently selected item, as shown in a the pill */
    @track selectedItem: FieldInput.MenuItem | undefined;

    /* Whether the menu is opened */
    @track isMenuOpened = false;

    // TODO: use labels
    inputBoxConfig: FieldInput.MenuInputBoxConfig = {
        labels: {
            inputLabel: 'Value',
            inputPlaceholder: 'Search resources ...'
        }
    };

    handleFieldInputMenuSelectItem(event: FieldInput.MenuSelectItemEvent) {
        const menuItem = event.detail.item;

        if (hasNext(menuItem.viewType)) {
            this.contextItems = [...this.contextItems, menuItem];
        } else {
            // otherwise set the selected item and close the menu
            this.selectedItem = menuItem;
            this.isMenuOpened = false;
        }
    }

    handleFieldInputBreadcrumbClick(event: FieldInput.BreadcrumbClickEvent) {
        const { index } = event.detail;

        // remove trailing breadcrumbs from index
        this.contextItems = this.contextItems.slice(0, index + 2);
    }

    handleUnselectItem() {
        this.selectedItem = undefined;
    }

    handleToggleMenu() {
        this.isMenuOpened = !this.isMenuOpened;
    }

    handleShowMenu(event) {
        this.isMenuOpened = event.detail.show;
    }

    renderedCallback(): void {
        this.dom.inputBox.focus();
    }
}

//   menuItem.hasNext =
//         (!shouldDisableHasNext(dataType, traversalConfig) && supportsTraversalOfElement(resource)) ||
//         (isComplexType(dataType) && !resource.isCollection);
