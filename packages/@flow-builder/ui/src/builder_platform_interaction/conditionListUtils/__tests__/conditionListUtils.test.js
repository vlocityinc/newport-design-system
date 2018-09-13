import { CONDITION_LOGIC, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { showDeleteCondition, getConditionsWithPrefixes } from "../conditionListUtils";

const listWithOneConditional = {
    containerElementType: ELEMENT_TYPE.DECISION,
    parentGuid: {value: '123'},
    conditionLogicOptions: [
        {value: CONDITION_LOGIC.AND, label: 'and'},
        {value: CONDITION_LOGIC.OR, label: 'or'},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: 'custom'}
    ],
    conditionLogic: {value: '1'},
    conditions: [
        {name: 'condition1', rowIndex: 0}
    ]
};

const listWithThreeConditionals = {
    containerElementType: ELEMENT_TYPE.DECISION,
    parentGuid: {value: '123'},
    conditionLogicOptions: [
        {value: CONDITION_LOGIC.AND, label: 'and'},
        {value: CONDITION_LOGIC.OR, label: 'or'},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: 'custom'}
    ],
    conditionLogic: {value: '1 and 2'},
    conditions: [
        {name: 'condition1', rowIndex: 0},
        {name: 'condition2', rowIndex: 1},
        {name: 'condition3', rowIndex: 2},
    ]
};

describe('condition-list-utils', () => {
    describe('delete button', () => {
        it('is inactive if there is only one conditional', () => {
            const showDelete = showDeleteCondition(listWithOneConditional.conditions);
            expect(showDelete).toBeFalsy();
        });
        it('is active if there are multiple conditionals', () => {
            const showDelete = showDeleteCondition(listWithThreeConditionals.conditions);
            expect(showDelete).toBeTruthy();
        });
    });

    describe('prefix', () => {
        describe('AND', () => {
            it('displays no prefix for the first row', () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'and'
                };

                const conditions = getConditionsWithPrefixes(list.conditionLogic, list.conditions);
                expect(conditions[0].prefix).toEqual('');
            });
            it('displays the prefix "AND" for all other rows', () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'and'
                };

                const conditions = getConditionsWithPrefixes(list.conditionLogic, list.conditions);
                expect(conditions[1].prefix).toEqual('AND');
                expect(conditions[2].prefix).toEqual('AND');
            });
        });
        describe('OR', () => {
            it('displays no prefix for the first row', () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'or'
                };

                const conditions = getConditionsWithPrefixes(list.conditionLogic, list.conditions);
                expect(conditions[0].prefix).toEqual('');
            });
            it('displays the prefix "OR" for all other rows', () => {
                const list = Object.assign({}, listWithThreeConditionals);
                list.conditionLogic = {
                    value: 'or'
                };

                const conditions = getConditionsWithPrefixes(list.conditionLogic, list.conditions);
                expect(conditions[1].prefix).toEqual('OR');
                expect(conditions[2].prefix).toEqual('OR');
            });
        });
        describe('advanced', () => {
            it('displays 1-based numerical prefix for all rows', () => {
                const conditions = getConditionsWithPrefixes(listWithThreeConditionals.conditionLogic, listWithThreeConditionals.conditions);

                expect(conditions[0].prefix).toEqual('1');
                expect(conditions[1].prefix).toEqual('2');
                expect(conditions[2].prefix).toEqual('3');
            });
        });
    });
});
