import { createElement } from 'lwc';
import {
    WAIT_TIME_EVENT_TYPE,
    WAIT_EVENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    UpdateParameterItemEvent,
    ComboboxStateChangedEvent,
    UpdateWaitEventEventTypeEvent
} from 'builder_platform_interaction/events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getFerovInfoAndErrorFromEvent } from 'builder_platform_interaction/expressionUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import WaitTimeEvent from '../waitTimeEvent';
import {
    getRulesForElementType,
    RULE_TYPES
} from 'builder_platform_interaction/ruleLib';

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const createComponentUnderTest = props => {
    let el = createElement('builder_platform_interaction-wait-time-event', {
        is: WaitTimeEvent
    });
    el = Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    picker: 'builder_platform_interaction-ferov-resource-picker',
    parameterItem: 'builder_platform_interaction-parameter-item',
    lightningRadioGroup: 'lightning-radio-group',
    lightningInput: 'lightning-input'
};

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getFerovInfoAndErrorFromEvent: jest
            .fn()
            .mockName('getFerovInfoAndErrorFromEvent')
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        getRulesForElementType: jest
            .fn()
            .mockImplementation(() => ['foo'])
            .mockName('getRulesForElementType'),
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
        RULE_TYPES: actual.RULE_TYPES
    };
});

