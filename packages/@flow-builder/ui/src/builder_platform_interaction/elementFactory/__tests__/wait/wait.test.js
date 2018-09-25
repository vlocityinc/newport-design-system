import { createWaitEvent } from '../../wait';
import { baseChildElement } from "../../base/baseElement";
import { ELEMENT_TYPE, CONDITION_LOGIC} from "builder_platform_interaction/flowMetadata";

jest.mock('../../base/baseElement', () => {
    return {
        baseChildElement: jest.fn().mockName('baseChildElementMock')
    };
});

describe('wait', () => {
    describe('waitEvent', () => {
        const defaultWaitEvent = {conditionLogic : CONDITION_LOGIC.NO_CONDITIONS};

        it('calls baseChildElement with elementType = WAIT_EVENT', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.WAIT_EVENT);
        });

        it('has NO_CONDITIONS as the default condition logic', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][0]).toEqual(defaultWaitEvent);
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
                dataType: 'sfdc'
            };

            createWaitEvent(mockWaitEvent);

            expect(baseChildElement.mock.calls[0][0]).toEqual(mockWaitEvent);
        });
    });
});