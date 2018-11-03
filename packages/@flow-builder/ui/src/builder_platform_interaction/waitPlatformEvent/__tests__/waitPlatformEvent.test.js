import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitPlatformEvent from '../waitPlatformEvent';
import { CONDITION_LOGIC, ELEMENT_TYPE, WAIT_EVENT_FIELDS } from 'builder_platform_interaction/flowMetadata';
import { getInputParametersForEventType } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from "../waitPlatformEventLabels";
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { WAIT_TIME_EVENT_TYPE } from '../../flowMetadata/flowMetadata';
import {
    UpdateWaitEventEventTypeEvent,
    ComboboxStateChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    WaitEventAddParameterEvent,
    WaitEventDeleteParameterEvent,
    WaitEventParameterChangedEvent,
} from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEventTypes: require.requireActual('builder_platform_interaction/sobjectLib').getEventTypes,
        getInputParametersForEventType: jest.fn().mockName('getInputParametersForEventType')
    };
});

const SELECTORS = {
    CONDITION_LIST: 'builder_platform_interaction-condition-list',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    PARAMETER_ITEM: 'builder_platform_interaction-parameter-item',
    FILTER_EXPRESSION_BUILDER: 'builder_platform_interaction-field-to-ferov-expression-builder',
    ROW: 'builder_platform_interaction-row'
};

const setupComponentUnderTest = (props) => {
    let element = createElement('builder_platform_interaction-wait-platform-event', {
        is: WaitPlatformEvent,
    });
    element = Object.assign(element, props);

    document.body.appendChild(element);
    return element;
};

