// @ts-nocheck
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createScreenElementSelectedEvent } from 'builder_platform_interaction/events';

import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    blurEvent,
    changeEvent
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { setupState, resetState, loadFlow } from '../../integrationTestUtils';
import {
    createComponentUnderTest,
    getExtensionPropertiesEditorElement,
    getScreenPropertiesEditorContainerElement,
    getSectionElementInScreenEditorCanvas,
    getCanvasScreenFieldElement,
    SCREEN_FIELD_TITLES,
    getScreenEditorHighlightElementInSection,
    getCanvasElement
} from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const getChoicePropertiesEditorElement = (screenEditor) => {
    return getScreenPropertiesEditorContainerElement(screenEditor).shadowRoot.querySelector(
        SELECTORS.SCREEN_CHOICE_FIELD_PROPERTIES_EDITOR
    );
};

const getInputFieldPropertiesEditorElement = (screenEditor) => {
    return getScreenPropertiesEditorContainerElement(screenEditor).shadowRoot.querySelector(
        SELECTORS.SCREEN_INPUT_FIELD_PROPERTIES_EDITOR
    );
};

const getSectionFieldPropertiesEditorElement = (screenEditor) => {
    return getScreenPropertiesEditorContainerElement(screenEditor).shadowRoot.querySelector(
        SELECTORS.SCREEN_SECTION_FIELD_PROPERTIES_EDITOR
    );
};

const getApiNameElementInPropertiesEditor = (propertiesEditor) => {
    return deepQuerySelector(propertiesEditor, [SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR, SELECTORS.LIGHTNING_INPUT]);
};

