// @ts-nocheck
import { createElement } from 'lwc';
import { MultiSelectOptionEvent } from 'builder_platform_interaction/events';
import MultiSelectOption from '../multiSelectOption';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

const createComponentUnderTest = (label = 'Basic', isSelected = false, isDefault = true) => {
    const el = createElement('builder_platform_interaction-multi-select-option', {
        is: MultiSelectOption
    });
    el.label = label;
    el.isSelected = isSelected;
    el.isDefault = isDefault;
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    clickableOption: '.slds-listbox__item',
    checkIcon: 'svg.slds-icon'
};

describe('option component on select-click', () => {
    let optionComponent;
    beforeEach(() => {
        optionComponent = createComponentUnderTest();
    });

    it('Checks if option shows check mark if isSelected', async () => {
        optionComponent.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(optionComponent.shadowRoot.querySelector(selectors.checkIcon)).toBeTruthy();
    });

    it('Checks if option select-click dispatches event', async () => {
        const callback = jest.fn();
        optionComponent.addEventListener(MultiSelectOptionEvent.EVENT_NAME, callback);
        optionComponent.shadowRoot.querySelector(selectors.clickableOption).click();
        expect(optionComponent.isSelected).toBeTruthy();
        expect(callback).toHaveBeenCalled();
    });
});

describe('option component on deselect-click', () => {
    let optionComponent;
    beforeEach(() => {
        optionComponent = createComponentUnderTest('label', true, false);
    });

    it('Checks if option hides check mark when deselected', async () => {
        optionComponent.shadowRoot.querySelector(selectors.clickableOption).click();
        await ticks(1);
        expect(optionComponent.shadowRoot.querySelector(selectors.checkIcon)).toBeFalsy();
    });

    it('Checks if option deselect-click dispatches event', async () => {
        const callback = jest.fn();
        optionComponent.addEventListener(MultiSelectOptionEvent.EVENT_NAME, callback);
        optionComponent.shadowRoot.querySelector(selectors.clickableOption).click();
        expect(optionComponent.isSelected).toBeFalsy();
        expect(callback).toHaveBeenCalled();
    });
});
