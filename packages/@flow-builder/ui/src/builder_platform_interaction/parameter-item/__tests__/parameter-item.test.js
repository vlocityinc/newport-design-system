import { createElement } from 'engine';
import ParameterItem from 'builder_platform_interaction-parameter-item';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { UpdateParameterItemEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
import { stringCollectionVariable1Guid, stringCollectionVariable1DevName } from 'mock-store-data';
import { comboboxConfig } from 'mock-combobox-data';

const defaultProps = {
    elementType: ELEMENT_TYPE.ACTION_CALL,
    itemIndex: 0,
};

const parameterLabel = 'Parameter Label';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-parameter-item', { is: ParameterItem });
    Object.assign(el, defaultProps, props);
    document.body.appendChild(el);
    return el;
}

function createMockParameterItem(isInput, isRequired, paramValue) {
    const item = {
        isInput,
        isOutput: !isInput,
        isRequired,
        dataType: 'STRING',
        label: parameterLabel,
        name: 'ParameterName',
        description: 'Parameter Description',
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

class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true, }});
    }
}

class ToggleOffChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: false, }});
    }
}

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getRHSTypes: jest.fn(),
        getRulesForContext: jest.fn().mockReturnValue([]),
        RULE_PROPERTY_INFO: require.requireActual('builder_platform_interaction-rule-lib').RULE_PROPERTY_INFO,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue(
            require.requireActual('mock-combobox-data').comboboxConfig.menuData
        ),
        getElementByGuid: require.requireActual('builder_platform_interaction-store-utils').getElementByGuid,
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
            let builderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, true, null)
                });
                builderCombobox = getBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox should be empty', () => {
                expect(builderCombobox.value).toEqual('');
            });
            it('combobox should be required', () => {
                expect(builderCombobox.required).toBe(true);
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
            let builderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, true, paramValue)
                });
                builderCombobox = getBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it("combobox.menuData", () => {
                expect(builderCombobox.menuData).toEqual(comboboxConfig.menuData);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to Test', () => {
                expect(builderCombobox.value).toEqual(paramValue);
            });
            it('combobox should be required', () => {
                expect(builderCombobox.required).toBe(true);
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
            let hiddenBuilderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, false, null)
                });
                hiddenBuilderCombobox = getHiddenBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be hidden', () => {
                expect(hiddenBuilderCombobox).not.toBeNull();
            });
            it('input toggle should be shown', () => {
                expect(toggleInput).not.toBeNull();
            });
            it('input toggle status should be not set', () => {
                expect(toggleInput.checked).toBe(false);
            });
        });
        describe('parameter has value', () => {
            const paramValue = "Test";
            let builderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, false, paramValue)
                });
                builderCombobox = getBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to Test', () => {
                expect(builderCombobox.value).toEqual(paramValue);
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBe(false);
            });
            it('input toggle should be shown', () => {
                expect(toggleInput).not.toBeNull();
            });
            it('input toggle status should be set', () => {
                expect(toggleInput.checked).toBe(true);
            });
        });
    });

    describe('showing combobox, not showing input toggle for output parameter', () => {
        describe('parameter has no value', () => {
            let builderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(false, false, null)
                });
                builderCombobox = getBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be empty', () => {
                expect(builderCombobox.value).toHaveLength(0);
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBe(false);
            });
            it('combobox label should be shown', () => {
                expect(builderCombobox.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
        describe('parameter has value', () => {
            let builderCombobox, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(false, false, stringCollectionVariable1Guid)
                });
                builderCombobox = getBuilderComboboxElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(builderCombobox).not.toBeNull();
            });
            it('combobox value should be equal to stringCollectionVariable1DevName', () => {
                expect(builderCombobox.value).toEqual(`{!${stringCollectionVariable1DevName}}`);
            });
            it('combobox should not be required', () => {
                expect(builderCombobox.required).toBe(false);
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
        const paramValue = "Test";
        it('toggle from OFF to ON should show the combobox for optional input parameter', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, null)
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            toggleInput.dispatchEvent(new ToggleOnChangeEvent());
            return Promise.resolve().then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItemCmp)).toBeNull();
                expect(getBuilderComboboxElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('toggle from ON to OFF should hide the combobox for optional input parameter', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            return Promise.resolve().then(() => {
                const toggleInput = getLightningInputToggle(parameterItemCmp);
                toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            }).then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('toggle OFF will only hide the comboBox', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            return Promise.resolve().then(() => {
                expect(getHiddenBuilderComboboxElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('toggle OFF will preserve the value for optional input parameter', done => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            // from OFF to ON
            toggleInput.dispatchEvent(new ToggleOnChangeEvent());
            const combobox = getBuilderComboboxElement(parameterItemCmp);
            expect(combobox).not.toBeNull();
            expect(combobox.value).toEqual(paramValue);
            done();
        });
        it("should fire 'UpdateParameterItemEvent'", done => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const eventCallback = jest.fn();
            parameterItemCmp.addEventListener(UpdateParameterItemEvent.EVENT_NAME, eventCallback);
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: null}});
            // from OFF to ON
            toggleInput.dispatchEvent(new ToggleOnChangeEvent());
            expect(eventCallback).toHaveBeenCalled();
            done();
        });
    });
    describe('handling value change event from combobox', () => {
        it("should fire 'UpdateParameterItemEvent'", done => {
            const paramValue = 'Test', parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, paramValue),
            });
            const eventCallback = jest.fn();
            parameterItemCmp.addEventListener(UpdateParameterItemEvent.EVENT_NAME, eventCallback);
            const newParamValue = 'new value';
            const cbChangeEvent = new ValueChangedEvent(newParamValue);
            const builderCombobox = getBuilderComboboxElement(parameterItemCmp);
            builderCombobox.dispatchEvent(cbChangeEvent);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: {stringValue: {value: newParamValue}}}});
            done();
        });
    });
});
