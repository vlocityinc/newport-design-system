import { createElement } from 'lwc';
import BaseResourcePicker from '../baseResourcePicker';
import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';
import { comboboxInitialConfig } from 'mock/comboboxData';

const createComponentUnderTest = (props?: {}) => {
    const element = createElement('builder_platform_interaction-base-resource-picker', {
        is: BaseResourcePicker
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

const mockMenuData = comboboxInitialConfig.menuData;
const [mockMenuDataItemAccountVariable] = mockMenuData[1].items;

const getCombobox = (baseResourcePicker) =>
    new ComboboxTestComponent(baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX));

describe('pills in base-resource-picker', () => {
    it('does not support pill by default', () => {
        const baseResourcePicker = createComponentUnderTest();
        const combobox = getCombobox(baseResourcePicker);
        expect(combobox.element.isPillSupported).toBe(false);
    });
    describe('pill supported', () => {
        let combobox: ComboboxTestComponent;
        beforeEach(async () => {
            const baseResourcePicker = createComponentUnderTest({
                isPillSupported: true
            });
            baseResourcePicker.setMenuData(mockMenuData);
            await ticks(1);
            combobox = getCombobox(baseResourcePicker);
            await combobox.selectItemBy('text', [mockMenuDataItemAccountVariable.text]);
        });
        it('displays pill on blur', async () => {
            expect(combobox.element.value).toEqual(mockMenuDataItemAccountVariable);
            expect(combobox.element.pill).toEqual({
                iconName: 'utility:sobject',
                label: mockMenuDataItemAccountVariable.text
            });
        });
        it('switches to mergeField notation with correct displayText when you click on the pill ', async () => {
            expect(combobox.element.hasPill).toBe(true);
            await combobox.clickPill();
            expect(combobox.element.hasPill).toBe(false);
            expect(combobox.element.value.displayText).toEqual(mockMenuDataItemAccountVariable.displayText);
        });
        it('clears combobox when you click on removing the pill ', async () => {
            expect(combobox.element.hasPill).toBe(true);
            await combobox.removePill();
            expect(combobox.element.hasPill).toBe(false);
            expect(combobox.element.value).toEqual('');
        });
    });
});
