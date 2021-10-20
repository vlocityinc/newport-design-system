// @ts-nocheck
import { createElement } from 'lwc';
import ConditionList from 'builder_platform_interaction/conditionList';
import {
    AddConditionEvent,
    AddListItemEvent,
    DeleteConditionEvent,
    DeleteListItemEvent,
    UpdateConditionEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from '../conditionListLabels';
import { focusoutEvent, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

const listWithThreeConditionals = {
    containerElementType: ELEMENT_TYPE.DECISION,
    parentGuid: { value: '123' },
    conditionLogicOptions: [
        { value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel },
        { value: CONDITION_LOGIC.OR, label: LABELS.orConditionLogicLabel },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: LABELS.customConditionLogicLabel
        }
    ],
    conditionLogic: { value: '1 and 2' },
    conditions: [
        { name: 'condition1', rowIndex: 0 },
        { name: 'condition2', rowIndex: 1 },
        { name: 'condition3', rowIndex: 2 }
    ]
};

const listForWaitWithNoConditions = {
    containerElementType: ELEMENT_TYPE.WAIT,
    parentGuid: { value: '123' },
    fields: { fakeFieldData: true },
    conditionLogicOptions: [
        { value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel },
        { value: CONDITION_LOGIC.OR, label: LABELS.orConditionLogicLabel },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: LABELS.customConditionLogicLabel
        }
    ],
    conditionLogic: { value: CONDITION_LOGIC.NO_CONDITIONS },
    conditions: [{ name: 'condition1', rowIndex: 0 }]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeOutcome',
    ferToFerov: 'builder_platform_interaction-fer-to-ferov-expression-builder',
    fieldToFerov: 'builder_platform_interaction-field-to-ferov-expression-builder'
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-condition-list', {
        is: ConditionList
    });

    el.containerElementType = ELEMENT_TYPE.DECISION;
    Object.assign(el, props);

    setDocumentBodyChildren(el);
    return el;
};

