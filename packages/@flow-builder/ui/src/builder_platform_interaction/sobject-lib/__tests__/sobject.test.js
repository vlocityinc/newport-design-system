import { mockEntities, mockAccountFields } from 'mock-server-entity-data';
import { setEntities, getAllEntities, getQueryableEntities, getCreateableEntities, getDeletableEntities, getUpdateableEntities, getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';

describe('SObject Lib Tests', () => {
    // Mocking out the fetch function to return Account fields
    jest.mock('builder_platform_interaction-server-data-lib', () => {
        return {
            fetch: jest.fn().mockReturnValue({mockAccountFields})
        };
    });

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
            expect(getAllEntities()).toHaveLength(4);
        });

        it('Get Queryable Entities', () => {
            const queryableEntities = getQueryableEntities();
            expect(queryableEntities).toHaveLength(1);
            expect(queryableEntities[0].apiName).toEqual('AcceptedEventRelation');
        });

        it('Get Creatable Entities', () => {
            const createableEntities = getCreateableEntities();
            expect(createableEntities).toHaveLength(1);
            expect(createableEntities[0].apiName).toEqual('Case');
        });

        it('Get Deletable Entities', () => {
            const deletableEntities = getDeletableEntities();
            expect(deletableEntities).toHaveLength(1);
            expect(deletableEntities[0].apiName).toEqual('Account');
        });

        it('Get Updatable Entities', () => {
            const updateableEntities = getUpdateableEntities();
            expect(updateableEntities).toHaveLength(1);
            expect(updateableEntities[0].apiName).toEqual('Contact');
        });
    });

    describe('Get Entity Fields Callback Tests', () => {
        it('Verify Fields Returned', () => {
            getFieldsForEntity('Account', (fields) => {
                expect(fields).toHaveLength(10);
            });
        });

        // TODO: W-4917767 Need to expand these once service is used
        it('Map to Flow String Data Type', () => {
            getFieldsForEntity('Account', (fields) => {
                expect(fields[0].dataType).toEqual('String');
            });
        });

        it('Map to Flow Number Data Type', () => {
            getFieldsForEntity('Account', (fields) => {
                expect(fields[7].dataType).toEqual('Number');
            });
        });
    });
});

