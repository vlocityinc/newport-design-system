import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { contactFields as mockContactFields } from 'serverData/GetFieldsForEntity/contactFields.json';
import { contractFields as mockContractFields } from 'serverData/GetFieldsForEntity/contractFields.json';
import { feedItemFields as mockfeedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleFieldsFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { recommendationFields as mockRecommendationFields } from 'serverData/GetFieldsForEntity/recommendationFields.json';
import { userFields as mockUserFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { accountFields as mockRelatedAccountFields } from 'serverData/GetRelatedRecordFieldsForEntity/accountFields.json';
import { caseFields as mockCaseRelatedFields } from 'serverData/GetRelatedRecordFieldsForEntity/caseFields.json';
import { contactFields as mockRelatedContactFields } from 'serverData/GetRelatedRecordFieldsForEntity/contactFields.json';
import { contractFields as mockRelatedContractFields } from 'serverData/GetRelatedRecordFieldsForEntity/contractFields.json';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleRelatedFieldsFields } from 'serverData/GetRelatedRecordFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { recommendationFields as mockRelatedRecommendationFields } from 'serverData/GetRelatedRecordFieldsForEntity/recommendationFields.json';
import { userFields as mockRelatedUserFields } from 'serverData/GetRelatedRecordFieldsForEntity/userFields.json';
const actualSObjectLib = jest.requireActual('builder_platform_interaction/sobjectLib');

export const getEntity = jest.fn((apiName) => mockEntities.find((entity) => entity.apiName === apiName));

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
    } else if (entityName === 'Case') {
        return mockCaseRelatedFields;
    } else if (entityName === 'Object_with_all_possible_fields__c') {
        return mockObjectWithAllPossibleRelatedFieldsFields;
    } else if (entityName === 'Recommendation') {
        return mockRelatedRecommendationFields;
    } else if (entityName === 'User') {
        return mockRelatedUserFields;
    }
    return undefined;
});

export const fetchFieldsForEntity = jest.fn().mockImplementation((entityName) => {
    if (entityName === 'Account') {
        return Promise.resolve(mockAccountFields);
    } else if (entityName === 'User') {
        return Promise.resolve(mockUserFields);
    } else if (entityName === 'FeedItem') {
        return Promise.resolve(mockfeedItemFields);
    } else if (entityName === 'Contact') {
        return Promise.resolve(mockContactFields);
    } else if (entityName === 'Contract') {
        return Promise.resolve(mockContractFields);
    } else if (entityName === 'Object_with_all_possible_fields__c') {
        return Promise.resolve(mockObjectWithAllPossibleFieldsFields);
    } else if (entityName === 'Recommendation') {
        return Promise.resolve(mockRecommendationFields);
    }
    return Promise.reject(`No entity with name ${entityName}`);
});

export const fetchRelatedRecordFieldsForEntity = jest.fn().mockImplementation((entityName) => {
    if (entityName === 'Account') {
        return Promise.resolve(mockRelatedAccountFields);
    } else if (entityName === 'User') {
        return Promise.resolve(mockRelatedUserFields);
    } else if (entityName === 'Case') {
        return Promise.resolve(mockCaseRelatedFields);
    } else if (entityName === 'Contact') {
        return Promise.resolve(mockRelatedContactFields);
    } else if (entityName === 'Contract') {
        return Promise.resolve(mockRelatedContractFields);
    } else if (entityName === 'Object_with_all_possible_fields__c') {
        return Promise.resolve(mockObjectWithAllPossibleRelatedFieldsFields);
    } else if (entityName === 'Recommendation') {
        return Promise.resolve(mockRelatedRecommendationFields);
    }
    return Promise.reject(`No entity with name ${entityName}`);
});

export const getEntityFieldWithApiName = actualSObjectLib.getEntityFieldWithApiName;
