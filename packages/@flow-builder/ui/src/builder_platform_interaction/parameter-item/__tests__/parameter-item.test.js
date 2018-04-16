import { createElement } from 'engine';
import ParameterItem from 'builder_platform_interaction-parameter-item';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { UpdateParameterItemEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
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

function getHiddenBuilderComboboxElement(parameterItem) {
    return parameterItem.querySelector("builder_platform_interaction-combobox.slds-hide");
}

function getLightningInputToggle(parameterItem) {
    return parameterItem.querySelector("lightning-input");
}

describe('parameter-item', () => {
    describe('showing combobox, not showing input toggle for required input parameter', () => {
        describe('parameter has no value', () => {
            let parameterItem;
            let builderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(true, true, null)
                });
                builderCombobox = getBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox should be empty', () => {
                expect(builderCombobox.value).toEqual('');
            });
            it('combobox should be required', () => {
                expect(builderCombobox.required).toBeTruthy();
            });
            it('combobox label should be shown', () => {
                expect(builderCombobox.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
        describe('parameter has value', () => {
            const paramValue = "Test";
            let parameterItem;
            let builderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(true, true, paramValue)
                });
                builderCombobox = getBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to Test', () => {
                expect(builderCombobox.value).toEqual(paramValue);
            });
            it('combobox should be required', () => {
                expect(builderCombobox.required).toBeTruthy();
            });
            it('combobox label should be shown', () => {
                expect(builderCombobox.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
    });

    describe('showing input toggle, show or hide combobox for optional input parameter', () => {
        describe('parameter has no value', () => {
            let parameterItem;
            let hiddenBuilderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(true, false, null)
                });
                hiddenBuilderCombobox = getHiddenBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be hidden', () => {
                expect(hiddenBuilderCombobox).not.toBeNull();
            });
            it('input toggle should be shown', () => {
                expect(toggleInput).not.toBeNull();
            });
            it('input toggle status should be not set', () => {
                expect(toggleInput.checked).toBeFalsy();
            });
        });
        describe('parameter has value', () => {
            const paramValue = "Test";
            let parameterItem;
            let builderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(true, false, paramValue)
                });
                builderCombobox = getBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to Test', () => {
                expect(builderCombobox.value).toEqual(paramValue);
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBeFalsy();
            });
            it('input toggle should be shown', () => {
                expect(toggleInput).not.toBeNull();
            });
            it('input toggle status should be set', () => {
                expect(toggleInput.checked).toBeTruthy();
            });
        });
    });

    describe('showing combobox, not showing input toggle for output parameter', () => {
        describe('parameter has no value', () => {
            let parameterItem;
            let builderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(false, false, null)
                });
                builderCombobox = getBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be empty', () => {
                expect(builderCombobox.value).toEqual('');
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBeFalsy();
            });
            it('combobox label should be shown', () => {
                expect(builderCombobox.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
        describe('parameter has value', () => {
            let parameterItem;
            let builderCombobox;
            let toggleInput;
            beforeAll(() => {
                parameterItem = createComponentForTest({
                    item: createMockParameterItem(false, false, stringCollectionVariable1Guid)
                });
                builderCombobox = getBuilderComboboxElement(parameterItem);
                toggleInput = getLightningInputToggle(parameterItem);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to stringCollectionVariable1DevName', () => {
                expect(builderCombobox.value).toEqual('{!' + stringCollectionVariable1DevName + '}');
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBeFalsy();
            });
            it('combobox label should be shown', () => {
                expect(builderCombobox.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
    });

    describe('handling onchange from input toggle', () => {
        it('toggle from OFF to ON should show the combobox for optional input parameter', () => {
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, null)
            });
            return Promise.resolve().then(() => {
                const toggleInput = getLightningInputToggle(parameterItem);
                const lightningToggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true, }});
                toggleInput.dispatchEvent(lightningToggleOnChangeEvent);
            }).then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItem)).toBeNull();
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
                const lightningToggleOffChangeEvent = new CustomEvent('change', { detail: { checked: false, }});
                toggleInput.dispatchEvent(lightningToggleOffChangeEvent);
            }).then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItem)).not.toBeNull();
            });
        });
        it('toggle OFF will preserve the value for optional input parameter', () => {
            const paramValue = 'Test';
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const toggleInput = getLightningInputToggle(parameterItem);
            return Promise.resolve().then(() => {
                // from ON to OFF
                const lightningToggleOffChangeEvent = new CustomEvent('change', { detail: { checked: false, }});
                toggleInput.dispatchEvent(lightningToggleOffChangeEvent);
            }).then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItem)).not.toBeNull();
                // from OFF to ON
                const lightningToggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true, }});
                toggleInput.dispatchEvent(lightningToggleOnChangeEvent);
            }).then(() => {
                const combobox = getBuilderComboboxElement(parameterItem);
                expect(combobox).not.toBeNull();
                expect(combobox.value).toEqual(paramValue);
            });
        });
        it('should throw UpdateParameterItemEvent', () => {
            const paramValue = 'Test';
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const eventCallback = jest.fn();
            parameterItem.addEventListener(UpdateParameterItemEvent.EVENT_NAME, eventCallback);
            const toggleInput = getLightningInputToggle(parameterItem);
            return Promise.resolve().then(() => {
                // from ON to OFF
                const lightningToggleOffChangeEvent = new CustomEvent('change', { detail: { checked: false, }});
                toggleInput.dispatchEvent(lightningToggleOffChangeEvent);
            }).then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: null}});
                // from OFF to ON
                const lightningToggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true, }});
                toggleInput.dispatchEvent(lightningToggleOnChangeEvent);
            }).then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {value: {stringValue: {value: paramValue}}}});
            });
        });
    });
    describe('handling value change events from combobox', () => {
        it('should throw UpdateParameterItemEvent', () => {
            const paramValue = 'Test';
            const parameterItem = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const eventCallback = jest.fn();
            parameterItem.addEventListener(UpdateParameterItemEvent.EVENT_NAME, eventCallback);
            const newParamValue = 'new value';
            return Promise.resolve().then(() => {
                const cbChangeEvent = new ValueChangedEvent(newParamValue);
                const builderCombobox = getBuilderComboboxElement(parameterItem);
                builderCombobox.dispatchEvent(cbChangeEvent);
            }).then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: {stringValue: {value: newParamValue}}}});
            });
        });
    });
});
