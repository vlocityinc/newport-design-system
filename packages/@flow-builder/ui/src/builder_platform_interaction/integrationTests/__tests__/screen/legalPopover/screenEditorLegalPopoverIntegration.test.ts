import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { FLOW_PROCESS_TYPE, FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { LegalPopoverTestComponent, resetState, setupStateForFlow } from '../../integrationTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

describe('Screen Editor Legal Popover', () => {
    let screenEditor: ScreenEditorTestComponent;
    let popover: LegalPopoverTestComponent | undefined;
    const footerCustomOptionSelectEvent = new CustomEvent('change', {
        detail: { value: FOOTER_LABEL_TYPE.CUSTOM }
    });
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
    describe('Popover for Custom Footers Notice', () => {
        let screenEditor;
        let propertiesEditor;
        beforeEach(async () => {
            screenEditor = await createScreenEditor('screenWithAutomaticFields');
            propertiesEditor = screenEditor.getPropertiesEditorContainer().getScreenPropertiesEditor();
        });
        it('is visible if next or finish label custom option is selected', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.customFooterLegalNoticeHeader);
        });
        it('is visible if previous label custom option is selected', async () => {
            propertiesEditor!.getPreviousLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.customFooterLegalNoticeHeader);
        });
        it('is visible if pause label custom option is selected', async () => {
            propertiesEditor!.getPauseLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.customFooterLegalNoticeHeader);
        });
        it('is not visible if dismissed using the close button', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            popover!.clickOnCloseButton();
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('is not visible even on trigger if dismissed previously', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            popover!.clickOnCloseButton();
            await ticks();
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: FOOTER_LABEL_TYPE.STANDARD }
                })
            );
            await ticks();
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('is not visible if label type hide / standard option is selected', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: FOOTER_LABEL_TYPE.HIDE }
                })
            );
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(
                new CustomEvent('change', {
                    detail: { value: FOOTER_LABEL_TYPE.STANDARD }
                })
            );
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
        it('it contains a link to the agreement url when visible', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.customFooterLegalNoticeHeader);
            expect(popover!.getAgreementUrl()).toBe('https://www.salesforce.com/company/legal/agreements/');
        });
    });
    describe('Multiple Legal Notices in Popup', () => {
        let screenEditor;
        let propertiesEditor;
        beforeEach(async () => {
            screenEditor = await createScreenEditor('screenWithAutomaticFields');
            propertiesEditor = screenEditor.getPropertiesEditorContainer().getScreenPropertiesEditor();
        });
        it('more than 1 notice show up in same popup if triggered', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(2);
        });
        it('latest notice is added at bottom of the popover', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(2);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.automaticFieldsLegalNoticeHeader);
        });
        it('if 1 notice has been dismissed, other one can show up on trigger if not dismissed', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            popover!.clickOnCloseButton();
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(1);
            expect(popover!.getLastNoticeHeading()).toEqual(LABELS.automaticFieldsLegalNoticeHeader);
        });
        it('all notices can be dismissed together', async () => {
            propertiesEditor!.getNextOrFinishLabelTypeRadioButtons().dispatchEvent(footerCustomOptionSelectEvent);
            await ticks();
            screenEditor.getAutomaticFieldsTab().dispatchEvent(activeTabEvent);
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover!.isVisible()).toBe(true);
            expect(popover!.getNumberOfNoticesInPopup()).toEqual(2);
            popover!.clickOnCloseButton();
            await ticks();
            popover = screenEditor.getLegalPopover();
            expect(popover).toBeUndefined();
        });
    });
});
