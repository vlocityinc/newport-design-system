import { createElement } from 'lwc';
import ScreenEditor, { ScreenEditorTab } from 'builder_platform_interaction/screenEditor';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    checkboxChangeEvent,
    lightningRadioGroupChangeEvent,
    blurEvent,
    ticks,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import ScreenCanvas from 'builder_platform_interaction/screenCanvas';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import ScreenEditorPalette from 'builder_platform_interaction/screenEditorPalette';
import ScreenEditorAutomaticFieldPalette from 'builder_platform_interaction/screenEditorAutomaticFieldPalette';
import ScreenEditorPropertiesEditorContainer from 'builder_platform_interaction/screenPropertiesEditorContainer';
import ScreenExtensionPropertiesEditor from 'builder_platform_interaction/screenExtensionPropertiesEditor';
import ScreenField from 'builder_platform_interaction/screenField';
import UseAdvancedOptionsCheckbox from 'builder_platform_interaction/useAdvancedOptionsCheckbox';
import ScreenPropertyField from 'builder_platform_interaction/screenPropertyField';
import { InputsOnNextNavToAssocScrnOption } from 'builder_platform_interaction/screenEditorUtils';
import ScreenSectionFieldPropertiesEditor from 'builder_platform_interaction/screenSectionFieldPropertiesEditor';
import ScreenChoiceFieldPropertiesEditor from 'builder_platform_interaction/screenChoiceFieldPropertiesEditor';
import ScreenInputFieldPropertiesEditor from 'builder_platform_interaction/screenInputFieldPropertiesEditor';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import ScreenAutomaticFieldPropertiesEditor from 'builder_platform_interaction/screenAutomaticFieldPropertiesEditor';
import ScreenInputField from 'builder_platform_interaction/screenInputField';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import Palette from 'builder_platform_interaction/palette';
import { TestComponent } from './testComponent';
import { getSObjectOrSObjectCollectionPickerCombobox } from './comboboxTestUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import ScreenEditorAutomaticFieldLegalPopover from 'builder_platform_interaction/screenEditorAutomaticFieldLegalPopover';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

export class ScreenEditorTestComponent extends TestComponent<ScreenEditor> {
    public getCanvas() {
        const canvasElement = deepQuerySelector(this.element, [
            SELECTORS.SCREEN_EDITOR_CANVAS,
            SELECTORS.SCREEN_CANVAS
        ]);
        return new ScreenCanvasTestComponent(canvasElement);
    }

    /**
     * @returns the tabset or null if the automatic fields org perm is not set
     */
    public getTabsetElement() {
        return this.element.shadowRoot!.querySelector<HTMLElement & { activeTabValue: ScreenEditorTab }>(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TABSET
        );
    }

    public isFieldsTabActive() {
        const tabset = this.getTabsetElement();
        return tabset == null ? false : tabset.activeTabValue === ScreenEditorTab.Fields;
    }

    public isComponentsTabActive() {
        const tabset = this.getTabsetElement();
        return tabset == null ? false : tabset.activeTabValue === ScreenEditorTab.Components;
    }

    public getComponentsPaletteElement() {
        const tabset = this.getTabsetElement();
        if (!tabset) {
            // automatic fields org perm not set
            return this.element.shadowRoot?.querySelector<Element>(
                INTERACTION_COMPONENTS_SELECTORS.SCREEN_EDITOR_PALETTE
            );
        }
        const componentsTab = tabset.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as HTMLElement;
        return (componentsTab.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as Element).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_EDITOR_PALETTE
        ) as ScreenEditorPalette & HTMLElement;
    }

    public getAutomaticFieldsPalette() {
        const tabset = this.getTabsetElement();
        const automaticFieldsTab = tabset!.shadowRoot!.querySelector('slot')!.assignedNodes()[1] as HTMLElement;
        const paletteElement = (automaticFieldsTab
            .shadowRoot!.querySelector('slot')!
            .assignedNodes()[0] as Element).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_AUTOMATIC_FIELD_PALETTE
        ) as ScreenEditorAutomaticFieldPalette & HTMLElement;
        return new ScreenEditorAutomaticFieldsPaletteTestComponent(paletteElement);
    }

    public getAutomaticFieldLegalPopover() {
        const tabset = this.getTabsetElement();
        const automaticFieldsTab = tabset!.shadowRoot!.querySelector('slot')!.assignedNodes()[1] as HTMLElement;
        const popoverElement = automaticFieldsTab
            .shadowRoot!.querySelector('slot')!
            .assignedNodes()[1] as ScreenEditorAutomaticFieldLegalPopover & HTMLElement;
        return new ScreenEditorAutomaticFieldLegalPopoverTestComponent(popoverElement);
    }

    public getPropertiesEditorContainer() {
        const element = this.element.shadowRoot!.querySelector(
            SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
        ) as ScreenEditorPropertiesEditorContainer & HTMLElement;
        return new PropertiesEditorContainerTestComponent(element);
    }
}

