// @ts-nocheck
import {
    blurEvent,
    checkboxChangeEvent,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    lightningRadioGroupChangeEvent,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import LearnMoreCard from 'builder_platform_interaction/learnMoreCard';
import ManuallyAssignVariablesCheckbox from 'builder_platform_interaction/manuallyAssignVariablesCheckbox';
import Palette from 'builder_platform_interaction/palette';
import Row from 'builder_platform_interaction/row';
import ScreenAutomaticFieldPropertiesEditor from 'builder_platform_interaction/screenAutomaticFieldPropertiesEditor';
import ScreenCanvas from 'builder_platform_interaction/screenCanvas';
import ScreenChoiceFieldPropertiesEditor from 'builder_platform_interaction/screenChoiceFieldPropertiesEditor';
import ScreenEditor, { ScreenEditorTab } from 'builder_platform_interaction/screenEditor';
import ScreenEditorAutomaticFieldPalette from 'builder_platform_interaction/screenEditorAutomaticFieldPalette';
import ScreenEditorCanvas from 'builder_platform_interaction/screenEditorCanvas';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import ScreenEditorPalette from 'builder_platform_interaction/screenEditorPalette';
import { InputsOnNextNavToAssocScrnOption } from 'builder_platform_interaction/screenEditorUtils';
import ScreenExtensionPropertiesEditor from 'builder_platform_interaction/screenExtensionPropertiesEditor';
import ScreenField from 'builder_platform_interaction/screenField';
import ScreenInputField from 'builder_platform_interaction/screenInputField';
import ScreenInputFieldPropertiesEditor from 'builder_platform_interaction/screenInputFieldPropertiesEditor';
import ScreenPropertiesEditor from 'builder_platform_interaction/screenPropertiesEditor';
import ScreenPropertiesEditorContainer from 'builder_platform_interaction/screenPropertiesEditorContainer';
import ScreenPropertyField from 'builder_platform_interaction/screenPropertyField';
import ScreenSectionFieldPropertiesEditor from 'builder_platform_interaction/screenSectionFieldPropertiesEditor';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import LegalPopover from 'src/builder_platform_interaction/legalPopover/legalPopover';
import { ComboboxTestComponent, getSObjectOrSObjectCollectionPickerCombobox } from './comboboxTestUtils';
import { LegalPopoverTestComponent } from './integrationTestUtils';
import { TestComponent } from './testComponent';

const { format } = commonUtils;

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
    ARIA_LIVE_REGION: '.aria-live-instruction'
};

const iconTypes = {
    editButtonIcon: 'utility:edit'
};

export class ScreenEditorTestComponent extends TestComponent<ScreenEditor> {
    public getScreenNode() {
        return this.element.getNode();
    }

    public getCanvas() {
        const canvasElement = deepQuerySelector(this.element, [
            SELECTORS.SCREEN_EDITOR_CANVAS,
            SELECTORS.SCREEN_CANVAS
        ]);
        return new ScreenCanvasTestComponent(canvasElement);
    }

    public getScreenEditorCanvas() {
        const screenEditorCanvas = this.element.shadowRoot!.querySelector(
            SELECTORS.SCREEN_EDITOR_CANVAS
        ) as ScreenEditorCanvas & HTMLElement;
        return new ScreenEditorCanvasTestComponent(screenEditorCanvas);
    }

    /**
     * @returns the tabset or null if the automatic fields org perm is not set
     */
    public getTabsetElement() {
        return this.element.shadowRoot!.querySelector<HTMLElement & { activeTabValue: ScreenEditorTab }>(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TABSET
        );
    }

    public getComponentsTab() {
        return this.getTabsetElement()!.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as HTMLElement;
    }

