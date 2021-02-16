import { createElement } from 'lwc';
import OutputResourcePicker from '../outputResourcePicker';
import { Store } from 'builder_platform_interaction/storeLib';
import { deepQuerySelector, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import Combobox from 'builder_platform_interaction/combobox';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';
import { comboboxInitialConfig } from 'mock/comboboxData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const setupComponentUnderTest = (props?: {}) => {
    const element = createElement('builder_platform_interaction-output-resource-picker', {
        is: OutputResourcePicker
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

const getCombobox = (outputResourcePicker) =>
    new ComboboxTestComponent(
        deepQuerySelector(outputResourcePicker, [BaseResourcePicker.SELECTOR, Combobox.SELECTOR])
    );

const mockMenuData = comboboxInitialConfig.menuData;
const [mockMenuDataItemTextVariable] = mockMenuData[2].items;

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return Object.assign({}, actual, {
        getMenuData: jest.fn().mockImplementation(() => Promise.resolve(mockMenuData)),
        filterMatches: jest.fn()
    });
});

describe('pills in output-resource-picker', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    it('does not support pill by default', () => {
        const outputResourcePicker = setupComponentUnderTest();
        const combobox = getCombobox(outputResourcePicker);
        expect(combobox.element.isPillSupported).toBe(false);
    });
    describe('pill supported', () => {
        let combobox: ComboboxTestComponent;
        beforeEach(async () => {
            const outputResourcePicker: HTMLElement = setupComponentUnderTest({
                isPillSupported: true
            });
            await ticks(1);
            combobox = getCombobox(outputResourcePicker);
            await combobox.selectItemBy('text', [mockMenuDataItemTextVariable.text]);
        });
        it('displays pill on blur', async () => {
            expect(combobox.element.value).toEqual(mockMenuDataItemTextVariable);
            expect(combobox.element.pill).toEqual({
                iconName: 'utility:text',
                label: mockMenuDataItemTextVariable.text
            });
        });
        it('switches to mergeField notation with correct displayText when you click on the pill ', async () => {
            await combobox.clickPill();
            expect(combobox.element.hasPill).toBe(false);
            expect(combobox.element.value.displayText).toEqual(mockMenuDataItemTextVariable.displayText);
        });
        it('clears combobox when you click on removing the pill ', async () => {
            await combobox.removePill();
            expect(combobox.element.hasPill).toBe(false);
            expect(combobox.element.value).toEqual('');
        });
    });
});
