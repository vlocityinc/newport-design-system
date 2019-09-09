import { createElement } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import RecordSobjectAndQueryFields from 'builder_platform_interaction/recordSobjectAndQueryFields';
import { sObjectOrSObjectCollectionByEntitySelector } from 'builder_platform_interaction/selectors';
import * as store from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    recordEntityName: 'Account',
    outputReference: '',
    queriedFields: [
        { field: { value: '', error: null }, rowIndex: 'RECORD_LOOKUP_FIELD_1' }
    ]
};

const selectors = {
    sobjectPicker:
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    fieldsList: 'builder_platform_interaction-record-query-fields'
};

const getSObjectPicker = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelector(
        selectors.sobjectPicker
    );
};

const getFieldList = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelector(
        selectors.fieldsList
    );
};

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-record-sobject-and-query-fields',
        {
            is: RecordSobjectAndQueryFields
        }
    );
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        sObjectOrSObjectCollectionByEntitySelector: jest.fn()
    };
});

describe('record-store-fields', () => {
    sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
        jest.fn().mockReturnValue([store.accountSObjectVariable])
    );
    describe('sobject resource picker and fields', () => {
        let recordSobjectAndQueryFields;

        it('contains an sObject resource picker', () => {
            recordSobjectAndQueryFields = createComponentUnderTest();
            expect(
                getSObjectPicker(recordSobjectAndQueryFields)
            ).not.toBeNull();
        });

        it('do not show fields list if outputReference is not set', () => {
            recordSobjectAndQueryFields = createComponentUnderTest();
            expect(getFieldList(recordSobjectAndQueryFields)).toBeNull();
        });
    });
});