describe('wait-platform-event', () => {
    describe('event type', () => {
        const updateWaitEventTypeHandler = jest.fn();

        beforeEach(() => {
            window.addEventListener(UpdateWaitEventEventTypeEvent.EVENT_NAME, updateWaitEventTypeHandler);
        });

        afterEach(() => {
            window.removeEventListener(UpdateWaitEventEventTypeEvent.EVENT_NAME, updateWaitEventTypeHandler);
        });

        it('is not set for a wait time event type', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                eventType : 'foo__e'
            });

            waitPlatformEventElement.eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME;
            expect(waitPlatformEventElement.eventType).toBe('foo__e');
        });

        it('is set for a a non wait time event type', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                eventType : 'foo__e'
            });

            waitPlatformEventElement.eventType = 'foo1__e';
            expect(waitPlatformEventElement.eventType).toBe('foo1__e');
        });

        it('updates the filter fields based on call to getInputParametersForEventType', () => {
            const filterFields = {
                a: {},
                b: {}
            };

            getInputParametersForEventType.mockImplementationOnce((eventType, callback) => {
                callback(filterFields);
            });

            const someEventType = {value: 'foo', error: null};

            const waitPlatformEventElement = setupComponentUnderTest({
                waitEventGuid: 'guid',
                eventType: someEventType,
                inputFilterParameters: [
                    {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    }
                ]
            });

            expect(getInputParametersForEventType).toHaveBeenCalledWith(someEventType.value, expect.any(Function));

            return Promise.resolve().then(() => {
                const filterExpressionBuilder = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.FILTER_EXPRESSION_BUILDER);
                expect(filterExpressionBuilder.lhsFields).toEqual(filterFields);
            });
        });

        it('fires UpdateWaitEventEventTypeEvent when event type is changed', () => {
            const platformEvent = 'foo__e';
            const platformEventUpdated = 'foo1__e';
            const waitPlatformEventElement = setupComponentUnderTest({
                eventType : platformEvent
            });
            const entityResourcePicker = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
            entityResourcePicker.dispatchEvent(new ComboboxStateChangedEvent({value: 'foo1__e', displayText: 'foo1'}));
            expect(updateWaitEventTypeHandler.mock.calls[0][0].detail.oldValue).toBe(platformEvent);
            expect(updateWaitEventTypeHandler.mock.calls[0][0].detail.value).toBe(platformEventUpdated);
            expect(updateWaitEventTypeHandler.mock.calls[0][0].detail.propertyName).toBe(WAIT_EVENT_FIELDS.EVENT_TYPE);
            expect(updateWaitEventTypeHandler.mock.calls[0][0].detail.error).toBeNull();
        });
    });

    describe('inputFilterParameters', () => {
        it('condition logic options are NO CONDITIONS and AND', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                waitEventGuid: 'guid',
                eventType: {value: 'foo', error: null},
                inputFilterParameters: [
                    {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    }
                ]
            });

            const conditionList = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.CONDITION_LIST);
            const filterLogicOptions = conditionList.conditionLogicOptions;

            expect(filterLogicOptions).toMatchObject([
                {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.noConditionsLabel},
                {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel}
            ]);
        });

        describe('sets condition logic', () => {
            it('set to NO CONDITIONS if no input parameters are present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: 'foo', error: null},
                    inputFilterParameters: []
                });

                const conditionList = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.CONDITION_LIST);
                const filterLogic = conditionList.conditionLogic;

                expect(filterLogic).toEqual({ value: CONDITION_LOGIC.NO_CONDITIONS});
            });

            it('set to AND if input parameters are present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: 'foo', error: null},
                    inputFilterParameters: [
                        {
                            name: 'a',
                            value: 'v',
                            valueDataType: 'vdt',
                            rowIndex: 'ri'
                        }
                    ]
                });

                const conditionList = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.CONDITION_LIST);
                const filterLogic = conditionList.conditionLogic;

                expect(filterLogic).toEqual({ value: CONDITION_LOGIC.AND});
            });
        });

        it('one filter per inputFilterParameters', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                waitEventGuid: 'guid',
                eventType: {value: 'foo', error: null},
                inputFilterParameters: [
                    {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    },
                    {
                        name: 'b',
                        value: 'vb',
                        valueDataType: 'vdt2',
                        rowIndex: 'ri2'
                    }
                ]
            });

            const rows = getShadowRoot(waitPlatformEventElement).querySelectorAll(SELECTORS.ROW);
            expect(rows).toHaveLength(2);
        });

        describe('showDelete', () => {
            it('is false if only one filter is present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: 'foo', error: null},
                    inputFilterParameters: [
                        {
                            name: 'a',
                            value: 'v',
                            valueDataType: 'vdt',
                            rowIndex: 'ri'
                        }
                    ]
                });

                const row = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ROW);

                expect(row.showDelete).toBeFalsy();
            });

            it('is true if only multiple filters are present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: 'foo', error: null},
                    inputFilterParameters: [
                        {
                            name: 'a',
                            value: 'v',
                            valueDataType: 'vdt',
                            rowIndex: 'ri'
                        },
                        {
                            name: 'b',
                            value: 'vb',
                            valueDataType: 'vdt2',
                            rowIndex: 'ri2'
                        }
                    ]
                });

                const row = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ROW);

                expect(row.showDelete).toBeTruthy();
            });
        });

        describe('expression builder', () => {
            it('expression set from inputFilterParameters', () => {
                const inputFilterParameter = {
                    name: {
                        value: 'a',
                        error: 'nameError'
                    },
                    value: {
                        value: 'v',
                        error: 'valueError'
                    },
                    valueDataType: {
                        value: 'vdt',
                        error: 'vdtError'
                    },
                    rowIndex: 'ri'
                };

                const eventTypeValue = 'foo';

                const waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: eventTypeValue, error: null},
                    inputFilterParameters: [inputFilterParameter]
                });

                const filterExpressionBuilder = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.FILTER_EXPRESSION_BUILDER);
                const expression = filterExpressionBuilder.expression;

                expect(expression).toMatchObject({
                    leftHandSide: {
                        value: inputFilterParameter.name.value,
                        error: inputFilterParameter.name.error,
                    },
                    rightHandSide: {
                        value: inputFilterParameter.value.value,
                        error: inputFilterParameter.value.error
                    },
                    rightHandSideDataType: {
                        value: inputFilterParameter.valueDataType.value,
                        error: inputFilterParameter.valueDataType.error
                    }
                });
            });
        });

        describe('events testing', () => {
            const waitEventAddParameterSpy = jest.fn();
            const waitEventDeleteParameterSpy = jest.fn();
            const waitEventParameterChangedSpy = jest.fn();

            const eventTypeValue = 'foo';
            const parentGuid = 'guid1';
            let filterExpressionBuilder;
            let waitPlatformEventElement;

            beforeEach(() => {
                waitPlatformEventElement = setupComponentUnderTest({
                    waitEventGuid: 'guid',
                    eventType: {value: eventTypeValue, error: null},
                    inputFilterParameters: [{
                        name: {
                            value: 'a',
                            error: 'nameError'
                        },
                        value: {
                            value: 'v',
                            error: 'valueError'
                        },
                        valueDataType: {
                            value: 'vdt',
                            error: 'vdtError'
                        },
                        rowIndex: 'ri'
                    }],
                });

                window.addEventListener(WaitEventAddParameterEvent.EVENT_NAME, waitEventAddParameterSpy);
                window.addEventListener(WaitEventDeleteParameterEvent.EVENT_NAME, waitEventDeleteParameterSpy);
                window.addEventListener(WaitEventParameterChangedEvent.EVENT_NAME, waitEventParameterChangedSpy);

                filterExpressionBuilder = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.FILTER_EXPRESSION_BUILDER);
            });

            afterEach(() => {
                window.removeEventListener(WaitEventAddParameterEvent.EVENT_NAME, waitEventAddParameterSpy);
                window.removeEventListener(WaitEventDeleteParameterEvent.EVENT_NAME, waitEventDeleteParameterSpy);
                window.removeEventListener(WaitEventParameterChangedEvent.EVENT_NAME, waitEventParameterChangedSpy);
            });

            it('fires WaitEventAddParameterEvent on add condition', () => {
                filterExpressionBuilder.dispatchEvent(new AddConditionEvent(parentGuid));
                expect(waitEventAddParameterSpy.mock.calls[0][0].detail.name).toBeNull();
                expect(waitEventAddParameterSpy.mock.calls[0][0].detail.parentGUID).toBe(parentGuid);
                expect(waitEventAddParameterSpy.mock.calls[0][0].detail.isInputParameter).toBe(true);
            });

            it('fires WaitEventDeleteParameterEvent on delete condition', () => {
                filterExpressionBuilder.dispatchEvent(new DeleteConditionEvent(parentGuid, 0));
                expect(waitEventDeleteParameterSpy.mock.calls[0][0].detail.name).toBeNull();
                expect(waitEventDeleteParameterSpy.mock.calls[0][0].detail.parentGUID).toBe(parentGuid);
                expect(waitEventDeleteParameterSpy.mock.calls[0][0].detail.isInputParameter).toBe(true);
                expect(waitEventDeleteParameterSpy.mock.calls[0][0].detail.index).toBe(0);
            });

            it('fires WaitEventParameterChangedEvent on update condition', () => {
                const updatedValue = {
                    leftHandSide: {value: 'lhs', error: null},
                    rightHandSide: {value: 'rhs', error: null},
                    rightHandSideDataType: {value: 'rhsdt', error: null},
                };
                filterExpressionBuilder.dispatchEvent(new UpdateConditionEvent(parentGuid, 0, updatedValue));
                expect(waitEventParameterChangedSpy.mock.calls[0][0].detail.name).toEqual(updatedValue.leftHandSide);
                expect(waitEventParameterChangedSpy.mock.calls[0][0].detail.value).toEqual(updatedValue.rightHandSide);
                expect(waitEventParameterChangedSpy.mock.calls[0][0].detail.valueDataType).toEqual(updatedValue.rightHandSideDataType);
                expect(waitEventParameterChangedSpy.mock.calls[0][0].detail.parentGUID).toBe(parentGuid);
                expect(waitEventParameterChangedSpy.mock.calls[0][0].detail.isInputParameter).toBe(true);
            });
        });
    });

    describe('parameter output', () => {
        const platformEventName = 'foo__e';
        const expectedParameterItem = {
            objectType: platformEventName,
            name: platformEventName,
            label: LABELS.platformEventOutputLabel,
            iconName: "utility:events",
            dataType: FLOW_DATA_TYPE.SOBJECT.value,
        };

        it('is hidden if platform event is not selected', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                waitEventGuid: 'guid',
                inputFilterParameters: [],
                outputParameters: { platformEventName : {value: platformEventName, displayText: 'foo' }}
            });

            const parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);

            // output parameter item is not present initially
            expect(parameterItem).toBeNull();
        });

        it('is visible if a platform event is selected', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                waitEventGuid: 'guid',
                inputFilterParameters: [],
                outputParameters: { platformEventName : {value: platformEventName, displayText: 'foo' }}
            });

            // populate the event type and ensure that the parameterItem is now visible
            waitPlatformEventElement.eventType = { value: platformEventName, error: null };
            return Promise.resolve().then(() => {
                const parameterItemUpdated = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);
                expect(parameterItemUpdated).not.toBeNull();
                expect(parameterItemUpdated.elementType).toBe(ELEMENT_TYPE.WAIT);
                expect(parameterItemUpdated.item).toEqual(expectedParameterItem);
            });
        });

        it('is updated when event type is changed', () => {
            const updatedPlatformEventName = 'foo1__e';
            const waitPlatformEventElement = setupComponentUnderTest({
                eventType: platformEventName,
                waitEventGuid: 'guid',
                inputFilterParameters: [],
                outputParameters: { platformEventName : {value: platformEventName, displayText: 'foo' }}
            });

            // update the event type and the output parameter item should have the updated object type and name
            waitPlatformEventElement.eventType = { value: updatedPlatformEventName, error: null };
            return Promise.resolve().then(() => {
                const parameterItemUpdated = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);
                expect(parameterItemUpdated).not.toBeNull();
                expect(parameterItemUpdated.item.objectType).toEqual(updatedPlatformEventName);
                expect(parameterItemUpdated.item.name).toEqual(updatedPlatformEventName);
            });
        });
    });
});
