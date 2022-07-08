import {
    AutoLayoutCanvasMode,
    CanvasContext,
    getEnterKeyInteraction,
    ICON_SHAPE,
    isCutMode,
    isDefaultMode
} from 'builder_platform_interaction/alcComponentsUtils';
import { CloseMenuEvent, ToggleMenuEvent } from 'builder_platform_interaction/alcEvents';
import { isElementCut } from 'builder_platform_interaction/alcMenuUtils';
import { ConnectionSource, MenuType, NodeOperationType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { classSet } from 'lightning/utils';
import { api, LightningElement } from 'lwc';

const { withKeyboardInteractions, Keys } = keyboardInteractionUtils;

const selectors = {
    button: 'button',
    checkbox: '.selection-checkbox'
};

/**
 * Fixed Layout Canvas Menu Button Component.
 * Used by Node and Connector components to render their buttons
 */
export default class AlcMenuTrigger extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    override getKeyboardInteractions() {
        return [getEnterKeyInteraction(() => this.handleSpaceOrEnter())];
    }

    @api
    connectorAriaInfo;

    @api
    elementMetadata;
    @api
    variant = MenuType.NODE;

    @api
    hasError;

    @api
    operationType!: NodeOperationType;

    @api
    canvasMode: AutoLayoutCanvasMode = AutoLayoutCanvasMode.DEFAULT;

    @api
    source!: ConnectionSource;

    @api
    canvasContext!: CanvasContext;

    @api
    disableEditElements;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

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

    /**
     * The size of the icon.
     * Options include xx-small, x-small, medium, or large.
     * This value defaults to medium.
     *
     * @default medium
     */
    @api iconSize = 'medium';

    @api disabled = false;

    get triggerContainerClass() {
        if (this.isConnectorVariant()) {
            return '';
        }

        return classSet('slds-p-around_xx-small').add({
            'default-container': !this.elementMetadata.dynamicNodeComponent,
            'dynamic-container': this.elementMetadata.dynamicNodeComponent,
            'rotate-icon-container': this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND,
            'round-container': this.elementMetadata.iconShape === ICON_SHAPE.CIRCLE
        });
    }

    get computedButtonClass() {
        const isConnectorVariant = this.isConnectorVariant();

        return classSet({
            'slds-button': true,
            'slds-button_icon': true,
            'border-none': !isConnectorVariant,
            'is-end-element': !isConnectorVariant && this.elementMetadata.type === NodeType.END,
            'node-in-selection-mode': !isDefaultMode(this.canvasMode),
            connector: isConnectorVariant,
            'cut-paste-connector': this.isConnectorInPasteMode(),
            'node-to-be-deleted': this.operationType === 'delete',
            'node-to-be-cut': this.operationType === 'cut',
            'has-error': this.hasError,
            'circular-icon': !isConnectorVariant && this.elementMetadata.iconShape === ICON_SHAPE.CIRCLE,
            'slds-button_icon-xx-small': this.iconSize === 'xx-small',
            'slds-button_icon-x-small': this.iconSize === 'x-small',
            'slds-button_icon-small': this.iconSize === 'small',
            'cut-paste-node-border': isElementCut(this.canvasMode, this.canvasContext?.cutInfo?.guids, this.source.guid)
        });
    }

    get computedTabIndex() {
        return !this.isCanvasTabable() || (this.elementMetadata && this.elementMetadata.type === NodeType.END) ? -1 : 0;
    }

    isCanvasTabable() {
        return isDefaultMode(this.canvasMode) || this.isConnectorInPasteMode();
    }

    /**
     * Checks for the connector variant
     *
     * @returns true iff this is the connector variant of the trigger
     */
    isConnectorVariant() {
        return this.variant === MenuType.CONNECTOR;
    }

    /** ***************************** Helper Functions */

    focusOnButton() {
        this.dom.button.focus({ preventScroll: true });
    }

    /**
     * Dispatches a ToggleMenuEvent when the trigger is activated
     *
     * @param moveFocusToMenu - Whether to move the focus to the menu when it is opened
     * @fires ToggleMenuEvent
     */
    toggleMenuVisibility(moveFocusToMenu = false) {
        const { elementMetadata, disableEditElements, variant, source } = this;

        const hasComponent = variant !== MenuType.NODE || elementMetadata.menuComponent;
        if (!hasComponent || (disableEditElements && elementMetadata.type !== NodeType.START)) {
            return;
        }
        const { top, left } = this.dom.button.getBoundingClientRect();

        this.dispatchEvent(
            new ToggleMenuEvent({
                type: variant,
                source,
                moveFocusToMenu,
                top,
                left
            })
        );
    }

    /** ***************************** Public Functions */

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.focusOnButton();
    }

    /** ***************************** Event Handlers */

    handleButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();

        if (isDefaultMode(this.canvasMode)) {
            this.toggleMenuVisibility();

            // Focus on the button even if the browser doesn't do it by default
            // (the behavior differs between Chrome, Safari, Firefox). Focus should not be moved to
            // End Element
            if (this.isConnectorVariant() || this.elementMetadata.type !== NodeType.END) {
                this.focusOnButton();
            }
        } else if (this.isConnectorInPasteMode()) {
            // TODO W-11145903 uncomment this and make cut paste work
            // this.dispatchEvent(new PasteOnCanvasEvent(this.source));
        }
    }

    handleButtonMouseDown(event) {
        // Preventing Default so that element is put in focus only after a click
        event.preventDefault();
    }

    isConnectorInPasteMode() {
        return isCutMode(this.canvasMode) && this.isConnectorVariant();
    }

    handleSpaceOrEnter() {
        if (isDefaultMode(this.canvasMode)) {
            // Opening and closing the current selected element
            this.toggleMenuVisibility(true);
        } else if (this.isConnectorInPasteMode()) {
            // TODO W-11145903 uncomment this and make cut paste work
            // this.dispatchEvent(new PasteOnCanvasEvent(this.source));
        } else {
            // Checking and unchecking the element when in selection mode
            // The checkbox is in a slot being filled by alcnode

            // TODO: this should be handled in AlcNode
            this.querySelector<HTMLElement>(selectors.checkbox)?.click();
        }
    }

    handleKeyDown = (event) => {
        if (event.key === Keys.Escape && this._menuOpened) {
            event.stopPropagation();
            this.dispatchEvent(new CloseMenuEvent());
        }
    };

    /** ***************************** Callbacks */

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('slds-dropdown-trigger', 'slds-dropdown-trigger_click');

        // the keyboard framework stops propagation by default but we need escape to propagate
        this.template.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        this.template.removeEventListener('keydown', this.handleKeyDown);
    }
}
