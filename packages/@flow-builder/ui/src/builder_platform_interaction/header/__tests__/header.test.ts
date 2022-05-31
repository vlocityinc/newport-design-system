import { setup } from '@sa11y/jest';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import Header from '../header';
import { LABELS } from '../headerLabels';
const { logInteraction } = loggingUtils;

jest.mock('builder_platform_interaction/contextLib', () =>
    Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowBuilderGuardrails: jest.fn()
    })
);
jest.mock('builder_platform_interaction/sharedUtils');

const createComponentForTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-header', {
        is: Header
    });
    Object.assign(el, { helpUrl: '/help' }, props);
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    root: '.header',
    flowNameVersionTitle: '.test-flow-name-version-title',
    flowName: '.test-flow-name',
    flowVersion: '.test-flow-version',
    appName: '.test-app-name',
    backUrl: '.test-back-url',
    backUrlTooltip: 'div[role="tooltip"]',
    backLabel: '.test-back-label',
    helpUrl: '.test-help-url',
    helpLabel: '.test-help-label',
    flowIcon: '.test-flow-utility-icon',
    backIcon: '.test-back-utility-icon',
    helpIcon: '.test-help-utility-icon',
    guardrailsMenuItem: 'analyzer_framework-help-menu-item',
    interviewLabel: '.test-interview-label',
    flowTestLabel: '.test-flowTest-label',
    debugBadge: '.test-debug-badge',
    testBadge: '.test-flowtest-badge',
    systemModeBadge: `${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BADGE}[title = "FlowBuilderHeader.systemModeLabelText"]`,
    overrideBadge: `${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BADGE}[title = "FlowBuilderHeader.overrideBadge"]`
};
const getAppNameDiv = (header) => header.shadowRoot.querySelector(SELECTORS.appName);
const getMenuTrigger = (headerComponent) =>
    headerComponent.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_MENU);
const getGuardrailsMenuItems = (headerComponent) =>
    headerComponent.shadowRoot.querySelectorAll(SELECTORS.guardrailsMenuItem);
const getLigthningMenuItems = (headerComponent) =>
    headerComponent.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_MENU_ITEM);
const getHelpUrl = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.helpUrl);
const getFlowIcon = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.flowIcon);
const getBackUrl = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.backUrl);
const getDebugStatusBadge = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.debugBadge);
const getTestStatusBadge = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.testBadge);
const getBackUrlTooltip = (headerComponent) => headerComponent.shadowRoot.querySelector(SELECTORS.backUrlTooltip);
const getBackUrlIcon = (headerComponent) =>
    getBackUrl(headerComponent).querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);