export class ScreenEditorAutomaticFieldLegalPopoverTestComponent extends TestComponent<ScreenEditorAutomaticFieldLegalPopover> {
    public getPopupElement() {
        return this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_POPUP) as HTMLElement & {
            isVisible: () => boolean;
        };
    }

    public isVisible() {
        return this.getPopupElement().isVisible();
    }

    public async clickOnCloseButton() {
        const popupElement = this.getPopupElement();
        const closeButton = popupElement.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON) as HTMLElement;
        closeButton.click();
        await ticks();
    }

    public getFormattedUrlElement() {
        const popupElement = this.getPopupElement();
        return (
            (popupElement.querySelector(SELECTORS.LIGHTNING_FORMATTED_URL) as HTMLElement & {
                value: string;
                label: string;
            }) || null
        );
    }

    public getAgreementUrl() {
        return this.getFormattedUrlElement()?.value;
    }
}

export class ScreenEditorAutomaticFieldsPaletteTestComponent extends TestComponent<ScreenEditorAutomaticFieldPalette> {
    public getSObjectPickerElement() {
        return this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
        ) as SObjectOrSObjectCollectionPicker & HTMLElement;
    }

    public getSObjectPickerCombobox() {
        return getSObjectOrSObjectCollectionPickerCombobox(this.getSObjectPickerElement());
    }

    public getPaletteElement() {
        return this.element.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.PALETTE) as Palette &
            HTMLElement;
    }

    /**
     * Returns the array of fields links
     * @param {String} label - object's field label
     * @returns {Array<HTMLAnchorElement>} array of fields anchors
     */
    public getFieldsAnchorElements() {
        const paletteElement = this.getPaletteElement();
        if (!paletteElement) {
            return [];
        }
        const paletteItems = Array.from(
            paletteElement.shadowRoot!.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.PALETTE_ITEM)
        );
        return paletteItems.map((paletteItem) => paletteItem.shadowRoot!.querySelector('a')!);
    }

    public getFieldsLabels() {
        return this.getFieldsAnchorElements().map((fieldLink) => fieldLink!.textContent);
    }

    /**
     * For a given field label click on its link
     * @param {String} label - object's field label
     */
    public async clickOnFieldByLabel(label: string) {
        const fieldsLinks = this.getFieldsAnchorElements() || [];
        const field = fieldsLinks.find((fieldLink) => fieldLink!.textContent === label);
        if (field) {
            field.click();
            await ticks();
        }
    }
}

export class ScreenCanvasTestComponent extends TestComponent<ScreenCanvas> {
    /**
     * Get the first ScreenEditorHighlight that has a screen field element that matches the predicate
     *
     * @param canvasElement
     * @param predicate
     */
    public getScreenEditorHighlight(
        predicate: (screenElement) => boolean
    ): ScreenEditorHighlightTestComponent | undefined {
        const screenEditorHighlights = Array.from(
            this.element.shadowRoot!.querySelectorAll(SELECTORS.SCREEN_EDITOR_HIGHLIGHT)
        ) as (ScreenEditorHighlight & HTMLElement)[];
        for (const screenEditorHighlight of screenEditorHighlights) {
            if (screenEditorHighlight.screenElement!.fieldType === FlowScreenFieldType.RegionContainer) {
                const sectionHighlightTestComponent = new SectionScreenEditorHighlightTestComponent(
                    screenEditorHighlight
                );
                if (predicate(screenEditorHighlight.screenElement)) {
                    return sectionHighlightTestComponent;
                }
                const screenEditorHighlightTestComponent = sectionHighlightTestComponent.getScreenEditorHighlight(
                    predicate
                );
                if (screenEditorHighlightTestComponent) {
                    return screenEditorHighlightTestComponent;
                }
            } else if (predicate(screenEditorHighlight.screenElement)) {
                return new ScreenEditorHighlightTestComponent(screenEditorHighlight);
            }
        }
        return undefined;
    }

    /**
     * Get the ScreenEditorHighlight for the screen field with given name
     *
     * @param screenFieldElementName
     */
    public getScreenEditorHighlightForScreenFieldWithName(screenFieldElementName) {
        return this.getScreenEditorHighlight(
            (screenElement) => screenElement.name && screenElement.name.value === screenFieldElementName
        );
    }

