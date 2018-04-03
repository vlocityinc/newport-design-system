import {createElement} from 'engine';
import Outcome from 'builder_platform_interaction-outcome';
import {
    AddConditionEvent,
    AddListItemEvent,
    DeleteConditionEvent,
    DeleteListItemEvent,
    UpdateConditionEvent,
    UpdateListItemEvent
} from 'builder_platform_interaction-events';

const outcomeWithOneConditional = {
    guid: {
        value: '123'
    },
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1'}
    ]
};
const outcomeWithThreeConditionals = {
    guid: {
        value: '123'
    },
    conditionLogic: {value: '1 and 2'},
    conditions: [
        {name: 'condition1'},
        {name: 'condition2'},
        {name: 'condition3'},
    ]
};

const selectors = {
    deleteButton: 'lightning-button',
    row: 'builder_platform_interaction-row',
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-outcome', {
        is: Outcome
    });
    document.body.appendChild(el);

    return el;
};

describe('Outcome', () => {
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
                const deleteButton = element.querySelector(selectors.deleteButton);

                expect(deleteButton.disabled).toBeTruthy();
            });
        });
        it('is active if there are multiple conditionals', () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const deleteButtons = element.querySelectorAll(selectors.deleteButton);

                expect(deleteButtons[0].disabled).toBeFalsy();
                expect(deleteButtons[1].disabled).toBeFalsy();
                expect(deleteButtons[2].disabled).toBeFalsy();
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
        it('fires addConditionEvent with current outcome GUI', () => {
            const element = createComponentUnderTest();
            // TODO: Figure out a way around this.  Currently shortcutting the element.outcome setter and setting
            // element.outcome directly so it will be available when we call the handler.  See handler call below
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);

                // TODO: Figure out a better way to access the handler rather than through the class prototype
                Outcome.prototype.handleAddCondition.call(element, new AddListItemEvent());

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        parentGUID: element.outcome.guid.value
                    }
                });
            });
        });
    });

    describe('handleDeleteCondition', () => {
        it('fires deleteConditionEvent with outcome GUI and condition index', () => {
            const indexToDelete = 300;

            const element = createComponentUnderTest();
            // TODO: Figure out a way around this.  Currently shortcutting the element.outcome setter and setting
            // element.outcome directly so it will be available when we call the handler.  See handler call below
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);

                // TODO: Figure out a better way to access the handler rather than through the class prototype
                Outcome.prototype.handleDeleteCondition.call(element, new DeleteListItemEvent(indexToDelete));

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        parentGUID: element.outcome.guid.value,
                        index: indexToDelete
                    }
                });
            });
        });
    });

    describe('handleUpdateCondition', () => {
        it('fires updateConditionEvent with outcome GUI, condition index, a property name, value and error', () => {
            const updateData = {
                index: 300,
                propertyName: 'foo',
                value: 'newVal',
                error: 'anError'
            };


            const element = createComponentUnderTest();
            // TODO: Figure out a way around this.  Currently shortcutting the element.outcome setter and setting
            // element.outcome directly so it will be available when we call the handler.  See handler call below
            element.outcome = outcomeWithThreeConditionals;

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);

                // TODO: Figure out a better way to access the handler rather than through the class prototype
                Outcome.prototype.handleUpdateCondition.call(element, new UpdateListItemEvent(
                    updateData.index,
                    updateData.propertyName,
                    updateData.value,
                    updateData.error));

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        parentGUID: element.outcome.guid.value,
                        index: updateData.index,
                        propertyName: updateData.propertyName,
                        value: updateData.value,
                        error: updateData.error
                    }
                });
            });
        });
    });
});
