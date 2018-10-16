import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import WaitPlatformEvent from '../waitPlatformEvent';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import {LABELS} from "../waitPlatformEventLabels";

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEventTypes: require.requireActual('builder_platform_interaction/sobjectLib').getEventTypes,
        getFieldsForEntity: jest.fn((eventType, callback) => {
            callback([1, 2, 3]);
        }).mockName('getFieldsForEntity')
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
        it('updates the filter fields based on call to getFieldsForEntity', () => {
            const someEventType = {value: 'foo'};

            const waitPlatformEventElement = setupComponentUnderTest({
                parentGuid: 'guid',
                eventType: someEventType,
                resumeTimeParameters: {
                    a: {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    }
                }
            });

            const filterFields = [1, 2, 3];

            getFieldsForEntity.mockImplementationOnce((eventType, callback) => {
                callback(filterFields);
            });
            expect(getFieldsForEntity).toHaveBeenCalledWith(someEventType.value, expect.any(Function));

            return Promise.resolve().then(() => {
                const filterExpressionBuilder = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.FILTER_EXPRESSION_BUILDER);
                expect(filterExpressionBuilder.lhsFields).toEqual(filterFields);
            });
        });
    });

    describe('resumeTimeParameters', () => {
        it('condition logic options are NO CONDITIONS and AND', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                parentGuid: 'guid',
                eventType: {value: 'foo'},
                resumeTimeParameters: {
                    a: {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    }
                }
            });

            const conditionList = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.CONDITION_LIST);
            const filterLogicOptions = conditionList.conditionLogicOptions;

            expect(filterLogicOptions).toMatchObject([
                {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.noConditionsLabel},
                {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel}
            ]);
        });

        it('one filter per resumeTimeParameter', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                parentGuid: 'guid',
                eventType: {value: 'foo'},
                resumeTimeParameters: {
                    a: {
                        name: 'a',
                        value: 'v',
                        valueDataType: 'vdt',
                        rowIndex: 'ri'
                    },
                    b: {
                        name: 'b',
                        value: 'vb',
                        valueDataType: 'vdt2',
                        rowIndex: 'ri2'
                    }
                }
            });

            const rows = getShadowRoot(waitPlatformEventElement).querySelectorAll(SELECTORS.ROW);
            expect(rows).toHaveLength(2);
        });

        describe('showDelete', () => {
            it('is false if only one filter is present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    parentGuid: 'guid',
                    eventType: {value: 'foo'},
                    resumeTimeParameters: {
                        a: {
                            name: 'a',
                            value: 'v',
                            valueDataType: 'vdt',
                            rowIndex: 'ri'
                        }
                    }
                });

                const row = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ROW);

                expect(row.showDelete).toBeFalsy();
            });

            it('is true if only multiple filters are present', () => {
                const waitPlatformEventElement = setupComponentUnderTest({
                    parentGuid: 'guid',
                    eventType: {value: 'foo'},
                    resumeTimeParameters: {
                        a: {
                            name: 'a',
                            value: 'v',
                            valueDataType: 'vdt',
                            rowIndex: 'ri'
                        },
                        b: {
                            name: 'b',
                            value: 'v2',
                            valueDataType: 'vdt2',
                            rowIndex: 'ri2'
                        }
                    }
                });

                const row = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ROW);

                expect(row.showDelete).toBeTruthy();
            });
        });

        describe('expression builder', () => {
            it('expression set from resumeTimeParameter', () => {
                const resumeTimeParameter = {
                    name: 'a',
                    value: 'v',
                    valueDataType: 'vdt',
                    rowIndex: 'ri'
                };

                const waitPlatformEventElement = setupComponentUnderTest({
                    parentGuid: 'guid',
                    eventType: {value: 'foo'},
                    resumeTimeParameters: {a: resumeTimeParameter}
                });

                const filterExpressionBuilder = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.FILTER_EXPRESSION_BUILDER);
                const expression = filterExpressionBuilder.expression;

                expect(expression).toMatchObject({
                    leftHandSide: {
                        value: resumeTimeParameter.name,
                        error: null
                    },
                    rightHandSide: {
                        value: resumeTimeParameter.value,
                        error: null
                    },
                    rightHandSideDataType: {
                    value: resumeTimeParameter.valueDataType,
                        error: null
                    }
                });
            });
        });
    });

    describe('parameter output', () => {
        it('is hidden if platform event is not selected', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                parentGuid: 'guid',
                resumeTimeParameters: {}
            });

            const parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);

            // output parameter item is not present initially
            expect(parameterItem).toBeNull();
        });

        it('is visible if a platform event is selected', () => {
            const waitPlatformEventElement = setupComponentUnderTest({
                parentGuid: 'guid',
                resumeTimeParameters: {}
            });
            const eventTypePicker = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);

            const itemPayload = { objectType: 'foo__e' };
            eventTypePicker.dispatchEvent(new ComboboxStateChangedEvent(itemPayload));
            return Promise.resolve().then(() => {
                const parameterItem = getShadowRoot(waitPlatformEventElement).querySelector(SELECTORS.PARAMETER_ITEM);
                expect(parameterItem.item.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
                expect(parameterItem.item.objectType).toBe('foo__e');
                expect(parameterItem.elementType).toBe(ELEMENT_TYPE.WAIT);
            });
        });
    });
});
