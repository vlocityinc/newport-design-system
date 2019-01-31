import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import VisualPickerItem from 'builder_platform_interaction/visualPickerItem';
import { VisualPickerItemChangedEvent } from 'builder_platform_interaction/events';

const TEMPLATE_ID = 'flowId';
const TEMPLATE_LABEL = 'Flow Label';
const TEMPLATE_DESCRIPTION = 'Flow description';
const TEMPLATE_ICON = 'utility:flow';

function createComponentForTest({ id = TEMPLATE_ID, label = TEMPLATE_LABEL, description = TEMPLATE_DESCRIPTION, iconName = TEMPLATE_ICON, isSelected = false } = {}) {
    const el = createElement('builder_platform_interaction-visual-picker-item', { is: VisualPickerItem });
    Object.assign(el, {id, label, description, iconName, isSelected});
    document.body.appendChild(el);
    return el;
}

const getChangedEvent = () => {
    return new Event('change');
};

const SELECTORS = {
    MEDIA_FIGURE: '.slds-media__figure ',
    VISUAL_PICKER_TEXT: '.slds-visual-picker input:checked ~ label .slds-visual-picker__text',
    LABEL: '.slds-media__body .slds-text-heading_small',
    DESCRIPTION: '.slds-media__body .slds-text-title',
    LIGHTNING_ICON: 'lightning-icon',
    CHECKBOX: 'input[type="checkbox"]',
};

function getTemplateIcon(visualPickerItem) {
    return getShadowRoot(visualPickerItem).querySelector(SELECTORS.MEDIA_FIGURE).querySelector(SELECTORS.LIGHTNING_ICON);
}

function getTemplateLabel(visualPickerItem) {
    return getShadowRoot(visualPickerItem).querySelector(SELECTORS.LABEL);
}

function getTemplateDescription(visualPickerItem) {
    return getShadowRoot(visualPickerItem).querySelector(SELECTORS.DESCRIPTION);
}

function getCheckbox(visualPickerItem) {
    return getShadowRoot(visualPickerItem).querySelector(SELECTORS.CHECKBOX);
}

function getCheckedText(visualPickerItem) {
    return getShadowRoot(visualPickerItem).querySelector(SELECTORS.VISUAL_PICKER_TEXT);
}

describe('visual-picker-item', () => {
    let visualPickerItemCmp;
    beforeEach(() => {
        visualPickerItemCmp = createComponentForTest();
    });

    it('shows the flow icon', () => {
        expect(getTemplateIcon(visualPickerItemCmp).iconName).toEqual(TEMPLATE_ICON);
    });

    it('shows the label as a template label', () => {
        expect(getTemplateLabel(visualPickerItemCmp).textContent).toEqual(TEMPLATE_LABEL);
    });

    it('shows the description as a template description', () => {
        expect(getTemplateDescription(visualPickerItemCmp).textContent).toEqual(TEMPLATE_DESCRIPTION);
    });

    it('should not be selected', () => {
        expect(getCheckedText(visualPickerItemCmp)).toBeNull();
        expect(getCheckbox(visualPickerItemCmp).checked).toBe(false);
    });

    it('should show check icon when selecting template',  async () => {
        const eventCallback = jest.fn();
        visualPickerItemCmp.addEventListener(VisualPickerItemChangedEvent.EVENT_NAME, eventCallback);
        const checkbox = getCheckbox(visualPickerItemCmp);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(getComputedStyle(getCheckedText(visualPickerItemCmp), ':after')).not.toBeNull();
    });

    it('should fire VisualPickerItemChangedEvent event when selecting template',  async () => {
        const eventCallback = jest.fn();
        visualPickerItemCmp.addEventListener(VisualPickerItemChangedEvent.EVENT_NAME, eventCallback);
        const checkbox = getCheckbox(visualPickerItemCmp);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toEqual({id: TEMPLATE_ID, isSelected: true });
    });
});