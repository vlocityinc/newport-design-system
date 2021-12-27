import {
    mockAccountVar,
    mockApexCallApexClassOutputSecondLevelComboboxItem,
    mockApexDefinedVariable,
    mockApexFieldSecondLevelComboboxItem,
    mockApexFieldThirdLevelComboboxItem,
    mockApexSObjectEntitySecondLevelComboboxItem,
    mockEmailScreenFieldAutoSecondLevelFieldComboboxItem,
    mockGlobalConstantEmptyStringComboboxItem,
    mockGlobalVariableFlowCurrentDateComboboxItem,
    mockPolymorphicSObjectEntitySecondLevelComboboxItem,
    mockPolymorphicSObjectFieldThirdLevelComboboxItem,
    mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem,
    mockSObjectFieldFourthLevelComboboxItem,
    secondLevelMenuData,
    thirdLevelMenuData
} from 'mock/comboboxData';
import { getGlobalConstantOrGlobalVariableLabel, getPillLabel, getPillMergeFieldLabel, getPillTooltip } from '../pill';

describe('getPillLabel', () => {
    const [mockSObjectFieldSecondLevelComboboxItem] = secondLevelMenuData;
    const [mockSObjectFieldThirdLevelComboboxItem] = thirdLevelMenuData;
    const mockSObjectFieldSecondLevelEmptySubTextComboboxItem = {
        ...mockSObjectFieldSecondLevelComboboxItem,
        subText: [
            {
                highlight: true,
                text: ''
            }
        ]
    };

    describe.each`
        item                                                             | expectedLabel
        ${mockAccountVar}                                                | ${'MyAccount'}
        ${mockSObjectFieldSecondLevelComboboxItem}                       | ${'MyAccount > Created By ID'}
        ${mockSObjectFieldSecondLevelEmptySubTextComboboxItem}           | ${'MyAccount > {!MyAccount.CreatedBy}'}
        ${mockSObjectFieldThirdLevelComboboxItem}                        | ${'MyAccount > Created By ID > Employee Number'}
        ${mockSObjectFieldFourthLevelComboboxItem}                       | ${'MyAccount > Created By ID > Manager ID > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelComboboxItem}             | ${'feedItemVariable > Created By ID (User) > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem} | ${'feedItemVariable > Created By ID (User) > Full Name'}
        ${mockPolymorphicSObjectEntitySecondLevelComboboxItem}           | ${'feedItemVariable > Created By ID (User)'}
        ${mockApexDefinedVariable}                                       | ${'vApexComplexTypeTestOne216'}
        ${mockApexFieldSecondLevelComboboxItem}                          | ${'vApexComplexTypeTestOne216 > booleanField'}
        ${mockApexFieldThirdLevelComboboxItem}                           | ${'vApexComplexTypeTestOne216 > acct > Annual Revenue'}
        ${mockApexSObjectEntitySecondLevelComboboxItem}                  | ${'vApexComplexTypeTestOne216 > acct'}
        ${mockEmailScreenFieldAutoSecondLevelFieldComboboxItem}          | ${'emailScreenFieldAutomaticOutput > Read Only'}
        ${mockApexCallApexClassOutputSecondLevelComboboxItem}            | ${'Outputs from apexCall_Car_automatic_output > car'}
        ${mockGlobalConstantEmptyStringComboboxItem}                     | ${'FlowBuilderPill.globalConstantEmptyString'}
        ${mockGlobalVariableFlowCurrentDateComboboxItem}                 | ${'FlowBuilderPill.flowCurrentDate'}
    `(' returns expected label', ({ item, label, expectedLabel }) => {
        test(`For item: ${
            item ? '(displayText) ' + item.displayText : item
        } and label: ${label}, should return: ${expectedLabel} `, () => {
            const actual = getPillLabel(item);
            expect(actual).toBe(expectedLabel);
        });
    });
});