describe('Condition List', () => {
    describe('variant', () => {
        it('size_1_of_3 absent when large', async () => {
            const element = createComponentUnderTest({
                ...listWithThreeConditionals,
                variant: 'narrow'
            });
            expect(element.shadowRoot.querySelector('div.size_1_of_3')).toBeNull();
        });

        it('size_1_of_3 present by default', async () => {
            const element = createComponentUnderTest({
                ...listWithThreeConditionals
            });
            expect(element.shadowRoot.querySelector('div.size_1_of_3')).toBeNull();
        });
    });

    describe('handleAddCondition', () => {
        it('fires addConditionEvent with current outcome GUID', async () => {
            const element = createComponentUnderTest(listWithThreeConditionals);

            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new AddListItemEvent());

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    parentGUID: element.parentGuid
                }
            });
        });
    });

    describe('handleDeleteCondition', () => {
        it('fires deleteConditionEvent with outcome GUID and condition index', async () => {
            const indexToDelete = 300;

            const element = createComponentUnderTest(listWithThreeConditionals);

            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new DeleteListItemEvent(indexToDelete));

            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    parentGUID: element.parentGuid,
                    index: indexToDelete
                }
            });
        });
    });

    describe('handleUpdateCondition', () => {
        it('fires updateConditionEvent with parent GUID, condition index, a property name, value and error', async () => {
            const updateData = {
                index: 300,
                value: 'newVal'
            };

            const element = createComponentUnderTest(listWithThreeConditionals);

            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);

            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new UpdateListItemEvent(updateData.index, updateData.value, updateData.error));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    parentGUID: element.parentGuid,
                    index: updateData.index,
                    value: updateData.value
                }
            });
        });
    });

    describe('condition logic', () => {
        describe('NO_CONDITIONS', () => {
            it('should hide the custom logic input', async () => {
                const list = Object.assign({}, listForWaitWithNoConditions);
                const element = createComponentUnderTest(list);

                await ticks(1);
                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);
                expect(customLogicInput).toBeNull();
            });
        });
        it('should hide the list of conditions', async () => {
            const list = Object.assign({}, listWithThreeConditionals);
            list.conditionLogic = {
                value: CONDITION_LOGIC.NO_CONDITIONS
            };
            const element = createComponentUnderTest(list);

            await ticks(1);
            const customLogicInput = element.shadowRoot.querySelector(selectors.conditionList);
            expect(customLogicInput).toBeNull();
        });
        it('should hide the list of conditions for formula logic', async () => {
            const list = Object.assign({}, listWithThreeConditionals);
            list.conditionLogic = {
                value: CONDITION_LOGIC.FORMULA
            };
            const element = createComponentUnderTest(list);

            await ticks(1);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            expect(conditionList).toBeNull();
        });

        describe('AND', () => {
            it("sets the logic combobox to 'and'", async () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'and'
                };
                const element = createComponentUnderTest(list);

                await ticks(1);
                const conditionLogicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);

                expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.AND);
            });
            it('should hide the custom logic input', async () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'and'
                };
                const element = createComponentUnderTest(list);

                await ticks(1);
                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);
                expect(customLogicInput).toBeNull();
            });
        });

        describe('OR', () => {
            it("sets the logic combobox to 'or'", async () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'or'
                };
                const element = createComponentUnderTest(list);

                await ticks(1);
                const conditionLogicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);

                expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.OR);
            });
            it('should hide the custom logic input', async () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'or'
                };

                const element = createComponentUnderTest(list);

                await ticks(1);
                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);
                expect(customLogicInput).toBeNull();
            });
        });

        describe('custom logic', () => {
            it('sets the logic combobox to custom logic', async () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                await ticks(1);
                const conditionLogicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);

                expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.CUSTOM_LOGIC);
            });
            it('shows the custom logic with the value from conditionLogic', async () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                await ticks(1);
                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);

                expect(customLogicInput.value).toEqual(listWithThreeConditionals.conditionLogic.value);
            });
            it('does not fire PropertyChangedEvent during custom logic input focusout without conditions', async () => {
                const conditionsList = Object.assign({}, listWithThreeConditionals);
                conditionsList.conditionLogic = { value: '1' };
                conditionsList.conditions = [];
                const element = createComponentUnderTest(conditionsList);

                await ticks(1);
                const eventCallback = jest.fn();
                element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);
                customLogicInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });
            it('fires PropertyChangedEvent during custom logic input focusout with conditions', async () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                await ticks(1);
                const eventCallback = jest.fn();
                element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                const customLogicInput = element.shadowRoot.querySelector(selectors.customLogicInput);
                customLogicInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
            });

            describe('default value', () => {
                it('from AND all conditions should be separated by ANDs', async () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'and'
                    };

                    const element = createComponentUnderTest(list);

                    await ticks(1);
                    const eventCallback = jest.fn();
                    element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    const logicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);
                    logicComboBox.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {
                                value: CONDITION_LOGIC.CUSTOM_LOGIC
                            }
                        })
                    );

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            guid: element.parentGuid,
                            propertyName: 'conditionLogic',
                            value: '1 AND 2 AND 3',
                            error: null
                        }
                    });
                });

                it('from OR all conditions should be separated by ORs', async () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'or'
                    };

                    const element = createComponentUnderTest(list);

                    await ticks(1);
                    const eventCallback = jest.fn();
                    element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    const logicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);
                    logicComboBox.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {
                                value: CONDITION_LOGIC.CUSTOM_LOGIC
                            }
                        })
                    );

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            guid: element.parentGuid,
                            propertyName: 'conditionLogic',
                            value: '1 OR 2 OR 3',
                            error: null
                        }
                    });
                });

                it('from NO_CONDITIONS all conditions should be separated by ANDs', async () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: CONDITION_LOGIC.NO_CONDITIONS
                    };

                    const element = createComponentUnderTest(list);

                    await ticks(1);
                    const eventCallback = jest.fn();
                    element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    const logicComboBox = element.shadowRoot.querySelector(selectors.conditionLogicComboBox);
                    logicComboBox.dispatchEvent(
                        new CustomEvent('change', {
                            detail: {
                                value: CONDITION_LOGIC.CUSTOM_LOGIC
                            }
                        })
                    );

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            guid: element.parentGuid,
                            propertyName: 'conditionLogic',
                            value: '1 AND 2 AND 3',
                            error: null
                        }
                    });
                });
            });
        });
    });
});
