import {createElement} from 'lwc';
import ConditionList from 'builder_platform_interaction-condition-list';
import {
    AddConditionEvent,
    AddListItemEvent,
    DeleteConditionEvent,
    DeleteListItemEvent,
    UpdateConditionEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { getShadowRoot } from 'lwc-test-utils';

const listWithOneConditional = {
    parentGuid: {value: '123'},
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1', rowIndex: 0}
    ]
};
const listWithThreeConditionals = {
    parentGuid: {value: '123'},
    conditionLogic: {value: '1 and 2'},
    conditions: [
        {name: 'condition1', rowIndex: 0},
        {name: 'condition2', rowIndex: 1},
        {name: 'condition3', rowIndex: 2},
    ]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeOutcome',
};

const createComponentUnderTest = (conditionList) => {
    const el = createElement('builder_platform_interaction-condition-list', {
        is: ConditionList
    });
    document.body.appendChild(el);

    el.conditions = conditionList.conditions;
    el.conditionLogic = conditionList.conditionLogic;
    el.parentGuid = conditionList.parentGuid;
    el.containerElementType = ELEMENT_TYPE.DECISION;

    return el;
};

describe('Condition List', () => {
    describe('advanced logic component', () => {
        it('has one conditional row per conditional', () => {
            const element = createComponentUnderTest(listWithThreeConditionals);

            return Promise.resolve().then(() => {
                const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                expect(rowsArray).toHaveLength(3);
            });
        });
        describe('delete button', () => {
            it('is inactive if there is only one conditional', () => {
                const element = createComponentUnderTest(listWithOneConditional);

                return Promise.resolve().then(() => {
                    const row = getShadowRoot(element).querySelector(selectors.row);

                    expect(row.showDelete).toBeFalsy();
                });
            });
            it('is active if there are multiple conditionals', () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                return Promise.resolve().then(() => {
                    const rows = getShadowRoot(element).querySelectorAll(selectors.row);

                    expect(rows[0].showDelete).toBeTruthy();
                    expect(rows[1].showDelete).toBeTruthy();
                    expect(rows[2].showDelete).toBeTruthy();
                });
            });
        });
        describe('prefix', () => {
            it('show-prefix is always true', () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                return Promise.resolve().then(() => {
                    const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                    expect(rowsArray[0].showPrefix).toBeTruthy();
                    expect(rowsArray[1].showPrefix).toBeTruthy();
                    expect(rowsArray[2].showPrefix).toBeTruthy();
                });
            });
            describe('AND', () => {
                it('displays no prefix for the first row', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'and'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('');
                    });
                });
                it('displays the prefix "AND" for all other rows', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'and'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                        expect(rowsArray[1].itemPrefix).toEqual('AND');
                        expect(rowsArray[2].itemPrefix).toEqual('AND');
                    });
                });
            });
            describe('OR', () => {
                it('displays no prefix for the first row', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'or'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('');
                    });
                });
                it('displays the prefix "OR" for all other rows', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'or'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                        expect(rowsArray[1].itemPrefix).toEqual('OR');
                        expect(rowsArray[2].itemPrefix).toEqual('OR');
                    });
                });
            });
            describe('advanced', () => {
                it('displays 1-based numerical prefix for all rows', () => {
                    const element = createComponentUnderTest(listWithThreeConditionals);

                    return Promise.resolve().then(() => {
                        const rowsArray = getShadowRoot(element).querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('1');
                        expect(rowsArray[1].itemPrefix).toEqual('2');
                        expect(rowsArray[2].itemPrefix).toEqual('3');
                    });
                });
            });
        });

        describe('handleAddCondition', () => {
            it('fires addConditionEvent with current outcome GUID', () => {
                const element = createComponentUnderTest(listWithThreeConditionals);

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = getShadowRoot(element).querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new AddListItemEvent());

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            parentGUID: element.parentGuid
                        }
                    });
                });
            });
        });

        describe('handleDeleteCondition', () => {
            it('fires deleteConditionEvent with outcome GUID and condition index', () => {
                const indexToDelete = 300;

                const element = createComponentUnderTest(listWithThreeConditionals);

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = getShadowRoot(element).querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new DeleteListItemEvent(indexToDelete));

                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            parentGUID: element.parentGuid,
                            index: indexToDelete
                        }
                    });
                });
            });
        });

        describe('handleUpdateCondition', () => {
            it('fires updateConditionEvent with parent GUID, condition index, a property name, value and error', () => {
                const updateData = {
                    index: 300,
                    value: 'newVal',
                };

                const element = createComponentUnderTest(listWithThreeConditionals);

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = getShadowRoot(element).querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new UpdateListItemEvent(
                        updateData.index,
                        updateData.value,
                        updateData.error
                    ));

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            parentGUID: element.parentGuid,
                            index: updateData.index,
                            value: updateData.value,
                        }
                    });
                });
            });
        });

        describe('condition logic', () => {
            describe('AND', () => {
                it('sets the logic combobox to \'and\'', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'and'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = getShadowRoot(element).querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.AND);
                    });
                });
                it('should hide the custom logic input', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'and'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const customLogicInput = getShadowRoot(element).querySelector(selectors.customLogicInput);
                        expect(customLogicInput).toBeNull();
                    });
                });
            });

            describe('OR', () => {
                it('sets the logic combobox to \'or\'', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'or'
                    };
                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = getShadowRoot(element).querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.OR);
                    });
                });
                it('should hide the custom logic input', () => {
                    const list = Object.assign({}, listWithThreeConditionals);
                    list.conditionLogic = {
                        value: 'or'
                    };

                    const element = createComponentUnderTest(list);

                    return Promise.resolve().then(() => {
                        const customLogicInput = getShadowRoot(element).querySelector(selectors.customLogicInput);
                        expect(customLogicInput).toBeNull();
                    });
                });
            });

            describe('custom logic', () => {
                it('sets the logic combobox to custom logic', () => {
                    const element = createComponentUnderTest(listWithThreeConditionals);

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = getShadowRoot(element).querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.CUSTOM_LOGIC);
                    });
                });
                it('shows the custom logic with the value from conditionLogic', () => {
                    const element = createComponentUnderTest(listWithThreeConditionals);

                    return Promise.resolve().then(() => {
                        const customLogicInput = getShadowRoot(element).querySelector(selectors.customLogicInput);

                        expect(customLogicInput.value).toEqual(listWithThreeConditionals.conditionLogic.value);
                    });
                });

                describe('default value', () => {
                    it('from AND all conditions should be separated by ANDs', () => {
                        const list = Object.assign({}, listWithThreeConditionals);
                        list.conditionLogic = {
                            value: 'and'
                        };

                        const element = createComponentUnderTest(list);

                        return Promise.resolve().then(() => {
                            const eventCallback = jest.fn();
                            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                            const logicComboBox = getShadowRoot(element).querySelector(selectors.conditionLogicComboBox);
                            logicComboBox.dispatchEvent(new CustomEvent('change', {
                                detail: {
                                    value: CONDITION_LOGIC.CUSTOM_LOGIC
                                }
                            }));

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

                    it('from OR all conditions should be separated by ORs', () => {
                        const list = Object.assign({}, listWithThreeConditionals);
                        list.conditionLogic = {
                            value: 'or'
                        };

                        const element = createComponentUnderTest(list);

                        return Promise.resolve().then(() => {
                            const eventCallback = jest.fn();
                            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                            const logicComboBox = getShadowRoot(element).querySelector(selectors.conditionLogicComboBox);
                            logicComboBox.dispatchEvent(new CustomEvent('change', {
                                detail: {
                                    value: CONDITION_LOGIC.CUSTOM_LOGIC
                                }
                            }));

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
                    });
                });
            });
        });
    });
});