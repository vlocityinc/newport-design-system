import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import ParameterItem from 'builder_platform_interaction/parameterItem';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { PropertyChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import { stringVariableDevName, stringVariableGuid } from 'mock/storeData';

const parameterLabel = 'Parameter Label';
const parameterName = 'parameterName';
const parameterStringValue = 'Simple String Value';

function createComponentForTest({ item = createMockParameterItem(true, true, 'string'), elementType = ELEMENT_TYPE.ACTION_CALL, itemIndex = 0, showDelete = false, warningMessage, warningBadge} = {}) {
    const el = createElement('builder_platform_interaction-parameter-item', { is: ParameterItem });
    Object.assign(el, {item, elementType, itemIndex, showDelete, warningMessage, warningBadge});
    document.body.appendChild(el);
    return el;
}

function createMockParameterItem(isInput, isRequired, dataType, value, valueGuid, valueDataType) {
    const item = {
        isInput,
        isOutput: !isInput,
        isRequired,
        dataType,
        label: parameterLabel,
        name: parameterName,
        description: 'Parameter Description',
    };
    if (value) {
        item.value = {value, error: null};
    }
    if (valueGuid) {
        item.valueGuid = {value: valueGuid, error: null};
    }
    if (valueDataType) {
        item.valueDataType = {value: valueDataType, error: null};
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

const selectors = {
    ferovResourcePicker: 'builder_platform_interaction-ferov-resource-picker',
    outputResourcePicker: 'builder_platform_interaction-output-resource-picker',
    hiddenFerovResourcePickerElement: 'builder_platform_interaction-ferov-resource-picker.slds-hide',
    toggle: 'lightning-input',
    baseResourcePicker: 'builder_platform_interaction-base-resource-picker',
    warningIcon: 'lightning-button-icon',
    warningBadge: 'lightning-badge',
    deleteButton: 'lightning-button-icon',
};

function getFerovResourcePickerElement(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.ferovResourcePicker);
}

function getHiddenFerovResourcePickerElement(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.hiddenFerovResourcePickerElement);
}

function getOutputResourcePickerElement(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.outputResourcePicker);
}

function getLightningInputToggle(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.toggle);
}

function getWarningIcon(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.warningIcon);
}

function getWarningBadge(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.warningBadge);
}

function getDeleteButton(parameterItem) {
    return getShadowRoot(parameterItem).querySelector(selectors.deleteButton);
}

