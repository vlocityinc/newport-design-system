import {
    getSObjectOrSObjectCollectionFilter,
    sObjectOrSObjectCollectionFilterToIsCollection,
    SOBJECT_OR_SOBJECT_COLLECTION_FILTER
} from 'builder_platform_interaction/filterTypeLib';

describe('filter type lib', () => {
    describe('getSObjectOrSObjectCollectionFilter', () => {
        it.each`
            isCollectionValue | expectedSObjectOrSObjectCollectionFilter
            ${true}           | ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION}
            ${false}          | ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT}
            ${undefined}      | ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT}
        `(
            'SObjectOrSObjectCollectionFilter should be $expectedSObjectOrSObjectCollectionFilter when isCollection is $isCollectionValue',
            ({ isCollectionValue, expectedSObjectOrSObjectCollectionFilter }) => {
                const sObjectOrSObjectCollectionFilter = getSObjectOrSObjectCollectionFilter(isCollectionValue);

                expect(sObjectOrSObjectCollectionFilter).toBe(expectedSObjectOrSObjectCollectionFilter);
            }
        );
    });
    describe('sObjectOrSObjectCollectionFilterToIsCollection', () => {
        it.each`
            sObjectOrSObjectCollectionFilter                                      | expectedIsCollection
            ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION}            | ${true}
            ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT}                       | ${false}
            ${SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION} | ${undefined}
            ${undefined}                                                          | ${undefined}
        `(
            'isCollection should be $expectedIsCollection when sObjectOrSObjectCollectionFilter is $sObjectOrSObjectCollectionFilter',
            ({ sObjectOrSObjectCollectionFilter, expectedIsCollection }) => {
                const actualIsCollection = sObjectOrSObjectCollectionFilterToIsCollection(
                    sObjectOrSObjectCollectionFilter
                );

                expect(actualIsCollection).toBe(expectedIsCollection);
            }
        );
    });
});
