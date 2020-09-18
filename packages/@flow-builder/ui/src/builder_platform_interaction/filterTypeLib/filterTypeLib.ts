/**
 * @enum {string} SOBJECT_OR_SOBJECT_COLLECTION_FILTER
 */
export enum SOBJECT_OR_SOBJECT_COLLECTION_FILTER {
    SOBJECT = 'SOBJECT',
    SOBJECT_COLLECTION = 'SOBJECT_COLLECTION',
    SOBJECT_OR_SOBJECT_COLLECTION = 'SOBJECT_OR_SOBJECT_COLLECTION'
}

export const getSObjectOrSObjectCollectionFilter = (isCollection: boolean): SOBJECT_OR_SOBJECT_COLLECTION_FILTER => {
    return isCollection
        ? SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
        : SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
};

export const sObjectOrSObjectCollectionFilterToIsCollection = (
    sObjectOrSObjectCollectionFilter: SOBJECT_OR_SOBJECT_COLLECTION_FILTER
): boolean | undefined => {
    return sObjectOrSObjectCollectionFilter
        ? sObjectOrSObjectCollectionFilter === SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
            ? true
            : sObjectOrSObjectCollectionFilter === SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
            ? false
            : undefined
        : undefined;
};
