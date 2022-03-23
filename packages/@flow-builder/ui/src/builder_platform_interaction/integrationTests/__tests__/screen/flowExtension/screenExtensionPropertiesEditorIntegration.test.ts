/* eslint-disable @lwc/lwc/no-async-operation */

import {
    blurEvent,
    deepQuerySelector,
    focusEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    textInputEvent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { ComboboxTestComponent } from '../../comboboxTestUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

export const getPaletteAccordionSectionList = (screenEditor) => {
    const leftPaletteSub = screenEditor
        .getComponentsPaletteElement()
        .shadowRoot.querySelector(SELECTORS.LEFT_PANEL_PALETTE);
    return leftPaletteSub.shadowRoot.querySelectorAll(SELECTORS.LIGHTNING_ACCORDION_SECTION);
};

export const getPaletteItem = (leftPaletteAccordSectionList, critStr) => {
    let foundItem;
    leftPaletteAccordSectionList.forEach((leftPaletteAccordSection) => {
        const leftPalleteSuSection = leftPaletteAccordSection.querySelector(SELECTORS.PALETTE_SECTION);
        const paletteItemList = leftPalleteSuSection.shadowRoot.querySelectorAll(SELECTORS.PALETTE_ITEM);
        paletteItemList.forEach((item) => {
            const a = item.shadowRoot.querySelector('a[role="button"]');
            if (a.textContent === critStr) {
                foundItem = item;
            }
        });
    });
    return foundItem;
};

describe('Screen Extension Properties Editor', () => {
    let screenNode;
    let screenEditor: ScreenEditorTestComponent;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
        const element = getElementByDevName('screenWithAddress');
        screenNode = getElementForPropertyEditor(element);
        screenEditor = new ScreenEditorTestComponent(
            createComponentUnderTest({
                processType: FLOW_PROCESS_TYPE.FLOW,
                node: screenNode
            })
        );

        // some of these need to be long
        await ticks(50);
        expect(screenEditor).toBeTruthy();
    });

    afterAll(() => {
        resetState();
    });
    describe('when a lookup Component is added', () => {
        let lookup, extensionPropertiesEditor, screenAttList;
        beforeAll(async () => {
            lookup = getPaletteItem(getPaletteAccordionSectionList(screenEditor), 'Lookup');
            expect(lookup).toBeTruthy();

            lookup.click();
            // this also needs to be long
            await ticks(50);

            extensionPropertiesEditor = screenEditor.getPropertiesEditorContainer().getExtensionPropertiesEditor();
            screenAttList = extensionPropertiesEditor!.element.shadowRoot.querySelectorAll(
                SELECTORS.SCREEN_EXTENSION_ATTRIBUTE_EDITOR
            );
        });

        it('there will be 5 screen extension attribute editors', async () => {
            expect(screenAttList).toHaveLength(5);
        });
        it('a missing value error will be properly removed when a value is given to the Field API Name field', async () => {
            const combobox = deepQuerySelector(screenAttList[0], [
                SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR,
                SELECTORS.FEROV_RESOURCE_PICKER,
                SELECTORS.BASE_RESOURCE_PICKER,
                SELECTORS.COMBOBOX
            ]);
            expect(combobox).toBeTruthy();

            const comboboxTestComp = new ComboboxTestComponent(combobox);
            const lightningGroupedCombobox = combobox.shadowRoot.querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
            expect(lightningGroupedCombobox).toBeTruthy();

            const lwcBaseComboBox = lightningGroupedCombobox.shadowRoot.querySelector(SELECTORS.LIGHTNING_BASE_COMBOX);
            expect(lwcBaseComboBox).toBeTruthy();

            lwcBaseComboBox.dispatchEvent(focusEvent);
            await ticks(1);

            const errBeforeBlur = comboboxTestComp.validity;
            expect(errBeforeBlur).toBeUndefined();

            lwcBaseComboBox.dispatchEvent(blurEvent);

            await ticks(1);

            /*
             *****   Assume Error moving fwd and try to prove it  *****
             */
            expect(comboboxTestComp.validity).not.toBeUndefined();
            expect(lightningGroupedCombobox.validity).not.toBeUndefined();

            lightningGroupedCombobox.dispatchEvent(textInputEvent('bob'));
            await ticks(1);

            lightningGroupedCombobox.dispatchEvent(blurEvent);
            await ticks(1);

            /*
             *****   Assume Error is removed moving fwd and try to prove it  *****
             */
            expect(lightningGroupedCombobox.validity).toBeUndefined();
            expect(comboboxTestComp.validity).toBeUndefined();
        });
    });
});