    public getAutomaticFieldsTab() {
        return this.getTabsetElement()!.shadowRoot!.querySelector('slot')!.assignedNodes()[1] as HTMLElement;
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
        const paletteElement = (
            automaticFieldsTab.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as Element
        ).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_AUTOMATIC_FIELD_PALETTE
        ) as ScreenEditorAutomaticFieldPalette & HTMLElement;
        return new ScreenEditorAutomaticFieldsPaletteTestComponent(paletteElement);
    }

    public getAutomaticFieldBetaDisclaimer() {
        const tabset = this.getTabsetElement();
        const automaticFieldsTab = tabset!.shadowRoot!.querySelector('slot')!.assignedNodes()[1] as HTMLElement;
        const paletteElement = (
            automaticFieldsTab.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as Element
        ).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_AUTOMATIC_FIELD_PALETTE
        ) as ScreenEditorAutomaticFieldPalette & HTMLElement;
        const betaDisclaimer = paletteElement.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.LEARN_MORE_CARD
        ) as LearnMoreCard & HTMLElement;
        return new ScreenEditorAutomaticFieldBetaDisclaimerTestComponent(betaDisclaimer);
    }

    public getLegalPopover() {
        const popoverElement = this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.LEGAL_POPOVER
        ) as LegalPopover & HTMLElement;
        if (!popoverElement) {
            return undefined;
        }
        return new LegalPopoverTestComponent(popoverElement);
    }

    public getPropertiesEditorContainer() {
        const element = this.element.shadowRoot!.querySelector(
            SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
        ) as ScreenPropertiesEditorContainer & HTMLElement;
        return new PropertiesEditorContainerTestComponent(element);
    }
}

