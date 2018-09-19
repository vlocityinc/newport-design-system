import { createOutcome } from '../../decision';
import { ELEMENT_TYPE, CONDITION_LOGIC} from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

describe('decision', () => {
    describe('outcome', () => {
        let outcome;

        beforeEach(() => {
            outcome = createOutcome();
        });

        it('creates element of type OUTCOME', () => {
            expect(outcome.elementType).toEqual(ELEMENT_TYPE.OUTCOME);
        });

        it('has one condition by default', () => {
            expect(outcome.conditions).toHaveLength(1);
        });

        it('has AND as the default condition logic', () => {
            expect(outcome.conditionLogic).toEqual(CONDITION_LOGIC.AND);
        });

        it('has default data type of BOOLEAN', () => {
            expect(outcome.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });

        it('uses existing values when passed in an outcome object', () => {
            const mockCondition1 = { operator: 'foo' };
            const mockCondition2 = { operator: 'bar' };
            const mockOutcome =  {
                conditionLogic: CONDITION_LOGIC.OR,
                conditions: [
                    mockCondition1,
                    mockCondition2,
                ],
                dataType: 'sfdc',
            };
            outcome = createOutcome(mockOutcome);
            expect(outcome.conditions).toEqual([
                expect.objectContaining(mockCondition1),
                expect.objectContaining(mockCondition2),
            ]);
            expect(outcome.conditionLogic).toEqual(CONDITION_LOGIC.OR);
            // cannot change data type
            expect(outcome.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });
    });
});