describe('getPillMergeFieldLabel', () => {
    const [mockSObjectFieldSecondLevelComboboxItem] = secondLevelMenuData;
    const [mockSObjectFieldThirdLevelComboboxItem] = thirdLevelMenuData;
    const mockSObjectFieldSecondLevelEmptySubTextComboboxItem = {
        ...mockSObjectFieldSecondLevelComboboxItem,
        subText: [
            {
                highlight: true,
                text: ''
            }
        ]
    };

    describe.each`
        item                                                             | label        | expectedLabel
        ${undefined}                                                     | ${undefined} | ${''}
        ${null}                                                          | ${undefined} | ${''}
        ${mockAccountVar}                                                | ${undefined} | ${'MyAccount'}
        ${mockSObjectFieldSecondLevelComboboxItem}                       | ${undefined} | ${'MyAccount > Created By ID'}
        ${mockSObjectFieldSecondLevelEmptySubTextComboboxItem}           | ${undefined} | ${'MyAccount > {!MyAccount.CreatedBy}'}
        ${mockSObjectFieldThirdLevelComboboxItem}                        | ${undefined} | ${'MyAccount > Created By ID > Employee Number'}
        ${mockSObjectFieldFourthLevelComboboxItem}                       | ${undefined} | ${'MyAccount > Created By ID > Manager ID > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelComboboxItem}             | ${undefined} | ${'feedItemVariable > Created By ID (User) > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem} | ${undefined} | ${'feedItemVariable > Created By ID (User) > Full Name'}
        ${mockPolymorphicSObjectEntitySecondLevelComboboxItem}           | ${undefined} | ${'feedItemVariable > Created By ID (User)'}
        ${mockApexDefinedVariable}                                       | ${undefined} | ${'vApexComplexTypeTestOne216'}
        ${mockApexFieldSecondLevelComboboxItem}                          | ${undefined} | ${'vApexComplexTypeTestOne216 > booleanField'}
        ${mockApexFieldThirdLevelComboboxItem}                           | ${undefined} | ${'vApexComplexTypeTestOne216 > acct > Annual Revenue'}
        ${mockApexSObjectEntitySecondLevelComboboxItem}                  | ${undefined} | ${'vApexComplexTypeTestOne216 > acct'}
        ${mockEmailScreenFieldAutoSecondLevelFieldComboboxItem}          | ${undefined} | ${'emailScreenFieldAutomaticOutput > Read Only'}
        ${mockApexCallApexClassOutputSecondLevelComboboxItem}            | ${undefined} | ${'Outputs from apexCall_Car_automatic_output > car'}
    `(' returns expected label', ({ item, label, expectedLabel }) => {
        test(`For item: ${
            item ? '(displayText) ' + item.displayText : item
        } and label: ${label}, should return: ${expectedLabel} `, () => {
            const actual = getPillMergeFieldLabel(item, label);
            expect(actual).toBe(expectedLabel);
        });
    });
});
describe('getGlobalConstantOrSystemVariableLabel', () => {
    test.each`
        itemValue                                  | expectedLabel
        ${null}                                    | ${undefined}
        ${undefined}                               | ${undefined}
        ${''}                                      | ${undefined}
        ${'$GlobalConstant.True'}                  | ${'FlowBuilderPill.globalConstantTrue'}
        ${'$GlobalConstant.False'}                 | ${'FlowBuilderPill.globalConstantFalse'}
        ${'$GlobalConstant.EmptyString'}           | ${'FlowBuilderPill.globalConstantEmptyString'}
        ${'GlobalConstant.False'}                  | ${undefined}
        ${'$Flow.CurrentDate'}                     | ${'FlowBuilderPill.flowCurrentDate'}
        ${'$Flow.CurrentDateTime'}                 | ${'FlowBuilderPill.flowCurrentDateTime'}
        ${'$Flow.FaultMessage'}                    | ${'FlowBuilderPill.flowFaultMessage'}
        ${'$Flow.CurrentStage'}                    | ${'FlowBuilderPill.flowCurrentStage'}
        ${'$Flow.InterviewStartTime'}              | ${'FlowBuilderPill.flowInterviewStartTime'}
        ${'$Flow.ActiveStages'}                    | ${'FlowBuilderPill.flowActiveStages'}
        ${'$Flow.InterviewGuid'}                   | ${'FlowBuilderPill.flowInterviewGuid'}
        ${'$Flow.CurrentRecord'}                   | ${'FlowBuilderPill.flowCurrentRecord'}
        ${'$API.Session_ID'}                       | ${undefined}
        ${'$Profile.AMiddleNameThisFieldIsCalled'} | ${undefined}
    `('Label for $itemValue should be: $expectedLabel', ({ itemValue, expectedLabel }) => {
        const actual = getGlobalConstantOrGlobalVariableLabel(itemValue);
        expect(actual).toBe(expectedLabel);
    });
});
describe('getPillTooltip', () => {
    describe('no error message', () => {
        test.each`
            label                                                  | expectedTooltip
            ${null}                                                | ${''}
            ${undefined}                                           | ${''}
            ${''}                                                  | ${''}
            ${'vText'}                                             | ${'vText'}
            ${'MyAccount > Created By ID > Manager ID > About Me'} | ${'MyAccount > Created By ID > Manager ID > About Me'}
        `('For label $label tooltip should be: $expectedTooltip', ({ label, expectedTooltip }) => {
            const actual = getPillTooltip(label, null);
            expect(actual).toEqual(expectedTooltip);
        });
    });

    describe('with error message', () => {
        it('tooltip includes the error message if any', () => {
            const errorMessage = 'myErrorMessage';
            const actual = getPillTooltip('vText', errorMessage);
            expect(actual).toEqual(expect.stringContaining(errorMessage));
        });
    });
});
