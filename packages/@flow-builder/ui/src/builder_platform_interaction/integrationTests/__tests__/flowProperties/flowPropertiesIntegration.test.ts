import {
    checkboxChangeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { setContext } from 'builder_platform_interaction/contextLib';
import FlowPropertiesEditor from 'builder_platform_interaction/flowPropertiesEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import * as flowOnSlack from 'mock/flows/flowOnSlack.json';
import { context } from 'serverData/GetContext/context.json';
import { resetState, setupStateForFlow } from '../integrationTestUtils';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    SLACK_CHECK: 'lightning-input.slack_check',
    SHOW_ADVANCED: '.show-advanced-button'
};

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-flowPropertiesEditor', { is: FlowPropertiesEditor });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
};

const getShowAdvancedButton = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SHOW_ADVANCED);
};

const getSlackCheck = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.SLACK_CHECK);
};

const setOrgHasScreenFlowsInSlack = (orgPermStatus) => {
    Object.assign(context, { access: { orgHasScreenFlowsInSlack: orgPermStatus } });
    setContext(context);
};

const getLegalNoticePopover = (flowPropertiesEditor) => {
    return flowPropertiesEditor.shadowRoot.querySelector(SELECTORS.LEGAL_POPOVER);
};

describe('Property Editor for Flow on slack', () => {
    let propertyEditorElement = null;
    beforeAll(async () => {
        // we set devMode to true to detect illegal changes to the state during getElementForPropertyEditor calls (see W-9823122 or W-9843783)
        await setupStateForFlow(flowOnSlack, { devMode: true });
        setOrgHasScreenFlowsInSlack(true);

        const flowProperties = Store.getStore().getCurrentState().properties;

        const elementForPropertyEditor = getElementForPropertyEditor(flowProperties);
        expect(elementForPropertyEditor).toBeTruthy();

        propertyEditorElement = createComponentUnderTest(elementForPropertyEditor);

        getShowAdvancedButton(propertyEditorElement).click();
        await ticks(1);
    });
    afterAll(() => {
        resetState();
        setOrgHasScreenFlowsInSlack(false);
    });
    it('has "Make available for Slack" checkbox checked', async () => {
        const slackCheckBox = getSlackCheck(propertyEditorElement);
        expect(slackCheckBox).not.toBeNull();
        expect(slackCheckBox.checked).toBe(true);
    });
    it('has the legal popover display when the Checkbox is checked again', async () => {
        const slackCheckBox = getSlackCheck(propertyEditorElement);
        expect(slackCheckBox.checked).toBe(true);
        // UnCheck the 'Make available in Slack' checkbox
        await slackCheckBox.dispatchEvent(checkboxChangeEvent(false));
        expect(slackCheckBox.checked).toBe(false);
        // Check again the 'Make available in Slack' checkbox
        await slackCheckBox.dispatchEvent(checkboxChangeEvent(true));
        expect(slackCheckBox.checked).toBe(true);

        // Expect the popover to be displayed
        expect(getLegalNoticePopover(propertyEditorElement)).toBeTruthy();
    });
});
