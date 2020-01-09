import {
    getSObjectOrSObjectCollectionByEntityElements,
    byTypeWritableElementsSelector,
    byElementTypeElementsSelector,
    writableElementsSelector,
    getCanContainSObjectElements
} from '../menuDataSelector';
import {
    apexCallAutomaticAnonymousStringOutput,
    createAccountWithAutomaticOutput,
    accountSObjectVariable,
    accountSObjectCollectionVariable,
    caseSObjectVariable,
    caseSObjectCollectionVariable,
    contactSObjectVariable,
    campaignSObjectVariable,
    opportunitySObjectVariable,
    opportunitySObjectCollectionVariable,
    textTemplate1,
    stringVariable,
    actionCallElement,
    apexComplexTypeVariable,
    apexComplexTypeCollectionVariable,
    apexCarVariable,
    lightningCompAutomaticOutputNoSObjectExtension,
    lightningCompAutomaticOutputContainsAccountExtension,
    lightningCompAutomaticOutputSObjectCollectionExtension,
    apexCallStringAutomaticOutput,
    apexCallAccountAutomaticOutput,
    localActionApexDoesNotContainSObjectAutomaticOutput,
    localActionApexDoesContainsSObjectAutomaticOutput
} from 'mock/storeData';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';

jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);
jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require.requireActual(
            'builder_platform_interaction/storeLib'
        ),
        mocked = require('builder_platform_interaction_mocks/storeLib');
    return Object.assign({}, mocked, { createSelector: actual.createSelector });
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const mockQueryableEntitiesInStore = [
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
            apiName: 'Campaign',
            deletable: true,
            queryable: false,
            updateable: false,
            createable: false
        },
        {
            apiName: 'Opportunity',
            deletable: true,
            queryable: false,
            updateable: false,
            createable: false
        }
    ];
    return {
        getQueryableEntities: () => {
            return mockQueryableEntitiesInStore;
        },
        getUpdateableEntities: () => {
            return mockUpdateableEntities;
        },
        getCreateableEntities: () => {
            return mockCreateableEntities;
        },
        getDeletableEntities: () => {
            return mockDeleteableEntities;
        },
        getEntity: jest.fn()
    };
});