    public getScreenEditorHighlightForScreenFieldWithObjectFieldReference(objectFieldReference) {
        const objectFieldReferenceParts = objectFieldReference.split('.');
        const objectReferenceElement = getElementByDevName(objectFieldReferenceParts[0]);
        if (!objectReferenceElement) {
            return undefined;
        }
        const objectFieldReferenceWithGuid = [objectReferenceElement.guid, ...objectFieldReferenceParts.slice(1)].join(
            '.'
        );
        return this.getScreenEditorHighlight(
            (screenElement) => screenElement.objectFieldReference === objectFieldReferenceWithGuid
        );
    }
}

export class ScreenEditorHighlightTestComponent extends TestComponent<ScreenEditorHighlight> {
    public async click() {
        this.element.shadowRoot!.querySelector('div')!.click();
        await ticks(50);
    }
    public getScreenField() {
        const screenFieldElement = this.element.querySelector(SELECTORS.SCREEN_FIELD)! as ScreenField & HTMLElement;
        return new ScreenFieldTestComponent(screenFieldElement);
    }

    /**
     * Returns the lightning-badge component from the header of the screen editor highlight for automatic field
     */
    public getHeaderAutomaticFieldBadge = () =>
        this.element.shadowRoot!.querySelector<HTMLElement & { label }>(SELECTORS.LIGHTNING_BADGE);

    public clickDelete() {
        const deleteButton = this.element.shadowRoot!.querySelectorAll(SELECTORS.LIGHTNING_BUTTON_ICON)[1] as any;
        deleteButton.click();
    }
}

export class ScreenFieldTestComponent extends TestComponent<ScreenField> {
    public getScreenInputField() {
        const screenInputFieldElement = this.element.shadowRoot!.querySelector<ScreenInputField & HTMLElement>(
            SELECTORS.SCREEN_INPUT_FIELD
        );
        if (!screenInputFieldElement) {
            return undefined;
        }
        return new ScreenInputFieldTestComponent(screenInputFieldElement);
    }
}

export class ScreenInputFieldTestComponent extends TestComponent<ScreenInputField> {
    public getInputElement() {
        return this.element.shadowRoot!.querySelector<HTMLElement>(SELECTORS.LIGHTNING_INPUT);
    }
}

export class SectionScreenEditorHighlightTestComponent extends ScreenEditorHighlightTestComponent {
    private getSectionCanvasElements() {
        const screenFieldElement = this.element.querySelector(SELECTORS.SCREEN_FIELD);
        const sectionFieldSectionElement = deepQuerySelector(screenFieldElement, [SELECTORS.SCREEN_SECTION_FIELD]);
        return Array.from(
            sectionFieldSectionElement.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS)
        ) as (ScreenCanvas & HTMLElement)[];
    }

    public getColumnCount() {
        return this.getSectionCanvasElements().length;
    }

    public getScreenEditorHighlight(
        predicate: (screenElement) => boolean
    ): ScreenEditorHighlightTestComponent | undefined {
        const sectionCanvasElements = this.getSectionCanvasElements();
        for (const sectionCanvasElement of sectionCanvasElements) {
            const sectionScreenEditorHighlight = new ScreenCanvasTestComponent(
                sectionCanvasElement
            ).getScreenEditorHighlight(predicate);
            if (sectionScreenEditorHighlight) {
                return sectionScreenEditorHighlight;
            }
        }
        return undefined;
    }

    public getScreenEditorHighlightForScreenFieldWithName(screenFieldElementName) {
        return this.getScreenEditorHighlight(
            (screenElement) => screenElement.name && screenElement.name.value === screenFieldElementName
        );
    }
}

export class PropertiesEditorContainerTestComponent extends TestComponent<ScreenEditorPropertiesEditorContainer> {
    public getExtensionPropertiesEditor(): ExtensionPropertiesEditorTestComponent | undefined {
        const extensionPropertiesEditorElement = this.element.shadowRoot!.querySelector<
            ScreenExtensionPropertiesEditor & HTMLElement
        >(SELECTORS.SCREEN_EXTENSION_PROPERTIES_EDITOR);
        if (!extensionPropertiesEditorElement) {
            return undefined;
        }
        return new ExtensionPropertiesEditorTestComponent(extensionPropertiesEditorElement);
    }

    public getSectionFieldPropertiesEditor(): SectionPropertiesEditorTestComponent | undefined {
        const sectionPropertiesEditorElement = this.element.shadowRoot!.querySelector<
            ScreenSectionFieldPropertiesEditor & HTMLElement
        >(SELECTORS.SCREEN_SECTION_FIELD_PROPERTIES_EDITOR);
        if (!sectionPropertiesEditorElement) {
            return undefined;
        }
        return new SectionPropertiesEditorTestComponent(sectionPropertiesEditorElement);
    }

    public getChoiceFieldPropertiesEditorElement() {
        return this.element.shadowRoot!.querySelector<ScreenChoiceFieldPropertiesEditor & HTMLElement>(
            SELECTORS.SCREEN_CHOICE_FIELD_PROPERTIES_EDITOR
        );
    }