describe('header', () => {
    beforeAll(() => {
        setup();
    });
    test('Accessibility', async () => {
        const headerComponent = createComponentForTest({ backUrl: '/300' });
        await expect(headerComponent).toBeAccessible();
    });
    test('focus API function calls backUrl focus', () => {
        const headerComponent = createComponentForTest({ backUrl: '/300' });
        const mockFocusEventHandler = jest.fn();
        getBackUrl(headerComponent).addEventListener('focus', mockFocusEventHandler);
        headerComponent.focus();
        expect(mockFocusEventHandler).toHaveBeenCalled();
    });

    it('does NOT render the backUrl icon and tooltip if no url is passed', () => {
        const headerComponent = createComponentForTest();
        expect(getBackUrl(headerComponent)).toBeNull();
        expect(getBackUrlTooltip(headerComponent)).toBeNull();
    });
    it('does render the backUrl icon and tooltip if no url is passed', () => {
        const headerComponent = createComponentForTest({ backUrl: '/300' });
        expect(getBackUrl(headerComponent)).not.toBeNull();
        expect(getBackUrlTooltip(headerComponent)).not.toBeNull();
    });
    test('back url tooltip css class', async () => {
        const headerComponent = createComponentForTest({ backUrl: '/300' });
        const backUrlIcon = getBackUrlIcon(headerComponent);
        backUrlIcon.dispatchEvent(new CustomEvent('focus'));
        await ticks(1);
        const backUrlTootip = getBackUrlTooltip(headerComponent);
        expect(backUrlTootip.className).toMatch('slds-rise-from-ground');
        backUrlIcon.dispatchEvent(new CustomEvent('blur'));
        await ticks(1);
        expect(backUrlTootip.className).toMatch('slds-fall-into-ground');
    });

    test('checks the rendering of default FLOW UTILITY icon', () => {
        const headerComponent = createComponentForTest();
        expect(getFlowIcon(headerComponent).iconName).toEqual('utility:flow');
    });

    it('displays badge in system mode', () => {
        const headerComponent = createComponentForTest({ runInMode: 'SystemModeWithSharing' });
        const systemModeBadge = headerComponent.shadowRoot.querySelector(SELECTORS.systemModeBadge);
        expect(systemModeBadge).not.toBeNull();
    });

    test('checks the rendering of default APP NAME label', () => {
        const headerComponent = createComponentForTest();
        expect(getAppNameDiv(headerComponent).textContent).toEqual(LABELS.appNameText);
    });

    test('checks the rendering of configured icon', () => {
        const testIcon = 'utility:testIcon';
        const headerComponent = createComponentForTest({ builderIcon: testIcon });
        expect(getFlowIcon(headerComponent).iconName).toEqual(testIcon);
    });

    test('checks the rendering of configured builder name', () => {
        const testBuilderName = 'testBuilder';
        const headerComponent = createComponentForTest({ builderName: testBuilderName });
        expect(getAppNameDiv(headerComponent).textContent).toEqual(testBuilderName);
    });

    test('checks the rendering FLOW NAME VERSION TITLE', () => {
        const EXPECTED_TITLE = `Flow Name${LABELS.versionLabelText}1`;
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.flowNameVersionTitle).title).toEqual(EXPECTED_TITLE);
        expect(document.title).toEqual(EXPECTED_TITLE);
    });

    test('checks the rendering FLOW NAME', () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.flowName).textContent).toEqual('Flow Name');
    });

    test('checks the rendering FLOW VERSION', () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.flowVersion).textContent).toEqual(
            `${LABELS.versionLabelText}1`
        );
    });

    test('checks the rendering BACK UTILITY icon', () => {
        const headerComponent = createComponentForTest({ backUrl: '/300' });
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.backIcon).iconName).toEqual('utility:back');
    });

    test('checks the rendering BACK URL when ProcessUIFlow value is provided should return /300', () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1', backUrl: '/300' });
        expect(getBackUrl(headerComponent).pathname).toEqual('/300');
    });

    test('checks the rendering HELP UTILITY Icon', () => {
        const headerComponent = createComponentForTest();
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.helpIcon).iconName).toEqual('utility:help');
    });

    test('checks the rendering HELP label', () => {
        const headerComponent = createComponentForTest();
        expect(headerComponent.shadowRoot.querySelector(SELECTORS.helpLabel).textContent).toEqual(
            LABELS.helpButtonText
        );
    });

    test('checks the rendering HELP URL when its undefined and should return Undefined.', () => {
        const headerComponent = createComponentForTest();
        expect(getHelpUrl(headerComponent).value).toBeUndefined();
    });

    test('checks the rendering HELP URL when ProcessUIFlow value is provided should return /HELP', () => {
        const headerComponent = createComponentForTest({
            flowName: 'Flow Name',
            flowVersion: '1',
            backUrl: '/300',
            helpUrl: '/HELP'
        });
        expect(getHelpUrl(headerComponent).pathname).toEqual('/HELP');
    });

    it('should not render the help menu if guardrails is off', () => {
        // @ts-ignore
        orgHasFlowBuilderGuardrails.mockReturnValue(false);
        const headerComponent = createComponentForTest();
        expect(getMenuTrigger(headerComponent)).toBeNull();
        expect(getHelpUrl(headerComponent)).not.toBeNull();
    });

    describe('override badge with overridden flow', () => {
        const headerComponent = createComponentForTest({ overriddenFlow: 'OverriddenFlowName' });
        const overrideBadge = headerComponent.shadowRoot.querySelector(SELECTORS.overrideBadge);
        expect(overrideBadge).not.toBeNull();
    });

    describe('override badge with no overridden flow', () => {
        const headerComponent = createComponentForTest();
        const overrideBadge = headerComponent.shadowRoot.querySelector(SELECTORS.overrideBadge);
        expect(overrideBadge).toBeNull();
    });

    describe('help menu', () => {
        beforeAll(() => {
            // @ts-ignore
            orgHasFlowBuilderGuardrails.mockReturnValue(true);
        });

        it('contains flow builder items', () => {
            const headerComponent = createComponentForTest({
                helpUrl: '/HELP',
                trailheadUrl: '/TRAILHEAD',
                trailblazerCommunityUrl: '/TRAILBLAZER',
                guardrailsParams: { running: false }
            });
            expect(getMenuTrigger(headerComponent)).not.toBeNull();
            expect(getLigthningMenuItems(headerComponent)).toHaveLength(4);
        });

        it('contains flow builder items even with empty/undefined urls', () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
            expect(getMenuTrigger(headerComponent)).not.toBeNull();
            expect(getLigthningMenuItems(headerComponent)).toHaveLength(4);
        });

        describe('logging', () => {
            describe('help', () => {
                test.each`
                    menuItemLabel              | menuItemIndex | logTarget
                    ${'flow builder'}          | ${0}          | ${'help-button'}
                    ${'keyboard'}              | ${1}          | ${'keyboard-help-button'}
                    ${'trailhead'}             | ${2}          | ${'trailhead-button'}
                    ${'trailblazer community'} | ${3}          | ${'trailblazer-community-button'}
                `(
                    'Click on $menuItemLabel menu item should be logged with the following log target: "$logTarget"',
                    ({ menuItemIndex, logTarget }) => {
                        const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
                        getLigthningMenuItems(headerComponent)[menuItemIndex].click();
                        expect(logInteraction).toHaveBeenCalledWith(logTarget, 'header', null, 'click');
                    }
                );
            });
            describe('guardrails', () => {
                test.each`
                    menuItemLabel  | running  | menuItemIndex | logTarget
                    ${'view tips'} | ${false} | ${0}          | ${'view-guardrails-button'}
                    ${'mute tips'} | ${false} | ${1}          | ${'mute-guardrails-button'}
                    ${'mute tips'} | ${true}  | ${1}          | ${'unmute-guardrails-button'}
                `(
                    'Click on $menuItemLabel menu item when guardrails running is $running should be logged with the following log target: "$logTarget"',
                    ({ menuItemIndex, running, logTarget }) => {
                        const headerComponent = createComponentForTest({ guardrailsParams: { running } });
                        getGuardrailsMenuItems(headerComponent)[menuItemIndex].click();
                        expect(logInteraction).toHaveBeenCalledWith(logTarget, 'header', null, 'click');
                    }
                );
            });
        });

        it('contains guardrails items', () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: true, count: 1 } });
            expect(getMenuTrigger(headerComponent)).not.toBeNull();
            const guardrailsMenuItems = getGuardrailsMenuItems(headerComponent);
            expect(guardrailsMenuItems).toHaveLength(2);

            const viewGuardrails = guardrailsMenuItems[0];
            expect(viewGuardrails.running).toBe(true);
            expect(viewGuardrails.count).toEqual(1);
        });

        test('guardrails items rendered even when muted', () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
            expect(getMenuTrigger(headerComponent)).not.toBeNull();
            expect(getGuardrailsMenuItems(headerComponent)).toHaveLength(2);
        });
    });
});
