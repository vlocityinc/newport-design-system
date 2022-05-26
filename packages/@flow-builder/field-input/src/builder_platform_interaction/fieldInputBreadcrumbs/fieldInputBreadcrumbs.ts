import { newCustomEvent } from 'builder_platform_interaction/events';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './fieldInputBreadcrumbsLabels';
import {
    BREADCRUMBS_ROOT_PARENT,
    computeViewAttributes,
    ELEMENT_SIBLINGS,
    Keys,
    MENU_TRIGGER_CSS_CLASS,
    MENU_TRIGGER_OPEN_CSS_CLASS,
    setFocusOnBreadcrumbLink,
    setFocusOnFirstBreadcrumb,
    TEST_TRUNCATION_FORCED_CSS_CLASS,
    TRUNCATED_BREADCRUMB_CSS_CLASS,
    updateBreadcrumbsLinks
} from './fieldInputBreadcrumbsUtils';

const SELECTORS = {
    nonTruncatedBreadcrumbLink: 'a.non-truncated-breadcrumb',
    truncatedBreadcrumbLink: 'a.truncated-breadcrumb',
    popupMenuTriggerButton: 'button',
    popupMenuTriggerDiv: 'div.slds-dropdown-trigger',
    breadcrumbLink: 'a[role="menuitem"]'
} as const;

/*
/*
 * Provides via breadcrumbs, display and selection via resource path
 * truncation support (via popup menu)
 */
