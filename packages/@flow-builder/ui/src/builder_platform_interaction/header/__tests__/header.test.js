import { createElement } from 'lwc';
import Header from '../header';
import { LABELS } from '../headerLabels';
import { orgHasFlowBuilderGuardrails } from 'builder_platform_interaction/contextLib';
import { invokeKeyboardHelpDialog } from 'builder_platform_interaction/builderUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowBuilderGuardrails: jest.fn()
    });
});

jest.mock('builder_platform_interaction/builderUtils', () => {
    return { invokeKeyboardHelpDialog: jest.fn() };
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-header', {
        is: Header
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const selectors = {
    root: '.header',
    flowNameVersionTitle: '.test-flow-name-version-title',
    flowName: '.test-flow-name',
    flowVersion: '.test-flow-version',
    appName: '.test-app-name',
    backUrl: '.test-back-url',
    backLabel: '.test-back-label',
    helpUrl: '.test-help-url',
    helpLabel: '.test-help-label',
    flowIcon: '.test-flow-utility-icon',
    backIcon: '.test-back-utility-icon',
    helpIcon: '.test-help-utility-icon',
    buttonMenu: 'lightning-button-menu',
    lightningMenuItem: 'lightning-menu-item',
    guardrailsMenuItem: 'analyzer_framework-help-menu-item'
};

describe('HEADER', () => {
    it('checks the rendering of default FLOW UTILITY Icon', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.flowIcon).iconName).toEqual('utility:flow');
    });

    it('checks the rendering of default APP NAME label', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.appName).textContent).toEqual(LABELS.appNameText);
    });

    it('checks the rendering of configured icon', async () => {
        const testIcon = 'utility:testIcon';
        const headerComponent = createComponentForTest();
        headerComponent.builderIcon = testIcon;
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.flowIcon).iconName).toEqual(testIcon);
    });

    it('checks the rendering of configured builder name', async () => {
        const testBuilderName = 'testBuilder';
        const headerComponent = createComponentForTest();
        headerComponent.builderName = testBuilderName;
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.appName).textContent).toEqual(testBuilderName);
    });

    it('checks the rendering FLOW NAME VERSION TITLE', async () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.flowNameVersionTitle).title).toEqual(
            `Flow Name${LABELS.versionLabelText}1`
        );
    });

    it('checks the rendering FLOW NAME', async () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.flowName).textContent).toEqual(`Flow Name`);
    });

    it('checks the rendering FLOW VERSION', async () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1' });
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.flowVersion).textContent).toEqual(
            `${LABELS.versionLabelText}1`
        );
    });

    it('checks the rendering BACK UTILITY Icon', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.backIcon).iconName).toEqual('utility:back');
    });

    it('checks the rendering BACK URL when its undefined and should return Undefined.', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.backUrl).value).toBeUndefined();
    });

    it('checks the rendering BACK URL when ProcessUIFlow value is provided should return /300', async () => {
        const headerComponent = createComponentForTest({ flowName: 'Flow Name', flowVersion: '1', backUrl: '/300' });
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.backUrl).pathname).toEqual('/300');
    });

    it('checks the rendering BACK label', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.backLabel).textContent).toEqual(
            LABELS.backButtonText
        );
    });

    it('checks the rendering HELP UTILITY Icon', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.helpIcon).iconName).toEqual('utility:help');
    });

    it('checks the rendering HELP label', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.helpLabel).textContent).toEqual(
            LABELS.helpButtonText
        );
    });

    it('checks the rendering HELP URL when its undefined and should return Undefined.', async () => {
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.helpUrl).value).toBeUndefined();
    });

    it('checks the rendering HELP URL when ProcessUIFlow value is provided should return /HELP', async () => {
        const headerComponent = createComponentForTest({
            flowName: 'Flow Name',
            flowVersion: '1',
            backUrl: '/300',
            helpUrl: '/HELP'
        });
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.helpUrl).pathname).toEqual('/HELP');
    });

    it('should not render the help menu if guardrails is off', async () => {
        orgHasFlowBuilderGuardrails.mockReturnValue(false);
        const headerComponent = createComponentForTest();
        await ticks(1);
        expect(headerComponent.shadowRoot.querySelector(selectors.buttonMenu)).toBeNull();
        expect(headerComponent.shadowRoot.querySelector(selectors.helpUrl)).toBeDefined();
    });

    describe('help menu', () => {
        beforeEach(() => {
            orgHasFlowBuilderGuardrails.mockReturnValue(true);
        });

        it('contains flow builder items', async () => {
            const headerComponent = createComponentForTest({
                helpUrl: '/HELP',
                trailheadUrl: '/TRAILHEAD',
                trailblazerCommunityUrl: '/TRAILBLAZER',
                guardrailsParams: { running: false }
            });
            await ticks(1);
            expect(headerComponent.shadowRoot.querySelector(selectors.buttonMenu)).toBeDefined();
            expect(headerComponent.shadowRoot.querySelectorAll(selectors.lightningMenuItem)).toHaveLength(4);
        });

        it('contains flow builder items even with empty/undefined urls', async () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
            await ticks(1);
            expect(headerComponent.shadowRoot.querySelector(selectors.buttonMenu)).toBeDefined();
            expect(headerComponent.shadowRoot.querySelectorAll(selectors.lightningMenuItem)).toHaveLength(4);
        });

        it('keyboard help menu item invokes keyboard help dialog', async () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
            await ticks(1);
            const keyboardHelp = headerComponent.shadowRoot.querySelectorAll(selectors.lightningMenuItem)[2];
            keyboardHelp.addEventListener('click', invokeKeyboardHelpDialog);
            keyboardHelp.click();
            expect(invokeKeyboardHelpDialog).toHaveBeenCalled();
        });

        it('contains guardrails items', async () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: true, count: 1 } });
            await ticks(1);
            expect(headerComponent.shadowRoot.querySelector(selectors.buttonMenu)).toBeDefined();
            expect(headerComponent.shadowRoot.querySelectorAll(selectors.guardrailsMenuItem)).toHaveLength(2);

            const viewGuardrails = headerComponent.shadowRoot.querySelectorAll(selectors.guardrailsMenuItem)[0];
            expect(viewGuardrails.running).toBeTruthy();
            expect(viewGuardrails.count).toBeDefined();
            expect(viewGuardrails.count).toEqual(1);
        });

        it('guardrails items rendered even when muted', async () => {
            const headerComponent = createComponentForTest({ guardrailsParams: { running: false } });
            await ticks(1);
            expect(headerComponent.shadowRoot.querySelector(selectors.buttonMenu)).toBeDefined();
            expect(headerComponent.shadowRoot.querySelectorAll(selectors.guardrailsMenuItem)).toHaveLength(2);
        });
    });
});
