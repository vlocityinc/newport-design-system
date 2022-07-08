import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { contactFields as mockContactFields } from 'serverData/GetFieldsForEntity/contactFields.json';
import { contractFields as mockContractFields } from 'serverData/GetFieldsForEntity/contractFields.json';
import { feedItemFields as mockfeedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleFieldsFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { recommendationFields as mockRecommendationFields } from 'serverData/GetFieldsForEntity/recommendationFields.json';
import { userFields as mockUserFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { accountFields as mockRelatedAccountFields } from 'serverData/GetRelatedRecordFieldsForEntity/accountFields.json';
import { contactFields as mockRelatedContactFields } from 'serverData/GetRelatedRecordFieldsForEntity/contactFields.json';
import { contractFields as mockRelatedContractFields } from 'serverData/GetRelatedRecordFieldsForEntity/contractFields.json';
import { feedItemFields as mockRelatedFeedItemFields } from 'serverData/GetRelatedRecordFieldsForEntity/feedItemFields.json';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleRelatedFieldsFields } from 'serverData/GetRelatedRecordFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { recommendationFields as mockRelatedRecommendationFields } from 'serverData/GetRelatedRecordFieldsForEntity/recommendationFields.json';
import { userFields as mockRelatedUserFields } from 'serverData/GetRelatedRecordFieldsForEntity/userFields.json';

export const getEntity = jest.fn().mockImplementation((apiName) => {
    return mockEntities.find((entity) => entity.apiName === apiName);
});

export const getFieldsForEntity = jest.fn().mockImplementation((entityName) => {
    if (entityName === 'Account') {
        return mockAccountFields;
    } else if (entityName === 'Contact') {
        return mockContactFields;
    } else if (entityName === 'Contract') {
        return mockContractFields;
    } else if (entityName === 'FeedItem') {
        return mockfeedItemFields;
    } else if (entityName === 'Object_with_all_possible_fields__c') {
        return mockObjectWithAllPossibleFieldsFields;
    } else if (entityName === 'Recommendation') {
        return mockRecommendationFields;
    } else if (entityName === 'User') {
        return mockUserFields;
    }
    return undefined;
});

export const getRelatedRecordFieldsForEntity = jest.fn().mockImplementation((entityName) => {
    if (entityName === 'Account') {
        return mockRelatedAccountFields;
    } else if (entityName === 'Contact') {
        return mockRelatedContactFields;
    } else if (entityName === 'Contract') {
        return mockRelatedContractFields;
    } else if (entityName === 'FeedItem') {
        return mockRelatedFeedItemFields;
    } else if (entityName === 'Object_with_all_possible_fields__c') {
        return mockObjectWithAllPossibleRelatedFieldsFields;
    } else if (entityName === 'Recommendation') {
        return mockRelatedRecommendationFields;
    } else if (entityName === 'User') {
        return mockRelatedUserFields;
    }
    return undefined;
});
