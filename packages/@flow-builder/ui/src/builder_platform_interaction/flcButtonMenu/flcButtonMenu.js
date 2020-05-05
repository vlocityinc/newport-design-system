import labelShowMenu from '@salesforce/label/LightningButtonMenu.showMenu';
import { api, LightningElement, track } from 'lwc';
import { classSet } from 'lightning/utils';

// TODO: need to fix this
// import { handleKeyDownOnMenuItem, handleKeyDownOnMenuTrigger } from './keyboard';

import { ToggleMenuEvent } from 'builder_platform_interaction/events';
import { MenuType } from 'builder_platform_interaction/flowUtils';

const i18n = {
    showMenu: labelShowMenu
};

// CSS class and selectors for menu items
const menuItemCSSClassName = 'slds-dropdown__item';
const menuItemCSSSelector = `.slds-dropdown__list .${menuItemCSSClassName}`;

/**
 * Fixed Layout Canvas Menu Button Component.
 * Used by Node and Connector components to render their buttons.
 */
export default class FlcButtonMenu extends LightningElement {
    @api
    guid;

    @api
    elementMetadata;

    @api
    variant;

    @api
    isNodeGettingDeleted;

    @api
    isSelectionMode;

    @api
    connectionInfo;

    @api
    conditionOptionsForNode;

    @api
    get menuOpened() {
        return this._menuOpened;
    }

    set menuOpened(menuOpened) {
        this._menuOpened = menuOpened;

        if (menuOpened) {
            this.classList.add('slds-is-open');
        } else {
            this.classList.remove('slds-is-open');
        }
    }

    _menuOpened = false;

    //     if (!this._dropdownOpened && this._dropdownVisible) {
    //         this._dropdownOpened = true;
    //         this.cancelBlur();
    //     }
    //     if (this._dropdownVisible) {
    //         // remove-next-line-for-c-namespace
    //         this.startPositioning();
    //         this.dispatchEvent(new CustomEvent('open'));

    //         // update the bounding rect when the menu is toggled
    //         this._boundingRect = this.getBoundingClientRect();

    //         this.pollBoundingRect();
    //     } else {
    //         // remove-next-line-for-c-namespace
    //         this.stopPositioning();
    //     }

    //     if (this._dropdownVisible) {

    //     } else {
    //         this.classList.remove('slds-is-open');
    //     }
    // }

    /**
     * The size of the icon.
     * Options include xx-small, x-small, medium, or large.
     * This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api iconSize = 'medium';

    /**
     * The name of the icon to be used in the format 'utility:down'.
     * If an icon other than 'utility:down' or 'utility:chevrondown' is used,
     * a utility:down icon is appended to the right of that icon.
     * This value defaults to utility:down.
     *
     * @type {string}
     * @default utility:down
     */
    @api iconName = 'utility:down';

    /**
     * The value for the button element.
     * This value is optional and can be used when submitting a form.
     *
     * @type {string}
     */
    @api value = '';

    /**
     * The assistive text for the button.
     *
     * @type {string}
     */
    @api alternativeText = i18n.showMenu;

    /**
     * Message displayed while the menu is in the loading state.
     *
     * @type {string}
     */
    @api loadingStateAlternativeText = i18n.loading;

    /**
     * Optional text to be shown on the button.
     *
     * @type {string}
     */
    @api label;

    @track _accesskey = null;
    @track _title = null;
    @track _focusOnIndexDuringRenderedCallback = null;
    @track _tabindex = 0;

    connectedCallback() {
        this._connected = true;
        this.keyboardInterface = this.menuKeyboardInterface();

        this.classList.add('slds-dropdown-trigger', 'slds-dropdown-trigger_click');
    }

    renderedCallback() {
        if (!this.target) {
            this.target = this.template.querySelector('button');
        }
        // if we are using autopositioning focus happens in its own cycle
        // if (!this._positioning && this._dropdownVisible) {
        //     // logic to focus on first menu item after render
        //     this.focusOnMenuItemAfterRender();
        // }
    }

    /**
     * Displays tooltip text when the mouse moves over the button menu.
     * @type {string}
     */
    @api
    get title() {
        return this._title;
    }

    set title(newValue) {
        this._title = newValue;
    }

    /**
     * The keyboard shortcut for the button menu.
     * @type {string}
     */
    @api
    get accessKey() {
        return this._accesskey;
    }

    set accessKey(newValue) {
        this._accesskey = newValue;
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        if (this._connected) {
            this.focusOnButton();
        }
    }

    /**
     * Clicks the button.
     */
    @api
    click() {
        if (this._connected) {
            this.template.querySelector('button').click();
        }
    }

