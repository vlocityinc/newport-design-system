import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { setContext } from 'builder_platform_interaction/contextLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as flowOnSlack from 'mock/flows/flowOnSlack.json';
import { context } from 'serverData/GetContext/context.json';
import { supportedScreenFieldsForFlowOnSlack } from 'serverData/GetSupportedScreenFields/supportedScreenFieldsForFlowOnSlack.json';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

export const getPaletteSectionList = (screenEditor) => {
    const leftPaletteSub = screenEditor
        .getComponentsPaletteElement()
        .shadowRoot.querySelector(SELECTORS.LEFT_PANEL_PALETTE);
    return leftPaletteSub.shadowRoot.querySelectorAll(SELECTORS.PALETTE_SECTION);
};

describe('ScreenEditor with Flow On Slack', () => {
    let screenEditor: ScreenEditorTestComponent;
    const createScreenEditor = async (elementName) => {
        const element = getElementByDevName(elementName);
        const screenNode = getElementForPropertyEditor(element);
        const screenEditor = createComponentUnderTest({
            node: screenNode,
            processType: FLOW_PROCESS_TYPE.FLOW
        });
        const editor = new ScreenEditorTestComponent(screenEditor);
        await ticks(50);
        return editor;
    };
    beforeAll(async () => {
        await setupStateForFlow(flowOnSlack);
        setContext(context);
        screenEditor = await createScreenEditor('Screen1');
    });
    afterAll(() => {
        resetState();
    });
    describe('slackEnabled is included in the environments', () => {
        it('should not have a tabset', () => {
            expect(screenEditor.getTabsetElement()).toBeNull();
        });
        it('should contain a palette with proper CSS class', () => {
            const palette = screenEditor.getComponentsPaletteElement();
            expect(palette).toBeTruthy();
            expect(palette!.shadowRoot!.querySelector('div')!.className).toContain('slds-panel_docked-left');
        });
    });
    describe('Flow native screen fields', () => {
        it('Should have compatible native screen fields only', async () => {
            const sections = getPaletteSectionList(screenEditor);
            let nativeScreenFieldCount = 0;
            sections.forEach((section) => {
                const items = section.shadowRoot.querySelectorAll(SELECTORS.PALETTE_ITEM);
                items.forEach((item) => {
                    if (item.label.startsWith('FlowBuilderScreenEditor.fieldTypeLabel')) {
                        nativeScreenFieldCount++;
                    }
                });
            });
            expect(nativeScreenFieldCount).toEqual(supportedScreenFieldsForFlowOnSlack.length);
        });
    });
    // TODO: We should add a text that verifies that we don't support any extensions when a flow is
    // marked for Slack. However, at this time it looks like the mock data for this is not set up
    // correctly.
});
