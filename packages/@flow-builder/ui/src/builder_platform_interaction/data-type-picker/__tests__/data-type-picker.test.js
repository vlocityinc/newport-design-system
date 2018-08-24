import { createElement } from 'lwc';
import DataTypePicker from '../data-type-picker';
import { FLOW_DATA_TYPE, SCALE_DEFAULT, SCALE_RANGE } from 'builder_platform_interaction-data-type-lib';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-data-type-picker', { is: DataTypePicker });
    document.body.appendChild(el);
    return el;
};

describe('Data Type picker', () => {
    let dataTypePickerComponent;
    let dataTypeComponent;
    let scaleComponent;
    let collectionComponent;
    beforeEach(() => {
        dataTypePickerComponent = createComponentUnderTest();
        dataTypeComponent = () => getShadowRoot(dataTypePickerComponent).querySelector('lightning-combobox');
        scaleComponent = () => getShadowRoot(dataTypePickerComponent).querySelector('.scale');
        collectionComponent = () => getShadowRoot(dataTypePickerComponent).querySelector('.collection');
    });

    it('should only display given available data types', async () => {
        dataTypePickerComponent.availableDataTypes = [FLOW_DATA_TYPE.STRING, FLOW_DATA_TYPE.NUMBER];
        await Promise.resolve();
        expect(getShadowRoot(dataTypePickerComponent).querySelector('lightning-combobox').options.map(option => option.label)).toEqual(['FlowBuilderDataTypes.textDataTypeLabel', 'FlowBuilderDataTypes.numberDataTypeLabel']);
    });

    it('should display the given error message', () => {
        const errorMessage = 'test error';
        dataTypePickerComponent.errorMessage = errorMessage;
        return Promise.resolve(() => {
            const combobox = getShadowRoot(dataTypeComponent).querySelector('lightning-component');
            expect(combobox.checkValidity()).toBeFalsy();
            expect(combobox.errorMessage).toEqual(errorMessage);
        });
    });

    describe('When scale is allowed', () => {
        beforeEach(() => {
            dataTypePickerComponent.allowScale = true;
        });
        it('should show scale input when Number is selected', async () => {
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value };
            await Promise.resolve();
            expect(scaleComponent()).not.toBeNull();
        });
        it('should show scale input when Currency is selected', async () => {
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.CURRENCY.value };
            await Promise.resolve();
            expect(scaleComponent()).not.toBeNull();
        });
        it('should not show scale input for any other data type', async () => {
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.STRING.value };
            await Promise.resolve();
            expect(scaleComponent()).toBeNull();
        });
        it('should not show scale input when collection is selected', async () => {
            dataTypePickerComponent.allowCollection = true;
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value, isCollection : true };
            await Promise.resolve();
            expect(scaleComponent()).toBeNull();
        });
    });
    describe('When scale is not allowed', () => {
        beforeEach(() => {
            dataTypePickerComponent.allowScale = false;
        });
        it('should not show scale input', async () => {
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value };
            await Promise.resolve();
            expect(scaleComponent()).toBeNull();
        });
    });
    describe('When collection is allowed', () => {
        it('should show collection checkbox', async () => {
            dataTypePickerComponent.allowCollection = true;
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value, isCollection : true };
            await Promise.resolve();
            expect(collectionComponent()).not.toBeNull();
        });
    });

    describe('When collection is not allowed', () => {
        it('should not show collection checkbox', async () => {
            dataTypePickerComponent.allowCollection = false;
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value };
            await Promise.resolve();
            expect(collectionComponent()).toBeNull();
        });
    });
    describe('Events', () => {
        let eventCallback;
        const expectValueChangedEventWithValue = (value) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({ detail: { value } });
        };
        beforeEach(async () => {
            eventCallback = jest.fn();
            dataTypePickerComponent.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            dataTypePickerComponent.allowScale = true;
            dataTypePickerComponent.allowCollection = true;
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value, isCollection : false, scale : 2 };
            await Promise.resolve();
            scaleComponent().reportValidity = jest.fn();
        });
        it('fires valueChanged event when another datatype is selected in the combobox', async () => {
            dataTypeComponent().value = FLOW_DATA_TYPE.CURRENCY.value;
            dataTypeComponent().dispatchEvent(new CustomEvent('change', { detail: { value: FLOW_DATA_TYPE.CURRENCY.value } }));
            await Promise.resolve();
            expectValueChangedEventWithValue({ dataType : FLOW_DATA_TYPE.CURRENCY.value, isCollection : false, scale : 2 });
        });
        it('fires valueChanged event when collection is changed', async () => {
            collectionComponent().dispatchEvent(new CustomEvent('change', { detail: { checked : true } }));
            await Promise.resolve();
            expectValueChangedEventWithValue({ dataType : FLOW_DATA_TYPE.NUMBER.value, isCollection : true, scale : 2 });
        });
        it('fires valueChanged event on blur when scale is changed', async () => {
            scaleComponent().mockUserInput('3');
            scaleComponent().dispatchEvent(new CustomEvent('blur'));
            await Promise.resolve();
            expectValueChangedEventWithValue({ dataType : FLOW_DATA_TYPE.NUMBER.value, isCollection : false, scale : 3 });
        });
        it('does not fire valueChanged event on blur when scale has not been changed', async () => {
            scaleComponent().mockUserInput('2');
            scaleComponent().dispatchEvent(new CustomEvent('blur'));
            await Promise.resolve();
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
    describe('Scale input', () => {
        let eventCallback;
        const expectValueChangedEventWithScale = (scale) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: { value : { dataType : FLOW_DATA_TYPE.NUMBER.value, scale } } });
        };
        const enterScaleAndDispatchBlur = (userInput) => {
            scaleComponent().mockUserInput(userInput);
            scaleComponent().dispatchEvent(new CustomEvent('blur'));
        };
        beforeEach(async () => {
            eventCallback = jest.fn();
            dataTypePickerComponent.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
            dataTypePickerComponent.allowScale = true;
            dataTypePickerComponent.value = { dataType : FLOW_DATA_TYPE.NUMBER.value, scale : 3 };
            await Promise.resolve();
            scaleComponent().reportValidity = jest.fn();
        });
        it('does not allow scale to be < 0', async () => {
            enterScaleAndDispatchBlur('-1');
            await Promise.resolve();
            expectValueChangedEventWithScale(SCALE_RANGE.min);
        });
        it('does not allow scale to be > 17', async () => {
            enterScaleAndDispatchBlur('20');
            await Promise.resolve();
            expectValueChangedEventWithScale(SCALE_RANGE.max);
        });
        it('does not allow scale to be text', async () => {
            enterScaleAndDispatchBlur('this is a text');
            await Promise.resolve();
            expectValueChangedEventWithScale(SCALE_DEFAULT);
        });
        it('does not allow scale to have a decimal part', async () => {
            enterScaleAndDispatchBlur('15.4');
            await Promise.resolve();
            expectValueChangedEventWithScale(15);
        });
    });
});