    get computedAriaExpanded() {
        return String(this._dropdownVisible); // default value must be a string for the attribute to always be present with a string value
    }

    focusOnMenuItemAfterRender() {
        // if no menu items are focused then set focus on the first or last one once registered
        // :: this can occur if there's a delay in loading the menu items (loading from server for example)
        // :: revealing the menu in an empty state to later have menu items loaded
        let focusOnIndex = this._focusOnIndexDuringRenderedCallback || 0;

        // if focus index is greater than the size of the list,
        // or next focus should be on LAST,
        // set to the last item
        const menuItems = this.getMenuItems();

        // if specified as 'LAST' set it to a valid numeric value instead
        if (focusOnIndex === 'LAST') {
            focusOnIndex = menuItems.length - 1;

            // maintain 'LAST' value if menu items aren't available yet
            if (focusOnIndex < 0) {
                focusOnIndex = 'LAST';
            }
        }

        // only perform operations when we have a valid numeric index
        if (focusOnIndex !== 'LAST') {
            if (focusOnIndex > menuItems.length - 1 && menuItems.length > 0) {
                focusOnIndex = menuItems.length - 1;
            }

            // set the focus
            this.focusOnMenuItem(focusOnIndex);

            // reset tracker value
            this._focusOnIndexDuringRenderedCallback = null;
        }
    }

    get computedAccessKey() {
        return this._accesskey;
    }

    get computedTitle() {
        return this._title;
    }

    get computedAlternativeText() {
        return this.alternativeText || i18n.showMenu;
    }

    get computedLoadingStateAlternativeText() {
        return this.loadingStateAlternativeText || i18n.loading;
    }

    get computedButtonClass() {
        return classSet({
            'slds-button': true,
            'slds-button_icon': true,
            'border-none': this.variant !== 'connector',
            'node-in-selection-mode': this.isSelectionMode,
            connector: this.variant === 'connector',
            'node-to-be-deleted': this.isNodeGettingDeleted,
            'slds-button_icon-xx-small': this.iconSize === 'xx-small',
            'slds-button_icon-x-small': this.iconSize === 'x-small',
            'slds-button_icon-small': this.iconSize === 'small'
        }).toString();
    }

    handleMenuItemPrivateSelect(event) {
        if (this._dropdownVisible) {
            this.toggleMenuVisibility();
            this.focusOnButton();
        }

        event.stopPropagation();
        this.dispatchSelect(event);
    }

    dispatchSelect(event) {
        this.dispatchEvent(
            new CustomEvent('select', {
                cancelable: true,
                detail: {
                    value: event.detail.value // pass value through from original private event
                }
            })
        );
    }

    handleButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.allowBlur();
        if (!this.isSelectionMode) {
            this.toggleMenuVisibility();
        }

