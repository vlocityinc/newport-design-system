import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ItemSelectedEvent } from 'builder_platform_interaction/events';

import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { setupState, resetState, loadFlow } from '../../integrationTestUtils';
import {
    createComponentUnderTest,
    ScreenEditorTestComponent,
    SectionScreenEditorHighlightTestComponent
} from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

describe('ScreenEditor', () => {
    let screenNode;
    let store;
    let screenEditor: ScreenEditorTestComponent;
    describe('Existing Screen containing screen fields, including two sections, each in turn containing nested screen fields', () => {
        beforeAll(async () => {
            store = setupState();
            await loadFlow(flowWithAllElements, store);
        });
        afterAll(() => {
            resetState();
        });
        beforeEach(async () => {
            /*
                Layout of ScreenWithSection
                - Section1
                    - Column1
                        - Slider
                - Number
                - Section2
                    - Column1
                        - Text
                    - Column2
                        - Email
                        - Picklist (DropdownBox)
                - Address
            */
            const element = getElementByDevName('ScreenWithSection');
            screenNode = getElementForPropertyEditor(element);
            screenEditor = new ScreenEditorTestComponent(
                createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                })
            );
            await ticks(50);
        });
        it('Select the Address screen field and verify the extension properties editor', async () => {
            const addressElement = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('address_2');
            expect(addressElement).toBeTruthy();
            addressElement!.click();
            await ticks(50);
            const extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor).toBeTruthy();
        });
        it('Select the first Section and verify the section properties editor', async () => {
            const section = screenEditor
                .getCanvas()
                .getScreenEditorHighlightForScreenFieldWithName('ScreenWithSection_Section1');
            expect(section).toBeTruthy();
            section!.click();
            await ticks(50);
            const sectionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getSectionFieldPropertiesEditor();
            expect(sectionPropertiesEditor).toBeTruthy();
        });
        it('Select the Slider screen field in the first section and verify the extension properties editor', async () => {
            const slider = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('slider_1');
            expect(slider).toBeTruthy();
            slider!.click();
            await ticks(50);
            const extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor).toBeTruthy();
        });
        it('Change the name of the Slider, switch to a different screen field, then switch back and verify we still have the updated name', async () => {
            // Select slider component in canvas and verify the API name of the slider on the extension properties editor
            let slider = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('slider_1');
            slider!.click();
            await ticks(50);
            let extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor!.getApiName()).toEqual('slider_1');

            // Change the API name of the slider
            await extensionPropertiesEditor!.setApiName('slider_2');

            // Select the address component on the canvas and verify API name
            const address = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('address_2');
            address!.click();
            await ticks(50);
            extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor!.getApiName()).toEqual('address_2');

            // Select the slider again and verify it has the updated API name
            slider = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('slider_2');
            slider!.click();
            await ticks(50);
            extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor!.getApiName()).toEqual('slider_2');
        });
        it('Select the Text screen field in the first Column in the second Section and verify the input properties editor', async () => {
            const text = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('text_2');
            expect(text).toBeTruthy();
            text!.click();
            await ticks(50);
            const inputFieldPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getInputFieldPropertiesEditorElement();
            expect(inputFieldPropertiesEditor).not.toEqual(null);
        });
        it('Select the Email screen field in the second Column in the second Section and verify the extension properties editor', async () => {
            const email = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('email_2');
            expect(email).toBeTruthy();
            email!.click();
            await ticks(50);
            const extensionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getExtensionPropertiesEditor();
            expect(extensionPropertiesEditor).toBeTruthy();
        });
        it('Add a Column to the second Section and verify the canvas is updated accordingly', async () => {
            const section = screenEditor
                .getCanvas()
                .getScreenEditorHighlightForScreenFieldWithName(
                    'ScreenWithSection_Section2'
                ) as SectionScreenEditorHighlightTestComponent;
            section.click();
            await ticks(50);
            expect(section.getColumnCount()).toBe(2);
            const sectionPropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getSectionFieldPropertiesEditor();
            sectionPropertiesEditor!.clickAddColumn();
            await ticks(50);
            expect(section.getColumnCount()).toBe(3);
        });
        it('Select the Picklist screen field in the second Column in the second Section and verify the choice properties editor', async () => {
            const picklist = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('accounts');
            expect(picklist).toBeTruthy();
            picklist!.click();
            await ticks(50);
            const choicePropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getChoiceFieldPropertiesEditorElement();
            expect(choicePropertiesEditor).not.toEqual(null);
            const propertyFields = choicePropertiesEditor!.shadowRoot!.querySelectorAll(
                SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR
            );
            expect(propertyFields).toHaveLength(6);
            const groupedCombobox = deepQuerySelector(propertyFields[2], [
                SELECTORS.FEROV_RESOURCE_PICKER,
                SELECTORS.BASE_RESOURCE_PICKER,
                SELECTORS.COMBOBOX,
                SELECTORS.LIGHTNING_GROUPED_COMBOBOX
            ]);
            expect(groupedCombobox.value).toEqual('{!recordChoiceSet}');
        });
        it('Select the Picklist screen field, change its default value and verify the change on the canvas', async () => {
            const picklist = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('accounts');
            picklist!.click();
            await ticks(50);
            const choicePropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getChoiceFieldPropertiesEditorElement()!;
            const propertyFields = choicePropertiesEditor.shadowRoot!.querySelectorAll(
                SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR
            );
            const ferovResourcePicker = propertyFields[4].shadowRoot!.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
            expect((ferovResourcePicker as any).value).toEqual('');
            const otherChoice = getElementByDevName('other');
            const itemPayload = { value: otherChoice!.guid, displayText: '{!other}' };
            ferovResourcePicker!.dispatchEvent(new ItemSelectedEvent(itemPayload as any) as Event);
            await ticks(50);
            const picklistScreenField = picklist!.getScreenFieldElement();
            const lightningPicklist = deepQuerySelector(picklistScreenField, [
                SELECTORS.SCREEN_CHOICE_FIELD,
                SELECTORS.LIGHTNING_PICKLIST
            ]);
            expect(lightningPicklist.value).toEqual(otherChoice!.guid);
        });
        it('Select the Picklist screen field and verify the CFV rule is correct', async () => {
            const picklist = screenEditor.getCanvas().getScreenEditorHighlightForScreenFieldWithName('accounts');
            picklist!.click();
            await ticks(50);
            const choicePropertiesEditor = screenEditor
                .getPropertiesEditorContainerElement()
                .getChoiceFieldPropertiesEditorElement();
            const conditionListItem = deepQuerySelector(choicePropertiesEditor, [
                SELECTORS.SCREEN_COMPONENT_VISIBILITY_SECTION,
                SELECTORS.COMPONENT_VISIBILITY,
                SELECTORS.CONDITION_LIST_ITEM
            ]);
            expect(conditionListItem).not.toBeNull();
            const slider = getElementByDevName('slider_1')!;
            expect(conditionListItem.condition.leftHandSide.value).toEqual(slider.guid + '.value');
            expect(conditionListItem.condition.operator.value).toEqual('GreaterThanOrEqualTo');
            expect(conditionListItem.condition.rightHandSide.value).toEqual('50');
        });
    });
});
