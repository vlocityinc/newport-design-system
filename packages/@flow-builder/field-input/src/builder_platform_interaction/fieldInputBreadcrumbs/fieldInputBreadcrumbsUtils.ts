import type { ARIAProperty, ARIAPropertyCurrent } from 'aria-query';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './fieldInputBreadcrumbsLabels';

type BreadcrumbView = FieldInput.Breadcrumb & { displayText: string };

const TABINDEX_ATTRIBUTE = 'tabindex';

export enum ELEMENT_SIBLINGS {
    Previous = 'previousElementSibling',
    Next = 'nextElementSibling'
}

enum Focusable {
    Is = '0',
    IsNot = '-1'
}

export const { Keys } = keyboardInteractionUtils;
export const BREADCRUMBS_ROOT_PARENT_NAME = 'resources';
export const MENU_TRIGGER_CSS_CLASS = 'menu-trigger';
export const MENU_TRIGGER_OPEN_CSS_CLASS = 'slds-is-open';
export const TRUNCATED_BREADCRUMB_CSS_CLASS = 'truncated-breadcrumb';
export const ERROR_MSG_BREADCRUMBS_ARRAY_ONLY = 'You must provide an array for the breadcrumbs value';

// could be removed once we have integration tests
export const TEST_TRUNCATION_FORCED_CSS_CLASS = 'test-truncation-forced';

export const BREADCRUMBS_ROOT_PARENT = {
    name: BREADCRUMBS_ROOT_PARENT_NAME,
    breadcrumb: {
        label: LABELS.parentBreadcrumbLabel,
        name: BREADCRUMBS_ROOT_PARENT_NAME,
        id: BREADCRUMBS_ROOT_PARENT_NAME
    },
    eventIndex: -1
};

export const ARIA_CURRENT_LOCATION: { name: ARIAProperty; value: ARIAPropertyCurrent } = {
    name: 'aria-current',
    value: 'location'
} as const;

export const setFocusOnBreadcrumbLink = (activeElement: HTMLElement, previousNextElement: ELEMENT_SIBLINGS) => {
    const breadcrumbListItem = activeElement?.parentElement;
    if (breadcrumbListItem) {
        (breadcrumbListItem[previousNextElement]?.firstElementChild as HTMLElement)?.focus();
    }
};

/**
 * Mapping to the field to be displayed
 *
 * @param breadcrumb current breadcrumb
 * @returns breadcrumb's field to be displayed
 */
export const mapToDisplayField = (breadcrumb: FieldInput.Breadcrumb) =>
    breadcrumb.label; /* will be revisited to handle API Name/ Label swap via the gear box (see W-10486502), could be refactored  via some mixin approach (as some code may be common)  */

/**
 * Adding some attributes to be rendered in the template to the given data model of the breadcrumb (displayText, tooltip)
 *
 * @param breadcrumb current breadcrumb to be "augmented"
 * @returns augmented breadcrumb "view" model to be rendered
 */
export const computeViewAttributes = (breadcrumb: FieldInput.Breadcrumb): BreadcrumbView => ({
    ...breadcrumb,
    displayText: mapToDisplayField(breadcrumb)
});

/**
 * Prevent focus or not for given HTML element via proper tabindex value
 *
 * @param element we want to prevent or not from being focusable
 * @param focusable element should be focusable or not?
 * @returns void
 */
const updateFocusableViaTabindex = (element, focusable: boolean) =>
    element?.setAttribute(TABINDEX_ATTRIBUTE, focusable ? Focusable.Is : Focusable.IsNot);

/**
 * Update breadcrumbs links html attributes:
 * - set aria-current on last breadcrumb link to "location" value
 * - set tabindex to "-1" for any breadcrumb links (making them non-focusable)
 * except for the first one if we are not in truncation mode (via "0" value making it focusable )
 *
 * @param elements collection of breadcrumbs links to update
 * @param isInTruncationMode is breadcrumbs in truncation mode?
 */
export const updateBreadcrumbsLinks = (elements: HTMLElement[], isInTruncationMode) => {
    const lastElementIndex = elements?.length - 1;
    (elements || []).forEach((element, index) => {
        updateFocusableViaTabindex(element, !isInTruncationMode && index === 0);
        if (index === lastElementIndex) {
            element.setAttribute(ARIA_CURRENT_LOCATION.name, <string>ARIA_CURRENT_LOCATION.value);
        } else {
            element.removeAttribute(ARIA_CURRENT_LOCATION.name);
        }
    });
};

/**
 * Depending on the truncation mode focus on the first truncated/non-truncated breadcrumb
 *
 * @param elements array of breadcrumbs inside which we look for the first one
 * @private
 */
export const setFocusOnFirstBreadcrumb = (elements: HTMLElement[]) => {
    const [firstBreadcrumb] = elements || [];
    firstBreadcrumb?.focus();
};