        // Focus on the button even if the browser doesn't do it by default
        // (the behaviour differs between Chrome, Safari, Firefox)
        this.focusOnButton();
    }

    handleButtonKeyDown(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.isSelectionMode) {
            // handleKeyDownOnMenuTrigger(event, this.keyboardInterface);
        }
    }

    handleButtonMouseDown(event) {
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    handleDropdownMouseDown(event) {
        // if the menu contais a scrollbar due to large number of menu-items
        // this is needed so that menu doesnt close on dragging the scrollbar with the mouse
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    handleDropdownMouseUp() {
        // We need this to make sure that if a scrollbar is being dragged with the mouse, upon release
        // of the drag we allow blur, otherwise the dropdown would not close on blur since we'd have cancel blur
        // set
        this.allowBlur();
    }

    handleDropdownMouseLeave() {
        // this is to close the menu after mousedown happens on scrollbar
        // in this case we close immediately if no menu-items were hovered/focused
        // without this the menu would remain open since the blur on the menuitems has happened already
        // when clicking the scrollbar
        if (!this._menuHasFocus) {
            this.close();
        }
    }

    handleDropdownScroll(event) {
        // We don't want this to bubble up to the modal which due to event retargeting wouldn't be able
        // to know what is actually being scrolled and thus may lead to the scrolling of the modal
        event.stopPropagation();
    }

    focusOnButton() {
        this.template.querySelector('button').focus();
    }

    focusOnMenuItem(itemIndex) {
        if (this._dropdownVisible) {
            const menuItem = this.getMenuItemByIndex(itemIndex);
            this.cancelBlurAndFocusOnMenuItem(menuItem);
        }
    }

    toggleMenuVisibility(sendEvent = true) {
        if (!this.disabled) {
            const { top, left, width } = this.target.getBoundingClientRect();
            const { clientWidth } = this.target;

            // account for border and stuff
            const offsetX = (width - clientWidth) / 2;

            const { conditionOptionsForNode, guid, connectionInfo, elementMetadata } = this;
            const type = connectionInfo ? MenuType.CONNECTOR : MenuType.NODE;

            if (sendEvent) {
                this.dispatchEvent(
                    new ToggleMenuEvent(
                        Object.assign(
                            {
                                top,
                                left,
                                offsetX,
                                type,
                                guid: guid || connectionInfo.prev,
                                elementMetadata,
                                conditionOptionsForNode
                            },
                            connectionInfo
                        )
                    )
                );
            }
        }
    }

    // const referenceElement = this.template.querySelector('button');
    // alert('')
    // showPopover(
    //     'builder_platform_interaction:nodeMenuOverlay',
    //     {},
    //     {
    //         referenceElement,
    //         direction: 'south',
    //         closeOnClickOut: true
    //     }
    // );

    getMenuItems() {
        return Array.from(this.querySelectorAll(menuItemCSSSelector));
    }

    getMenuItemByIndex(index) {
        return this.getMenuItems()[index];
    }

    findMenuItemIndex(menuItemElement) {
        return this.getMenuItems().indexOf(menuItemElement);
    }

    findMenuItemFromEventTarget(element) {
        let currentNode = element;
        const stopAtElement = this.template.querySelector("[role='menu']");
        while (currentNode !== stopAtElement) {
            if (currentNode.classList && currentNode.classList.contains(menuItemCSSClassName)) {
                return currentNode;
            }
            if (currentNode.parentNode) {
                currentNode = currentNode.parentNode;
            } else {
                return null;
            }
        }
        return null;
    }

    handleKeyOnMenuItem(event) {
        const menuItem = this.findMenuItemFromEventTarget(event.target);
        if (menuItem) {
            // handleKeyDownOnMenuItem(event, this.findMenuItemIndex(menuItem), this.keyboardInterface);
        }
    }

    handleMouseOverOnMenuItem(event) {
        const menuItem = this.findMenuItemFromEventTarget(event.target);
        if (menuItem) {
            const menuItemIndex = this.findMenuItemIndex(menuItem);
            this.focusOnMenuItem(menuItemIndex);
        }
    }

    cancelBlurAndFocusOnMenuItem(menuItem) {
        if (menuItem) {
            // prevent blur during a non-blurring focus change
            // set lock so that while focusing on menutitem, menu doesnt close
            this.cancelBlur();
            menuItem.focus();
        }
        // allowBlur is called when the menu items receives focus
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handlePrivateBlur(event) {
        // The event may be synthetic from the menu items
        event.stopPropagation();

        // perform common blurring behavior
        this.handleBlur();
        this._menuHasFocus = false;
    }

    handlePrivateFocus(event) {
        // synthetic from the menu items
        event.stopPropagation();
        // reset the cancelBlur so any clicks outside the menu can now close the menu
        this.allowBlur();
        this._menuHasFocus = true;
    }

    handleBlur() {
        // Don't handle the blur event if the focus events are inside the menu (see the cancelBlur/allowBlur functions)
        if (this._cancelBlur) {
            return;
        }
        // Hide only when the focus moved away from the container
        if (this._dropdownVisible) {
            this.toggleMenuVisibility();
        }
        // dispatch standard blur event

        this.dispatchEvent(new CustomEvent('blur'));
    }

    allowBlur() {
        this._cancelBlur = false;
    }

    cancelBlur() {
        this._cancelBlur = true;
    }

    menuKeyboardInterface() {
        const that = this;
        return {
            getTotalMenuItems() {
                return that.getMenuItems().length;
            },
            focusOnIndex(index) {
                that.focusOnMenuItem(index);
            },
            setNextFocusIndex(index) {
                that._focusOnIndexDuringRenderedCallback = index;
            },
            returnFocus() {
                that.focusOnButton();
            },
            isMenuVisible() {
                return that._menuOpened;
            },
            toggleMenuVisibility() {
                that.toggleMenuVisibility();
            },
            focusMenuItemWithText(text) {
                const match = [...that.getMenuItems()].filter(menuItem => {
                    const label = menuItem.label;
                    return label && label.toLowerCase().indexOf(text) === 0;
                });
                if (match.length > 0) {
                    that.focusOnMenuItem(match[0]);
                }
            }
        };
    }

    /**
     * {Function} close - Closes the dropdown if it's open
     */
    close() {
        // should only do something if dropdown is visible
        if (this._menuOpened) {
            this.toggleMenuVisibility();
        }
    }
}
