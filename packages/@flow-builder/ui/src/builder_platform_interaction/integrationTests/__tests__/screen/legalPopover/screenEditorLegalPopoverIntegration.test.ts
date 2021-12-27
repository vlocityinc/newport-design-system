import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { LegalPopoverTestComponent, resetState, setupStateForFlow } from '../../integrationTestUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

describe('Screen Editor Legal Popover', () => {
    let screenEditor: ScreenEditorTestComponent;
    let popover: LegalPopoverTestComponent | undefined;
    const activeTabEvent = new CustomEvent('active', {});
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
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('Popover for Automatic Fields Notice', () => {
        beforeEach(async () => {
            screenEditor = await createScreenEditor('screenWithAutomaticFields');
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
        });
        it('is visible in the Fields tab if not dismissed', async () => {
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.automaticFieldsLegalNoticeHeader);
        });
        it('is not visible if switched to the Components tab', async () => {
            screenEditor.getComponentsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('is not visible if dismissed using the close button', async () => {
            popover!.clickOnCloseButton();
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('is not visible once dismissed even on tab switch to component and back to fields', async () => {
            popover!.clickOnCloseButton();
            await ticks();
            screenEditor.getComponentsTab().dispatchEvent(activeTabEvent);
            await ticks();
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('it contains a link to the agreement url when visible', () => {
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.automaticFieldsLegalNoticeHeader);
            expect(popover!.getAgreementUrl()).toBe('https://www.salesforce.com/company/legal/agreements/');
        });
    });
});
