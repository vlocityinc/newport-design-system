import {createElement} from 'lwc';
import WaitEvent from "builder_platform_interaction/waitEvent";
import {
    DeleteWaitEventEvent,
    PropertyChangedEvent,
    WaitEventPropertyChangedEvent,
    WaitEventParameterChangedEvent,
    UpdateParameterItemEvent,
} from "builder_platform_interaction/events";
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from "../waitEventLabels";
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));
jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));
jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder'));

jest.mock('builder_platform_interaction/conditionListUtils', () => {
    return {
        getConditionsWithPrefixes: jest.fn().mockName('getConditionsWithPrefixes'),
        showDeleteCondition: jest.fn().mockName('showDeleteCondition'),
    };
});

const waitEventWithOneConditional = {
    label: {value: 'Test Name of the Outcome'},
    name: {value: 'Test Dev Name'},
    guid: {value: '123'},
    conditionLogic: {value: '1'},
    conditions: [{name: 'condition1', rowIndex: 0}],
    eventType: { value: 'mockEventType' },
    inputParameters: [],
    outputParameters: {},
};

const waitEventWithInputParameters = {
    label: {value: 'Test Name of the Outcome'},
    name: {value: 'Test Dev Name'},
    guid: {value: '123'},
    conditionLogic: {value: '1'},
    eventType: { value: 'mockEventType' },
    inputParameters: [
        {name: {value: 'foo', error: null}, value: {value: 'bar', error: null}, valueDataType: {value: 'vdt', error: null}}
    ],
    outputParameters: {},
};

const selectors = {
    conditionList: 'builder_platform_interaction-condition-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeWaitEvent',
    waitResumeConditions: 'builder_platform_interaction-wait-resume-conditions',
    tab: 'lightning-tab',
    ferToFerovExpressionBuilder: 'builder_platform_interaction-fer-to-ferov-expression-builder',
};

const createComponentUnderTest = (waitEvent) => {
    const el = createElement('builder_platform_interaction-wait-event', {
        is: WaitEvent
    });

    el.waitEvent = waitEvent;
    el.showDelete = true;

    document.body.appendChild(el);

    return el;
};

