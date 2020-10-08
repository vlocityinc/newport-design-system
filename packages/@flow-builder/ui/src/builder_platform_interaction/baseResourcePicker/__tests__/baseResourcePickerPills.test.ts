import { createElement } from 'lwc';
import BaseResourcePicker from '../baseResourcePicker';
import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    clickPill,
    removePill
} from 'builder_platform_interaction/builderTestUtils';
import Combobox from 'builder_platform_interaction/combobox';
import { selectComboboxItemBy } from '../../integrationTests/__tests__/comboboxTestUtils';
import { comboboxInitialConfig } from 'mock/comboboxData';

const createComponentUnderTest = (props?: {}) => {
    const element = createElement('builder_platform_interaction-base-resource-picker', {
        is: BaseResourcePicker
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const mockMenuData = comboboxInitialConfig.menuData;
const [mockMenuDataItemAccountVariable] = mockMenuData[1].items;

const getCombobox = (baseResourcePicker) =>
    baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX);

describe('pills in base-resource-picker', () => {
    it('does not support pill by default', () => {
        const baseResourcePicker = createComponentUnderTest();
        const combobox = getCombobox(baseResourcePicker);
        expect(combobox.isPillSupported).toBe(false);
    });
    describe('pill supported', () => {
        let combobox: Combobox;
        beforeEach(async () => {
            const baseResourcePicker = createComponentUnderTest({
                isPillSupported: true
            });
            baseResourcePicker.setMenuData(mockMenuData);
            await ticks(1);
            combobox = getCombobox(baseResourcePicker);
            await selectComboboxItemBy(combobox, 'text', [mockMenuDataItemAccountVariable.text]);
        });
        it('displays pill on blur', async () => {
            expect(combobox.value).toEqual(mockMenuDataItemAccountVariable);
            expect(combobox.pill).toEqual({
                iconName: 'utility:sobject',
                label: mockMenuDataItemAccountVariable.text
            });
        });
        it('switches to mergeField notation with correct displayText when you click on the pill ', async () => {
            expect(combobox.hasPill).toBe(true);
            await clickPill(combobox);
            expect(combobox.hasPill).toBe(false);
            expect(combobox.value.displayText).toEqual(mockMenuDataItemAccountVariable.displayText);
        });
        it('clears combobox when you click on removing the pill ', async () => {
            expect(combobox.hasPill).toBe(true);
            await removePill(combobox);
            expect(combobox.hasPill).toBe(false);
            expect(combobox.value).toEqual('');
        });
    });
});
