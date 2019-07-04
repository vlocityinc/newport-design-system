import { mockEntities, mockAccountFields } from 'mock/serverEntityData';
import {
    setEntities,
    getAllEntities,
    getQueryableEntities,
    getCreateableEntities,
    getDeletableEntities,
    getUpdateableEntities,
    getFieldsForEntity,
    fetchFieldsForEntity,
    getEntity
} from 'builder_platform_interaction/sobjectLib';

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAccountFields)),
        SERVER_ACTION_TYPE: require.requireActual(
            '../../serverDataLib/serverDataLib.js'
        ).SERVER_ACTION_TYPE
    };
});

describe('SObject Lib Tests', () => {
    describe('Set Entities Tests', () => {
        it('Set Null Entities', () => {
            expect(() => {
                setEntities();
            }).not.toThrow();
        });

        it('Set Entities', () => {
            setEntities(JSON.stringify(mockEntities));
        });
    });

    describe('Get Entity Types Tests', () => {
        it('Get All Entities', () => {
            expect(getAllEntities()).toHaveLength(5);
        });

        it('Get Queryable Entities', () => {
            const queryableEntities = getQueryableEntities();
            expect(queryableEntities).toHaveLength(3);
            expect(queryableEntities[0].apiName).toEqual(
                'AcceptedEventRelation'
            );
            expect(queryableEntities[1].apiName).toEqual('Account');
            expect(queryableEntities[2].apiName).toEqual('Case');
        });

        it('Get Creatable Entities', () => {
            const createableEntities = getCreateableEntities();
            expect(createableEntities).toHaveLength(1);
            expect(createableEntities[0].apiName).toEqual('Case');
        });

        it('Get Deletable Entities', () => {
            const deletableEntities = getDeletableEntities();
            expect(deletableEntities).toHaveLength(2);
            expect(deletableEntities[0].apiName).toEqual('Account');
            expect(deletableEntities[1].apiName).toEqual('Case');
        });

        it('Get Updatable Entities', () => {
            const updateableEntities = getUpdateableEntities();
            expect(updateableEntities).toHaveLength(2);
            expect(updateableEntities[0].apiName).toEqual('Contact');
            expect(updateableEntities[1].apiName).toEqual('Contract');
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
            expect(Object.keys(fields)).toHaveLength(
                Object.keys(mockAccountFields).length
            );
        });
    });

    describe('getFieldsForEntity', () => {
        it('Verify Fields Returned', () => {
            const fields = getFieldsForEntity('Account');
            expect(Object.keys(fields)).toHaveLength(
                Object.keys(mockAccountFields).length
            );
        });
    });
});
