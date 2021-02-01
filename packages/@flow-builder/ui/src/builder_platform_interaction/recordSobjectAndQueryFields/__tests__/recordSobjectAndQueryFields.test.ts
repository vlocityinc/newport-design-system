import { createElement } from 'lwc';
import RecordSobjectAndQueryFields from 'builder_platform_interaction/recordSobjectAndQueryFields';

import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel, accountSObjectVariable, accountSObjectCollectionVariable } from 'mock/storeData';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const newSObjectConfig = {
    recordEntityName: 'Account',
    outputReference: '',
    isCollection: false,
    queriedFields: [],
    queryable: true
};
const newSObjectCollectionConfig = { ...newSObjectConfig, isCollection: true };
const queriedFields = [
    {
        field: {
            value: 'Id',
            error: null
        },
        rowIndex: '0e039142-2edf-4134-801f-48aa609daf60'
    },
    {
        field: {
            value: 'BillingCity',
            error: null
        },
        rowIndex: '52765eb5-c6c6-4116-9b33-cd88fc0bede4'
    },
    {
        field: {
            value: 'BillingCountry',
            error: null
        },
        rowIndex: '12673078-abe2-41c9-a9af-5a1672fd6b1d'
    }
];
const existingSObjectConfig = {
    recordEntityName: 'Account',
    outputReference: accountSObjectVariable.guid,
    isCollection: false,
    queryable: true,
    queriedFields
};
const existingSObjectCollectionConfig = {
    ...existingSObjectConfig,
    isCollection: true,
    outputReference: accountSObjectCollectionVariable.guid
};

const getSObjectSObjectCollectionPicker = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
const getRecordQueryFields = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_QUERY_FIELDS_COMPONENT);

const createComponentUnderTest = (props?: {}) => {
    const el = createElement('builder_platform_interaction-record-sobject-and-query-fields', {
        is: RecordSobjectAndQueryFields
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

describe('record-sobject-and-query-fields', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('new Element', () => {
        describe('"SObjectSObjectCollectionPicker" and "RecordSQueryFields"', () => {
            describe.each([
                ['', newSObjectConfig],
                ['collection ', newSObjectCollectionConfig]
            ])('for SObject %sconfig', (collectionHeader, config) => {
                let recordSobjectAndQueryFields;
                beforeEach(() => {
                    recordSobjectAndQueryFields = createComponentUnderTest(config);
                });
                it('contains an "SObjectSObjectCollectionPicker" displaying an empty value', () => {
                    const sobjectOrSobjectCollectionPicker = getSObjectSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    expect(sobjectOrSobjectCollectionPicker).not.toBeNull();
                    expect(sobjectOrSobjectCollectionPicker.value).toEqual('');
                });
                it('does NOT show "RecordSQueryFields"', () => {
                    expect(getRecordQueryFields(recordSobjectAndQueryFields)).toBeNull();
                });
            });
        });
    });
    describe('Existing Element', () => {
        describe('"SObjectSObjectCollectionPicker" and "RecordSQueryFields"', () => {
            describe.each([
                ['', existingSObjectConfig],
                ['collection ', existingSObjectCollectionConfig]
            ])('for SObject %sconfig', (collectionHeader, config) => {
                let recordSobjectAndQueryFields;
                beforeEach(() => {
                    recordSobjectAndQueryFields = createComponentUnderTest(config);
                });
                it('contains an "SObjectSObjectCollectionPicker" displaying the "outputReference" value', () => {
                    const sobjectOrSobjectCollectionPicker = getSObjectSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    expect(sobjectOrSobjectCollectionPicker).not.toBeNull();
                    expect(sobjectOrSobjectCollectionPicker.value).toEqual(config.outputReference);
                });
                it('does show "RecordSQueryFields" and have correct "queriedFields"', () => {
                    const recordQueryFields = getRecordQueryFields(recordSobjectAndQueryFields);
                    expect(recordQueryFields).not.toBeNull();
                    expect(recordQueryFields.queriedFields).toEqual(queriedFields);
                });
            });
        });
    });
    it('does NOT support pills by default', () => {
        const recordSobjectAndQueryFields = createComponentUnderTest();
        expect(recordSobjectAndQueryFields.isPillSupported).toBe(false);
    });
});
