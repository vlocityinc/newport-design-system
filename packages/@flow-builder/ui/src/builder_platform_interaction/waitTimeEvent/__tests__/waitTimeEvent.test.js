import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { WAIT_TIME_EVENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    UpdateParameterItemEvent,
    ComboboxStateChangedEvent,
} from "builder_platform_interaction/events";
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFerovInfoFromComboboxItem } from 'builder_platform_interaction/expressionUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import WaitTimeEvent from '../waitTimeEvent';

import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';

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
    parameterItem: 'builder_platform_interaction-parameter-item',
    lightningRadioGroup: 'lightning-radio-group',
    lightningInput: 'lightning-input',
};

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getFerovInfoFromComboboxItem: jest.fn().mockName('getFerovInfoFromComboboxItem'),
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getRulesForElementType: jest.fn().mockImplementation(() => ['foo']).mockName('getRulesForElementType'),
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
        RULE_TYPES: require.requireActual('builder_platform_interaction/ruleLib').RULE_TYPES,
    };
});

describe('waitTimeEvent', () => {
    let getRulesForElementTypeParameters;

    beforeAll(() => {
        getRulesForElementTypeParameters = getRulesForElementType.mock.calls[0];
    });

    it('calls getRulesForElementType to fetch rules of type ASSIGNMENT for WAIT', () => {
        expect(getRulesForElementTypeParameters).toEqual([RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.WAIT]);
    });

    describe('resume time parameters', () => {
        let waitTimeEvent;
        let props;
        const errorMessage = 'bad';

        const propChangedSpy = jest.fn().mockName('propertyChangedEventSpy');
        let updateParameterSpy;

        beforeEach(() => {
            const mockResumeTimeParameters = [
                { name: 'foo'},
                { name: 'TimeOffset', value: -3},
                { name: 'TimeOffsetUnit', value: 'Days'}];
            const mockEventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
            props = {
                resumeTimeParameters: mockResumeTimeParameters,
                eventType: mockEventType,
            };
            waitTimeEvent = createComponentUnderTest(props);
            window.addEventListener(PropertyChangedEvent.EVENT_NAME, propChangedSpy);
            updateParameterSpy = jest.fn().mockName('updateParameterEventSpy');
            window.addEventListener(UpdateParameterItemEvent.EVENT_NAME, updateParameterSpy);
        });

        afterEach(() => {
            window.removeEventListener(PropertyChangedEvent.EVENT_NAME, propChangedSpy);
            window.removeEventListener(UpdateParameterItemEvent.EVENT_NAME, updateParameterSpy);
        });

        it('has a date time picker when absolute time is selected', () => {
            const picker = getShadowRoot(waitTimeEvent).querySelector(selectors.picker);
            expect(picker.comboboxConfig.type).toEqual(FLOW_DATA_TYPE.DATE_TIME.value);
        });

        it('loads the existing offset number and unit values', () => {
            const offsetNumber = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.lightningInput)[0];
            expect(offsetNumber.value).toEqual(-3);
            const offsetUnit = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.lightningInput)[1];
            expect(offsetUnit.value).toEqual('Days');
        });

        it('dispatches PropertyChangedEvent when event type changes', () => {
            const radio = getShadowRoot(waitTimeEvent).querySelector(selectors.lightningRadioGroup);
            const mockPayload = { value: WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME };
            const changedEvent = new CustomEvent('change', { detail: mockPayload});

            radio.dispatchEvent(changedEvent);
            return Promise.resolve().then(() => {
                expect(propChangedSpy.mock.calls[0][0].detail.propertyName).toEqual('eventType');
                expect(propChangedSpy.mock.calls[0][0].detail.value).toEqual(mockPayload.value);
            });
        });

        it('fires UpdateParameterItemEvent on base time combobox state changed', () => {
            const mockFerov = { value: 'foo', dataType: 'sfdcDatType' };
            getFerovInfoFromComboboxItem.mockReturnValueOnce(mockFerov);
            const mockItem = { value: 'foo', displayText: 'foo bar' };
            const comboboxStateChanged = new ComboboxStateChangedEvent(mockItem);

            const picker = getShadowRoot(waitTimeEvent).querySelector(selectors.picker);
            picker.dispatchEvent(comboboxStateChanged);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(UpdateParameterItemEvent.EVENT_NAME);
                expect(updateParameterSpy.mock.calls[0][0].detail.value).toEqual(mockFerov.value);
                expect(updateParameterSpy.mock.calls[0][0].detail.valueDataType).toEqual(mockFerov.dataType);
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toEqual(true);
            });
        });

        it('fires UpdateParameterItemEvent on offset number blur', () => {
            const blurEvent = new CustomEvent('blur', {
                detail: {value: 1000, error: errorMessage},
            });

            const offsetNumber = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.lightningInput)[0];
            offsetNumber.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(UpdateParameterItemEvent.EVENT_NAME);
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(true);
                expect(updateParameterSpy.mock.calls[0][0].detail.valueDataType).toEqual('Number');
                expect(updateParameterSpy.mock.calls[0][0].detail.value).toEqual(1000);
                expect(updateParameterSpy.mock.calls[0][0].detail.rowIndex).toEqual(null);
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual('TimeOffset');
                expect(updateParameterSpy.mock.calls[0][0].detail.error).toEqual(errorMessage);
            });
        });

        it('fires UpdateParameterItemEvent on offset unit blur', () => {
            const blurEvent = new CustomEvent('blur', {
                detail: {value: 'Hours', error: errorMessage},
            });

            const offsetUnit = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.lightningInput)[1];
            offsetUnit.dispatchEvent(blurEvent);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(UpdateParameterItemEvent.EVENT_NAME);
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(true);
                expect(updateParameterSpy.mock.calls[0][0].detail.valueDataType).toEqual('String');
                expect(updateParameterSpy.mock.calls[0][0].detail.value).toEqual('Hours');
                expect(updateParameterSpy.mock.calls[0][0].detail.rowIndex).toEqual(null);
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual('TimeOffsetUnit');
                expect(updateParameterSpy.mock.calls[0][0].detail.error).toEqual(errorMessage);
            });
        });

        it('rules are given to the input parameters', () => {
            const picker = getShadowRoot(waitTimeEvent).querySelector(selectors.picker);
            expect(picker.rules).toEqual(['foo']);
        });
    });

    describe('output parameters', () => {
        let waitTimeEvent;
        let resumeTimeParam;
        let eventDeliveryStatus;
        let props;
        let mockOutputParameters;

        beforeEach(() => {
            const mockEventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
            mockOutputParameters = [
                {name: 'AlarmTime', value: 'bar'},
                {name: 'Status', value: 'foo'},
            ];
            props = {
                outputParameters: mockOutputParameters,
                eventType: mockEventType,
            };
            waitTimeEvent = createComponentUnderTest(props);
            resumeTimeParam = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.parameterItem)[0];
            eventDeliveryStatus = getShadowRoot(waitTimeEvent).querySelectorAll(selectors.parameterItem)[1];
        });

        it('has an optional resumeTime output parameter of type dateTime', () => {
            expect(resumeTimeParam.item.isRequired).toEqual(false);
            expect(resumeTimeParam.item.dataType).toEqual(FLOW_DATA_TYPE.DATE_TIME.value);
            expect(resumeTimeParam.item.isInput).toEqual(false);
        });

        // it('sets the resumeTimeParameter value to the value of output parameters passed in through props', () => {
        //     expect(resumeTimeParam.item.value).toEqual(mockOutputParameters[0].value);
        // });

        it('has an optional eventDeliveryStatus output parameter of type string', () => {
            expect(eventDeliveryStatus.item.isRequired).toEqual(false);
            expect(eventDeliveryStatus.item.dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
            expect(eventDeliveryStatus.item.isInput).toEqual(false);
        });
    });
});