describe('ScreenEditor', () => {
    let screenNode, store;
    let screenEditor;
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
            screenEditor = createComponentUnderTest({
                node: screenNode,
                processType: FLOW_PROCESS_TYPE.FLOW
            });
            await ticks(50);
        });
        it('Select the Address screen field and verify the extension properties editor', async () => {
            expect.assertions(2);
            const addressElement = getCanvasScreenFieldElement(screenEditor, 'Address');
            expect(addressElement).not.toBeNull();
            addressElement.click();
            await ticks(50);
            const extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            expect(extensionPropertiesEditor).not.toBeNull();
        });
        it('Select the first Section and verify the section properties editor', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section1');
            expect(section).not.toBeNull();
            section.click();
            await ticks(50);
            const sectionPropertiesEditor = getSectionFieldPropertiesEditorElement(screenEditor);
            expect(sectionPropertiesEditor).not.toBeNull();
        });
        it('Select the Slider screen field in the first section and verify the extension properties editor', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section1');
            const slider = getScreenEditorHighlightElementInSection(section, 'Slider');
            expect(slider).not.toBeNull();
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(slider.screenElement));
            await ticks(50);
            const extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            expect(extensionPropertiesEditor).not.toBeNull();
        });
        it('Change the name of the Slider, switch to a different screen field, then switch back and verify we still have the updated name', async () => {
            expect.assertions(3);
            const canvas = getCanvasElement(screenEditor);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section1');

            // Select slider component in canvas and verify the API name of the slider on the extension properties editor
            const slider = getScreenEditorHighlightElementInSection(section, 'Slider');
            canvas.dispatchEvent(createScreenElementSelectedEvent(slider.screenElement));
            await ticks(50);
            let extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            let apiNameField = getApiNameElementInPropertiesEditor(extensionPropertiesEditor);
            expect(apiNameField.value).toEqual('slider_1');

            // Change the API name of the slider
            apiNameField.value = 'slider_2';
            apiNameField.dispatchEvent(blurEvent);

            // Select the address component on the canvas and verify API name
            const address = getCanvasScreenFieldElement(screenEditor, 'Address');
            address.click();
            await ticks(50);
            extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            apiNameField = getApiNameElementInPropertiesEditor(extensionPropertiesEditor);
            expect(apiNameField.value).toEqual('address_2');

            // Select the slider again and verify it has the updated API name
            canvas.dispatchEvent(createScreenElementSelectedEvent(slider.screenElement));
            await ticks(50);
            extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            apiNameField = getApiNameElementInPropertiesEditor(extensionPropertiesEditor);
            expect(apiNameField.value).toEqual('slider_2');
        });
        it('Select the Text screen field in the first Column in the second Section and verify the input properties editor', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            const text = getScreenEditorHighlightElementInSection(section, SCREEN_FIELD_TITLES.TEXT);
            expect(text).not.toBeNull();
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(text.screenElement));
            await ticks(50);
            const inputFieldPropertiesEditor = getInputFieldPropertiesEditorElement(screenEditor);
            expect(inputFieldPropertiesEditor).not.toBeNull();
        });
        it('Select the Email screen field in the second Column in the second Section and verify the extension properties editor', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            const email = getScreenEditorHighlightElementInSection(section, SCREEN_FIELD_TITLES.EMAIL);
            expect(email).not.toBeNull();
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(email.screenElement));
            await ticks(50);
            const extensionPropertiesEditor = getExtensionPropertiesEditorElement(screenEditor);
            expect(extensionPropertiesEditor).not.toBeNull();
        });
        it('Add a Column to the second Section and verify the canvas is updated accordingly', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            section.click();
            await ticks(50);
            let columns = section.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS);
            expect(columns).toHaveLength(2);
            const sectionPropertiesEditor = getSectionFieldPropertiesEditorElement(screenEditor);
            const addButton = deepQuerySelector(sectionPropertiesEditor, [SELECTORS.LIST, 'lightning-button']);
            addButton.click();
            await ticks(50);
            columns = section.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS);
            expect(columns).toHaveLength(3);
        });
        it('Select the Picklist screen field in the second Column in the second Section and verify the choice properties editor', async () => {
            expect.assertions(4);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            const picklist = getScreenEditorHighlightElementInSection(section, SCREEN_FIELD_TITLES.PICKLIST);
            expect(picklist).not.toBeNull();
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(picklist.screenElement));
            await ticks(50);
            const choicePropertiesEditor = getChoicePropertiesEditorElement(screenEditor);
            expect(choicePropertiesEditor).not.toBeNull();
            const propertyFields = choicePropertiesEditor.shadowRoot.querySelectorAll(
                SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR
            );
            expect(propertyFields).toHaveLength(6);
            const groupedCombobox = deepQuerySelector(propertyFields[3], [
                SELECTORS.FEROV_RESOURCE_PICKER,
                SELECTORS.BASE_RESOURCE_PICKER,
                SELECTORS.COMBOBOX,
                SELECTORS.LIGHTNING_GROUPED_COMBOBOX
            ]);
            expect(groupedCombobox.value).toEqual('{!recordChoiceSet}');
        });
        it('Select the Picklist screen field, change its default value and verify the change on the canvas', async () => {
            expect.assertions(2);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            const picklist = getScreenEditorHighlightElementInSection(section, SCREEN_FIELD_TITLES.PICKLIST);
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(picklist.screenElement));
            await ticks(50);
            const choicePropertiesEditor = getChoicePropertiesEditorElement(screenEditor);
            const propertyFields = choicePropertiesEditor.shadowRoot.querySelectorAll(
                SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR
            );
            const combobox = propertyFields[1].shadowRoot.querySelector(SELECTORS.LIGHTNING_COMBOBOX);
            expect(combobox.value).toEqual('');
            const otherChoice = getElementByDevName('other');
            combobox.dispatchEvent(changeEvent(otherChoice.guid));
            combobox.dispatchEvent(blurEvent);
            await ticks(50);
            const secondColumn = section.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS)[1];
            const secondField = secondColumn.shadowRoot.querySelectorAll(SELECTORS.SCREEN_FIELD)[1];
            const lightningPicklist = deepQuerySelector(secondField, [
                SELECTORS.SCREEN_CHOICE_FIELD,
                SELECTORS.LIGHTNING_PICKLIST
            ]);
            expect(lightningPicklist.value).toEqual(otherChoice.guid);
        });
        it('Select the Picklist screen field and verify the CFV rule is correct', async () => {
            expect.assertions(4);
            const section = getSectionElementInScreenEditorCanvas(screenEditor, 'ScreenWithSection_Section2');
            const picklist = getScreenEditorHighlightElementInSection(section, SCREEN_FIELD_TITLES.PICKLIST);
            const canvas = getCanvasElement(screenEditor);
            canvas.dispatchEvent(createScreenElementSelectedEvent(picklist.screenElement));
            await ticks(50);
            const choicePropertiesEditor = getChoicePropertiesEditorElement(screenEditor);
            const conditionListItem = deepQuerySelector(choicePropertiesEditor, [
                SELECTORS.SCREEN_COMPONENT_VISIBILITY_SECTION,
                SELECTORS.COMPONENT_VISIBILITY,
                SELECTORS.CONDITION_LIST_ITEM
            ]);
            expect(conditionListItem).not.toBeNull();
            const slider = getElementByDevName('slider_1');
            expect(conditionListItem.condition.leftHandSide.value).toEqual(slider.guid + '.value');
            expect(conditionListItem.condition.operator.value).toEqual('GreaterThanOrEqualTo');
            expect(conditionListItem.condition.rightHandSide.value).toEqual('50');
        });
    });
});
