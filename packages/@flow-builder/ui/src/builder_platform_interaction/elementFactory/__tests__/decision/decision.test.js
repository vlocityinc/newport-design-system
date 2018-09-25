import { createOutcome } from '../../decision';
import { baseChildElement } from "../../base/baseElement";
import { ELEMENT_TYPE, CONDITION_LOGIC} from "builder_platform_interaction/flowMetadata";

jest.mock('../../base/baseElement', () => {
    return {
        baseChildElement: jest.fn().mockName('baseChildElementMock')
    };
});

describe('decision', () => {
    describe('outcome', () => {
        it('calls baseChildElement with elementType = OUTCOME', () => {
            createOutcome();
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.OUTCOME);
        });

        it('calls baseChildElement with an empty outcome by default', () => {
            createOutcome();
            expect(baseChildElement.mock.calls[0][0]).toEqual({});
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

            createOutcome(mockOutcome);

            expect(baseChildElement.mock.calls[0][0]).toEqual(mockOutcome);
        });
    });
});