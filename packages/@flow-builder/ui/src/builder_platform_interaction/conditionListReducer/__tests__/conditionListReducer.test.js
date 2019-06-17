import { conditionListReducer } from '../conditionListReducer';

import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    UpdateConditionLogicEvent
} from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        checkExpressionForDeletedElem: jest.fn()
    };
});

describe('condition-list-reducer', () => {
    let conditionList;

    function createConditionList() {
        return {
            conditions: [createCondition()],
            conditionLogic: { value: CONDITION_LOGIC.AND, error: null }
        };
    }

    beforeEach(() => {
        conditionList = createConditionList();
    });

    it('adds a condition', () => {
        const addConditionEvent = new AddConditionEvent();
        expect(conditionList.conditions).toHaveLength(1);
        const resultObj = conditionListReducer(
            conditionList,
            addConditionEvent
        );
        expect(resultObj.conditions).toHaveLength(2);
    });

    it('hydrates a new condition', () => {
        const addConditionEvent = new AddConditionEvent();
        expect(conditionList.conditions).toHaveLength(1);
        const resultObj = conditionListReducer(
            conditionList,
            addConditionEvent
        );
        const newCondition = resultObj.conditions[1];
        expect(newCondition).toHaveProperty('operator.value');
        expect(newCondition).toHaveProperty('operator.error');
    });

    it('updates a condition', () => {
        const operator = 'foo';
        const updateConditionEvent = new UpdateConditionEvent(null, 0, {
            operator
        });

        const resultObj = conditionListReducer(
            conditionList,
            updateConditionEvent
        );

        expect(resultObj.conditions).toHaveLength(1);
        const updatedCondition = resultObj.conditions[0];
        expect(updatedCondition.operator).toEqual(operator);
    });

    it('deletes a condition', () => {
        const deleteIndex = 0;
        const deleteConditionEvent = new DeleteConditionEvent(
            null,
            deleteIndex
        );

        const resultObj = conditionListReducer(
            conditionList,
            deleteConditionEvent
        );

        expect(resultObj.conditions).toHaveLength(0);
    });

    describe('condition logic', () => {
        it('updates condition logic', () => {
            expect(conditionList.conditionLogic.value).toEqual(
                CONDITION_LOGIC.AND
            );

            const newConditionLogic = CONDITION_LOGIC.OR;
            const updateConditionLogicEvent = new UpdateConditionLogicEvent(
                null,
                newConditionLogic
            );

            const resultObj = conditionListReducer(
                conditionList,
                updateConditionLogicEvent
            );

            expect(resultObj.conditionLogic.value).toEqual(CONDITION_LOGIC.OR);
        });

        it('other logic to no condition', () => {
            expect(conditionList.conditionLogic.value).toEqual(
                CONDITION_LOGIC.AND
            );

            const newConditionLogic = CONDITION_LOGIC.NO_CONDITIONS;
            const updateConditionLogicEvent = new UpdateConditionLogicEvent(
                null,
                newConditionLogic
            );

            const resultObj = conditionListReducer(
                conditionList,
                updateConditionLogicEvent
            );

            expect(resultObj.conditionLogic.value).toEqual(newConditionLogic);
            expect(resultObj.conditions).toHaveLength(0);
        });

        it('no condition to other logic adds a condition', () => {
            conditionList.conditionLogic.value = CONDITION_LOGIC.NO_CONDITION;
            conditionList.conditions = [];

            const newConditionLogic = CONDITION_LOGIC.OR;
            const updateConditionLogicEvent = new UpdateConditionLogicEvent(
                null,
                newConditionLogic
            );

            const resultObj = conditionListReducer(
                conditionList,
                updateConditionLogicEvent
            );

            expect(resultObj.conditionLogic.value).toEqual(newConditionLogic);
            expect(resultObj.conditions).toHaveLength(1);
        });
    });
});
