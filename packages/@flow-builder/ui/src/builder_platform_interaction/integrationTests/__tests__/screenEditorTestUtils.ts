import { createElement } from 'lwc';
import ScreenEditor from 'builder_platform_interaction/screenEditor';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    checkboxChangeEvent,
    lightningRadioGroupChangeEvent,
    blurEvent
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

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

abstract class TestComponent<E> {
    private _element: E & HTMLElement;

    constructor(element: E & HTMLElement) {
        this._element = element;
    }

    get element() {
        return this._element;
    }

    deepQuerySelector(selectors: string[]) {
        return deepQuerySelector(this.element, selectors);
    }
}

export class ScreenEditorTestComponent extends TestComponent<ScreenEditor> {
    public getCanvas() {
        const canvasElement = deepQuerySelector(this.element, [
            SELECTORS.SCREEN_EDITOR_CANVAS,
            SELECTORS.SCREEN_CANVAS
        ]);
        return new ScreenCanvasTestComponent(canvasElement);
    }

    private getTabset(): HTMLElement {
        return this.element.shadowRoot!.querySelector<HTMLElement>(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TABSET)!;
    }

    public getComponentsPalette() {
        const tabset = this.getTabset();
        const componentsTab = tabset.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as HTMLElement;
        return (componentsTab.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as Element).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_PALETTE
        ) as ScreenEditorPalette & HTMLElement;
    }

    public getAutomaticFieldsPalette() {
        const tabset = this.getTabset();
        const automaticFieldsTab = tabset.shadowRoot!.querySelector('slot')!.assignedNodes()[1] as HTMLElement;
        return (automaticFieldsTab.shadowRoot!.querySelector('slot')!.assignedNodes()[0] as Element).querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_AUTOMATIC_FIELDS_PALETTE
        ) as ScreenEditorAutomaticFieldPalette & HTMLElement;
    }

    public getPropertiesEditorContainerElement() {
        const element = this.element.shadowRoot!.querySelector(
            SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
        ) as ScreenEditorPropertiesEditorContainer & HTMLElement;
        return new PropertiesEditorContainerTestComponent(element);
    }
}

export class ScreenCanvasTestComponent extends TestComponent<ScreenCanvas> {
    private getSectionCanvasElements(screenEditorHighlight: ScreenEditorHighlight & HTMLElement) {
        const screenFieldElement = screenEditorHighlight.querySelector(SELECTORS.SCREEN_FIELD);
        const sectionFieldSectionElement = deepQuerySelector(screenFieldElement, [SELECTORS.SCREEN_SECTION_FIELD]);
        return Array.from(
            sectionFieldSectionElement.shadowRoot.querySelectorAll(SELECTORS.SCREEN_CANVAS)
        ) as (ScreenCanvas & HTMLElement)[];
    }

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
            if (screenEditorHighlight.screenElement!.fieldType === 'RegionContainer') {
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
        const objectFieldRefenceWithGuid = [objectReferenceElement.guid, ...objectFieldReferenceParts.slice(1)].join(
            '.'
        );
        return this.getScreenEditorHighlight(
            (screenElement) => screenElement.objectFieldReference === objectFieldRefenceWithGuid
        );
    }
}

export class ScreenEditorHighlightTestComponent extends TestComponent<ScreenEditorHighlight> {
    public click() {
        this.element.shadowRoot!.querySelector('div')!.click();
    }
    public getScreenFieldElement() {
        return this.element.querySelector(SELECTORS.SCREEN_FIELD)! as ScreenField & HTMLElement;
    }
    public clickDelete() {
        const deleteButton = this.element.shadowRoot!.querySelectorAll(SELECTORS.LIGHTNING_BUTTON_ICON)[1] as any;
        deleteButton.click();
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

    public setApiName(value: string) {
        const apiNameScreenPropertyField = this.getApiNameScreenPropertyField();
        const inputElement = apiNameScreenPropertyField!.shadowRoot!.querySelector(SELECTORS.LIGHTNING_INPUT) as any;
        inputElement.value = value;
        inputElement.dispatchEvent(blurEvent);
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

    public setAdvancedOptions(value: boolean) {
        const input = this.getAdvancedOptionsCheckboxInput();
        input!.dispatchEvent(checkboxChangeEvent(value));
    }

    public getInputsOnNextNavToAssocScrnOption() {
        const radioGroup = this.element.shadowRoot!.querySelector(SELECTORS.LIGHTNING_RADIO_GROUP) as any;
        return radioGroup.value as InputsOnNextNavToAssocScrnOption;
    }

    public setInputsOnNextNavToAssocScrnOption(value: InputsOnNextNavToAssocScrnOption) {
        const radioGroup = this.element.shadowRoot!.querySelector<HTMLElement>(SELECTORS.LIGHTNING_RADIO_GROUP)!;
        radioGroup.dispatchEvent(lightningRadioGroupChangeEvent(value));
    }
}

export const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};
