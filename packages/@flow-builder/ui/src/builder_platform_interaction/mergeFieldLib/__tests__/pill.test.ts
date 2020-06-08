import { getPillLabel, getPillTooltip } from '../pill';
import {
    mockAccountVar,
    secondLevelMenuData,
    thirdLevelMenuData,
    mockApexDefinedVariable,
    mockApexFieldSecondLevelComboboxItem,
    mockApexFieldThirdLevelComboboxItem,
    mockPolymorphicSObjectFieldThirdLevelComboboxItem,
    mockPolymorphicSObjectEntitySecondLevelComboboxItem,
    mockApexSObjectEntitySecondLevelComboboxItem,
    mockSObjectFieldFourthLevelComboboxItem,
    mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem,
    mockEmailScreenFieldAutoSecondLevelFieldComboboxItem,
    mockApexCallApexClassOutputSecondLevelComboboxItem
} from 'mock/comboboxData';

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
        item                                                             | label                                              | expectedLabel
        ${null}                                                          | ${undefined}                                       | ${''}
        ${undefined}                                                     | ${undefined}                                       | ${''}
        ${undefined}                                                     | ${'MyAccount'}                                     | ${'MyAccount'}
        ${undefined}                                                     | ${'Account from lookup_account > Billing Country'} | ${'Account from lookup_account > Billing Country'}
        ${undefined}                                                     | ${'car > model'}                                   | ${'car > model'}
        ${undefined}                                                     | ${'apex > car > model'}                            | ${'apex > car > model'}
        ${mockAccountVar}                                                | ${undefined}                                       | ${'MyAccount'}
        ${mockSObjectFieldSecondLevelComboboxItem}                       | ${undefined}                                       | ${'MyAccount > Created By ID'}
        ${mockSObjectFieldSecondLevelEmptySubTextComboboxItem}           | ${undefined}                                       | ${'MyAccount > {!MyAccount.CreatedBy}'}
        ${mockSObjectFieldThirdLevelComboboxItem}                        | ${undefined}                                       | ${'MyAccount > Created By ID > Employee Number'}
        ${mockSObjectFieldFourthLevelComboboxItem}                       | ${undefined}                                       | ${'MyAccount > Created By ID > Manager ID > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelComboboxItem}             | ${undefined}                                       | ${'feedItemVariable > Created By ID (User) > About Me'}
        ${mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem} | ${undefined}                                       | ${'feedItemVariable > Created By ID (User) > Full Name'}
        ${mockPolymorphicSObjectEntitySecondLevelComboboxItem}           | ${undefined}                                       | ${'feedItemVariable > Created By ID (User)'}
        ${mockApexDefinedVariable}                                       | ${undefined}                                       | ${'vApexComplexTypeTestOne216'}
        ${mockApexFieldSecondLevelComboboxItem}                          | ${undefined}                                       | ${'vApexComplexTypeTestOne216 > booleanField'}
        ${mockApexFieldThirdLevelComboboxItem}                           | ${undefined}                                       | ${'vApexComplexTypeTestOne216 > acct > Annual Revenue'}
        ${mockApexSObjectEntitySecondLevelComboboxItem}                  | ${undefined}                                       | ${'vApexComplexTypeTestOne216 > acct'}
        ${mockEmailScreenFieldAutoSecondLevelFieldComboboxItem}          | ${undefined}                                       | ${'emailScreenFieldAutomaticOutput > Read Only'}
        ${mockApexCallApexClassOutputSecondLevelComboboxItem}            | ${undefined}                                       | ${'Outputs from apexCall_Car_automatic_output > car'}
    `(' returns expected label', ({ item, label, expectedLabel }) => {
        test(`For item: ${
            item ? '(displayText) ' + item.displayText : item
        } and label: ${label}, should return: ${expectedLabel} `, () => {
            const actual = getPillLabel(item, label);
            expect(actual).toBe(expectedLabel);
        });
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