    public getInputFieldPropertiesEditorElement() {
        return this.element.shadowRoot!.querySelector<ScreenInputFieldPropertiesEditor & HTMLElement>(
            SELECTORS.SCREEN_INPUT_FIELD_PROPERTIES_EDITOR
        );
    }

    public getAutomaticFieldPropertiesEditorElement(): AutomaticFieldPropertiesEditorTestComponent | undefined {
        const automaticFieldPropertiesEditor = this.element.shadowRoot!.querySelector<
            ScreenAutomaticFieldPropertiesEditor & HTMLElement
        >(SELECTORS.SCREEN_AUTOMATIC_FIELD_PROPERTIES_EDITOR);
        if (!automaticFieldPropertiesEditor) {
            return undefined;
        }
        return new AutomaticFieldPropertiesEditorTestComponent(automaticFieldPropertiesEditor);
    }
}

export class SectionPropertiesEditorTestComponent extends TestComponent<ScreenSectionFieldPropertiesEditor> {
    public clickAddColumn() {
        const addButton = deepQuerySelector(this.element, [SELECTORS.LIST, SELECTORS.LIGHTNING_BUTTON]);
        addButton.click();
    }
}

export class ExtensionPropertiesEditorTestComponent extends TestComponent<ScreenExtensionPropertiesEditor> {
    public getApiNameScreenPropertyField() {
        return this.element.shadowRoot!.querySelector<ScreenPropertyField & HTMLElement>(
            SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR
        );
    }

    public getApiName() {
        const inputElement = this.getApiNameScreenPropertyField()!.shadowRoot!.querySelector(
            SELECTORS.LIGHTNING_INPUT
        ) as any;
        return inputElement.value;
    }

    public async setApiName(value: string) {
        const apiNameScreenPropertyField = this.getApiNameScreenPropertyField();
        const inputElement = apiNameScreenPropertyField!.shadowRoot!.querySelector(SELECTORS.LIGHTNING_INPUT) as any;
        inputElement.value = value;
        inputElement.dispatchEvent(blurEvent);
        await ticks(50);
    }

    public getAdvancedOptionsCheckbox() {
        return this.element.shadowRoot!.querySelector<UseAdvancedOptionsCheckbox & HTMLElement>(
            SELECTORS.USE_ADVANCED_OPTIONS_CHECKBOX
        );
    }

    private getAdvancedOptionsCheckboxInput() {
        return this.getAdvancedOptionsCheckbox()!.shadowRoot!.querySelector<HTMLElement>(SELECTORS.LIGHTNING_INPUT);
    }

    public isAdvancedOptionsChecked() {
        const input = this.getAdvancedOptionsCheckboxInput() as any;
        if (!input) {
            return false;
        }
        return input.checked as boolean;
    }

    public async setAdvancedOptions(value: boolean) {
        const input = this.getAdvancedOptionsCheckboxInput();
        input!.dispatchEvent(checkboxChangeEvent(value));
        await ticks(50);
    }

    public getInputsOnNextNavToAssocScrnOption() {
        const radioGroup = this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_RADIO_GROUP) as any;
        return radioGroup.value as InputsOnNextNavToAssocScrnOption;
    }

    public async setInputsOnNextNavToAssocScrnOption(value: InputsOnNextNavToAssocScrnOption) {
        const radioGroup = this.element.shadowRoot!.querySelector<HTMLElement>(SELECTORS.LIGHTNING_RADIO_GROUP)!;
        radioGroup.dispatchEvent(lightningRadioGroupChangeEvent(value));
        await ticks(50);
    }
}

export class AutomaticFieldPropertiesEditorTestComponent extends TestComponent<ScreenAutomaticFieldPropertiesEditor> {
    private static AUTOFIELD_DESC_VALUE_SELECTOR =
        "tr[class*='{0}'] > td > " +
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT +
        "[class*='autofield-description-value']";

    public getFieldNameFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-field-name');
    }
    public getFieldLabelFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-field-label');
    }
    public getFieldDataTypeFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-datatype');
    }
    public getFieldObjectFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-object');
    }
    public getFieldIsRequiredFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-required');
    }
    public getFieldIsCreateableFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-createable');
    }
    public getFieldIsUpdateableFormattedTextElement() {
        return this.getFieldValueFormattedTextElement('autofield-updateable');
    }
    public getFieldHelptextElement() {
        return this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_HELPTEXT) as { content: string } | null;
    }
    private getFieldValueFormattedTextElement(valueKey: string) {
        return this.element.shadowRoot!.querySelector(
            format(AutomaticFieldPropertiesEditorTestComponent.AUTOFIELD_DESC_VALUE_SELECTOR, valueKey)
        ) as { value: string } | null;
    }
}

export const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};