describe('Wait Event', () => {
    describe('header section', () => {
        it('has name and api name component', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const labelAndNameComponents = getShadowRoot(element).querySelectorAll(selectors.labelAndName);
                expect(labelAndNameComponents).toHaveLength(1);
                expect(labelAndNameComponents[0].devName.value).toBe(waitEventWithOneConditional.name.value);
                expect(labelAndNameComponents[0].label.value).toBe(waitEventWithOneConditional.label.value);
            });
        });

        it('fires a waitEventPropertyChangedEvent with guid when a propertyChanged event is handled', () => {
            const newValue = 'newVal';

            const element = createComponentUnderTest(waitEventWithOneConditional);

            const waitEventEventCallback = jest.fn();
            element.addEventListener(WaitEventPropertyChangedEvent.EVENT_NAME, waitEventEventCallback);

            const propertyChangedEvent = new PropertyChangedEvent('label', newValue);
            const labelAndNameComponent = getShadowRoot(element).querySelector(selectors.labelAndName);
            labelAndNameComponent.dispatchEvent(propertyChangedEvent);

            expect(waitEventEventCallback).toHaveBeenCalled();

            expect(waitEventEventCallback.mock.calls[0][0]).toMatchObject({
                detail:{
                    propertyName: 'label',
                    value: newValue,
                    parentGUID: waitEventWithOneConditional.guid
                }
            });
        });

        it('has Remove button if show delete is true', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelectorAll(selectors.removeButton)[0];

                expect(removeButton.label).toBe(LABELS.deleteWaitEventLabel);
                expect(removeButton.title).toBe(LABELS.deleteWaitEventLabel);
            });
        });
        it('has no Remove button if show delete is false', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);
            element.showDelete = false;

            return Promise.resolve().then(() => {
                const removeButton = getShadowRoot(element).querySelector(selectors.removeButton);

                expect(removeButton).toBeNull();
            });
        });
    });

    describe('handleDelete', () => {
        it('fires deleteWaitEventEvent with wait event GUID', () => {
            const element = createComponentUnderTest(waitEventWithOneConditional);

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteWaitEventEvent.EVENT_NAME, eventCallback);

                const removeButton = getShadowRoot(element).querySelector(selectors.button);
                removeButton.click();

                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: element.waitEvent.guid
                    }
                });
            });
        });
    });

    describe('wait conditions', () => {
        let waitEvent;

        beforeEach(() => {
            waitEvent = createComponentUnderTest(waitEventWithOneConditional);
        });

        it('contains a condition list', () => {
            const conditionList = getShadowRoot(waitEvent).querySelector(selectors.conditionList);
            expect(conditionList).toBeDefined();
        });

        it('creates conditions with prefixes when it has condition logic and conditions', () => {
            expect(getConditionsWithPrefixes).toHaveBeenCalledWith(waitEventWithOneConditional.conditionLogic, waitEventWithOneConditional.conditions);
        });

        it('allows deletion of conditions when it has conditions', () => {
            getConditionsWithPrefixes.mockReturnValueOnce([{
                prefix: 'foo',
                condition: { rowIndex: 'bar' },
            }]);
            waitEvent = createComponentUnderTest(waitEventWithOneConditional);
            expect(showDeleteCondition).toHaveBeenCalledWith(waitEventWithOneConditional.conditions);
        });

        it('has AND, OR, NO_CONDITION, and CUSTOM_LOGIC options for wait criteria', () => {
            const conditionList = getShadowRoot(waitEvent).querySelector(selectors.conditionList);
            expect(conditionList.conditionLogicOptions).toEqual([
                expect.objectContaining({ value: CONDITION_LOGIC.NO_CONDITIONS }),
                expect.objectContaining({ value: CONDITION_LOGIC.AND }),
                expect.objectContaining({ value: CONDITION_LOGIC.OR }),
                expect.objectContaining({ value: CONDITION_LOGIC.CUSTOM_LOGIC }),
            ]);
        });

        it('dispatches a WaitEventPropertyChangedEvent on PropertyChangedEvent', () => {
            const conditionList = getShadowRoot(waitEvent).querySelector(selectors.conditionList);
            const propNameToUpdate = 'foo';
            const propChangedEvent = new PropertyChangedEvent(propNameToUpdate);
            const waitEventUpdateSpy = jest.fn();

            window.addEventListener(WaitEventPropertyChangedEvent.EVENT_NAME, waitEventUpdateSpy);
            conditionList.dispatchEvent(propChangedEvent);
            return Promise.resolve().then(() => {
                window.removeEventListener(WaitEventPropertyChangedEvent.EVENT_NAME, waitEventUpdateSpy);
                expect(waitEventUpdateSpy.mock.calls[0][0].type).toEqual(WaitEventPropertyChangedEvent.EVENT_NAME);
                expect(waitEventUpdateSpy.mock.calls[0][0].detail.propertyName).toEqual(propNameToUpdate);
            });
        });

        it('shows the error indicator in the wait conditions subtab when errors in conditions exist', () => {
            const conditionWithErorr = {
                name: 'condition1',
                rowIndex: 0,
                leftHandSide: { value: '{!foo}', error: 'someError' },
            };
            const waitEventWithErrorConditional = Object.assign({}, waitEventWithOneConditional, { conditions: [conditionWithErorr] });
            waitEvent = createComponentUnderTest(waitEventWithErrorConditional);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[0].showErrorIndicator).toEqual(true);
            });
        });

        it('shows the error indicator in the wait conditions subtab when errors in conditionLogic exist', () => {
            const conditionLogicWithError = { value: '1', error: 'some error' };
            const waitEventWithErrorConditionLogic = Object.assign({}, waitEventWithOneConditional, { conditionLogic: conditionLogicWithError });
            waitEvent = createComponentUnderTest(waitEventWithErrorConditionLogic);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[0].showErrorIndicator).toEqual(true);
            });
        });

        it('does not show the error indicator in the wait conditions subtab when there is no error', () => {
            const conditionWithNoErorr = {
                name: 'condition1',
                rowIndex: 0,
                leftHandSide: { value: '{!foo}', error: null },
            };
            const conditionLogicWithNoError = { value: '1', error: null };
            const waitEventWithErrorConditional = Object.assign({}, waitEventWithOneConditional, { conditions: [conditionWithNoErorr], conditionLogic: conditionLogicWithNoError });
            waitEvent = createComponentUnderTest(waitEventWithErrorConditional);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[0].showErrorIndicator).toEqual(false);
            });
        });

        it('sets the default operator to EqualTo', () => {
            getConditionsWithPrefixes.mockReturnValueOnce([{
                prefix: 'foo',
                condition: { rowIndex: 'bar' },
            }]);
            waitEvent = createComponentUnderTest(waitEventWithOneConditional);
            const ferToFerovExpressionBuilder = waitEvent.shadowRoot.querySelector(selectors.ferToFerovExpressionBuilder);
            expect(ferToFerovExpressionBuilder.defaultOperator).toEqual(RULE_OPERATOR.EQUAL_TO);
        });
    });

    describe('resume conditions', () => {
        let waitEvent;
        const waitEventParameterSpy = jest.fn().mockName('waitEventParameterChangedEventSpy');
        const waitEventPropertySpy = jest.fn().mockName('waitEventPropertyChangedEventSpy');

        beforeEach(() => {
            waitEvent = createComponentUnderTest(waitEventWithInputParameters);
            window.addEventListener(WaitEventPropertyChangedEvent.EVENT_NAME, waitEventPropertySpy);
            window.addEventListener(WaitEventParameterChangedEvent.EVENT_NAME, waitEventParameterSpy);
        });

        afterEach(() => {
            window.removeEventListener(WaitEventPropertyChangedEvent.EVENT_NAME, waitEventPropertySpy);
            window.removeEventListener(WaitEventParameterChangedEvent.EVENT_NAME, waitEventParameterSpy);
        });

        it('passes inputParameters to to the waitResumeConditions component', () => {
            const waitResumeConditions = getShadowRoot(waitEvent).querySelector(selectors.waitResumeConditions);
            expect(waitResumeConditions.resumeTimeParameters).toEqual(waitEventWithInputParameters.inputParameters);
        });

        it('passes eventType to the waitResumeConditions component', () => {
            const waitResumeConditions = getShadowRoot(waitEvent).querySelector(selectors.waitResumeConditions);
            expect(waitResumeConditions.eventType).toEqual(waitEventWithInputParameters.eventType);
        });

        it('handles PropertyChangedEvent from waitResumeConditions and fires WaitEventPropertyChangedEvent', () => {
            const propertyChanged = new PropertyChangedEvent();

            const waitResumeConditions = getShadowRoot(waitEvent).querySelector(selectors.waitResumeConditions);
            waitResumeConditions.dispatchEvent(propertyChanged);

             return Promise.resolve().then(() => {
                expect(waitEventPropertySpy).toHaveBeenCalled();
            });
        });

        it('handles UpdateParameterItem from waitResumeConditions and fires WaitEventParameterChangedEvent', () => {
            const isInput = true;
            const error = 'an error';
            const propName = {
                value: 'foo',
                error: null
            };
            const newValue = {
                value: 'my new value',
                error
            };
            const newValueDataType = {
                value: 'sfdcDataType',
                error: null
            };
            const parameterChanged = new UpdateParameterItemEvent(isInput, null, propName.value, newValue.value, newValueDataType.value, error);

            const waitResumeConditions = getShadowRoot(waitEvent).querySelector(selectors.waitResumeConditions);
            waitResumeConditions.dispatchEvent(parameterChanged);

             return Promise.resolve().then(() => {
                expect(waitEventParameterSpy.mock.calls[0][0].type).toEqual(WaitEventParameterChangedEvent.EVENT_NAME);
                expect(waitEventParameterSpy.mock.calls[0][0].detail.isInputParameter).toEqual(isInput);
                expect(waitEventParameterSpy.mock.calls[0][0].detail.name).toEqual(propName);
                expect(waitEventParameterSpy.mock.calls[0][0].detail.value).toEqual(newValue);
                expect(waitEventParameterSpy.mock.calls[0][0].detail.valueDataType).toEqual(newValueDataType);
                expect(waitEventParameterSpy.mock.calls[0][0].detail.error).toEqual(error);
            });
        });

        it('shows the error indicator in the resume conditions subtab when errors exist in inputParamters', () => {
            const inputParameterWithError = {
                name: {value: 'foo', error: null},
                value: {value: 'bar', error: 'some error'},
                valueDataType: {value: 'vdt', error: null}
            };
            const waitEventWithErrorInputParameters = Object.assign({}, waitEventWithInputParameters, { inputParameters: [inputParameterWithError] });
            waitEvent = createComponentUnderTest(waitEventWithErrorInputParameters);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[1].showErrorIndicator).toEqual(true);
            });
        });

        it('shows the error indicator in the resume conditions subtab when errors exist in outputParameters', () => {
            const outputParameterWithError = {
                name: {value: 'foo', error: null},
                value: {value: 'bar', error: 'some error'},
                valueDataType: {value: 'vdt', error: null}
            };
            const waitEventWithErrorOutputParameters = Object.assign({}, waitEventWithInputParameters, { inputParameters: [outputParameterWithError] });
            waitEvent = createComponentUnderTest(waitEventWithErrorOutputParameters);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[1].showErrorIndicator).toEqual(true);
            });
        });

        it('shows the error indicator in the resume conditions subtab when errors exist in eventType', () => {
            const eventTypeWithError = { value: 'someEventType', error: 'some error' };
            const waitEventWithErrorOutputParameters = Object.assign({}, waitEventWithInputParameters, { eventType: eventTypeWithError });
            waitEvent = createComponentUnderTest(waitEventWithErrorOutputParameters);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[1].showErrorIndicator).toEqual(true);
            });
        });

        it('does not show the error indicator in the resume conditions subtab when there is no error', () => {
            const inputParameterWithNoError = {
                name: {value: 'foo', error: null},
                value: {value: 'bar', error: null},
                valueDataType: {value: 'vdt', error: null}
            };
            const outputParameterWithNoError = {
                name: {value: 'foo', error: null},
                value: {value: 'bar', error: null},
                valueDataType: {value: 'vdt', error: null}
            };
            const eventTypeWithNoError = { value: 'someEventType', error: null };
            const waitEventWithErrorConditional = Object.assign({}, waitEventWithOneConditional, { inputParameters: [inputParameterWithNoError], outputParameters: [outputParameterWithNoError], eventType: eventTypeWithNoError });
            waitEvent = createComponentUnderTest(waitEventWithErrorConditional);
            const tabs = getShadowRoot(waitEvent).querySelectorAll(selectors.tab);
            return Promise.resolve().then(() => {
                expect(tabs[1].showErrorIndicator).toEqual(false);
            });
        });
    });
});