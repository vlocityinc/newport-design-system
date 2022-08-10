import { getRelatedRecordName } from '../relatedRecordLib';

describe('"getRelatedRecordName"', () => {
    it.each`
        field                                                                                                                                                      | inputReference            | expected
        ${{ apiName: 'AccountId', isCustom: false, isPolymorphic: false, isRelatedRecordChild: false, sobjectName: 'Case', referenceToNames: ['Account'] }}        | ${'$Record.Account'}      | ${'Account'}
        ${{ apiName: 'OwnerId', isCustom: false, isPolymorphic: true, isRelatedRecordChild: false, sobjectName: 'Case', referenceToNames: ['Group', 'User'] }}     | ${'$Record.Owner:User'}   | ${'User'}
        ${{ apiName: 'CustomObj__c', isCustom: true, isPolymorphic: false, isRelatedRecordChild: false, sobjectName: 'Case', referenceToNames: ['CustomObj__c'] }} | ${'$Record.CustomObj__r'} | ${'CustomObj__c'}
        ${{ apiName: 'Events', isCustom: false, isPolymorphic: true, isRelatedRecordChild: true, sobjectName: 'Event', referenceToNames: ['Account', 'Case'] }}    | ${'$Record.Events'}       | ${'Event'}
        ${{ apiName: 'CaseComments', isCustom: false, isPolymorphic: false, isRelatedRecordChild: true, sobjectName: 'CaseComment', referenceToNames: ['Case'] }}  | ${'$Record.CaseComments'} | ${'CaseComment'}
    `(
        'should return "$expected" for parameters => field: { apiName: "$field.apiName", isCustom: $field.isCustom, isPolymorphic: $field.isPolymorphic, ' +
            'isRelatedRecordChild: $field.isRelatedRecordChild, sobjectName: $field.sobjectName, referenceToNames: $field.referenceToNames},  inputReference: "$inputReference"',
        async ({ field, inputReference, expected }) => {
            const actual = getRelatedRecordName(field, inputReference);
            expect(actual).toBe(expected);
        }
    );
});