describe('menuDataSelector', () => {
    const STORE_INSTANCE = {
        elements: {
            accountSObjectVariable,
            accountSObjectCollectionVariable,
            actionCallElement,
            apexCallAutomaticAnonymousStringOutput,
            caseSObjectVariable,
            caseSObjectCollectionVariable,
            campaignSObjectVariable,
            contactSObjectVariable,
            createAccountWithAutomaticOutput,
            opportunitySObjectVariable,
            opportunitySObjectCollectionVariable,
            stringVariable,
            textTemplate1
        }
    };
    const { elements: ELEMENTS_IN_STORE } = STORE_INSTANCE;

    describe('getSObjectOrSObjectCollectionByEntityElements', () => {
        it('with empty options returns only sObject elements (not sObject collection)', () => {
            const retrieveOptions = {};
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(5);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectVariable,
                    caseSObjectVariable,
                    campaignSObjectVariable,
                    contactSObjectVariable,
                    opportunitySObjectVariable
                ])
            );
        });
        it('with null options returns all sObject elements', () => {
            const retrieveOptions = null;
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(8);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectVariable,
                    accountSObjectCollectionVariable,
                    caseSObjectVariable,
                    caseSObjectCollectionVariable,
                    campaignSObjectVariable,
                    contactSObjectVariable,
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        it('with options to select all sObject & sObject collection returns all sObject and sObject collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(8);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectVariable,
                    accountSObjectCollectionVariable,
                    caseSObjectVariable,
                    caseSObjectCollectionVariable,
                    campaignSObjectVariable,
                    contactSObjectVariable,
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        it('with options to select all sObject & sObject collection and only queryable elements returns only queryable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                queryable: true
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    caseSObjectVariable,
                    caseSObjectCollectionVariable
                ])
            );
        });
        it('with options to select all sObject & sObject collection and only createable elements returns only createable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                createable: true
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectVariable,
                    accountSObjectCollectionVariable
                ])
            );
        });
        it('with options to select all sObject & sObject collection and only updateable elements returns only updateable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                updateable: true
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toEqual([contactSObjectVariable]);
        });
        it('with options to select all sObject & sObject collection and only deleteable elements returns only deleteable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                deleteable: true
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(3);
            expect(results).toEqual(
                expect.arrayContaining([
                    campaignSObjectVariable,
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        it('with options to filter only by entity name "Opportunity" elements returns all elements with entity name "Opportunity', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                entityName: 'Opportunity'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        it('with options to filter only sObject collection returns the sObject collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(3);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectCollectionVariable,
                    caseSObjectCollectionVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        it('with options to filter only sObject collection & entity name "Case" returns sonly "Case" collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                entityName: 'Case'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toEqual([caseSObjectCollectionVariable]);
        });
        it('with options to filter only sObject collection & entity name "Campaign" returns an empty array', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                entityName: 'Campaign'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toHaveLength(0);
        });
        it('with options to filter only sObject collection with entity name "Opportunity"" & deleteable entity returns the only one sObject Opportunity collection element', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                deleteable: true,
                entityName: 'Opportunity'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toEqual([opportunitySObjectCollectionVariable]);
        });
        it('with options to filter only sObject collection & deleteable entity returns the "Opportunity" sObject deletable collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion:
                    SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                deleteable: true
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(
                ELEMENTS_IN_STORE,
                retrieveOptions
            );
            expect(results).toEqual([opportunitySObjectCollectionVariable]);
        });
    });
    describe('byTypeWritableElementsSelector', () => {
        it('should only retrieve writable variables of the given type', () => {
            const filteredElements = byTypeWritableElementsSelector(
                stringVariable.dataType
            )(STORE_INSTANCE);
            expect(filteredElements).toEqual([stringVariable]);
        });
    });

    describe('writableElementsSelector', () => {
        it('returns only writable elements', () => {
            const results = writableElementsSelector(STORE_INSTANCE);
            expect(results).toHaveLength(11);
            expect(results).toEqual(
                expect.arrayContaining([
                    accountSObjectVariable,
                    accountSObjectCollectionVariable,
                    apexCallAutomaticAnonymousStringOutput,
                    caseSObjectVariable,
                    caseSObjectCollectionVariable,
                    campaignSObjectVariable,
                    contactSObjectVariable,
                    createAccountWithAutomaticOutput,
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable,
                    stringVariable
                ])
            );
        });
    });

    describe('byElementTypeElementsSelector', () => {
        it('does not fail with empty element type param', () => {
            const results = byElementTypeElementsSelector()(STORE_INSTANCE);
            expect(results).toHaveLength(0);
        });
        it('returns only single element matching given element type param', () => {
            const results = byElementTypeElementsSelector(
                textTemplate1.elementType
            )(STORE_INSTANCE);
            expect(results).toEqual([textTemplate1]);
        });
        it('return only elements matching given element types params', () => {
            const results = byElementTypeElementsSelector(
                apexCallAutomaticAnonymousStringOutput.elementType,
                textTemplate1.elementType
            )(STORE_INSTANCE);
            expect(results).toEqual([
                apexCallAutomaticAnonymousStringOutput,
                textTemplate1
            ]);
        });
    });
});
describe('getCanContainSObjectElements', () => {
    beforeAll(() => {
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        setApexClasses();
    });
    it('returns apex action with SObject automatic output', () => {
        const result = getCanContainSObjectElements([
            apexCallAccountAutomaticOutput
        ]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty(
            'name',
            apexCallAccountAutomaticOutput.name
        );
    });
    it('does not return apex action with primitive automatic output', () => {
        const result = getCanContainSObjectElements([
            apexCallStringAutomaticOutput
        ]);

        expect(result).toHaveLength(0);
    });
    it('returns flow extension that has SObject in automatic output', () => {
        const result = getCanContainSObjectElements([
            lightningCompAutomaticOutputContainsAccountExtension
        ]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty(
            'name',
            lightningCompAutomaticOutputContainsAccountExtension.name
        );
    });
    it('does not return flow extension that does not have SObject in automatic output', () => {
        const result = getCanContainSObjectElements([
            lightningCompAutomaticOutputNoSObjectExtension
        ]);

        expect(result).toHaveLength(0);
    });
    it('returns apex variable which contains SObject', () => {
        const result = getCanContainSObjectElements([apexComplexTypeVariable]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', apexComplexTypeVariable.name);
    });
    it('does not return apex variable which does not contain SObject', () => {
        const result = getCanContainSObjectElements([apexCarVariable]);

        expect(result).toHaveLength(0);
    });
    it('does not return apex collection variable even if apex contains SObject', () => {
        const result = getCanContainSObjectElements([
            apexComplexTypeCollectionVariable
        ]);

        expect(result).toHaveLength(0);
    });
    it('returns local action that has apex variable which contains SObject', () => {
        const result = getCanContainSObjectElements([
            localActionApexDoesContainsSObjectAutomaticOutput
        ]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty(
            'name',
            localActionApexDoesContainsSObjectAutomaticOutput.name
        );
    });
    it('does not return local action that has apex variable which contains SObject that does not correspond to retrieveOptions', () => {
        // localActionApexDoesContainsSObjectAutomaticOutput returns ApexComplexTypeOne216, that has account field. Account is mocked to not be deletable here
        const result = getCanContainSObjectElements(
            [localActionApexDoesContainsSObjectAutomaticOutput],
            { deleteable: true }
        );

        expect(result).toHaveLength(0);
    });
    it('does not return local action that has apex variable which does not contain SObject', () => {
        const result = getCanContainSObjectElements([
            localActionApexDoesNotContainSObjectAutomaticOutput
        ]);

        expect(result).toHaveLength(0);
    });
    describe('collection criterion', () => {
        describe('Only single values', () => {
            it('does not return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputSObjectCollectionExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                    }
                );

                expect(result).toHaveLength(0);
            });
            it('does return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputContainsAccountExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    lightningCompAutomaticOutputContainsAccountExtension.name
                );
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements(
                    [localActionApexDoesContainsSObjectAutomaticOutput],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    localActionApexDoesContainsSObjectAutomaticOutput.name
                );
            });
        });
        describe('Only collections', () => {
            it('does return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputSObjectCollectionExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    lightningCompAutomaticOutputSObjectCollectionExtension.name
                );
            });
            it('does not return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputContainsAccountExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(0);
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements(
                    [localActionApexDoesContainsSObjectAutomaticOutput],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    localActionApexDoesContainsSObjectAutomaticOutput.name
                );
            });
        });
        describe('Both single values and collections', () => {
            it('does return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputSObjectCollectionExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    lightningCompAutomaticOutputSObjectCollectionExtension.name
                );
            });
            it('does return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements(
                    [lightningCompAutomaticOutputContainsAccountExtension],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    lightningCompAutomaticOutputContainsAccountExtension.name
                );
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements(
                    [localActionApexDoesContainsSObjectAutomaticOutput],
                    {
                        sobjectCollectionCriterion:
                            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                    }
                );

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty(
                    'name',
                    localActionApexDoesContainsSObjectAutomaticOutput.name
                );
            });
        });
    });
});
