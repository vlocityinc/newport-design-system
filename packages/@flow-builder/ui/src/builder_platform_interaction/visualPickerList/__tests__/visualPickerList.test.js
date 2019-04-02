import { createElement } from 'lwc';
import VisualPickerList from 'builder_platform_interaction/visualPickerList';
import { VisualPickerListChangedEvent } from 'builder_platform_interaction/events';

const ITEMS = [{
    isSelected: true,
    iconName: 'utility:screen',
    label: 'Screen Flow',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean bibendum nulla dignissim, pellentesque tortor ut, vestibulum urna. Cras convallis facilisis sodales. In hac habitasse platea dictumst. Morbi ut tempor sem.',
    itemId:'Flow1',
}, {
    isSelected: false,
    iconName: 'utility:magicwand',
    label: 'Autolaunched Flow',
    description: 'This is my description',
    itemId:'Flow2',
}, {
    isSelected: false,
    iconName: 'utility:user',
    label: 'User Provisioning',
    description: 'User Provisioning flow',
    itemId:'Flow3',
}, {
    isSelected: false,
    iconName: 'utility:wifi',
    label: 'Field Service Mobile',
    description: 'Field Service Mobile flow',
    itemId:'Flow4',
}];

function createComponentForTest({ items = ITEMS, numberOfColumns = 2, allowMultipleSelection = false } = {}) {
    const el = createElement('builder_platform_interaction-visual-picker', { is: VisualPickerList });
    Object.assign(el, {items, numberOfColumns, allowMultipleSelection});
    document.body.appendChild(el);
    return el;
}

const getChangedEvent = () => {
    return new Event('change');
};

const SELECTORS = {
    VISUAL_PICKER_ITEM: 'builder_platform_interaction-visual-picker-item',
    GRID: '.slds-grid_vertical .slds-grid',
    CHECKBOX: 'input[type="checkbox"]',
};

function getVisualPickerItems(visualPicker) {
    return visualPicker.shadowRoot.querySelectorAll(SELECTORS.VISUAL_PICKER_ITEM);
}

function getRows(visualPicker) {
    return visualPicker.shadowRoot.querySelectorAll(SELECTORS.GRID);
}

function getItemsPerRow(row) {
    return row.querySelectorAll(SELECTORS.VISUAL_PICKER_ITEM);
}

function getCheckbox(visualPickerItem) {
    return visualPickerItem.shadowRoot.querySelector(SELECTORS.CHECKBOX);
}

describe('visual-picker-list', () => {
    let visualPickerCmp;
    beforeEach(() => {
        visualPickerCmp = createComponentForTest();
    });

    it('shows all items', () => {
        const visualPickerItems = getVisualPickerItems(visualPickerCmp);
        expect(visualPickerItems).toHaveLength(ITEMS.length);
    });

    it('should have the first item which is selected', () => {
        const firstItem = getVisualPickerItems(visualPickerCmp)[0];
        expect(firstItem.itemId).toEqual(ITEMS[0].itemId);
        expect(firstItem.isSelected).toBe(true);
    });

    it('should have 2 rows', () => {
        const rows = getRows(visualPickerCmp);
        expect(rows).toHaveLength(2);
    });

    it('shows 2 items for each row', () => {
        const rows = getRows(visualPickerCmp);
        rows.forEach(row => {
            const itemsPerRow = getItemsPerRow(row);
            expect(itemsPerRow).toHaveLength(2);
        });
    });

    it('should fire VisualPickerListChangedEvent when selecting another item', async () => {
        const eventCallback = jest.fn();
        visualPickerCmp.addEventListener(VisualPickerListChangedEvent.EVENT_NAME, eventCallback);
        const visualPickerItem = getVisualPickerItems(visualPickerCmp)[1];
        const checkbox = getCheckbox(visualPickerItem);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toEqual({items:[{id: ITEMS[0].itemId, isSelected: false}, {id: visualPickerItem.itemId, isSelected: true}]});
    });

    it('allows multiple selections when selecting another item', async () => {
        visualPickerCmp = createComponentForTest({items: ITEMS, allowMultipleSelection: true});
        const eventCallback = jest.fn();
        visualPickerCmp.addEventListener(VisualPickerListChangedEvent.EVENT_NAME, eventCallback);
        const visualPickerItems = getVisualPickerItems(visualPickerCmp);
        const checkbox = getCheckbox(visualPickerItems[1]);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toEqual({items:[{id: visualPickerItems[1].itemId, isSelected: true}]});
    });

    it('should use default number of columns (2) if numberOfColumns is negative', () => {
        visualPickerCmp = createComponentForTest({items: ITEMS, numberOfColumns: -1});
        const rows = getRows(visualPickerCmp);
        expect(rows).toHaveLength(2);
    });
});