// @ts-nocheck
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    setEntities,
    getAllEntities,
    getQueryableEntities,
    getCreateableEntities,
    getDeletableEntities,
    getUpdateableEntities,
    getWorkflowEnabledEntities,
    getFieldsForEntity,
    fetchFieldsForEntity,
    getEntity,
    getEntityFieldWithApiName
} from 'builder_platform_interaction/sobjectLib';

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        fetchOnce: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    const mockEntitiesForStore = () => {
        const allEntities = [];
        const allEntitiesMap = {};
        const queryableEntities = [];
        const createableEntities = [];
        const deletableEntities = [];
        const updateableEntities = [];
        const workflowEnabledEntities = [{ apiName: 'Account' }];
        mockEntities.forEach(entity => {
            allEntities.push(entity);
            allEntitiesMap[entity.apiName.toLowerCase()] = entity;
            if (entity.queryable) {
                queryableEntities.push(entity);
            }
            if (entity.createable) {
                createableEntities.push(entity);
            }
            if (entity.deletable) {
                deletableEntities.push(entity);
            }
            if (entity.updateable) {
                updateableEntities.push(entity);
            }
            if (entity.workflowEnabled) {
                workflowEnabledEntities.push(entity);
            }
        });
        return {
            allEntities,
            allEntitiesMap,
            queryableEntities,
            createableEntities,
            deletableEntities,
            updateableEntities,
            workflowEnabledEntities
        };
    };
    const entities = { entities: mockEntitiesForStore() };
    const getCurrentState = () => {
        return { peripheralData: entities };
    };
    const dispatch = jest.fn();
    function getStore() {
        return {
            dispatch,
            getCurrentState
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

describe('SObject Lib Tests', () => {
    describe('Set Entities Tests', () => {
        it('Set Null Entities', () => {
            expect(() => {
                setEntities();
            }).not.toThrow();
        });

        it('Set Entities', () => {
            setEntities(mockEntities);
        });
    });

    describe('Get Entity Types Tests', () => {
        it('Get All Entities', () => {
            expect(getAllEntities()).toHaveLength(Object.keys(mockEntities).length);
        });

        it('Get Queryable Entities', () => {
            const queryableEntities = getQueryableEntities();
            expect(queryableEntities).toContainEqual(expect.objectContaining({ apiName: 'AcceptedEventRelation' }));
            expect(queryableEntities).toContainEqual(expect.objectContaining({ apiName: 'Account' }));
            expect(queryableEntities).not.toContainEqual(expect.objectContaining({ apiName: 'AccountChangeEvent' }));
        });

        it('Get Creatable Entities', () => {
            const createableEntities = getCreateableEntities();
            expect(createableEntities).toContainEqual(expect.objectContaining({ apiName: 'Account' }));
            expect(createableEntities).not.toContainEqual(
                expect.objectContaining({ apiName: 'AcceptedEventRelation' })
            );
        });

        it('Get Deletable Entities', () => {
            const deletableEntities = getDeletableEntities();
            expect(deletableEntities).toContainEqual(expect.objectContaining({ apiName: 'Account' }));
            expect(deletableEntities).not.toContainEqual(expect.objectContaining({ apiName: 'AcceptedEventRelation' }));
        });

        it('Get Updatable Entities', () => {
            const updateableEntities = getUpdateableEntities();
            expect(updateableEntities).toContainEqual(expect.objectContaining({ apiName: 'Account' }));
            expect(updateableEntities).not.toContainEqual(
                expect.objectContaining({ apiName: 'AcceptedEventRelation' })
            );
        });

        it('Get Workflow Enabled Entities', () => {
            const workflowEnabledEntities = getWorkflowEnabledEntities();
            expect(workflowEnabledEntities).toContainEqual(expect.objectContaining({ apiName: 'Account' }));
            expect(workflowEnabledEntities).not.toContainEqual(
                expect.objectContaining({ apiName: 'AcceptedEventRelation' })
            );
        });

        it('Get existing entity description', () => {
            const entity = getEntity('Account');
            expect(entity).toBeDefined();
            expect(entity.apiName).toEqual('Account');
        });

        it('Get unexisting entity description', () => {
            const entity = getEntity('UnknownEntity');
            expect(entity).toBeUndefined();
        });
    });

    describe('fetchFieldsForEntity', () => {
        it('Returns fields for the entity', async () => {
            const fields = await fetchFieldsForEntity('Account');
            expect(Object.keys(fields)).toHaveLength(Object.keys(mockAccountFields).length);
        });
    });

    describe('getFieldsForEntity', () => {
        it('Verify Fields Returned', () => {
            const fields = getFieldsForEntity('Account');
            expect(Object.keys(fields)).toHaveLength(Object.keys(mockAccountFields).length);
        });
    });

    describe('getEntityFieldWithApiName', () => {
        it('returns the field with given api name', () => {
            const field = getEntityFieldWithApiName(mockAccountFields, 'Name');
            expect(field).toMatchObject({
                apiName: 'Name',
                label: 'Account Name'
            });
        });
        it('returns undefined if there is no field with given api name', () => {
            const field = getEntityFieldWithApiName(mockAccountFields, 'Unknown');
            expect(field).toBeUndefined();
        });
        it('is not case sensitive', () => {
            const field = getEntityFieldWithApiName(mockAccountFields, 'name');
            expect(field).toMatchObject({
                apiName: 'Name',
                label: 'Account Name'
            });
        });
    });
});
