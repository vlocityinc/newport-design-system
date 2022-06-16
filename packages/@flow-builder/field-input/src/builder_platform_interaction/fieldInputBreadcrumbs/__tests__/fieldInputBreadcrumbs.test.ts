// @ts-nocheck
import { setup as setupSa11y } from '@sa11y/jest';
import type { Breadcrumb } from '@types/index';
import { clickEvent, keydownEvent } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { Keys } from 'builder_platform_interaction/sharedUtils/keyboardInteractionUtils';
import type { LightningElement } from 'lwc';
import { MOCK_BREADCRUMBS, MOCK_NEW_BREADCRUMB } from 'mock-data/fieldInputBreadcrumbData';
import FieldInputBreadcrumbs from '../fieldInputBreadcrumbs';
import {
    ARIA_CURRENT_LOCATION,
    BREADCRUMBS_ROOT_PARENT,
    ERROR_MSG_BREADCRUMBS_ARRAY_ONLY,
    MENU_TRIGGER_OPEN_CSS_CLASS,
    TEST_TRUNCATION_FORCED_CSS_CLASS
} from '../fieldInputBreadcrumbsUtils';

const TRUNCATED_BREADCRUMB_CLASSNAME = 'truncated-breadcrumb';
const SELECTORS = {
    popupMenuTriggerParentDiv: 'div.slds-dropdown-trigger',
    popupMenuTriggerButton: 'button.slds-button',
    popupMenuDiv: 'div.slds-dropdown',
    spanTruncatedBreadcrumb: 'span.slds-truncate',
    breadcrumbLink: 'a[role="menuitem"]',
    nonTruncatedBreadcrumbLink: 'a.non-truncated-breadcrumb',
    truncatedBreadcrumbLink: `a.${TRUNCATED_BREADCRUMB_CLASSNAME}`
};

const getBreadcrumbsLinks = (
    component: LightningElement,
    breadcrumbSelector = SELECTORS.breadcrumbLink
): HTMLAnchorElement[] => component.shadowRoot.querySelectorAll(breadcrumbSelector);

const getBreadcrumbLink = (component: LightningElement, breadcrumbId: string) =>
    [...getBreadcrumbsLinks(component)].find(({ dataset: { id } }) => id === breadcrumbId);

const createComponentUnderTest = createComponent.bind(null, FieldInputBreadcrumbs.SELECTOR);

const getPopupMenuTriggerButton = (component: Breadcrumb) =>
    component.shadowRoot.querySelector(SELECTORS.popupMenuTriggerButton);

const expectFieldInputBreadcrumbClickEventSentWith = (eventCallback: jest.Mock, index: number) =>
    expect(eventCallback).toHaveBeenCalledWith(expect.objectContaining({ detail: { index } }));

const expectPopupMenuDisplayAndAriaExpanded = (component: Breadcrumb, shouldBeDisplayed: boolean) => {
    const popupMenuTriggerParentDiv = component.shadowRoot.querySelector(SELECTORS.popupMenuTriggerParentDiv);
    if (shouldBeDisplayed) {
        expect(popupMenuTriggerParentDiv.classList).toContain(MENU_TRIGGER_OPEN_CSS_CLASS);
    } else {
        expect(popupMenuTriggerParentDiv.classList).not.toContain(MENU_TRIGGER_OPEN_CSS_CLASS);
    }
    expect(getPopupMenuTriggerButton(component).ariaExpanded).toBe(shouldBeDisplayed.toString());
};

const expectLastBreadcrumbLinkAriaCurrentToBeLocationValue = (component: Breadcrumb) => {
    const lastBreadcrumbLink = [...getBreadcrumbsLinks(component)].pop()!;
    expect(lastBreadcrumbLink.getAttribute(ARIA_CURRENT_LOCATION.name)).toBe(ARIA_CURRENT_LOCATION.value);
};