describe('waitTimeEvent', () => {
    let getRulesForElementTypeParameters;

    beforeAll(() => {
        getRulesForElementTypeParameters = getRulesForElementType.mock.calls[0];
    });

    it('calls getRulesForElementType to fetch rules of type ASSIGNMENT for WAIT', () => {
        expect(getRulesForElementTypeParameters).toEqual([
            RULE_TYPES.ASSIGNMENT,
            ELEMENT_TYPE.WAIT
        ]);
    });

    describe('absolute resume time parameters', () => {
        let waitTimeEvent;
        let props;

        const propChangedSpy = jest.fn().mockName('propertyChangedEventSpy');
        const updateParameterSpy = jest
            .fn()
            .mockName('updateParameterEventSpy');
        const updateWaitEventEventTypeSpy = jest
            .fn()
            .mockName('updateWaitEventEventTypeSpy');

        beforeEach(() => {
            const mockResumeTimeParameters = [
                { name: 'foo' },
                { name: 'TimeOffset', value: -3 },
                { name: 'TimeOffsetUnit', value: 'Days' }
            ];
            const mockEventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
            props = {
                resumeTimeParameters: mockResumeTimeParameters,
                eventType: mockEventType
            };
            waitTimeEvent = createComponentUnderTest(props);
            window.addEventListener(
                PropertyChangedEvent.EVENT_NAME,
                propChangedSpy
            );
            window.addEventListener(
                UpdateParameterItemEvent.EVENT_NAME,
                updateParameterSpy
            );
            window.addEventListener(
                UpdateWaitEventEventTypeEvent.EVENT_NAME,
                updateWaitEventEventTypeSpy
            );
        });

        afterEach(() => {
            window.removeEventListener(
                PropertyChangedEvent.EVENT_NAME,
                propChangedSpy
            );
            window.removeEventListener(
                UpdateParameterItemEvent.EVENT_NAME,
                updateParameterSpy
            );
            window.removeEventListener(
                UpdateWaitEventEventTypeEvent.EVENT_NAME,
                updateWaitEventEventTypeSpy
            );
        });

        it('has a date time picker when absolute time is selected', () => {
            const picker = waitTimeEvent.shadowRoot.querySelector(
                selectors.picker
            );
            expect(picker.comboboxConfig.type).toEqual(
                FLOW_DATA_TYPE.DATE_TIME.value
            );
        });

        describe('absolute base time customValidity', () => {
            it('is set if an error is present', () => {
                const someError = 'someError';

                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: 'AlarmTime',
                        value: {
                            value: 'someValue',
                            error: someError
                        }
                    }
                ];

                return Promise.resolve().then(() => {
                    const absoluteBaseTimePicker = waitTimeEvent.shadowRoot.querySelector(
                        selectors.picker
                    );
                    expect(
                        absoluteBaseTimePicker.setCustomValidity
                    ).toHaveBeenCalledWith(someError);
                });
            });

            it('is set to an empty string if no error present', () => {
                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: 'AlarmTime',
                        value: {
                            value: 'someValue',
                            error: null
                        }
                    }
                ];

                return Promise.resolve().then(() => {
                    const absoluteBaseTimePicker = waitTimeEvent.shadowRoot.querySelector(
                        selectors.picker
                    );
                    expect(
                        absoluteBaseTimePicker.setCustomValidity
                    ).toHaveBeenCalledWith('');
                });
            });
        });

        it('allows sobjects in menudata, so the user can select an sobject field', () => {
            const picker = waitTimeEvent.shadowRoot.querySelector(
                selectors.picker
            );
            expect(picker.comboboxConfig.enableFieldDrilldown).toEqual(true);
        });

        it('loads the existing offset number and unit values', () => {
            const offsetNumber = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[0];
            expect(offsetNumber.value).toEqual(-3);
            const offsetUnit = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[1];
            expect(offsetUnit.value).toEqual('Days');
        });

        it('dispatches UpdateWaitEventEventTypeEvent when event type changes', () => {
            const radio = waitTimeEvent.shadowRoot.querySelector(
                selectors.lightningRadioGroup
            );
            const mockPayload = {
                value: WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME
            };
            const changedEvent = new CustomEvent('change', {
                detail: mockPayload
            });

            radio.dispatchEvent(changedEvent);
            return Promise.resolve().then(() => {
                expect(
                    updateWaitEventEventTypeSpy.mock.calls[0][0].detail
                        .propertyName
                ).toEqual(WAIT_EVENT_FIELDS.EVENT_TYPE);
                expect(
                    updateWaitEventEventTypeSpy.mock.calls[0][0].detail.value
                ).toEqual(mockPayload.value);
            });
        });

        it('fires UpdateParameterItemEvent on base time combobox state changed', () => {
            const mockFerov = { value: 'foo', dataType: 'sfdcDatType' };
            getFerovInfoAndErrorFromEvent.mockReturnValueOnce(mockFerov);
            const mockItem = { value: 'foo', displayText: 'foo bar' };
            const comboboxStateChanged = new ComboboxStateChangedEvent(
                mockItem
            );

            const picker = waitTimeEvent.shadowRoot.querySelector(
                selectors.picker
            );
            picker.dispatchEvent(comboboxStateChanged);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual(mockFerov.value);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual(mockFerov.dataType);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.isInput
                ).toEqual(true);
            });
        });

        it('fires UpdateParameterItemEvent on offset number focus out', () => {
            const focusOut = new CustomEvent('focusout');

            const offsetNumber = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[0];
            offsetNumber.reportValidity = jest.fn();
            offsetNumber.dispatchEvent(focusOut);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(
                    true
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual('Number');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual(-3);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.rowIndex
                ).toEqual(null);
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual(
                    'TimeOffset'
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.error
                ).toEqual(null);
            });
        });

        it('fires UpdateParameterItemEvent on offset unit focus out', () => {
            const focusOut = new CustomEvent('focusout');

            const offsetUnit = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[1];
            offsetUnit.dispatchEvent(focusOut);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(
                    true
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual('String');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual('Days');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.rowIndex
                ).toEqual(null);
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual(
                    'TimeOffsetUnit'
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.error
                ).toEqual(null);
            });
        });

        it('rules are given to the input parameters', () => {
            const picker = waitTimeEvent.shadowRoot.querySelector(
                selectors.picker
            );
            expect(picker.rules).toEqual(['foo']);
        });
    });

    describe('direct record time type time parameters', () => {
        let waitTimeEvent;
        let props;
        const directRecordSalesforceObject = 'TimeTableColumnEnumOrId';
        const directRecordBaseTime = 'TimeFieldColumnEnumOrId';
        const directRecordRecordId = 'EntityObjectId';

        const propChangedSpy = jest.fn().mockName('propertyChangedEventSpy');
        let updateParameterSpy;

        beforeEach(() => {
            const directRecordTimeTypeParameters = [
                { name: directRecordSalesforceObject, value: 'Account' },
                { name: directRecordBaseTime, value: 'LastModifiedDate' },
                { name: directRecordRecordId, value: '{!recId}' }
            ];
            const mockEventType = WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME;
            props = {
                resumeTimeParameters: directRecordTimeTypeParameters,
                eventType: mockEventType
            };
            waitTimeEvent = createComponentUnderTest(props);
            window.addEventListener(
                PropertyChangedEvent.EVENT_NAME,
                propChangedSpy
            );
            updateParameterSpy = jest.fn().mockName('updateParameterEventSpy');
            window.addEventListener(
                UpdateParameterItemEvent.EVENT_NAME,
                updateParameterSpy
            );
        });

        afterEach(() => {
            window.removeEventListener(
                PropertyChangedEvent.EVENT_NAME,
                propChangedSpy
            );
            window.removeEventListener(
                UpdateParameterItemEvent.EVENT_NAME,
                updateParameterSpy
            );
        });

        describe('direct record time custom validity', () => {
            let value;
            beforeEach(() => {
                value = {
                    value: 'someValue',
                    error: 'someError'
                };
            });
            it('does not set an error on initial render', () => {
                waitTimeEvent = createComponentUnderTest(props);
                return Promise.resolve().then(() => {
                    const salesforceObject = waitTimeEvent.shadowRoot.querySelectorAll(
                        selectors.lightningInput
                    )[0];
                    expect(
                        salesforceObject.setCustomValidity
                    ).not.toHaveBeenCalled();
                });
            });
            it('sets an error if one is present on record name field', () => {
                value.error = 'someError';
                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: directRecordSalesforceObject,
                        value
                    }
                ];

                return Promise.resolve().then(() => {
                    const salesforceObject = waitTimeEvent.shadowRoot.querySelectorAll(
                        selectors.lightningInput
                    )[0];
                    expect(
                        salesforceObject.setCustomValidity
                    ).toHaveBeenCalledWith(value.error);
                });
            });

            it('sets an error if one is present on record date field', () => {
                value.error = 'someError';

                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: directRecordBaseTime,
                        value
                    }
                ];

                return Promise.resolve().then(() => {
                    const dateField = waitTimeEvent.shadowRoot.querySelectorAll(
                        selectors.lightningInput
                    )[1];
                    expect(dateField.setCustomValidity).toHaveBeenCalledWith(
                        value.error
                    );
                });
            });

            it('is set to an empty string if no error present and element was previously in error state', () => {
                const salesforceObject = waitTimeEvent.shadowRoot.querySelectorAll(
                    selectors.lightningInput
                )[0];
                salesforceObject.validity = { customError: true };
                value.error = null;

                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: directRecordSalesforceObject,
                        value
                    }
                ];

                return Promise.resolve().then(() => {
                    expect(
                        salesforceObject.setCustomValidity
                    ).toHaveBeenCalledWith('');
                });
            });

            it('does not set an error if one is not present and element was previously in valid state', () => {
                const salesforceObject = waitTimeEvent.shadowRoot.querySelectorAll(
                    selectors.lightningInput
                )[0];
                salesforceObject.validity = { customError: false };
                value.error = null;

                waitTimeEvent.resumeTimeParameters = [
                    {
                        name: directRecordSalesforceObject,
                        value
                    }
                ];

                return Promise.resolve().then(() => {
                    expect(
                        salesforceObject.setCustomValidity
                    ).not.toHaveBeenCalled();
                });
            });
        });

        it('fires UpdateParameterItemEvent on salesforceObject focus out', () => {
            const focusOut = new CustomEvent('focusout');

            const salesforceObject = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[0];
            salesforceObject.dispatchEvent(focusOut);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(
                    true
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual(
                    directRecordSalesforceObject
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual('String');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual('Account');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.rowIndex
                ).toEqual(null);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.error
                ).toEqual(null);
            });
        });

        it('fires UpdateParameterItemEvent on basetime focus out', () => {
            const focusOut = new CustomEvent('focusout');

            const baseTime = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.lightningInput
            )[1];
            baseTime.dispatchEvent(focusOut);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.isInput).toBe(
                    true
                );
                expect(updateParameterSpy.mock.calls[0][0].detail.name).toEqual(
                    directRecordBaseTime
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual('String');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual('LastModifiedDate');
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.rowIndex
                ).toEqual(null);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.error
                ).toEqual(null);
            });
        });

        it('fires UpdateParameterItemEvent on recordId combobox state changed', () => {
            const mockFerov = { value: 'recordId', dataType: 'String' };
            getFerovInfoAndErrorFromEvent.mockReturnValueOnce(mockFerov);
            const mockItem = {
                value: 'newRecordId',
                displayText: 'newRecordId'
            };
            const comboboxStateChanged = new ComboboxStateChangedEvent(
                mockItem
            );

            const picker = waitTimeEvent.shadowRoot.querySelector(
                selectors.picker
            );
            picker.dispatchEvent(comboboxStateChanged);

            return Promise.resolve().then(() => {
                expect(updateParameterSpy.mock.calls[0][0].type).toEqual(
                    UpdateParameterItemEvent.EVENT_NAME
                );
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.value
                ).toEqual(mockFerov.value);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.valueDataType
                ).toEqual(mockFerov.dataType);
                expect(
                    updateParameterSpy.mock.calls[0][0].detail.isInput
                ).toEqual(true);
            });
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
                { name: 'AlarmTime', value: 'bar' },
                { name: 'Status', value: 'foo' }
            ];
            props = {
                outputParameters: mockOutputParameters,
                eventType: mockEventType
            };
            waitTimeEvent = createComponentUnderTest(props);
            resumeTimeParam = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.parameterItem
            )[0];
            eventDeliveryStatus = waitTimeEvent.shadowRoot.querySelectorAll(
                selectors.parameterItem
            )[1];
        });

        it('has an optional resumeTime output parameter of type dateTime', () => {
            expect(resumeTimeParam.item.isRequired).toEqual(false);
            expect(resumeTimeParam.item.dataType).toEqual(
                FLOW_DATA_TYPE.DATE_TIME.value
            );
            expect(resumeTimeParam.item.isInput).toEqual(false);
        });

        // it('sets the resumeTimeParameter value to the value of output parameters passed in through props', () => {
        //     expect(resumeTimeParam.item.value).toEqual(mockOutputParameters[0].value);
        // });

        it('has an optional eventDeliveryStatus output parameter of type string', () => {
            expect(eventDeliveryStatus.item.isRequired).toEqual(false);
            expect(eventDeliveryStatus.item.dataType).toEqual(
                FLOW_DATA_TYPE.STRING.value
            );
            expect(eventDeliveryStatus.item.isInput).toEqual(false);
        });
    });
});
