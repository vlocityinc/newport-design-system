import {createElement} from 'engine';
import Outcome from 'builder_platform_interaction-outcome';
import {
    DeleteOutcomeEvent,
    AddConditionEvent,
    AddListItemEvent,
    DeleteConditionEvent,
    DeleteListItemEvent,
    UpdateConditionEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';
import {CONDITION_LOGIC} from 'builder_platform_interaction-flow-metadata';

const outcomeWithOneConditional = {
    label: {value: 'Test Name of the Outcome'},
    name: {value: 'Test Dev Name'},
    guid: {value: '123'},
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1'}
    ]
};
const outcomeWithThreeConditionals = {
    guid: {value: '123'},
    conditionLogic: {value: '1 and 2'},
    conditions: [
        {name: 'condition1'},
        {name: 'condition2'},
        {name: 'condition3'},
    ]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-outcome', {
        is: Outcome
    });
    document.body.appendChild(el);

    return el;
};

describe('Outcome', () => {
    describe('advanced logic component', () => {
        it('has one conditional row per conditional', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const rowsArray = element.querySelectorAll(selectors.row);

                expect(rowsArray).toHaveLength(3);
            });
        });
        describe('delete button', () => {
            it('is inactive if there is only one conditional', () => {
                const element = createComponentUnderTest();
                element.outcome = outcomeWithOneConditional;

                return Promise.resolve().then(() => {
                    const row = element.querySelector(selectors.row);

                    expect(row.showDelete).toBeFalsy();
                });
            });
            it('is active if there are multiple conditionals', () => {
                const element = createComponentUnderTest();
                element.outcome = outcomeWithThreeConditionals;

                return Promise.resolve().then(() => {
                    const rows = element.querySelectorAll(selectors.row);

                    expect(rows[0].showDelete).toBeTruthy();
                    expect(rows[1].showDelete).toBeTruthy();
                    expect(rows[2].showDelete).toBeTruthy();
                });
            });
        });
        describe('prefix', () => {
            it('show-prefix is always true', () => {
                const element = createComponentUnderTest();
                element.outcome = outcomeWithThreeConditionals;

                return Promise.resolve().then(() => {
                    const rowsArray = element.querySelectorAll(selectors.row);

                    expect(rowsArray[0].showPrefix).toBeTruthy();
                    expect(rowsArray[1].showPrefix).toBeTruthy();
                    expect(rowsArray[2].showPrefix).toBeTruthy();
                });
            });
            describe('AND', () => {
                it('displays no prefix for the first row', () => {
                    const rule = Object.assign({}, outcomeWithThreeConditionals);
                    rule.conditionLogic = {
                        value: 'and'
                    };

                    const element = createComponentUnderTest();
                    element.outcome = rule;

                    return Promise.resolve().then(() => {
                        const rowsArray = element.querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('');
                    });
                });
                it('displays the prefix "AND" for all other rows', () => {
                    const rule = Object.assign({}, outcomeWithThreeConditionals);
                    rule.conditionLogic = {
                        value: 'and'
                    };

                    const element = createComponentUnderTest();

                    element.outcome = rule;

                    return Promise.resolve().then(() => {
                        const rowsArray = element.querySelectorAll(selectors.row);

                        expect(rowsArray[1].itemPrefix).toEqual('AND');
                        expect(rowsArray[2].itemPrefix).toEqual('AND');
                    });
                });
            });
            describe('OR', () => {
                it('displays no prefix for the first row', () => {
                    const rule = Object.assign({}, outcomeWithThreeConditionals);
                    rule.conditionLogic = {
                        value: 'or'
                    };

                    const element = createComponentUnderTest();
                    element.outcome = rule;

                    return Promise.resolve().then(() => {
                        const rowsArray = element.querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('');
                    });
                });
                it('displays the prefix "OR" for all other rows', () => {
                    const rule = Object.assign({}, outcomeWithThreeConditionals);
                    rule.conditionLogic = {
                        value: 'or'
                    };

                    const element = createComponentUnderTest();

                    element.outcome = rule;

                    return Promise.resolve().then(() => {
                        const rowsArray = element.querySelectorAll(selectors.row);

                        expect(rowsArray[1].itemPrefix).toEqual('OR');
                        expect(rowsArray[2].itemPrefix).toEqual('OR');
                    });
                });
            });
            describe('advanced', () => {
                it('displays 1-based numerical prefix for all rows', () => {
                    const element = createComponentUnderTest();
                    element.outcome = outcomeWithThreeConditionals;

                    return Promise.resolve().then(() => {
                        const rowsArray = element.querySelectorAll(selectors.row);

                        expect(rowsArray[0].itemPrefix).toEqual('1');
                        expect(rowsArray[1].itemPrefix).toEqual('2');
                        expect(rowsArray[2].itemPrefix).toEqual('3');
                    });
                });
            });
        });

        describe('handleAddCondition', () => {
            it('fires addConditionEvent with current outcome GUID', () => {
                const element = createComponentUnderTest();
                element.outcome = outcomeWithThreeConditionals;

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = element.querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new AddListItemEvent());

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        parentGUID: element.outcome.guid
                    });
                });
            });
        });

        describe('handleDeleteCondition', () => {
            it('fires deleteConditionEvent with outcome GUID and condition index', () => {
                const indexToDelete = 300;

                const element = createComponentUnderTest();
                element.outcome = outcomeWithThreeConditionals;

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = element.querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new DeleteListItemEvent(indexToDelete));

                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        parentGUID: element.outcome.guid,
                        index: indexToDelete
                    });
                });
            });
        });

        describe('handleUpdateCondition', () => {
            it('fires updateConditionEvent with outcome GUI, condition index, a property name, value and error', () => {
                const updateData = {
                    index: 300,
                    value: 'newVal',
                };

                const element = createComponentUnderTest();
                element.outcome = outcomeWithThreeConditionals;

                return Promise.resolve().then(() => {
                    const eventCallback = jest.fn();
                    element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);

                    const conditionList = element.querySelector(selectors.conditionList);
                    conditionList.dispatchEvent(new UpdateListItemEvent(
                        updateData.index,
                        updateData.value,
                        updateData.error
                    ));

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        parentGUID: element.outcome.guid,
                        index: updateData.index,
                        value: updateData.value,
                    });
                });
            });
        });

        describe('condition logic', () => {
            describe('AND', () => {
                it('sets the logic combobox to \'and\'', () => {
                    const element = createComponentUnderTest();

                    element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                        conditionLogic: {value: 'and'}
                    });

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = element.querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.AND);
                    });
                });
                it('should hide the custom logic input', () => {
                    const element = createComponentUnderTest();

                    element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                        conditionLogic: {value: 'and'}
                    });

                    return Promise.resolve().then(() => {
                        const customLogicInput = element.querySelector(selectors.customLogicInput);
                        expect(customLogicInput).toBeNull();
                    });
                });
            });

            describe('OR', () => {
                it('sets the logic combobox to \'or\'', () => {
                    const element = createComponentUnderTest();

                    element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                        conditionLogic: {value: 'or'}
                    });

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = element.querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.OR);
                    });
                });
                it('should hide the custom logic input', () => {
                    const element = createComponentUnderTest();

                    element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                        conditionLogic: {value: 'or'}
                    });

                    return Promise.resolve().then(() => {
                        const customLogicInput = element.querySelector(selectors.customLogicInput);
                        expect(customLogicInput).toBeNull();
                    });
                });
            });

            describe('custom logic', () => {
                it('sets the logic combobox to custom logic', () => {
                    const element = createComponentUnderTest();
                    element.outcome = outcomeWithThreeConditionals;

                    return Promise.resolve().then(() => {
                        const conditionLogicComboBox = element.querySelector(selectors.conditionLogicComboBox);

                        expect(conditionLogicComboBox.value).toEqual(CONDITION_LOGIC.CUSTOM_LOGIC);
                    });
                });
                it('shows the custom logic with the value from conditionLogic', () => {
                    const element = createComponentUnderTest();
                    element.outcome = outcomeWithThreeConditionals;

                    return Promise.resolve().then(() => {
                        const customLogicInput = element.querySelector(selectors.customLogicInput);

                        expect(customLogicInput.value).toEqual(outcomeWithThreeConditionals.conditionLogic.value);
                    });
                });

                describe('default value', () => {
                    it('from AND all conditions should be separated by ANDs', () => {
                        const element = createComponentUnderTest();

                        element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                            conditionLogic: {value: 'and'}
                        });

                        return Promise.resolve().then(() => {
                            const eventCallback = jest.fn();
                            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                            const logicComboBox = element.querySelector(selectors.conditionLogicComboBox);
                            logicComboBox.dispatchEvent(new CustomEvent('change', {
                                detail: {
                                    value: CONDITION_LOGIC.CUSTOM_LOGIC
                                }
                            }));

                            expect(eventCallback).toHaveBeenCalled();
                            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                                guid: element.outcome.guid,
                                propertyName: 'conditionLogic',
                                value: '1 AND 2 AND 3',
                                error: null
                            });
                        });
                    });

                    it('from OR all conditions should be separated by ORs', () => {
                        const element = createComponentUnderTest();

                        element.outcome = Object.assign({}, outcomeWithThreeConditionals, {
                            conditionLogic: {value: 'or'}
                        });

                        return Promise.resolve().then(() => {
                            const eventCallback = jest.fn();
                            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                            const logicComboBox = element.querySelector(selectors.conditionLogicComboBox);
                            logicComboBox.dispatchEvent(new CustomEvent('change', {
                                detail: {
                                    value: CONDITION_LOGIC.CUSTOM_LOGIC
                                }
                            }));

                            expect(eventCallback).toHaveBeenCalled();
                            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                                guid: element.outcome.guid,
                                propertyName: 'conditionLogic',
                                value: '1 OR 2 OR 3',
                                error: null
                            });
                        });
                    });
                });
            });
        });
    });
    describe('header section', () => {
        it('has name and api name component', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            return Promise.resolve().then(() => {
                const labelAndNameComponents = element.querySelectorAll(selectors.labelAndName);
                expect(labelAndNameComponents).toHaveLength(1);
                expect(labelAndNameComponents[0].devName.value).toBe(outcomeWithOneConditional.name.value);
                expect(labelAndNameComponents[0].label.value).toBe(outcomeWithOneConditional.label.value);
            });
        });
        it('has Remove button', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            return Promise.resolve().then(() => {
                const removeButton = element.querySelectorAll(selectors.button)[0];
                expect(removeButton.label).toBe('Remove');
                expect(removeButton.title).toBe('Remove Outcome');
            });
        });
    });

    describe('handleDelete', () => {
        it('fires deleteOutcomeEvent with outcome GUID', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteOutcomeEvent.EVENT_NAME, eventCallback);

                const removeButton = element.querySelector(selectors.button);
                removeButton.click();

                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    guid: element.outcome.guid
                });
            });
        });
    });
});