describe('parameter-item', () => {
    describe('showing combobox, not showing input toggle for required input parameter', () => {
        describe('parameter has no value', () => {
            let ferovResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest();
                ferovResourcePicker = getFerovResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(ferovResourcePicker).not.toBeNull();
            });
            it('combobox value should be null', () => {
                expect(ferovResourcePicker.value).toBeNull();
            });
            it('combobox should be required', () => {
                expect(ferovResourcePicker.comboboxConfig.required).toBe(true);
            });
            it('combobox label should be shown', () => {
                expect(ferovResourcePicker.comboboxConfig.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
        describe('parameter has value', () => {
            let ferovResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, true, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
                });
                ferovResourcePicker = getFerovResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(ferovResourcePicker).not.toBeNull();
            });
            it('combobox value should be equal to parameterStringValue', () => {
                expect(ferovResourcePicker.value).toEqual(parameterStringValue);
            });
            it('combobox should be required', () => {
                expect(ferovResourcePicker.comboboxConfig.required).toBe(true);
            });
            it('combobox label should be shown', () => {
                expect(ferovResourcePicker.comboboxConfig.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
    });
    describe('showing input toggle, show or hide combobox for optional input parameter', () => {
        describe('parameter has no value', () => {
            let hiddenFerovResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, false, 'string'),
                });
                hiddenFerovResourcePicker = getHiddenFerovResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be hidden', () => {
                expect(hiddenFerovResourcePicker).not.toBeNull();
            });
            it('input toggle should be shown', () => {
                expect(toggleInput).not.toBeNull();
            });
            it('input toggle status should be not set', () => {
                expect(toggleInput.checked).toBe(false);
            });
        });
        describe('parameter has value', () => {
            let ferovResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING)
                });
                ferovResourcePicker = getFerovResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(ferovResourcePicker).not.toBeNull();
            });
            it('combobox value should be equal to parameterStringValue', () => {
                expect(ferovResourcePicker.value).toEqual(parameterStringValue);
            });
            it('combobox should not be required', () => {
                expect(ferovResourcePicker.comboboxConfig.required).toBe(false);
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
            let outputResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(false, false, 'reference')
                });
                outputResourcePicker = getOutputResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(outputResourcePicker).not.toBeNull();
            });
            it('combobox value should be null', () => {
                expect(outputResourcePicker.value).toBeNull();
            });
            it('combobox should not be required', () => {
                expect(outputResourcePicker.comboboxConfig.required).toBe(false);
            });
            it('combobox label should be shown', () => {
                expect(outputResourcePicker.comboboxConfig.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
        describe('parameter has value', () => {
            let outputResourcePicker, toggleInput;
            beforeAll(() => {
                const parameterItemCmp = createComponentForTest({
                    item: createMockParameterItem(false, false, 'reference', stringVariableGuid + '.' + stringVariableDevName)
                });
                outputResourcePicker = getOutputResourcePickerElement(parameterItemCmp);
                toggleInput = getLightningInputToggle(parameterItemCmp);
            });
            it('combobox should be shown', () => {
                expect(outputResourcePicker).not.toBeNull();
            });
            it('combobox value should be equal to stringVariableGuid.stringVariableDevName', () => {
                expect(outputResourcePicker.value).toEqual(stringVariableGuid + '.' + stringVariableDevName);
            });
            it('combobox should not be required', () => {
                expect(outputResourcePicker.comboboxConfig.required).toBe(false);
            });
            it('combobox label should be shown', () => {
                expect(outputResourcePicker.comboboxConfig.label).toEqual(parameterLabel);
            });
            it('input toggle should not be shown', () => {
                expect(toggleInput).toBeNull();
            });
        });
    });
    describe('handling onchange from input toggle', () => {
        it('should show the combobox for optional input parameter when toggle from OFF to ON ', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string')
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            toggleInput.dispatchEvent(new ToggleOnChangeEvent());
            return Promise.resolve().then(() => {
                expect(getHiddenFerovResourcePickerElement(parameterItemCmp)).toBeNull();
                expect(getFerovResourcePickerElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('should hide the combobox for optional input parameter when toggle from ON to OFF ', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
            });
            return Promise.resolve().then(() => {
                const toggleInput = getLightningInputToggle(parameterItemCmp);
                toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            }).then(() => {
                expect(getHiddenFerovResourcePickerElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('should hide the comboBox when toggle OFF ', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            return Promise.resolve().then(() => {
                expect(getHiddenFerovResourcePickerElement(parameterItemCmp)).not.toBeNull();
            });
        });
        it('should preserve the value for optional input parameter when toggle OFF', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
            });
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            // from OFF to ON
            return Promise.resolve().then(() => {
                toggleInput.dispatchEvent(new ToggleOnChangeEvent());
            }).then(() => {
                const combobox = getFerovResourcePickerElement(parameterItemCmp);
                expect(combobox).not.toBeNull();
                expect(combobox.value).toEqual(parameterStringValue);
            });
        });
        it('should fire PropertyChangedEvent', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
            });
            const eventCallback = jest.fn();
            parameterItemCmp.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            const toggleInput = getLightningInputToggle(parameterItemCmp);
            // from ON to OFF
            toggleInput.dispatchEvent(new ToggleOffChangeEvent());
            return Promise.resolve().then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: ('inputParameters.' + parameterName), value: null, valueDataType: null}});
            }).then(() => {
                // from OFF to ON
                toggleInput.dispatchEvent(new ToggleOnChangeEvent());
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: ('inputParameters.' + parameterName), value: parameterStringValue, valueDataType: FEROV_DATA_TYPE.STRING}});
            });
        });
    });
    describe('handling value change event from combobox', () => {
        it('should fire PropertyChangedEvent', () => {
            const parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
            });
            const eventCallback = jest.fn();
            parameterItemCmp.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            const newParamValue = 'new value';
            const cbChangeEvent = new ComboboxStateChangedEvent(null, newParamValue);
            const ferovResourcePicker = getFerovResourcePickerElement(parameterItemCmp);
            ferovResourcePicker.dispatchEvent(cbChangeEvent);
            return Promise.resolve().then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: ('inputParameters.' + parameterName), value: newParamValue, valueDataType: FEROV_DATA_TYPE.STRING}});
            });
        });
    });
    describe('showing badge and icon', () => {
        let parameterItemCmp;
        it('should show only icon if only warningMessage is set', () => {
            parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
                warningMessage: 'Warning'
            });
            const warningIcon = getWarningIcon(parameterItemCmp);
            expect(warningIcon).not.toBeNull();
            expect(warningIcon.iconName).toEqual('utility:warning');
            expect(getWarningBadge(parameterItemCmp)).toBeNull();
        });
        it('should show badge and icon if both warningBadge and warningMessage are set', () => {
            parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
                warningMessage: 'Warning',
                warningBadge: 'Debug Only'
            });
            expect(getWarningIcon(parameterItemCmp)).not.toBeNull();
            const badgeCmp = getWarningBadge(parameterItemCmp);
            expect(badgeCmp).not.toBeNull();
            expect(badgeCmp.label).toEqual('Debug Only');
        });
    });
    describe('when showDelete is TRUE', () => {
        let parameterItemCmp;
        beforeAll(() => {
            parameterItemCmp = createComponentForTest({
                item: createMockParameterItem(true, false, 'string', parameterStringValue, null, FEROV_DATA_TYPE.STRING),
                showDelete: true
            });
        });
        it('should show delete icon button', () => {
            const deleteBtn = getDeleteButton(parameterItemCmp);
            expect(deleteBtn).not.toBeNull();
            expect(deleteBtn.iconName).toEqual('utility:delete');
        });
        it('should hide toggle input', () => {
            expect(getLightningInputToggle(parameterItemCmp)).toBeNull();
        });
    });
});