export default class FieldInputBreadcrumbs extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-field-input-breadcrumbs';

    dom = lwcUtils.createDomProxy(this, SELECTORS);
    labels = LABELS;

    /**
    /* Is popup menu (for truncated breadcrumbs) expanded?
     */
    isExpanded = false;

    private _breadcrumbs: FieldInput.Breadcrumb[] = [];

    @track
    truncatedBreadcrumbs: FieldInput.Breadcrumb[] = [];

    /**
     * Set breadcrumbs
     *
     * @param value breadcrumbs to be set
     * @throws error if a value different from an array is passed
     */
    @api
    set breadcrumbs(value: FieldInput.Breadcrumb[]) {
        if (!value || !Array.isArray(value)) {
            throw new Error('You must provide an array for the breadcrumbs value');
        }
        this._breadcrumbs = value;
    }

    /**
     * Get breadcrumbs (if truncation in place only non-truncated ones)
     *
     * @returns array of breadcrumbs (if truncation in place only non-truncated ones)
     */
    get breadcrumbs() {
        return this._breadcrumbs;
    }

    /**
     * Add a breadcrumb
     *
     * @param breadcrumb to be added
     */
    @api
    addBreadcrumb(breadcrumb: FieldInput.Breadcrumb) {
        this._breadcrumbs = [...this.breadcrumbs, breadcrumb];
    }

    /**
     * Reset the breadcrumbs array (ie: to an empty array)
     * apply to every "type" of breadcrumbs (truncated or not)
     */
    @api
    reset() {
        this._breadcrumbs = [];
        this.truncatedBreadcrumbs = [];
        this.isExpanded = false;
    }

    /**
     * Are we in forced truncation mode (for testing purposes - will be removed once we have some proper integration tests in place)
     *
     * @returns true if truncation mode has been forced, false otherwise
     */
    get isTruncationForced() {
        return this.classList.contains(TEST_TRUNCATION_FORCED_CSS_CLASS);
    }

    /**
     * Get the breadcrumbs "view" model (with text to display) for non-truncated breadcrumbs
     *
     * @returns an array of breadcrumbs (in view format ready to be displayed)
     */
    get nonTruncatedBreadcrumbsView() {
        return this.getViewFromModel(
            !this.isTruncated && this.hasBreadcrumbs
                ? [BREADCRUMBS_ROOT_PARENT.breadcrumb, ...this.breadcrumbs]
                : this.breadcrumbs
        );
    }

    get hasBreadcrumbs() {
        return this.breadcrumbs?.length > 0;
    }

    /**
     * Get the breadcrumbs "view" model (with text to display)
     *
     * @returns an array of breadcrumbs (in view format ready to be displayed)
     * or an empty array if no breadcrumbs in place
     */
    get truncatedBreadcrumbsView() {
        return this.getViewFromModel([BREADCRUMBS_ROOT_PARENT.breadcrumb, ...this.truncatedBreadcrumbs]);
    }

    /**
     * Mapping from breadcrumb model data to view model
     *
     * @param breadcrumbsData array of breadcrumbs in data model form
     * @returns breadcrumbs array in view mode
     */
    getViewFromModel(breadcrumbsData: FieldInput.Breadcrumb[]) {
        return breadcrumbsData?.length > 0 ? breadcrumbsData.map(computeViewAttributes) : [];
    }

    /**
     * Is in truncation mode?
     *
     * @returns true if in truncation mode false otherwise
     */
    get isTruncated() {
        return this.truncatedBreadcrumbs?.length > 0;
    }

    /**
     * Do we have to switch to truncation mode?
     *
     * @returns true if truncation needed false otherwise
     */
    get isTruncationNeeded() {
        return this.template.host?.offsetWidth < this.template.host?.scrollWidth;
    }

    /**
     * Returns all breadcrumbs (truncated and non-truncated)
     *
     * @returns all breadcrumbs (truncated and non-truncated)
     */
    get allBreadcrumbs(): FieldInput.Breadcrumb[] {
        return [...this.truncatedBreadcrumbs, ...this.breadcrumbs];
    }

    /**
     * Handling click event on breadcrumb
     *
     * @param event breadcrumb click event
     */
    handleBreadcrumbClick(event: PointerEvent) {
        event.preventDefault();
        const eventTarget = event.target! as HTMLElement;
        const {
            dataset: { id: breadcrumbId }
        } = eventTarget;

        if (breadcrumbId) {
            const breadcrumbIndex = this.allBreadcrumbs.findIndex(({ id }) => id === breadcrumbId);
            this.updateBreadcrumbs(breadcrumbIndex);

            this.dispatchEvent(
                newCustomEvent<FieldInput.BreadcrumbClickEventDetail>('fieldinputbreadcrumbclick', {
                    index: breadcrumbIndex
                })
            );

            this.isExpanded = false;
        }
    }

    /**
     * Handling keydown event (navigation via arrow left/right key and selection via enter key)
     *
     * @param event keydown event
     */
    handleKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { activeElement: focusedBreadcrumbLink }: any = this.template;
        const isTruncatedBreadcrumb = focusedBreadcrumbLink?.classList.contains(TRUNCATED_BREADCRUMB_CSS_CLASS);
        const nonTruncatedBreadcrumbIndex = focusedBreadcrumbLink.dataset.index;
        const { key } = event;
        switch (key) {
            case Keys.ArrowRight:
                if (isTruncatedBreadcrumb) {
                    this.displayHidePopupMenu();
                    setFocusOnFirstBreadcrumb(this.dom.all.nonTruncatedBreadcrumbLink);
                } else {
                    setFocusOnBreadcrumbLink(focusedBreadcrumbLink, ELEMENT_SIBLINGS.Next);
                }
                break;
            case Keys.ArrowLeft:
                if (this.isTruncated && !isTruncatedBreadcrumb && nonTruncatedBreadcrumbIndex === '0') {
                    this.displayHidePopupMenu();
                    setFocusOnFirstBreadcrumb(this.dom.all.truncatedBreadcrumbLink);
                } else {
                    setFocusOnBreadcrumbLink(focusedBreadcrumbLink, ELEMENT_SIBLINGS.Previous);
                }
                break;
            case Keys.ArrowDown:
                setFocusOnBreadcrumbLink(focusedBreadcrumbLink, ELEMENT_SIBLINGS.Next);
                break;
            case Keys.ArrowUp:
                setFocusOnBreadcrumbLink(focusedBreadcrumbLink, ELEMENT_SIBLINGS.Previous);
                break;
            case Keys.Enter:
                focusedBreadcrumbLink?.click();
                break;
            case Keys.Escape:
                if (isTruncatedBreadcrumb) {
                    this.displayHidePopupMenu();
                    this.dom.popupMenuTriggerButton?.focus();
                }
                break;
            default:
        }
    }

    /**
     * Handling popup menu trigger button click
     * Responsible for displaying/hiding the popup menu (with truncated breadcrumbs)
     *
     * @param event pointer event
     */
    handlePopupMenuTriggerButtonClick(event: PointerEvent) {
        event.stopPropagation();
        this.displayHidePopupMenu();
        if (this.isExpanded) {
            setFocusOnFirstBreadcrumb(this.dom.all.truncatedBreadcrumbLink);
        }
    }

    handlePopupMenuFocusOut(event) {
        event.stopPropagation();
        const classList = event.relatedTarget?.classList;

        // close the menu if the focus is not moving the another truncated breadcrumb or the menu trigger
        if (!classList?.contains(TRUNCATED_BREADCRUMB_CSS_CLASS) && !classList?.contains(MENU_TRIGGER_CSS_CLASS)) {
            this.displayHidePopupMenu();
        }
    }

    /**
     * Handling popup menu trigger button keydown
     *
     * @param event pointer event
     */
    handlePopupMenuTriggerButtonKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        const { key } = event;
        if (key === Keys.ArrowDown) {
            this.displayHidePopupMenu();
            setFocusOnFirstBreadcrumb(this.dom.all.truncatedBreadcrumbLink);
        } else if (key === Keys.ArrowRight) {
            if (this.isExpanded) {
                this.displayHidePopupMenu();
            }
            setFocusOnFirstBreadcrumb(this.dom.all.nonTruncatedBreadcrumbLink);
        }
    }

    renderedCallback() {
        if (this.isTruncationForced || this.isTruncationNeeded) {
            this.generateTruncatedBreadcrumbs();
            this.removeTestTruncationForcedCssClass();
        }
        updateBreadcrumbsLinks(this.dom.all.nonTruncatedBreadcrumbLink, this.isTruncated);
    }

    /**
     * Removes the dedicated css class used to force truncation mode
     * For testing purposes (will be removed once we got integration tests in place)
     *
     * @private
     */
    private removeTestTruncationForcedCssClass() {
        this.classList.remove(TEST_TRUNCATION_FORCED_CSS_CLASS);
        if (this.classList.length === 0) {
            this.removeAttribute('class');
        }
    }

    /**
     * Create the truncated breadcrumbs
     *
     * @private
     */
    private generateTruncatedBreadcrumbs() {
        const [firstBreadcrumb] = this.breadcrumbs;
        this.truncatedBreadcrumbs = [...this.truncatedBreadcrumbs, firstBreadcrumb];
        this._breadcrumbs = this._breadcrumbs.slice(1);
    }

    /**
     * Display/Hide popup menu (truncated breadcrumbs)
     * handling a11y aspects as well (ie: aria-expanded state)
     *
     * @private
     */
    private displayHidePopupMenu() {
        this.dom.popupMenuTriggerDiv?.classList.toggle(MENU_TRIGGER_OPEN_CSS_CLASS);
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Update breadcrumbs to reflect any click/enter action made on a breadcrumb (ie: selection made).
     * Reset to an empty array if the "resources" breadcrumb is selected
     *
     * @param index index of the breadcrumb clicked (-1 for parent breadcrumb)
     * @private
     */
    private updateBreadcrumbs(index: number) {
        if (index === BREADCRUMBS_ROOT_PARENT.eventIndex) {
            this.reset();
        } else {
            this._breadcrumbs = this.allBreadcrumbs.slice(0, index + 1);
            this.truncatedBreadcrumbs = [];
        }
    }
}
