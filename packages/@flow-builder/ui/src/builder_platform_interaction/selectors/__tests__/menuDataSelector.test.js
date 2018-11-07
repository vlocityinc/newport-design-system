import { getSObjectOrSObjectCollectionByEntityElements, byTypeWritableElementsSelector } from "../menuDataSelector";
import * as storeLib from 'builder_platform_interaction/storeLib';

const elementsInStore = {
    'guid1':{
        dataType: 'SObject',
        description: '',
        elementType: 'VARIABLE',
        guid: 'guid1',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'contactDevName',
        objectType: 'Contact',
    },
    'guid2': {
        dataType: 'SObject',
        description: '',
        elementType: 'VARIABLE',
        guid: 'guid2',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'accountDevName',
        objectType: 'Account',
    },
    'guid3': {
        dataType: 'SObject',
        description: '',
        elementType: 'VARIABLE',
        guid: 'guid3',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'caseDevName',
        objectType: 'Case',
    },
    'guid4': {
        dataType: 'SObject',
        description: '',
        elementType: 'VARIABLE',
        guid: 'guid4',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'opportunityDevName',
        objectType: 'Opportunity',
    },
    'guid5': {
        dataType: 'Text',
        description: '',
        elementType: 'TEXT_TEMPLATE',
        guid: 'guid5',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'textTemplate',
    },
    'guid6': {
        dataType: 'Text',
        description: '',
        elementType: 'VARIABLE',
        guid: 'guid6',
        isCanvasElement: false,
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: 'textVariable',
    }
};

const mockQueryableEntities = [
    {
        "apiName":"Case",
        "deletable":false,
        "queryable":true,
        "updateable":false,
        "createable":false,
    }
];

const mockUpdateableEntities = [
    {
        "apiName":"Contact",
        "deletable":false,
        "queryable":false,
        "updateable":true,
        "createable":false,
    }
];

const mockCreateableEntities = [
    {
        "apiName":"Account",
        "deletable":false,
        "queryable":false,
        "updateable":false,
        "createable":true,
    }
];

const mockDeleteableEntities = [
    {
        "apiName":"Opportunity",
        "deletable":true,
        "queryable":false,
        "updateable":false,
        "createable":false,
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

describe('getSObjectOrSObjectCollectionByEntityElements selector', () => {
    describe('Retrieve all sObject collection & sObject elements without any extra option', () => {
        it('Should return all sObject elements', () => {
            const retrieveAllSObjectOptions = {allSObjectsAndSObjectCollections:true};
            const result = getSObjectOrSObjectCollectionByEntityElements(elementsInStore, retrieveAllSObjectOptions);
            expect(result).toHaveLength(4);
        });
    });
    describe('Filter only queryable sObject collection & sObject elements', () => {
        it('Should return the only one queryable element', () => {
            const retrieveAllUpdateableSObjectOptions = {allSObjectsAndSObjectCollections:true, queryable:true};
            const result = getSObjectOrSObjectCollectionByEntityElements(elementsInStore, retrieveAllUpdateableSObjectOptions);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', 'caseDevName');
        });
    });
    describe('Filter only createable sObject collection & sObject elements', () => {
        it('Should return the only one creatable element', () => {
            const retrieveAllUpdateableSObjectOptions = {allSObjectsAndSObjectCollections:true, createable:true};
            const result = getSObjectOrSObjectCollectionByEntityElements(elementsInStore, retrieveAllUpdateableSObjectOptions);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', 'accountDevName');
        });
    });
    describe('Filter only updateable sObject collection & sObject elements', () => {
        it('Should return the only one updateable element', () => {
            const retrieveAllUpdateableSObjectOptions = {allSObjectsAndSObjectCollections:true, updateable:true};
            const result = getSObjectOrSObjectCollectionByEntityElements(elementsInStore, retrieveAllUpdateableSObjectOptions);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', 'contactDevName');
        });
    });
    describe('Filter only deleteable sObject collection & sObject elements', () => {
        it('Should return the only one deleteable element', () => {
            const retrieveAllUpdateableSObjectOptions = {allSObjectsAndSObjectCollections:true, deleteable:true};
            const result = getSObjectOrSObjectCollectionByEntityElements(elementsInStore, retrieveAllUpdateableSObjectOptions);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', 'opportunityDevName');
        });
    });
});

describe('byTypeWritableElementsSelector', () => {
    it('should only retrieve variables of the given type', () => {
        byTypeWritableElementsSelector(elementsInStore.guid6.dataType);
        const selector = storeLib.createSelector.mock.calls[0][1];
        const result = selector(elementsInStore);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject(elementsInStore.guid6);
    });
    it('should call createSelector', () => {
        const returnVal = 'returnVal';
        storeLib.createSelector.mockImplementation(() => returnVal);
        const result = byTypeWritableElementsSelector('Text');
        expect(result).toBe(returnVal);
        expect(storeLib.createSelector).toHaveBeenCalledTimes(1);
    });
});