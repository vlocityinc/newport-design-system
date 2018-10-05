import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { WAIT_EVENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    UpdateParameterItemEvent,
    ComboboxStateChangedEvent,
} from "builder_platform_interaction/events";
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFerovInfoFromComboboxItem } from 'builder_platform_interaction/expressionUtils';
import WaitTimeEvent from '../waitTimeEvent';

const createComponentUnderTest = (props) => {
    let el = createElement('builder_platform_interaction-wait-time-event', {
        is: WaitTimeEvent,
    });
    el = Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    picker: 'builder_platform_interaction-ferov-resource-picker',
    lightningRadioGroup: 'lightning-radio-group',
};

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getFerovInfoFromComboboxItem: jest.fn().mockName('getFerovInfoFromComboboxItem'),
    };
});

describe('waitTimeEvent', () => {
    describe('resume time paramters', () => {
        let waitTimeEvent;
        let props;

        beforeEach(() => {
            const mockResumeTimeParamters = [{ name: 'foo' }];
            const mockEventType = WAIT_EVENT_TYPE.ABSOLUTE_TIME;
            props = {
                resumeTimeParameters: mockResumeTimeParamters,
                eventType: mockEventType,
            };
            waitTimeEvent = createComponentUnderTest(props);
        });

        it('has a date time picker when absolute time is selected', () => {
            const picker = getShadowRoot(waitTimeEvent).querySelector(selectors.picker);
            expect(picker.comboboxConfig.type).toEqual(FLOW_DATA_TYPE.DATE_TIME.value);
        });

        it('dispatches PropertyChangedEvent when event type changes', () => {
            const propChangedSpy = jest.fn().mockName('propertyChangedEventSpy');
            window.addEventListener(PropertyChangedEvent.EVENT_NAME, propChangedSpy);

            const radio = getShadowRoot(waitTimeEvent).querySelector(selectors.lightningRadioGroup);
            const mockPayload = { value: WAIT_EVENT_TYPE.DIRECT_RECORD_TIME };
            const changedEvent = new CustomEvent('change', { detail: mockPayload});
            radio.dispatchEvent(changedEvent);
            return Promise.resolve().then(() => {
                expect(propChangedSpy.mock.calls[0][0].detail.propertyName).toEqual('eventType');
                expect(propChangedSpy.mock.calls[0][0].detail.value).toEqual(mockPayload.value);
            });
        });

        it('fires UpdateParameterItemEvent on combobox state changed', () => {
            const mockFerov = { value: 'foo', dataType: 'sfdcDatType' };
            getFerovInfoFromComboboxItem.mockReturnValueOnce(mockFerov);
            const mockItem = { value: 'foo', displayText: 'foo bar' };
            const comboboxStateChanged = new ComboboxStateChangedEvent(mockItem);

            const updateParameterSpy = jest.fn();

            window.addEventListener(UpdateParameterItemEvent.EVENT_NAME, updateParameterSpy);
            const picker = getShadowRoot(waitTimeEvent).querySelector(selectors.picker);
            picker.dispatchEvent(comboboxStateChanged);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(UpdateParameterItemEvent.EVENT_NAME);
                expect(updateParameterSpy.mock.calls[0][0].detail.value).toEqual(mockFerov.value);
                expect(updateParameterSpy.mock.calls[0][0].detail.valueDataType).toEqual(mockFerov.dataType);
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toEqual(true);
            });
        });
    });
});