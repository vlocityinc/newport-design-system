import {
    getSObjectOrSObjectCollectionByEntityElements,
    byTypeWritableElementsSelector
} from '../menuDataSelector';
import * as storeLib from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const elementsInStore = {
    guid1: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid1',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'contactDevName',
        subtype: 'Contact'
    },
    guid2: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid2',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'accountDevName',
        subtype: 'Account'
    },
    guid3: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid3',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'caseDevName',
        subtype: 'Case'
    },
    guid4: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid4',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'opportunityDevName',
        subtype: 'Opportunity'
    },
    guid5: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid5',
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: 'opportunityCollectionDevName',
        subtype: 'Opportunity'
    },
    guid6: {
        dataType: 'SObject',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid6',
        isCanvasElement: false,
        isCollection: true,
        isInput: false,
        isOutput: false,
        name: 'campaignCollectionDevName',
        subtype: 'Campaign'
    },
    guid7: {
        dataType: 'Text',
        description: '',
        elementType: ELEMENT_TYPE.TEXT_TEMPLATE,
        guid: 'guid7',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'textTemplate'
    },
    guid8: {
        dataType: 'Text',
        description: '',
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'guid8',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'textVariable'
    }
};

const mockQueryableEntities = [
    {
        apiName: 'Case',
        deletable: false,
        queryable: true,
        updateable: false,
        createable: false
    }
];

const mockUpdateableEntities = [
    {
        apiName: 'Contact',
        deletable: false,
        queryable: false,
        updateable: true,
        createable: false
    }
];

const mockCreateableEntities = [
    {
        apiName: 'Account',
        deletable: false,
        queryable: false,
        updateable: false,
        createable: true
    }
];

const mockDeleteableEntities = [
    {
        apiName: 'Opportunity',
        deletable: true,
        queryable: false,
        updateable: false,
        createable: false
    },
    {
        apiName: 'Campaign',
        deletable: true,
        queryable: false,
        updateable: false,
        createable: false
    }
];

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getQueryableEntities: () => {
            return mockQueryableEntities;
        },
        getUpdateableEntities: () => {
            return mockUpdateableEntities;
        },
        getCreateableEntities: () => {
            return mockCreateableEntities;
        },
        getDeletableEntities: () => {
            return mockDeleteableEntities;
        }
    };
});

describe('Retrieve sObject collection & sObject elements', () => {
    it('without any extra option should return only sObject elements (not sObject collection)', () => {
        const emptyRetrieveOptions = {};
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            emptyRetrieveOptions
        );
        expect(result).toHaveLength(4);
        expect(result[0]).toHaveProperty('name', 'contactDevName');
        expect(result[1]).toHaveProperty('name', 'accountDevName');
        expect(result[2]).toHaveProperty('name', 'caseDevName');
        expect(result[3]).toHaveProperty('name', 'opportunityDevName');
    });
    it('with option to select all sObject & sObject collection should return all sObject and sObject collection elements', () => {
        const retrieveAllSObjectAndSobjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllSObjectAndSobjectCollectionOptions
        );
        expect(result).toHaveLength(6);
        expect(result[0]).toHaveProperty('name', 'contactDevName');
        expect(result[1]).toHaveProperty('name', 'accountDevName');
        expect(result[2]).toHaveProperty('name', 'caseDevName');
        expect(result[3]).toHaveProperty('name', 'opportunityDevName');
        expect(result[4]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
        expect(result[5]).toHaveProperty('name', 'campaignCollectionDevName');
    });
    it('with options to select all sObject & sObject collection and only queryable elements should return the only one queryable element', () => {
        const retrieveAllQueryableSObjectAndSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true,
            queryable: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllQueryableSObjectAndSObjectCollectionOptions
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'caseDevName');
    });
    it('with options to select all sObject & sObject collection and only createable elements should return the only one createable element', () => {
        const retrieveAllCreateableSObjectAndSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true,
            createable: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllCreateableSObjectAndSObjectCollectionOptions
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'accountDevName');
    });
    it('with options to select all sObject & sObject collection and only updateable elements should return the only one updateable element', () => {
        const retrieveAllUpdateableSObjectAndSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true,
            updateable: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllUpdateableSObjectAndSObjectCollectionOptions
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'contactDevName');
    });
    it('with options to select all sObject & sObject collection and only deleteable elements should return the three deleteable elements', () => {
        const retrieveAllDeleteableSObjectAndSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true,
            deleteable: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllDeleteableSObjectAndSObjectCollectionOptions
        );
        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('name', 'opportunityDevName');
        expect(result[1]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
        expect(result[2]).toHaveProperty('name', 'campaignCollectionDevName');
    });
    it('with option to filter only by entity name opportunity elements should return all elements with entity name opportunity', () => {
        const retrieveAllOpportunitySObjectAndSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: true,
            entityName: 'Opportunity'
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllOpportunitySObjectAndSObjectCollectionOptions
        );
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('name', 'opportunityDevName');
        expect(result[1]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
    });
    it('with option to filter only sObject collection should return the two sObject collection elements', () => {
        const retrieveAllSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: false,
            isCollection: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllSObjectCollectionOptions
        );
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
        expect(result[1]).toHaveProperty('name', 'campaignCollectionDevName');
    });
    it('with options to filter only sObject collection & entity name Opportunity should return only one Opportunity collection element', () => {
        const retrieveAllOpportunitySObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: false,
            isCollection: true,
            entityName: 'Opportunity'
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllOpportunitySObjectCollectionOptions
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
    });
    it('with options to filter only sObject collection & entity name Account should return an empty array', () => {
        const retrieveAllAccountSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: false,
            isCollection: true,
            entityName: 'Account'
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllAccountSObjectCollectionOptions
        );
        expect(result).toHaveLength(0);
    });
    it('with options to filter only sObject collection with entity name Opportunity & deleteable entity should return the only one sObject Opportunity collection element', () => {
        const retrieveAllDeleteableOpportunitySObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: false,
            isCollection: true,
            deleteable: true,
            entityName: 'Opportunity'
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllDeleteableOpportunitySObjectCollectionOptions
        );
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
    });
    it('with options to filter only sObject collection & deleteable entity should return the two sObject deletable collection elements', () => {
        const retrieveAllDeleteableSObjectCollectionOptions = {
            allSObjectsAndSObjectCollections: false,
            isCollection: true,
            deleteable: true
        };
        const result = getSObjectOrSObjectCollectionByEntityElements(
            elementsInStore,
            retrieveAllDeleteableSObjectCollectionOptions
        );
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty(
            'name',
            'opportunityCollectionDevName'
        );
        expect(result[1]).toHaveProperty('name', 'campaignCollectionDevName');
    });
});

describe('byTypeWritableElementsSelector', () => {
    it('should only retrieve variables of the given type', () => {
        byTypeWritableElementsSelector(elementsInStore.guid8.dataType);
        const selector = storeLib.createSelector.mock.calls[0][1];
        const result = selector(elementsInStore);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject(elementsInStore.guid8);
    });
    it('should call createSelector', () => {
        const returnVal = 'returnVal';
        storeLib.createSelector.mockImplementation(() => returnVal);
        const result = byTypeWritableElementsSelector('Text');
        expect(result).toBe(returnVal);
        expect(storeLib.createSelector).toHaveBeenCalledTimes(1);
    });
});
