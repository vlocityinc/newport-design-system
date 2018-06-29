import { createElement } from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { FilterMatchesEvent } from 'builder_platform_interaction-events';
import { filterMatches } from 'builder_platform_interaction-expression-utils';
import BaseResourcePicker from '../base-resource-picker';

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-resource-picker', {
        is: BaseResourcePicker,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const selectors = {
    COMBOBOX: 'builder_platform_interaction-combobox',
};

const filteredMenuData = ['filteredMenuData'];

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        filterMatches: jest.fn().mockReturnValue(['filteredMenuData']).mockName('filterMatches'),
    };
});

describe('base-resource-picker', () => {
    const comboboxConfig = {
        label: 'test label',
        placeholder: 'test placeholder',
        errorMessage: 'test error message',
        literalsAllowed: true,
        required: true,
        disabled: false,
        type: FLOW_DATA_TYPE.NUMBER.value,
    };

    it('has a static getComboboxConfig method that returns a ComboboxConfig object', () => {
        expect(BaseResourcePicker.getComboboxConfig).toEqual(expect.any(Function));
        expect(BaseResourcePicker.getComboboxConfig('', '', '', '', '', '', '')).toMatchObject(
            {
                label: expect.anything(),
                placeholder: expect.anything(),
                errorMessage: expect.anything(),
                literalsAllowed: expect.anything(),
                required: expect.anything(),
                disabled: expect.anything(),
                type: expect.anything(),
            }
        );
    });

    it('contains one flow combobox', () => {
        const baseResourcePicker = setupComponentUnderTest({comboboxConfig});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox).toBeDefined();
        });
    });

    it('initialized the combobox with the values inside the combobox config object', () => {
        const baseResourcePicker = setupComponentUnderTest({comboboxConfig, value: 'test display text'});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox.label).toEqual(comboboxConfig.label);
            expect(flowCombobox.placeholder).toEqual(comboboxConfig.placeholder);
            expect(flowCombobox.errorMessage).toEqual(comboboxConfig.errorMessage);
            expect(flowCombobox.literalsAllowed).toEqual(comboboxConfig.literalsAllowed);
            expect(flowCombobox.required).toEqual(comboboxConfig.required);
            expect(flowCombobox.disabled).toEqual(comboboxConfig.disabled);
            expect(flowCombobox.type).toEqual(comboboxConfig.type);
        });
    });

    it('can set the value of the flow combobox', () => {
        const defaultValue = {value:'testVal', displayText:'test val'};
        const baseResourcePicker = setupComponentUnderTest({comboboxConfig, value: defaultValue});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox.value).toEqual(defaultValue);
        });
    });

    it('can set the displayText of the flow combobox', () => {
        const defaultDisplayText = 'test display text';
        const baseResourcePicker = setupComponentUnderTest({comboboxConfig, value: defaultDisplayText});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox.value).toEqual(defaultDisplayText);
        });
    });

    describe('event handlers', () => {
        it('handles the filter menu data event', () => {
            const baseResourcePicker = setupComponentUnderTest({comboboxConfig, });
            const fullMenuData = ['full menu data'];
            baseResourcePicker.setMenuData(fullMenuData);
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue'));
            return Promise.resolve().then(() => {
                expect(filterMatches).toHaveBeenCalledWith('someValue', fullMenuData);
                expect(flowCombobox.menuData).toEqual(filteredMenuData);
            });
        });
    });
});