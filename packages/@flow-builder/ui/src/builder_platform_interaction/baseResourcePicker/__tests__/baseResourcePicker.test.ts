import { createElement } from 'lwc';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { FilterMatchesEvent } from 'builder_platform_interaction/events';
import { filterMatches } from 'builder_platform_interaction/expressionUtils';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import BaseResourcePicker from '../baseResourcePicker';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

const setupComponentUnderTest = (props?: {}) => {
    const element = createElement('builder_platform_interaction-base-resource-picker', {
        is: BaseResourcePicker
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const filteredMenuData = ['filteredMenuData'];

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        filterMatches: jest.fn().mockReturnValue(['filteredMenuData']).mockName('filterMatches')
    };
});

const getFlowCombobox = (baseResourcePicker) =>
    baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX);

describe('base-resource-picker', () => {
    const comboboxConfig = {
        label: 'test label',
        placeholder: 'test placeholder',
        errorMessage: 'test error message',
        literalsAllowed: true,
        required: true,
        disabled: false,
        type: FLOW_DATA_TYPE.NUMBER.value,
        variant: LIGHTNING_INPUT_VARIANTS.STANDARD
    };

    it('has a static getComboboxConfig method that returns a ComboboxConfig object', () => {
        expect(BaseResourcePicker.getComboboxConfig).toEqual(expect.any(Function));
        expect(BaseResourcePicker.getComboboxConfig('', '', '', false, false, false, '')).toMatchObject({
            label: expect.anything(),
            placeholder: expect.anything(),
            errorMessage: expect.anything(),
            literalsAllowed: expect.anything(),
            required: expect.anything(),
            disabled: expect.anything(),
            type: expect.anything()
        });
    });

    it('contains one flow combobox', () => {
        const baseResourcePicker = setupComponentUnderTest({ comboboxConfig });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox).toBeDefined();
    });

    describe('initialized the combobox with the values inside the combobox config object', () => {
        it('config including all values except type and errorMessage', () => {
            const comboboxConfigWithoutType = {
                label: 'test label',
                placeholder: 'test placeholder',
                errorMessage: 'test error message',
                literalsAllowed: true,
                required: true,
                disabled: false,
                variant: LIGHTNING_INPUT_VARIANTS.STANDARD
            };

            const baseResourcePicker = setupComponentUnderTest({
                comboboxConfig: comboboxConfigWithoutType,
                value: 123
            });
            const flowCombobox = getFlowCombobox(baseResourcePicker);
            expect(flowCombobox).toMatchObject({
                label: comboboxConfig.label,
                placeholder: comboboxConfig.placeholder,
                literalsAllowed: comboboxConfig.literalsAllowed,
                required: comboboxConfig.required,
                disabled: comboboxConfig.disabled
            });
        });
        it('config including type', () => {
            const baseResourcePicker = setupComponentUnderTest({
                comboboxConfig,
                value: 'test display text'
            });
            const flowCombobox = getFlowCombobox(baseResourcePicker);
            expect(flowCombobox.type).toEqual(comboboxConfig.type);
        });
    });

    it('can set the value of the flow combobox', () => {
        const defaultValue = { value: 'testVal', displayText: 'test val' };
        const baseResourcePicker = setupComponentUnderTest({
            comboboxConfig,
            value: defaultValue
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.value).toEqual(defaultValue);
    });

    it('can set the displayText of the flow combobox', () => {
        const defaultDisplayText = 'test display text';
        const baseResourcePicker = setupComponentUnderTest({
            comboboxConfig,
            value: defaultDisplayText
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.value).toEqual(defaultDisplayText);
    });

    it('can set the errorMessage of the flow combobox', () => {
        const errorMessage = 'wrong';
        const baseResourcePicker = setupComponentUnderTest({
            comboboxConfig,
            errorMessage
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.errorMessage).toEqual(errorMessage);
    });

    it('sets the allowed param types on the flow combobox', () => {
        const allowedParamTypes = { foo: { value: 'foo' } };
        const baseResourcePicker = setupComponentUnderTest({
            allowedParamTypes
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.allowedParamTypes).toEqual(allowedParamTypes);
    });

    it('sets the render-incrementally property on the flow combobox', async () => {
        const baseResourcePicker = setupComponentUnderTest({
            comboboxConfig
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.renderIncrementally).toBeFalsy();

        const fullMenuData = ['full menu data'];
        baseResourcePicker.setMenuData(fullMenuData);
        await ticks(1);
        expect(flowCombobox.renderIncrementally).toBeTruthy();
    });

    describe('event handlers', () => {
        it('handles the filter menu data event', async () => {
            const baseResourcePicker = setupComponentUnderTest({
                comboboxConfig
            });
            const fullMenuData = ['full menu data'];
            baseResourcePicker.setMenuData(fullMenuData);
            const flowCombobox = getFlowCombobox(baseResourcePicker);
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue', false));
            await ticks(1);
            expect(filterMatches).toHaveBeenCalledWith('someValue', fullMenuData, false);
            expect(flowCombobox.menuData).toEqual(filteredMenuData);
        });

        it('passes the isMergeField property from filter matches event to filter matches util', async () => {
            const baseResourcePicker = setupComponentUnderTest({
                comboboxConfig
            });
            const flowCombobox = getFlowCombobox(baseResourcePicker);
            const isMergeField = true;
            flowCombobox.dispatchEvent(new FilterMatchesEvent('someValue', isMergeField));
            await ticks(1);
            expect(filterMatches).toHaveBeenCalledWith(expect.anything(), undefined, isMergeField);
        });
    });

    it('uses placeholder property, if no placeholder is in config', () => {
        const comboboxConfigWithoutType = {
            label: 'test label',
            errorMessage: 'test error message',
            literalsAllowed: true,
            required: true,
            disabled: false,
            type: FLOW_DATA_TYPE.NUMBER.value,
            variant: LIGHTNING_INPUT_VARIANTS.STANDARD
        };

        const baseResourcePicker = setupComponentUnderTest({
            comboboxConfig: comboboxConfigWithoutType,
            placeholder: 'abc',
            value: 123
        });
        const flowCombobox = getFlowCombobox(baseResourcePicker);
        expect(flowCombobox.placeholder).not.toEqual(comboboxConfig.placeholder);
        expect(flowCombobox.placeholder).toEqual('abc');
    });
});