describe('field-input-breadcrumbs', () => {
    let component: LightningElement;
    beforeAll(() => setupSa11y());
    describe('without truncation', () => {
        describe('with breadcrumbs', () => {
            beforeEach(async () => {
                component = await createComponentUnderTest(FieldInputBreadcrumbs.SELECTOR, {
                    breadcrumbs: MOCK_BREADCRUMBS
                });
            });
            test('Accessibility', async () => {
                await expect(component).toBeAccessible();
            });
            it(`displays correctly the breadcrumbs (template check: "${BREADCRUMBS_ROOT_PARENT.name}" parent entry, role, tabindex, displayText...)`, () =>
                expect(component).toMatchSnapshot());
            test(`when adding a new breadcrumb it is displayed correctly (template check: "${BREADCRUMBS_ROOT_PARENT.name}" parent entry, role, tabindex, displayText...)`, async () => {
                component.addBreadcrumb(MOCK_NEW_BREADCRUMB);
                await Promise.resolve();
                expect(component.breadcrumbs).toHaveLength(MOCK_BREADCRUMBS.length + 1);
                // former last breadcrumb "aria-current" attribute remove, added with "location" value to new last (added) breadcrumb
                const allBreadcrumbsLinks = [...getBreadcrumbsLinks(component)];
                allBreadcrumbsLinks
                    .slice(allBreadcrumbsLinks.length - 2)
                    .forEach((element, index) =>
                        expect(element.getAttribute(ARIA_CURRENT_LOCATION.name)).toBe(
                            index === 0 ? null : ARIA_CURRENT_LOCATION.value
                        )
                    );

                expect(component).toMatchSnapshot();
            });
            describe('events', () => {
                const eventCallback = jest.fn();
                beforeEach(() => component.addEventListener('fieldinputbreadcrumbclick', eventCallback));

                it(`dispatches the expected custom event on breadcrumb click (not on "${BREADCRUMBS_ROOT_PARENT.name}" root parent) and updates breadcrumbs accordingly`, async () => {
                    const mockBreadcrumbIndex = 3;
                    const mockBreadcrumb = MOCK_BREADCRUMBS[mockBreadcrumbIndex];
                    getBreadcrumbLink(component, mockBreadcrumb.id)?.click();
                    expectFieldInputBreadcrumbClickEventSentWith(eventCallback, mockBreadcrumbIndex);
                    await Promise.resolve();
                    expectLastBreadcrumbLinkAriaCurrentToBeLocationValue(component);

                    expect(component.breadcrumbs).toHaveLength(mockBreadcrumbIndex + 1);
                    expect(component).toMatchSnapshot();
                });
                test('reset of the breadcrumbs (ie: empty array) on "reset" API call', () => {
                    component.reset();
                    expect(component.breadcrumbs).toHaveLength(0);
                    expect(component).toMatchSnapshot();
                });
                it('dispatches the expected index when multiple breadcrumb with the same API name', async () => {
                    const accountFieldsBreadcrumbs = (<Breadcrumb[]>MOCK_BREADCRUMBS).filter(
                        ({ name }) => name === 'Account'
                    );
                    expect(accountFieldsBreadcrumbs.length).toBeGreaterThan(1);
                    const lastAccountFieldsBreadcrumb = [...accountFieldsBreadcrumbs].pop();
                    const lastAccountFieldIndex = MOCK_BREADCRUMBS.indexOf(lastAccountFieldsBreadcrumb);
                    getBreadcrumbLink(component, lastAccountFieldsBreadcrumb.id)?.click();
                    await Promise.resolve();
                    expectFieldInputBreadcrumbClickEventSentWith(eventCallback, lastAccountFieldIndex);
                });
                it(`dispatches the expected custom event on breadcrumb click (on "${BREADCRUMBS_ROOT_PARENT.name}" root parent) and reset breadcrumbs accordingly`, async () => {
                    const expectedBreadcrumbAllIndexSent = BREADCRUMBS_ROOT_PARENT.eventIndex;
                    const breadcrumb = getBreadcrumbLink(component, BREADCRUMBS_ROOT_PARENT.breadcrumb.id);
                    expect(component.breadcrumbs).toHaveLength(MOCK_BREADCRUMBS.length);
                    breadcrumb?.click();
                    expectFieldInputBreadcrumbClickEventSentWith(eventCallback, expectedBreadcrumbAllIndexSent);
                    await Promise.resolve();
                    expect(component.breadcrumbs).toHaveLength(0);
                    expect(component).toMatchSnapshot();
                });
                describe('keydown handling', () => {
                    let firstBreadcrumb: HTMLAnchorElement, secondBreadcrumb: HTMLAnchorElement;
                    beforeEach(() => {
                        [firstBreadcrumb, secondBreadcrumb] = getBreadcrumbsLinks(component);
                        firstBreadcrumb.focus();
                    });
                    it('sets the focus on the next breadcrumb when "arrow right" key is pressed', () => {
                        secondBreadcrumb.focus = jest.fn();
                        firstBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowRight));
                        expect(secondBreadcrumb.focus).toHaveBeenCalled();
                    });
                    it('sets the focus on the previous breadcrumb when "arrow left" key is pressed', () => {
                        firstBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowRight));
                        firstBreadcrumb.focus = jest.fn();
                        secondBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowLeft));
                        expect(firstBreadcrumb.focus).toHaveBeenCalled();
                    });
                    it('simulates a click on the breadcrumb link when "enter" key is pressed', () => {
                        firstBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowRight));
                        secondBreadcrumb.click = jest.fn();
                        secondBreadcrumb.dispatchEvent(keydownEvent(Keys.Enter));
                        expect(secondBreadcrumb.click).toHaveBeenCalled();
                    });
                    describe('No cycling', () => {
                        let lastBreadcrumb: HTMLAnchorElement;
                        beforeEach(() => {
                            lastBreadcrumb = [...getBreadcrumbsLinks(component)].pop()!;
                        });

                        test('on "Arrow right" key', () => {
                            firstBreadcrumb.focus = jest.fn();
                            lastBreadcrumb.focus();
                            lastBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowRight));
                            expect(firstBreadcrumb.focus).not.toHaveBeenCalled();
                        });
                        test('on "Arrow left" key', () => {
                            lastBreadcrumb.focus = jest.fn();
                            firstBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowLeft));
                            expect(lastBreadcrumb.focus).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });
        describe('no breadcrumbs', () => {
            it('does not display any breadcrumbs (template check)', async () => {
                component = await createComponentUnderTest();
                expect(component.breadcrumbs).toHaveLength(0);
                expect(component).toMatchSnapshot();
            });
        });
    });
    describe('with truncation', () => {
        beforeEach(async () => {
            component = await createComponentUnderTest(FieldInputBreadcrumbs.SELECTOR, {
                breadcrumbs: MOCK_BREADCRUMBS,
                className: TEST_TRUNCATION_FORCED_CSS_CLASS
            });
        });
        test('Accessibility', async () => {
            await expect(component).toBeAccessible();
        });
        it(`displays correctly the truncated breadcrumbs (template check: "${BREADCRUMBS_ROOT_PARENT.name}" parent entry, role, tabindex, displayText, aria-expanded, slds-is-open...) and the non truncated ones`, () => {
            // as we do simulate the overflow mode switch, the first horizontal breadcrumb should now be a truncated one (ie: horizontal inside popup menu
            // with the rest of the horizontal breadcrumbs (without the one moved to the popup menu)
            const nbrOfNonTruncatedBreadcrumbsLinks = getBreadcrumbsLinks(
                component,
                SELECTORS.nonTruncatedBreadcrumbLink
            ).length;
            expect(nbrOfNonTruncatedBreadcrumbsLinks).toBe(MOCK_BREADCRUMBS.length - 1);
            expect(component.breadcrumbs).toEqual(MOCK_BREADCRUMBS.slice(1));
            // parent breadcrumb is automatically added to the truncated breadcrumbs (ie: resources)
            const expectedNumberOfTruncatedBreadcrumbsLinks =
                MOCK_BREADCRUMBS.length - nbrOfNonTruncatedBreadcrumbsLinks + 1;
            expect(getBreadcrumbsLinks(component, SELECTORS.truncatedBreadcrumbLink)).toHaveLength(
                expectedNumberOfTruncatedBreadcrumbsLinks
            );
            expect(component).toMatchSnapshot();
        });
        describe('events', () => {
            const eventCallback = jest.fn();
            beforeEach(() => component.addEventListener('fieldinputbreadcrumbclick', eventCallback));

            it('adds the popup menu class (ie: slds-is-open), updates "aria-expanded" attribute and set focus on first breadcrumb on popup menu trigger button click', async () => {
                expectPopupMenuDisplayAndAriaExpanded(component, false);

                const [firstBreadcrumbLink] = getBreadcrumbsLinks(component);
                firstBreadcrumbLink.focus = jest.fn();
                getPopupMenuTriggerButton(component).click();
                await Promise.resolve();
                expectPopupMenuDisplayAndAriaExpanded(component, true);
                expect(firstBreadcrumbLink.focus).toHaveBeenCalled();
            });
            it('shows the popup menu ("with proper aria-expanded attribute and focus set on first breadcrumb") when "ArrowDown" key is pressed on the popup menu trigger button', async () => {
                expectPopupMenuDisplayAndAriaExpanded(component, false);

                const [firstBreadcrumbLink] = getBreadcrumbsLinks(component);
                firstBreadcrumbLink.focus = jest.fn();
                getPopupMenuTriggerButton(component).dispatchEvent(keydownEvent(Keys.ArrowDown));
                await Promise.resolve();
                expectPopupMenuDisplayAndAriaExpanded(component, true);
                expect(firstBreadcrumbLink.focus).toHaveBeenCalled();
            });
            it('hides the expanded popup menu and set focus to the first non-truncated breadcrumb when "Arrow right" key is pressed on popup menu trigger button', async () => {
                const popupMenuTriggerButton = getPopupMenuTriggerButton(component);
                popupMenuTriggerButton.click();
                await Promise.resolve();
                expectPopupMenuDisplayAndAriaExpanded(component, true);

                popupMenuTriggerButton.focus();
                const [firstNonTruncatedBreadcrumbLink] = getBreadcrumbsLinks(
                    component,
                    SELECTORS.nonTruncatedBreadcrumbLink
                );
                firstNonTruncatedBreadcrumbLink.focus = jest.fn();

                popupMenuTriggerButton.dispatchEvent(keydownEvent(Keys.ArrowRight));
                await Promise.resolve();
                expect(firstNonTruncatedBreadcrumbLink.focus).toHaveBeenCalled();
                expectPopupMenuDisplayAndAriaExpanded(component, false);
            });
            it('sets focus to the first non-truncated breadcrumb when "Arrow right" key is pressed on popup menu trigger button', async () => {
                const popupMenuTriggerButton = getPopupMenuTriggerButton(component);
                popupMenuTriggerButton.focus();
                expectPopupMenuDisplayAndAriaExpanded(component, false);
                const [firstNonTruncatedBreadcrumbLink] = getBreadcrumbsLinks(
                    component,
                    SELECTORS.nonTruncatedBreadcrumbLink
                );
                firstNonTruncatedBreadcrumbLink.focus = jest.fn();

                popupMenuTriggerButton.dispatchEvent(keydownEvent(Keys.ArrowRight));
                await Promise.resolve();
                expect(firstNonTruncatedBreadcrumbLink.focus).toHaveBeenCalled();
                expectPopupMenuDisplayAndAriaExpanded(component, false);
            });
            it(`dispatches the expected custom event on truncated breadcrumb click (not on "${BREADCRUMBS_ROOT_PARENT.name}" root parent) and updates breadcrumbs accordingly`, async () => {
                const mockBreadcrumbIndex = 0;
                const mockBreadcrumb = MOCK_BREADCRUMBS[mockBreadcrumbIndex];
                const breadcrumbLink = getBreadcrumbLink(component, mockBreadcrumb.id)!;
                expect(breadcrumbLink.className).toBe(TRUNCATED_BREADCRUMB_CLASSNAME);
                breadcrumbLink.click();
                expectFieldInputBreadcrumbClickEventSentWith(eventCallback, mockBreadcrumbIndex);
                await Promise.resolve();
                expectLastBreadcrumbLinkAriaCurrentToBeLocationValue(component);
                // Truncated breadcrumbs
                expect(component.breadcrumbs).toHaveLength(mockBreadcrumbIndex + 1);
                expect(component).toMatchSnapshot();
            });
            it(`dispatches the expected custom event on truncated breadcrumb click (on "${BREADCRUMBS_ROOT_PARENT.name}" root parent) and updates breadcrumbs accordingly`, async () => {
                const breadcrumb = getBreadcrumbLink(component, BREADCRUMBS_ROOT_PARENT.breadcrumb.id);
                const nbrOfTruncatedBreadcrumbsWithoutParentOne =
                    getBreadcrumbsLinks(component, SELECTORS.truncatedBreadcrumbLink).length - 1;

                // Truncated breadcrumbs
                expect(component.breadcrumbs).toHaveLength(
                    MOCK_BREADCRUMBS.length - nbrOfTruncatedBreadcrumbsWithoutParentOne
                );
                breadcrumb?.click();
                expectFieldInputBreadcrumbClickEventSentWith(eventCallback, BREADCRUMBS_ROOT_PARENT.eventIndex);
                await Promise.resolve();
                expect(component.breadcrumbs).toHaveLength(0);
                expect(getBreadcrumbsLinks(component)).toHaveLength(0);
                expect(component).toMatchSnapshot();
            });
            it('dispatches the expected custom event on span child of truncated breadcrumb click', () => {
                const spanSecondTruncatedBreadcrumb = getBreadcrumbsLinks(
                    component,
                    SELECTORS.truncatedBreadcrumbLink
                )[1].firstElementChild!;
                spanSecondTruncatedBreadcrumb.dispatchEvent(clickEvent());
                expectFieldInputBreadcrumbClickEventSentWith(eventCallback, 0);
            });
            describe('keydown handling on truncated breadcrumbs', () => {
                let firstTruncatedBreadcrumb: HTMLAnchorElement,
                    secondTruncatedBreadcrumb: HTMLAnchorElement,
                    firstNonTruncatedBreadcrumb: HTMLAnchorElement;
                beforeEach(() => {
                    [firstTruncatedBreadcrumb, secondTruncatedBreadcrumb] = getBreadcrumbsLinks(
                        component,
                        SELECTORS.truncatedBreadcrumbLink
                    );
                    [firstNonTruncatedBreadcrumb] = getBreadcrumbsLinks(
                        component,
                        SELECTORS.nonTruncatedBreadcrumbLink
                    );
                });
                it('sets the focus on the next truncated breadcrumb when "arrow down" key is pressed', () => {
                    firstTruncatedBreadcrumb.focus();
                    secondTruncatedBreadcrumb.focus = jest.fn();
                    firstTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowDown));
                    expect(secondTruncatedBreadcrumb.focus).toHaveBeenCalled();
                });
                it('sets the focus on the previous truncated breadcrumb when "arrow up" key is pressed', () => {
                    secondTruncatedBreadcrumb.focus();
                    firstTruncatedBreadcrumb.focus = jest.fn();
                    secondTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowUp));
                    expect(firstTruncatedBreadcrumb.focus).toHaveBeenCalled();
                });
                it('sets the focus on the first non-truncated breadcrumb when "arrow right" key is pressed on a truncated breadcrumb', () => {
                    firstTruncatedBreadcrumb.focus();
                    firstNonTruncatedBreadcrumb.focus = jest.fn();
                    firstTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowRight));
                    expect(firstNonTruncatedBreadcrumb.focus).toHaveBeenCalled();
                });
                it('sets the focus on the first truncated breadcrumb when "arrow left" key is pressed on the first non-truncated breadcrumb', () => {
                    firstNonTruncatedBreadcrumb.focus();
                    firstTruncatedBreadcrumb.focus = jest.fn();
                    firstNonTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowLeft));
                    expect(firstTruncatedBreadcrumb.focus).toHaveBeenCalled();
                });
                it('calls the click event when the "enter" key is press on a truncated breadcrumb', () => {
                    firstTruncatedBreadcrumb.focus();
                    firstTruncatedBreadcrumb.click = jest.fn();
                    firstTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.Enter));
                    expect(firstTruncatedBreadcrumb.click).toHaveBeenCalled();
                });
                it('calls the truncated breadcrumb click when "enter" key is pressed', () => {
                    firstTruncatedBreadcrumb.focus();
                    firstTruncatedBreadcrumb.click = jest.fn();
                    firstTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.Enter));
                    expect(firstTruncatedBreadcrumb.click).toHaveBeenCalled();
                });
                it('hides the opened popup menu ("with proper aria-expanded attribute and focus set on button trigger") when "Esc" key is pressed on truncated breadcrumb', async () => {
                    getPopupMenuTriggerButton(component).click();
                    await Promise.resolve();
                    expectPopupMenuDisplayAndAriaExpanded(component, true);
                    const popupMenuTriggerButton = getPopupMenuTriggerButton(component);
                    popupMenuTriggerButton.focus = jest.fn();
                    const [firstBreadcrumbLink] = getBreadcrumbsLinks(component);
                    firstBreadcrumbLink.dispatchEvent(keydownEvent(Keys.Escape));
                    await Promise.resolve();
                    expect(popupMenuTriggerButton.focus).toHaveBeenCalled();
                    expectPopupMenuDisplayAndAriaExpanded(component, false);
                });
                describe('No cycling', () => {
                    test('on "Arrow down" key', () => {
                        // the 2nd truncated breadcrumb is the last one
                        secondTruncatedBreadcrumb.focus();
                        firstTruncatedBreadcrumb.focus = jest.fn();
                        secondTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowDown));
                        expect(firstTruncatedBreadcrumb.focus).not.toHaveBeenCalled();
                    });
                    test('on "Arrow up" key', () => {
                        firstTruncatedBreadcrumb.focus();
                        // the 2nd truncated breadcrumb is the last one
                        secondTruncatedBreadcrumb.focus = jest.fn();
                        firstTruncatedBreadcrumb.dispatchEvent(keydownEvent(Keys.ArrowUp));
                        expect(secondTruncatedBreadcrumb.focus).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
    describe('breadcrumbs API setter', () => {
        let component: Breadcrumb;
        beforeAll(async () => {
            component = await createComponentUnderTest();
        });
        test.each([1, '', undefined, null, {}])(
            'Only array value permitted for breadcrumbs: does throw an error if "%s" value passed',
            (breadcrumbs) =>
                expect(() => (component.breadcrumbs = breadcrumbs)).toThrowError(ERROR_MSG_BREADCRUMBS_ARRAY_ONLY)
        );
    });
});
