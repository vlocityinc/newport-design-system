import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { FilterMatchesEvent } from "builder_platform_interaction/events";
import { filterMatches } from "builder_platform_interaction/expressionUtils";
import { LIGHTNING_INPUT_VARIANTS } from "builder_platform_interaction/screenEditorUtils";
import BaseResourcePicker from "../baseResourcePicker";

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-base-resource-picker', {
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

jest.mock('builder_platform_interaction/expressionUtils', () => {
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
        variant: LIGHTNING_INPUT_VARIANTS.STANDARD,
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

    describe('initialized the combobox with the values inside the combobox config object', () => {
        it('config including all values except type and errorMessage', () => {
            const comboboxConfigWithoutType = Object.assign({}, comboboxConfig);
            delete comboboxConfigWithoutType.type;

            const baseResourcePicker = setupComponentUnderTest({comboboxConfig: comboboxConfigWithoutType, value: 123});
            return Promise.resolve().then(() => {
                const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
                expect(flowCombobox.label).toEqual(comboboxConfig.label);
                expect(flowCombobox.placeholder).toEqual(comboboxConfig.placeholder);
                expect(flowCombobox.literalsAllowed).toEqual(comboboxConfig.literalsAllowed);
                expect(flowCombobox.required).toEqual(comboboxConfig.required);
                expect(flowCombobox.disabled).toEqual(comboboxConfig.disabled);
            });
        });
        it('config including type', () => {
            const baseResourcePicker = setupComponentUnderTest({comboboxConfig, value: 'test display text'});
            return Promise.resolve().then(() => {
                const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
                expect(flowCombobox.type).toEqual(comboboxConfig.type);
            });
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

    it('can set the errorMessage of the flow combobox', () => {
        const errorMessage = 'wrong';
        const baseResourcePicker = setupComponentUnderTest({comboboxConfig, errorMessage});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox.errorMessage).toEqual(errorMessage);
        });
    });

    it('sets the allowed param types on the flow combobox', () => {
        const allowedParamTypes = { foo: {value: 'foo'}};
        const baseResourcePicker = setupComponentUnderTest({allowedParamTypes});
        return Promise.resolve().then(() => {
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            expect(flowCombobox.allowedParamTypes).toEqual(allowedParamTypes);
        });
    });

    describe('event handlers', () => {
        it('handles the filter menu data event', () => {
            const baseResourcePicker = setupComponentUnderTest({comboboxConfig, });
            const fullMenuData = ['full menu data'];
            baseResourcePicker.setMenuData(fullMenuData);
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue', false));
            return Promise.resolve().then(() => {
                expect(filterMatches).toHaveBeenCalledWith('someValue', fullMenuData, false);
                expect(flowCombobox.menuData).toEqual(filteredMenuData);
            });
        });

        it('passes the isMergeField property from filter matches event to filter matches util', () => {
            const baseResourcePicker = setupComponentUnderTest({comboboxConfig, });
            const flowCombobox = getShadowRoot(baseResourcePicker).querySelector(selectors.COMBOBOX);
            const isMergeField = true;
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue', isMergeField));
            return Promise.resolve().then(() => {
                expect(filterMatches).toHaveBeenCalledWith(expect.anything(), undefined, isMergeField);
            });
        });
    });
});