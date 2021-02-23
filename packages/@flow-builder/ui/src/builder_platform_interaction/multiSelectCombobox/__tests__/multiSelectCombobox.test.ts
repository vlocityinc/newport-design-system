// @ts-nocheck
import { createElement } from 'lwc';
import { MultiSelectComboboxEvent, DefaultMultiSelectComboboxEvent } from 'builder_platform_interaction/events';
import MultiSelectCombobox from '../multiSelectCombobox';
import { LABELS } from '../multiSelectComboboxLabels';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { format } from 'builder_platform_interaction/commonUtils';

const opt = [
    {
        label: 'Basic',
        isSelected: false,
        isDefault: true
    },
    {
        label: 'GovLim',
        isSelected: false,
        isDefault: false
    },
    {
        label: 'Transaction',
        isSelected: false,
        isDefault: false
    }
];

const defaultSelectedOpt = [
    {
        label: 'Basic',
        isSelected: true,
        isDefault: true
    },
    {
        label: 'GovLim',
        isSelected: false,
        isDefault: false
    }
];

const customSelectedOpt = [
    {
        label: 'Basic',
        isSelected: false,
        isDefault: true
    },
    {
        label: 'GovLim',
        isSelected: true,
        isDefault: false
    },
    {
        label: 'Transaction',
        isSelected: false,
        isDefault: false
    }
];

const placeholder = 'Select an option';

const createComponentUnderTest = (options = opt, placeholderText = placeholder) => {
    const el = createElement('builder_platform_interaction-multi-select-combobox', {
        is: MultiSelectCombobox
    });
    el.options = options;
    el.placeholderText = placeholderText;
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    inputField: 'input',
    dropdown: '.slds-dropdown',
    optionComponent: 'builder_platform_interaction-multi-select-option',
    clickableOption: '.slds-listbox__item',
    checkIcon: 'svg.slds-icon'
};

describe('collapsed and expanded combobox', () => {
    let comboboxComponent;
    beforeEach(() => {
        comboboxComponent = createComponentUnderTest();
    });

    it('Checks if combobox is rendered correctly', () => {
        expect(comboboxComponent.placeholderText).toEqual(placeholder);
        expect(comboboxComponent.options).toBeTruthy();
        expect(comboboxComponent.options).toEqual(opt);
    });

    it('Checks if combobox click event shows dropdown then click hides dropdown again', async () => {
        comboboxComponent.shadowRoot.querySelector(selectors.inputField).click();
        await ticks(1);
        expect(comboboxComponent.shadowRoot.querySelector(selectors.dropdown)).toBeTruthy();
        comboboxComponent.shadowRoot.querySelector(selectors.inputField).click();
        await ticks(1);
        expect(comboboxComponent.shadowRoot.querySelector(selectors.dropdown)).toBeFalsy();
    });

    it('Checks if combobox click event shows dropdown with correct number of list items', async () => {
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField)).toBeTruthy();
        comboboxComponent.shadowRoot.querySelector(selectors.inputField).click();

        await ticks(1);
        expect(comboboxComponent.shadowRoot.querySelector(selectors.dropdown)).toBeTruthy();
        expect(comboboxComponent.shadowRoot.querySelectorAll(selectors.optionComponent).length).toEqual(opt.length);

        const optionComponents = comboboxComponent.shadowRoot.querySelectorAll(selectors.optionComponent);
        expect(optionComponents).not.toBeNull();
        expect(optionComponents.length).toEqual(opt.length);
    });

    it('Checks if combobox shows the placeholder', () => {
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField)).toBeTruthy();
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).placeholder).toEqual(placeholder);
    });

    it('Checks if combobox shows the value of default label on render', () => {
        const comboboxComponent = createComponentUnderTest(defaultSelectedOpt);
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField)).toBeTruthy();
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).value).toEqual(
            defaultSelectedOpt[0].label
        );
    });
});

describe('custom/default selection events get dispatched on click', () => {
    let comboboxComponent;
    let defaultOption;
    let customOption;
    beforeEach(async () => {
        comboboxComponent = createComponentUnderTest();
        const inputField = comboboxComponent.shadowRoot.querySelector(selectors.inputField);
        expect(inputField).toBeTruthy();
        inputField.click();
        await ticks(1);

        const optionComponents = comboboxComponent.shadowRoot.querySelectorAll(selectors.optionComponent);
        defaultOption = optionComponents[0];
        customOption = optionComponents[1];
    });

    it('Check that the DefaultMultiSelectCombobox event gets dispatched in default click', () => {
        const callback = jest.fn();
        comboboxComponent.addEventListener(DefaultMultiSelectComboboxEvent.EVENT_NAME, callback);
        defaultOption.shadowRoot.querySelector(selectors.clickableOption).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Check that the MultiSelectComboboxEvent event gets dispatched in custom click', () => {
        const callback = jest.fn();
        comboboxComponent.addEventListener(MultiSelectComboboxEvent.EVENT_NAME, callback);
        customOption.shadowRoot.querySelector(selectors.clickableOption).click();
        expect(callback).toHaveBeenCalled();
    });
});

describe('selection change behavior when Default isSelected = true', () => {
    let comboboxComponent;
    let defaultOption;
    let customOption;
    beforeEach(async () => {
        comboboxComponent = createComponentUnderTest(defaultSelectedOpt);
        const inputField = comboboxComponent.shadowRoot.querySelector(selectors.inputField);
        expect(inputField).toBeTruthy();
        inputField.click();
        await ticks(1);

        const optionComponents = comboboxComponent.shadowRoot.querySelectorAll(selectors.optionComponent);
        defaultOption = optionComponents[0];
        customOption = optionComponents[1];
    });

    it('Check that the default is checked initially on render', () => {
        expect(defaultOption.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
        expect(customOption.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();
    });

    it('On clicking a custom option, default option is deselected', async () => {
        customOption.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(customOption.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
        expect(defaultOption.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();
    });
});

describe('selection change behavior when Custom isSelected = true', () => {
    let comboboxComponent;
    let defaultOption;
    let customOption;
    let customOption2;
    beforeEach(async () => {
        comboboxComponent = createComponentUnderTest(customSelectedOpt);
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).value).toEqual(
            customSelectedOpt[1].label
        );

        const inputField = comboboxComponent.shadowRoot.querySelector(selectors.inputField);
        expect(inputField).toBeTruthy();
        inputField.click();
        await ticks(1);

        const optionComponents = comboboxComponent.shadowRoot.querySelectorAll(selectors.optionComponent);
        defaultOption = optionComponents[0];
        customOption = optionComponents[1];
        customOption2 = optionComponents[2];
    });

    it('On deselecting all custom options - default is selected', async () => {
        customOption.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(customOption.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();
        expect(defaultOption.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();

        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).value).toEqual(
            customSelectedOpt[0].label
        );
    });

    it('On selecting the default option, all other custom options get deselected', async () => {
        defaultOption.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(customOption.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();
        expect(defaultOption.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).value).toEqual(
            customSelectedOpt[0].label
        );
    });

    it('On selecting another custom option - combobox label updates', async () => {
        customOption2.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(customOption.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
        expect(customOption2.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
        expect(defaultOption.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();

        expect(comboboxComponent.shadowRoot.querySelector(selectors.inputField).value).toEqual(
            format(LABELS.optionsSelected, 2)
        );
    });
});
