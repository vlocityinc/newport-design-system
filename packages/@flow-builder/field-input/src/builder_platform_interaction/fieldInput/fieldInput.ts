import { scheduleTask } from 'builder_platform_interaction/alcComponentsUtils';
import { menuContextItemAll } from 'builder_platform_interaction/fieldInputUtils';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement, track } from 'lwc';
import { LABELS } from './fieldInputLabels';

const selectors = {
    inputBox: 'builder_platform_interaction-field-input-box',
    menu: 'builder_platform_interaction-field-input-menu'
};

export default class FieldInput extends LightningElement {
    static delegatesFocus = true;

    labels = LABELS;
    dom = lwcUtils.createDomProxy(this, selectors);
    hasPendingHideMenu = false;

    @track
    contextItems: FieldInput.MenuContextItem[] = [menuContextItemAll];

    /* The currently selected item, as shown in a the pill */
    @track selectedItem: FieldInput.MenuItem | undefined;

    /* Whether the menu is opened */
    @track isMenuOpened = false;

    // TODO: use labels
    inputBoxConfig: FieldInput.MenuInputBoxConfig = {
        labels: {
            inputLabel: this.labels.inputLabel,
            inputPlaceholder: this.labels.inputPlaceholder
        }
    };

    /**
     * Handles the fieldinputmenuselectitem event dispatched from the menu
     *
     * @param event - The menu item selection event
     */
    handleFieldInputMenuSelectItem(event: FieldInput.MenuSelectItemEvent) {
        const menuItem = event.detail.item;

        if (menuItem.view != null) {
            this.updateContextItems([
                ...this.contextItems,
                { ...menuItem.view, label: menuItem.label, name: menuItem.name }
            ]);
        } else {
            // otherwise set the selected item and close the menu
            this.selectedItem = menuItem;
            this.updateIsMenuOpened(false);
        }
    }

    /**
     * Handles the breakcrumbclick event dispatched from the input box
     *
     * @param event - The breakcrumb click event
     */
    handleFieldInputBreadcrumbClick(event: FieldInput.BreadcrumbClickEvent) {
        const { index } = event.detail;

        // remove trailing breadcrumbs from index
        this.updateContextItems(this.contextItems.slice(0, index + 2));
    }

    updateContextItems(newContextItems: FieldInput.MenuContextItem[]) {
        this.contextItems = newContextItems;

        // after updating the context items we need to restore the focus to the menu
        scheduleTask(() => {
            this.resetPendingHideMenu();
            this.dom.menu.focus();
        });
    }

    updateIsMenuOpened(newIsMenuOpened) {
        this.isMenuOpened = newIsMenuOpened;

        if (!newIsMenuOpened) {
            // when hidding the menu, reset the context to all
            this.contextItems = [menuContextItemAll];
        } else {
            // otherwise dismiss any pending hide menu
            this.resetPendingHideMenu();
        }
    }

    handleUnselectItem() {
        this.selectedItem = undefined;
    }

    handleShowMenu(event) {
        this.updateIsMenuOpened(event.detail.show);
    }

    handleFocusIn() {
        this.updateIsMenuOpened(true);
    }

    resetPendingHideMenu() {
        this.hasPendingHideMenu = false;
    }

    handleFocusOut(event: FocusEvent) {
        // @ts-ignore
        const tagName = event.relatedTarget?.tagName;

        // if the focus is moved to another part of the field-input, ignore the focusout
        if (
            tagName === 'BUILDER_PLATFORM_INTERACTION-FIELD-INPUT-MENU' ||
            tagName === 'BUILDER_PLATFORM_INTERACTION-FIELD-INPUT-BOX'
        ) {
            return;
        }

        // otherwise schedule a hide menu action
        this.hasPendingHideMenu = true;

        scheduleTask(() => {
            if (this.hasPendingHideMenu) {
                this.updateIsMenuOpened(false);
            }
        });
    }
}
