import { createWaitEvent } from '../../wait';
import { ELEMENT_TYPE, CONDITION_LOGIC} from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

describe('wait', () => {
    describe('waitEvent', () => {
        let waitEvent;

        beforeEach(() => {
            waitEvent = createWaitEvent();
        });

        it('creates element of type WAIT_EVENT', () => {
            expect(waitEvent.elementType).toEqual(ELEMENT_TYPE.WAIT_EVENT);
        });

        it('has one condition by default', () => {
            expect(waitEvent.conditions).toHaveLength(1);
        });

        it('has NO_CONDITIONS as the default condition logic', () => {
            expect(waitEvent.conditionLogic).toEqual(CONDITION_LOGIC.NO_CONDITIONS);
        });

        it('has default data type of BOOLEAN', () => {
            expect(waitEvent.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });

        it('uses existing values when passed in a waitEvent object', () => {
            const mockCondition1 = { operator: 'foo' };
            const mockCondition2 = { operator: 'bar' };
            const mockWaitEvent =  {
                conditionLogic: CONDITION_LOGIC.OR,
                conditions: [
                    mockCondition1,
                    mockCondition2,
                ],
                dataType: 'sfdc',
            };
            waitEvent = createWaitEvent(mockWaitEvent);

            expect(waitEvent.conditions).toEqual([
                expect.objectContaining(mockCondition1),
                expect.objectContaining(mockCondition2),
            ]);
            expect(waitEvent.conditionLogic).toEqual(CONDITION_LOGIC.OR);
            // cannot change data type
            expect(waitEvent.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });
    });
});