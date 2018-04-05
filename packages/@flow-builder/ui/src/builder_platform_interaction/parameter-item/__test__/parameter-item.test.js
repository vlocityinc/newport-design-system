import { createElement } from 'engine';
import ParameterItem from 'builder_platform_interaction-parameter-item';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { stringCollectionVariable1Guid, stringCollectionVariable1DevName } from 'mock-store-data';

const defaultProps = {
    elementType: ELEMENT_TYPE.ACTION_CALL,
    itemIndex: 0,
};

const parameterLabel = 'Parameter Label';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-parameter-item', { is: ParameterItem });
    Object.assign(el, defaultProps);
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

// mock parameter item
function createMockParameterItem(isInput, isRequired, paramValue) {
    const item = {
        IsInput: isInput,
        IsOutput: !isInput,
        IsRequired: isRequired,
        DataType: 'STRING',
        Label: parameterLabel,
        Name: 'ParameterName',
        Description: 'Parameter Description',
    };
    if (paramValue) {
        if (isInput) {
            item.value = {
                stringValue: {value: paramValue},
            };
        } else {
            item.assignToReference = {
                value: paramValue,
            };
        }
    }
    return item;
}

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getRHSTypes: jest.fn(),
        getRulesForElementType: jest.fn().mockReturnValue([]),
        RULE_PROPERTY_INFO: require.requireActual('builder_platform_interaction-rule-lib').RULE_PROPERTY_INFO,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue([]),
    };
});

function getBuilderComboboxElement(parameterItem) {
    return parameterItem.querySelector("builder_platform_interaction-combobox");
}

function getLightningInputToggle(parameterItem) {
    return parameterItem.querySelector("lightning-input");
}

describe('parameter-item', () => {
    describe('showing combobox, not showing input toggle for required input parameter', () => {
        it('combobox has no value', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, true, null)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(builderCombobox).not.toBeNull();
            expect(toggleInput).toBeNull();
            expect(builderCombobox.value).toEqual('');
            expect(builderCombobox.required).toBeTruthy();
            expect(builderCombobox.label).toEqual(parameterLabel);
        });
        it('combobox has value', () => {
            const paramValue = "Test";
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, true, paramValue)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(builderCombobox).not.toBeNull();
            expect(toggleInput).toBeNull();
            expect(builderCombobox.required).toBeTruthy();
            expect(builderCombobox.label).toEqual(parameterLabel);
            expect(builderCombobox.value).toEqual(paramValue);
        });
    });

    describe('showing input toggle, show or hide combobox for optional input parameter', () => {
        it('showing input toggle, not showing combobox', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, null)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(toggleInput).not.toBeNull();
            expect(toggleInput.checked).toBeFalsy();
            expect(builderCombobox).toBeNull();
        });
        it('showing input toggle, showing combobox', () => {
            const paramValue = "Test";
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(toggleInput).not.toBeNull();
            expect(toggleInput.checked).toBeTruthy();
            expect(builderCombobox).not.toBeNull();
            expect(builderCombobox.required).toBeFalsy();
            expect(builderCombobox.label).toEqual(parameterLabel);
            expect(builderCombobox.value).toEqual(paramValue);
        });
    });

    describe('showing combobox, not showing input toggle for output parameter', () => {
        it('combobox has no value', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(false, false, null)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(builderCombobox).not.toBeNull();
            expect(toggleInput).toBeNull();
            expect(builderCombobox.required).toBeFalsy();
            expect(builderCombobox.label).toEqual(parameterLabel);
            expect(builderCombobox.value).toEqual('');
        });
        it('combobox has value', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(false, false, stringCollectionVariable1Guid)
            });
            const builderCombobox = getBuilderComboboxElement(parameterItem);
            const toggleInput = getLightningInputToggle(parameterItem);

            expect(builderCombobox).not.toBeNull();
            expect(toggleInput).toBeNull();
            expect(builderCombobox.required).toBeFalsy();
            expect(builderCombobox.label).toEqual(parameterLabel);
            expect(builderCombobox.value).toEqual('{!' + stringCollectionVariable1DevName + '}');
        });
    });

    describe('handling onchange from input toggle', () => {
        it('toggle from OFF to ON should show the combobox for optional input parameter', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, null)
            });
            return Promise.resolve().then(() => {
                const toggleInput = getLightningInputToggle(parameterItem);
                expect(getBuilderComboboxElement(parameterItem)).toBeNull();
                const lightningToggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true, }});
                toggleInput.dispatchEvent(lightningToggleOnChangeEvent);
            }).then(() => {
                expect(getBuilderComboboxElement(parameterItem)).not.toBeNull();
            });
        });
        it('toggle from ON to OFF should hide the combobox for optional input parameter', () => {
            const paramValue = 'Test';
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            return Promise.resolve().then(() => {
                const toggleInput = getLightningInputToggle(parameterItem);
                expect(getBuilderComboboxElement(parameterItem)).not.toBeNull();
                const lightningToggleOffChangeEvent = new CustomEvent('change', { detail: { checked: false, }});
                toggleInput.dispatchEvent(lightningToggleOffChangeEvent);
            }).then(() => {
                expect(getBuilderComboboxElement(parameterItem)).toBeNull();
            });
        });
        it('toggle OFF will preserve the value for optional input parameter', () => {
            const paramValue = 'Test';
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const toggleInput = getLightningInputToggle(parameterItem);
            return Promise.resolve().then(() => {
                expect(getBuilderComboboxElement(parameterItem)).not.toBeNull();
                const lightningToggleOffChangeEvent = new CustomEvent('change', { detail: { checked: false, }});
                toggleInput.dispatchEvent(lightningToggleOffChangeEvent);
            }).then(() => {
                expect(getBuilderComboboxElement(parameterItem)).toBeNull();
                const lightningToggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true, }});
                toggleInput.dispatchEvent(lightningToggleOnChangeEvent);
            }).then(() => {
                const combobox = getBuilderComboboxElement(parameterItem);
                expect(combobox).not.toBeNull();
                expect(combobox.value).toEqual(paramValue);
            });
        });
    });
});
