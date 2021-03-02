import {
    getSObjectOrSObjectCollectionByEntityElements,
    byElementTypeElementsSelector,
    writableElementsSelector,
    getCanContainSObjectElements,
    isOrCanContainSelector,
    choiceSelector,
    QUERYABLE_FILTER,
    CREATEABLE_FILTER,
    UPDATEABLE_FILTER,
    DELETABLE_FILTER,
    RetrieveOptions
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
    localActionApexDoesContainsSObjectAutomaticOutput,
    apexComplexTypeTwoVariable,
    staticChoiceOther
} from 'mock/storeData';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);
jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeLib'),
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
        getEntity: (objectType) => {
            return { apiName: objectType.charAt(0).toUpperCase() + objectType.slice(1) };
        },
        getFieldsForEntity: jest.fn()
    };
});

jest.mock('builder_platform_interaction/subflowsLib', () => require('builder_platform_interaction_mocks/subflowsLib'));

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
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
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
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
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
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
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
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                crudFilter: QUERYABLE_FILTER
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(2);
            expect(results).toEqual(expect.arrayContaining([caseSObjectVariable, caseSObjectCollectionVariable]));
        });
        it('with options to select all sObject & sObject collection and only createable elements returns only createable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                crudFilter: CREATEABLE_FILTER
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(2);
            expect(results).toEqual(expect.arrayContaining([accountSObjectVariable, accountSObjectCollectionVariable]));
        });
        it('with options to select all sObject & sObject collection and only updateable elements returns only updateable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                crudFilter: UPDATEABLE_FILTER
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toEqual([contactSObjectVariable]);
        });
        it('with options to select all sObject & sObject collection and only deleteable elements returns only deleteable elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                crudFilter: DELETABLE_FILTER
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(3);
            expect(results).toEqual(
                expect.arrayContaining([
                    campaignSObjectVariable,
                    opportunitySObjectVariable,
                    opportunitySObjectCollectionVariable
                ])
            );
        });
        test('with options to select all sObject & sObject collection and only elements matching crud filter', () => {
            const retrieveOptions: RetrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                crudFilter: ({ createable, queryable }) => createable || queryable
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(4);
            expect(results).toEqual(
                expect.arrayContaining([
                    caseSObjectVariable,
                    caseSObjectCollectionVariable,
                    accountSObjectVariable,
                    accountSObjectCollectionVariable
                ])
            );
        });
        it('with options to filter only by entity name "Opportunity" elements returns all elements with entity name "Opportunity', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION,
                entityName: 'Opportunity'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([opportunitySObjectVariable, opportunitySObjectCollectionVariable])
            );
        });
        it('with options to filter only sObject collection returns the sObject collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
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
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                entityName: 'Case'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toEqual([caseSObjectCollectionVariable]);
        });
        it('with options to filter only sObject collection & entity name "Campaign" returns an empty array', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                entityName: 'Campaign'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toHaveLength(0);
        });
        it('with options to filter only sObject collection with entity name "Opportunity"" & deleteable entity returns the only one sObject Opportunity collection element', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                crudFilter: DELETABLE_FILTER,
                entityName: 'Opportunity'
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toEqual([opportunitySObjectCollectionVariable]);
        });
        it('with options to filter only sObject collection & deleteable entity returns the "Opportunity" sObject deletable collection elements', () => {
            const retrieveOptions = {
                sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                crudFilter: DELETABLE_FILTER
            };
            const results = getSObjectOrSObjectCollectionByEntityElements(ELEMENTS_IN_STORE, retrieveOptions);
            expect(results).toEqual([opportunitySObjectCollectionVariable]);
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
            const results = byElementTypeElementsSelector(textTemplate1.elementType)(STORE_INSTANCE);
            expect(results).toEqual([textTemplate1]);
        });
        it('return only elements matching given element types params', () => {
            const results = byElementTypeElementsSelector(
                apexCallAutomaticAnonymousStringOutput.elementType,
                textTemplate1.elementType
            )(STORE_INSTANCE);
            expect(results).toEqual([apexCallAutomaticAnonymousStringOutput, textTemplate1]);
        });
    });
});
describe('getCanContainSObjectElements', () => {
    beforeAll(() => {
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        setApexClasses(null);
    });
    it('returns apex action with SObject automatic output', () => {
        const result = getCanContainSObjectElements([apexCallAccountAutomaticOutput]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', apexCallAccountAutomaticOutput.name);
    });
    it('does not return apex action with primitive automatic output', () => {
        const result = getCanContainSObjectElements([apexCallStringAutomaticOutput]);

        expect(result).toHaveLength(0);
    });
    it('returns flow extension that has SObject in automatic output', () => {
        const result = getCanContainSObjectElements([lightningCompAutomaticOutputContainsAccountExtension]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', lightningCompAutomaticOutputContainsAccountExtension.name);
    });
    it('does not return flow extension that does not have SObject in automatic output', () => {
        const result = getCanContainSObjectElements([lightningCompAutomaticOutputNoSObjectExtension]);

        expect(result).toHaveLength(0);
    });
    it('returns apex variable which contains SObject', () => {
        const result = getCanContainSObjectElements([apexComplexTypeVariable]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', apexComplexTypeVariable.name);
    });
    it('returns apex variable which contains apex variable which contains SObject', () => {
        const result = getCanContainSObjectElements([apexComplexTypeTwoVariable]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', apexComplexTypeTwoVariable.name);
    });
    it('does not return apex variable which does not contain SObject', () => {
        const result = getCanContainSObjectElements([apexCarVariable]);

        expect(result).toHaveLength(0);
    });
    it('does not return apex collection variable even if apex contains SObject', () => {
        const result = getCanContainSObjectElements([apexComplexTypeCollectionVariable]);

        expect(result).toHaveLength(0);
    });
    it('returns local action that has apex variable which contains SObject', () => {
        const result = getCanContainSObjectElements([localActionApexDoesContainsSObjectAutomaticOutput]);

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', localActionApexDoesContainsSObjectAutomaticOutput.name);
    });
    it('does not return local action that has apex variable which contains SObject that does not correspond to retrieveOptions', () => {
        // localActionApexDoesContainsSObjectAutomaticOutput returns ApexComplexTypeOne216, that has account field. Account is mocked to not be deletable here
        const result = getCanContainSObjectElements([localActionApexDoesContainsSObjectAutomaticOutput], {
            crudFilter: DELETABLE_FILTER
        });

        expect(result).toHaveLength(0);
    });
    it('does not return local action that has apex variable which does not contain SObject', () => {
        const result = getCanContainSObjectElements([localActionApexDoesNotContainSObjectAutomaticOutput]);

        expect(result).toHaveLength(0);
    });
    describe('collection criterion', () => {
        describe('Only single values', () => {
            it('does not return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputSObjectCollectionExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                });

                expect(result).toHaveLength(0);
            });
            it('does return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputContainsAccountExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', lightningCompAutomaticOutputContainsAccountExtension.name);
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements([localActionApexDoesContainsSObjectAutomaticOutput], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', localActionApexDoesContainsSObjectAutomaticOutput.name);
            });
        });
        describe('Only collections', () => {
            it('does return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputSObjectCollectionExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', lightningCompAutomaticOutputSObjectCollectionExtension.name);
            });
            it('does not return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputContainsAccountExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(0);
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements([localActionApexDoesContainsSObjectAutomaticOutput], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', localActionApexDoesContainsSObjectAutomaticOutput.name);
            });
            it('does return collection of given entity name', () => {
                const result = getCanContainSObjectElements([apexComplexTypeTwoVariable], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_COLLECTION,
                    entityName: 'Account'
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', apexComplexTypeTwoVariable.name);
            });
        });
        describe('Both single values and collections', () => {
            it('does return flow extensions that only have an SObject collection in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputSObjectCollectionExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', lightningCompAutomaticOutputSObjectCollectionExtension.name);
            });
            it('does return flow extensions that only have a single SObject in automatic', () => {
                const result = getCanContainSObjectElements([lightningCompAutomaticOutputContainsAccountExtension], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', lightningCompAutomaticOutputContainsAccountExtension.name);
            });
            it('does return local action that has apex variable which contains both single SObject and SObject collection', () => {
                const result = getCanContainSObjectElements([localActionApexDoesContainsSObjectAutomaticOutput], {
                    sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION
                });

                expect(result).toHaveLength(1);
                expect(result[0]).toHaveProperty('name', localActionApexDoesContainsSObjectAutomaticOutput.name);
            });
        });
    });
});
describe('choiceSelector', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    it('returns only the static choices provided', () => {
        const result = choiceSelector('String', [staticChoiceOther.guid])(flowWithAllElementsUIModel);

        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual(staticChoiceOther.name);
    });
    it('returns string type choice elements if data type is String and no static choices are provided', () => {
        const result = choiceSelector('String')(flowWithAllElementsUIModel);

        expect(result).toHaveLength(2);
        expect(result[0].name).toEqual('other');
        expect(result[1].name).toEqual('recordChoiceSet');
    });
    it('returns number type choice elements if data type is Number and no static choices are provided', () => {
        const result = choiceSelector('Number')(flowWithAllElementsUIModel);
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual('numberChoice');
    });
});
describe('isOrCanContainSelector', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
        setApexClasses(null);
    });
    const toSortedNames = (result) => {
        return result.map(({ name }) => name).sort();
    };
    describe('collection', () => {
        it('returns only collection with allowTraversal false', () => {
            const result = isOrCanContainSelector({ isCollection: true, allowTraversal: false })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'apexCall_anonymous_accounts',
                'apexCall_anonymous_apex_collection',
                'apexCall_anonymous_strings',
                'apexComplexTypeCollectionVariable',
                'apexSampleCollectionVariable',
                'caseSObjectCollectionVariable',
                'dateCollectionVariable',
                'getAccountsAutomaticWithFieldsAndFilters',
                'lookupRecordCollectionAutomaticOutput',
                'opportunitySObjectCollectionVariable',
                'stringCollectionVariable1',
                'stringCollectionVariable2'
            ]);
        });
        it('returns only collection of given entity name with allowTraversal false', () => {
            const result = isOrCanContainSelector({ isCollection: true, allowTraversal: false, entityName: 'Account' })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'apexCall_anonymous_accounts',
                'getAccountsAutomaticWithFieldsAndFilters',
                'lookupRecordCollectionAutomaticOutput'
            ]);
        });
        it('returns only collection of given datatype with allowTraversal false', () => {
            const result = isOrCanContainSelector({ isCollection: true, dataType: 'String', allowTraversal: false })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'apexCall_anonymous_strings',
                'stringCollectionVariable1',
                'stringCollectionVariable2'
            ]);
        });
        it('returns only collection of given elementType with allowTraversal false', () => {
            const result = isOrCanContainSelector({
                isCollection: true,
                elementType: ELEMENT_TYPE.VARIABLE,
                allowTraversal: false
            })(flowWithAllElementsUIModel);

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'apexComplexTypeCollectionVariable',
                'apexSampleCollectionVariable',
                'caseSObjectCollectionVariable',
                'dateCollectionVariable',
                'opportunitySObjectCollectionVariable',
                'stringCollectionVariable1',
                'stringCollectionVariable2'
            ]);
        });
        it('returns collection and object that contain a collection with allowTraversal true', () => {
            const result = isOrCanContainSelector({ isCollection: true, allowTraversal: true })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'actionCallLC_apex_with_sobject_auto',
                'apexCall_anonymous_accounts',
                'apexCall_anonymous_apex_collection',
                'apexCall_anonymous_strings',
                'apexComplexTypeCollectionVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'apexSampleCollectionVariable',
                'caseSObjectCollectionVariable',
                'dateCollectionVariable',
                'getAccountsAutomaticWithFieldsAndFilters',
                'lightningCompWithAccountsOutput',
                'lookupRecordCollectionAutomaticOutput',
                'loopOnApexAutoOutput',
                'opportunitySObjectCollectionVariable',
                'screenCompInSectionColumnWithSObjectCollAutoOutput',
                'stringCollectionVariable1',
                'stringCollectionVariable2',
                'subflowAutomaticOutput'
            ]);
        });
        it('returns collection and object that contain a collection with allowTraversal undefined', () => {
            const result = isOrCanContainSelector({ isCollection: true })(flowWithAllElementsUIModel);

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'actionCallLC_apex_with_sobject_auto',
                'apexCall_anonymous_accounts',
                'apexCall_anonymous_apex_collection',
                'apexCall_anonymous_strings',
                'apexComplexTypeCollectionVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'apexSampleCollectionVariable',
                'caseSObjectCollectionVariable',
                'dateCollectionVariable',
                'getAccountsAutomaticWithFieldsAndFilters',
                'lightningCompWithAccountsOutput',
                'lookupRecordCollectionAutomaticOutput',
                'loopOnApexAutoOutput',
                'opportunitySObjectCollectionVariable',
                'screenCompInSectionColumnWithSObjectCollAutoOutput',
                'stringCollectionVariable1',
                'stringCollectionVariable2',
                'subflowAutomaticOutput'
            ]);
        });
        it('returns collection and object that contain a collection of given entity name with allowTraversal true', () => {
            const result = isOrCanContainSelector({ isCollection: true, allowTraversal: true, entityName: 'Account' })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'actionCallLC_apex_with_sobject_auto',
                'apexCall_anonymous_accounts',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'getAccountsAutomaticWithFieldsAndFilters',
                'lightningCompWithAccountsOutput',
                'lookupRecordCollectionAutomaticOutput',
                'loopOnApexAutoOutput',
                'screenCompInSectionColumnWithSObjectCollAutoOutput',
                'subflowAutomaticOutput'
            ]);
        });
        it('returns collection and objects that contain a collection of given dataType with allowTraversal true', () => {
            const result = isOrCanContainSelector({ isCollection: true, dataType: 'String', allowTraversal: true })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'actionCallLC_apex_with_sobject_auto',
                'apexCall_anonymous_strings',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'loopOnApexAutoOutput',
                'stringCollectionVariable1',
                'stringCollectionVariable2'
            ]);
        });
        it('returns collection and object that contain a collection of given elementType allowTraversal true', () => {
            const result = isOrCanContainSelector({
                isCollection: true,
                elementType: ELEMENT_TYPE.VARIABLE,
                allowTraversal: true
            })(flowWithAllElementsUIModel);

            expect(toSortedNames(result)).toEqual([
                'accountSObjectCollectionVariable',
                'apexComplexTypeCollectionVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'apexSampleCollectionVariable',
                'caseSObjectCollectionVariable',
                'dateCollectionVariable',
                'opportunitySObjectCollectionVariable',
                'stringCollectionVariable1',
                'stringCollectionVariable2'
            ]);
        });
    });
    describe('single', () => {
        it('returns only single values with allowTraversal false', () => {
            const result = isOrCanContainSelector({ isCollection: false, allowTraversal: false })({
                elements: { apexCallAccountAutomaticOutput, apexComplexTypeVariable, caseSObjectCollectionVariable }
            });

            expect(toSortedNames(result)).toEqual(['apexCall_account_automatic_output', 'apexComplexTypeVariable']);
        });
        it('returns only single values of given entity name with allowTraversal false', () => {
            const result = isOrCanContainSelector({
                isCollection: false,
                allowTraversal: false,
                entityName: 'Account'
            })({
                elements: {
                    apexCallAccountAutomaticOutput,
                    accountSObjectVariable,
                    apexComplexTypeVariable,
                    caseSObjectCollectionVariable
                }
            });

            expect(toSortedNames(result)).toEqual(['accountSObjectVariable']);
        });
        it('returns only single values of given datatype with allowTraversal false', () => {
            const result = isOrCanContainSelector({ isCollection: false, dataType: 'String', allowTraversal: false })({
                elements: {
                    apexCallAccountAutomaticOutput,
                    apexComplexTypeVariable,
                    stringVariable,
                    caseSObjectCollectionVariable
                }
            });

            expect(toSortedNames(result)).toEqual(['stringVariable']);
        });
        it('returns only single values of given elementType with allowTraversal false', () => {
            const result = isOrCanContainSelector({
                isCollection: false,
                elementType: ELEMENT_TYPE.VARIABLE,
                allowTraversal: false
            })(flowWithAllElementsUIModel);

            expect(toSortedNames(result)).toEqual([
                'accountSObjectVariable',
                'apexCarVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyASingleSObjectVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'apexSampleVariable',
                'campaignSObjectVariable',
                'caseSObjectVariable',
                'contactSObjectVariable',
                'contractSObjectVariable',
                'currencyVariable',
                'dateVariable',
                'feedItemVariable',
                'numberVariable',
                'objectWithAllPossiblFieldsVariable',
                'opportunitySObjectVariable',
                'stringVariable',
                'vAccountId',
                'vAccountIdFromCreate'
            ]);
        });
        it('returns single values and object that contain a single value of given entity name with allowTraversal true', () => {
            const result = isOrCanContainSelector({ isCollection: false, allowTraversal: true, entityName: 'Account' })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'accountSObjectVariable',
                'actionCallLC_apex_with_sobject_auto',
                'apexCall_account_automatic_output',
                'apexCall_anonymous_account',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyASingleSObjectVariable',
                'getAccountAutoWithFields',
                'lightningCompWithAccountOutput',
                'lookupRecordAutomaticOutput',
                'loopOnAccountAutoOutput',
                'loopOnApexAutoOutput',
                'loopOnLocalActionSobjectCollInApexAutoOutput',
                'loopOnNestedApexTypeAutoOutput',
                'loopOnScreenCompInSectionColl',
                'loopOnScreenCompSObjectCollAutoOutput',
                'loopOnSobjectCollectionInApexTypeAutoOutput',
                'screenCompInSectionColumnWithSingleSObjectAutoOutput',
                'subflowAutomaticOutput'
            ]);
        });
        it('returns single values and object that contain a single value of given dataType with allowTraversal true', () => {
            const result = isOrCanContainSelector({ isCollection: false, dataType: 'String', allowTraversal: true })(
                flowWithAllElementsUIModel
            );

            expect(toSortedNames(result)).toEqual([
                'Address',
                'accounts',
                'actionCallAutomaticOutput',
                'actionCallLC_apex_no_sobject_auto',
                'actionCallLC_apex_with_sobject_auto',
                'address_2',
                'apexCall_Car_automatic_output',
                'apexCall_String_automatic_output',
                'apexCall_anonymous_string',
                'apexCarVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'createAccountWithAutomaticOutput',
                'emailScreenFieldAutomaticOutput',
                'email_2',
                'lightningCompWithAccountOutput',
                'lightningCompWithNoAccountOutput',
                'loopOnApexAutoOutput',
                'loopOnTextCollectionAutoOutput',
                'other',
                'recordChoiceSet',
                'screenCompInSectionColumnWithSingleSObjectAutoOutput',
                'slider_1',
                'someText',
                'stringConstant',
                'stringVariable',
                'subflowAutomaticOutput',
                'textFormula',
                'textTemplate1',
                'textTemplate2',
                'text_2',
                'vAccountId',
                'vAccountIdFromCreate'
            ]);
        });
        it('returns single values and object that contain a single value of given elementType allowTraversal true', () => {
            const result = isOrCanContainSelector({
                isCollection: false,
                elementType: ELEMENT_TYPE.VARIABLE,
                allowTraversal: true
            })(flowWithAllElementsUIModel);

            expect(toSortedNames(result)).toEqual([
                'accountSObjectVariable',
                'apexCarVariable',
                'apexComplexTypeTwoVariable',
                'apexComplexTypeVariable',
                'apexContainsOnlyASingleSObjectVariable',
                'apexContainsOnlyAnSObjectCollectionVariable',
                'apexSampleVariable',
                'campaignSObjectVariable',
                'caseSObjectVariable',
                'contactSObjectVariable',
                'contractSObjectVariable',
                'currencyVariable',
                'dateVariable',
                'feedItemVariable',
                'numberVariable',
                'objectWithAllPossiblFieldsVariable',
                'opportunitySObjectVariable',
                'stringVariable',
                'vAccountId',
                'vAccountIdFromCreate'
            ]);
        });
    });
});
