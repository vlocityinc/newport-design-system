import { mockEntities, mockAccountFields } from "mock/serverEntityData";
import { setEntities, getAllEntities, getQueryableEntities, getCreateableEntities, getDeletableEntities, getUpdateableEntities, getFieldsForEntity } from "builder_platform_interaction/sobjectLib";

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetch: jest.fn().mockImplementation((actionType, callback) => {
            callback({
                data: JSON.stringify(mockAccountFields),
            });
        }),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE,
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
                expect(Object.keys(fields)).toHaveLength(45);
            });
        });

        it('Map to Flow String Data Type', () => {
            getFieldsForEntity('Account', (fields) => {
                expect(fields.Description.dataType).toEqual('String');
            });
        });

        it('Maps Field Type to Flow Data Type', () => {
            getFieldsForEntity('Account', (fields) => {
                expect(fields.Phone.dataType).toEqual('String');
            });
        });

        it('Get fields returns an empty object when validating and the cache does not contain the info', () => {
            getFieldsForEntity('Contact', (fields) => {
                expect(fields).toBeUndefined();
            }, true);
        });
    });
});

