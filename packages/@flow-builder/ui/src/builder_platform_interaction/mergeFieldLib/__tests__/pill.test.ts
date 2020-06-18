import {
    convertCapitalizedToSpacedString,
    getPillLabel,
    getGlobalConstantOrSystemVariableOrOtherGlobalsLabel,
    getPillTooltip,
    getOtherGlobalApiName,
    getOtherGlobalFieldName,
    getOtherGlobalLabel
} from '../pill';
import {
    mockGlobalConstantEmptyStringComboboxItem,
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
        ${mockGlobalConstantEmptyStringComboboxItem}                     | ${undefined}                                       | ${'EmptyString'}
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

describe('getOtherGlobalApiName', () => {
    test.each`
        globalEntry                                 | expected
        ${''}                                       | ${''}
        ${'$Profile'}                               | ${'Profile'}
        ${'$Profile.AMiddleNameThisFieldIsCalled'}  | ${'Profile'}
        ${'$$Profile.AMiddleNameThisFieldIsCalled'} | ${'$Profile'}
        ${'$Profile$.AMiddleNameThisFieldIsCalled'} | ${'Profile$'}
    `('Should return $expected for $globalEntry', ({ globalEntry, expected }) => {
        const actual = getOtherGlobalApiName(globalEntry);
        expect(actual).toBe(expected);
    });
});

describe('getOtherGlobalFieldName', () => {
    test.each`
        globalEntry                                         | expected
        ${''}                                               | ${null}
        ${undefined}                                        | ${null}
        ${null}                                             | ${null}
        ${'$Profile'}                                       | ${null}
        ${'$Profile.AMiddleNameThisFieldIsCalled'}          | ${'AMiddleNameThisFieldIsCalled'}
        ${'$$Profile.AMiddleNameThisFieldIsCalled'}         | ${'AMiddleNameThisFieldIsCalled'}
        ${'$$Profile..AMiddleNameThisFieldIsCalled'}        | ${'.AMiddleNameThisFieldIsCalled'}
        ${'$Profile$.AMiddleNameThisFieldIsCalled.Subpart'} | ${'AMiddleNameThisFieldIsCalled.Subpart'}
    `('Should return $expected for $globalEntry', ({ globalEntry, expected }) => {
        const actual = getOtherGlobalFieldName(globalEntry);
        expect(actual).toBe(expected);
    });
});

describe('getOtherGlobalLabel', () => {
    test.each`
        globalEntry                                 | expectedLabel
        ${''}                                       | ${''}
        ${'$Profile'}                               | ${'$Profile'}
        ${'$Profile.AMiddleNameThisFieldIsCalled'}  | ${'A Middle Name This Field Is Called for Profile'}
        ${'$User.AMiddleNameThisFieldIsCalled'}     | ${'A Middle Name This Field Is Called for User'}
        ${'$Profile$.AMiddleNameThisFieldIsCalled'} | ${'A Middle Name This Field Is Called for Profile$'}
    `('Should return $expectedLabel for $globalEntry', ({ globalEntry, expectedLabel }) => {
        const actual = getOtherGlobalLabel(globalEntry);
        expect(actual).toBe(expectedLabel);
    });
});

describe('convertCapitalizedToSpacedString', () => {
    test.each`
        rawString                   | expectedSpacedString
        ${'ACapitalizedMiddleName'} | ${'A Capitalized Middle Name'}
        ${'notacapitalizedone'}     | ${'notacapitalizedone'}
    `(
        'Converted string for given string $rawString should be: $expectedSpacedString',
        ({ rawString, expectedSpacedString }) => {
            const actual = convertCapitalizedToSpacedString(rawString);
            expect(actual).toBe(expectedSpacedString);
        }
    );
});

describe('getGlobalConstantOrSystemVariableLabel', () => {
    test.each`
        rawValue                                    | expectedLabel
        ${null}                                     | ${''}
        ${undefined}                                | ${''}
        ${''}                                       | ${''}
        ${'$GlobalConstant.True'}                   | ${'True'}
        ${'$GlobalConstant.False'}                  | ${'False'}
        ${'$GlobalConstant.EmptyString'}            | ${'EmptyString'}
        ${'GlobalConstant.False'}                   | ${'GlobalConstant.False'}
        ${'$Flow.CurrentDate'}                      | ${'Current Date'}
        ${'$Flow.CurrentDateTime'}                  | ${'Current Date & Time'}
        ${'$Flow.FaultMessage'}                     | ${'Error Text'}
        ${'$Flow.CurrentStage'}                     | ${'Current Flow Stage'}
        ${'$Flow.InterviewStartTime'}               | ${'Flow Start Time'}
        ${'$Flow.ActiveStages'}                     | ${'Active Flow Stage'}
        ${'$Flow.InterviewGuid'}                    | ${'Flow Instance Id'}
        ${'$Flow.CurrentRecord'}                    | ${'Specified Related Record'}
        ${'$API.Session_ID'}                        | ${'Session Id'}
        ${'$Profile.AMiddleNameThisFieldIsCalled'}  | ${'A Middle Name This Field Is Called for Profile'}
        ${'$Profile2.AMiddleNameThisFieldIsCalled'} | ${'$Profile2.AMiddleNameThisFieldIsCalled'}
    `('Label for $rawValue should be: $expectedLabel', ({ rawValue, expectedLabel }) => {
        const actual = getGlobalConstantOrSystemVariableOrOtherGlobalsLabel(rawValue);
        expect(actual).toBe(expectedLabel);
    });
});