export class ScreenEditorAutomaticFieldBetaDisclaimerTestComponent extends TestComponent<LearnMoreCard> {
    public getPopupElement = () =>
        this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_POPUP) as HTMLElement & {
            isVisible: () => boolean;
        };

    public isPopupVisible = () => this.getPopupElement().isVisible();

    public async clickOnTriggerButton() {
        const triggerButton = this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_BUTTON) as HTMLElement & {
            click: () => void;
        };
        triggerButton.click();
        await ticks();
    }

    public async clickOnCloseButton() {
        const popupElement = this.getPopupElement();
        const closeButton = popupElement.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON) as HTMLElement;
        closeButton.click();
        await ticks();
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
     *
     * @param {string} label - object's field label
     * @returns {Array<HTMLAnchorElement>} array of fields anchors
     */
    public getFieldsAnchorElements() {
        const paletteElement = this.getPaletteElement();
        if (!paletteElement) {
            return [];
        }

        let allItems: Element[] = [];

        const paletteSections = Array.from(
            paletteElement.shadowRoot!.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.PALETTE_SECTION)
        );

        paletteSections.forEach((section) => {
            const items = Array.from(
                section.shadowRoot!.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.PALETTE_ITEM)
            );

            allItems = [...allItems, ...items];
        });

        return allItems.map((paletteItem: Element) => paletteItem.shadowRoot!.querySelector('a')!);
    }

    public getFieldsLabels() {
        return this.getFieldsAnchorElements().map((fieldLink) => fieldLink!.textContent);
    }

    /**
     * For a given field label click on its link
     *
     * @param {string} label - object's field label
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

export class ScreenEditorCanvasTestComponent extends TestComponent<ScreenEditorCanvas> {
    public getAriaLiveText() {
        return this.element.shadowRoot!.querySelectorAll(SELECTORS.ARIA_LIVE_REGION)[0].textContent;
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
                const screenEditorHighlightTestComponent =
                    sectionHighlightTestComponent.getScreenEditorHighlight(predicate);
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
        const div = this.element.shadowRoot!.querySelector('div');
        div!.focus();
        div!.click();
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

    public pressKey(key: string) {
        const highlightDiv = this.element.shadowRoot!.querySelector('div');
        const event = new KeyboardEvent('keydown', { key, code: key === ' ' ? 'Space' : key });
        highlightDiv?.dispatchEvent(event);
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

export class PropertiesEditorContainerTestComponent extends TestComponent<ScreenPropertiesEditorContainer> {
    public getScreenPropertiesEditor(): ScreenPropertiesEditorTestComponent | undefined {
        const screenPropertiesEditorElement = this.element.shadowRoot!.querySelector<
            ScreenPropertiesEditor & HTMLElement
        >(SELECTORS.SCREEN_PROPERTIES_EDITOR);
        if (!screenPropertiesEditorElement) {
            return undefined;
        }
        return new ScreenPropertiesEditorTestComponent(screenPropertiesEditorElement);
    }

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
        const choicePropertiesEditorElement = this.element.shadowRoot!.querySelector<
            ScreenChoiceFieldPropertiesEditor & HTMLElement
        >(SELECTORS.SCREEN_CHOICE_FIELD_PROPERTIES_EDITOR);
        if (!choicePropertiesEditorElement) {
            return undefined;
        }
        return new ChoicePropertiesEditorTestComponent(choicePropertiesEditorElement);
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

    public getLabelDescription() {
        return this.element.shadowRoot!.querySelector(SELECTORS.LABEL_DESCRIPTION);
    }
}
export class ScreenPropertiesEditorTestComponent extends TestComponent<ScreenPropertiesEditor> {
    public getNextOrFinishLabelTypeRadioButtons() {
        return this.element.shadowRoot!.querySelectorAll(SELECTORS.LIGHTNING_RADIO_GROUP)[0];
    }

    public getPreviousLabelTypeRadioButtons() {
        return this.element.shadowRoot!.querySelectorAll(SELECTORS.LIGHTNING_RADIO_GROUP)[1];
    }

    public getPauseLabelTypeRadioButtons() {
        return this.element.shadowRoot!.querySelectorAll(SELECTORS.LIGHTNING_RADIO_GROUP)[2];
    }
}

export class RowTestComponent extends TestComponent<Row> {
    getButtonIconFromName = (iconName): HTMLElement | null => {
        const iconNameProperty = 'iconName';
        const buttonIcons = <HTMLElement[]>(
            Array.from(this.element.shadowRoot!.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON))
        );

        if (buttonIcons?.length > 0) {
            const filteredButtonIcons = buttonIcons.filter((item: HTMLElement) => item[iconNameProperty] === iconName);
            if (filteredButtonIcons) {
                return filteredButtonIcons[0];
            }
        }
        return null;
    };

    getEditButton = (): HTMLElement | null => {
        return this.getButtonIconFromName(iconTypes.editButtonIcon);
    };
}

export class ChoicePropertiesEditorTestComponent extends TestComponent<ScreenChoiceFieldPropertiesEditor> {
    public getScreenPropertyFields() {
        return this.element.shadowRoot!.querySelectorAll(SELECTORS.SCREEN_PROPERTY_FIELD_EDITOR);
    }

    public getChoicePicker() {
        const screenPropertyFields = this.getScreenPropertyFields();
        const ferovResourcePicker = screenPropertyFields[3].shadowRoot!.querySelector<
            FerovResourcePicker & HTMLElement
        >(SELECTORS.FEROV_RESOURCE_PICKER);
        return new ComboboxTestComponent(
            deepQuerySelector(ferovResourcePicker, [
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
                INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
            ])
        );
    }

    public getChoiceRows(): RowTestComponent[] {
        const rows = Array.from(
            this.element.shadowRoot!.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.ROW)
        ) as (Row & HTMLElement)[];

        return rows.map((row) => {
            return new RowTestComponent(row);
        });
    }

    public getScreenComponentVisibilitySection() {
        return this.element.shadowRoot!.querySelector(SELECTORS.SCREEN_COMPONENT_VISIBILITY_SECTION);
    }

    public getLabelDescription() {
        return this.element.shadowRoot!.querySelector(SELECTORS.LABEL_DESCRIPTION);
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
        return this.element.shadowRoot!.querySelector<ManuallyAssignVariablesCheckbox & HTMLElement>(
            SELECTORS.MANUALLY_ASSIGN_VARIABLES_CHECKBOX
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
