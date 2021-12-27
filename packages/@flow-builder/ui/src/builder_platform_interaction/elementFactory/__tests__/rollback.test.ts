import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createDuplicateRollback,
    createRollback,
    createRollbackMetadataObject,
    createRollbackWithConnectors
} from '../rollback';

const defaultRollbackElement = {
    elementType: ELEMENT_TYPE.ROLLBACK,
    description: '',
    name: '',
    guid: 'testGUID',
    label: '',
    maxConnections: 1,
    locationX: 0,
    locationY: 0,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0
};

const testRollbackElement = {
    elementType: ELEMENT_TYPE.ROLLBACK,
    description: 'testElementDesc',
    name: 'rollback1',
    guid: 'testGUID',
    label: 'rollback1label',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0
};

const testRollbackMetadataElement = {
    description: 'testElementDesc',
    name: 'rollback1',
    label: 'rollback1label',
    locationX: 10,
    locationY: 10
};

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

describe('Rollback Element Factory', () => {
    describe('createRollback Function', () => {
        it('returns a new rollback element object with default values when no arguments are passed', () => {
            const result = createRollback();
            expect(result).toMatchObject(defaultRollbackElement);
        });
        it('copies an rollback element object if one is passed in', () => {
            const result = createRollback(testRollbackElement);
            expect(result).toMatchObject(testRollbackElement);
        });
    });

    describe('createRollbackWithConnectors Function', () => {
        it('returns new rollback element & connector using connector from base rollback object', () => {
            const { connectors } = createRollbackWithConnectors({
                connector: { targetReference: 'foo' }
            });
            const target = connectors[0].target;
            expect(target).toBe('foo');
        });
    });

    describe('createDuplicateRollback Function', () => {
        it('returns new duplicated rollback element with new name and guid', () => {
            const rollback = {
                elementType: ELEMENT_TYPE.ROLLBACK,
                name: 'rollback1'
            };
            const newName = 'dupeName';
            const newGuid = 'dupeGuid';
            const { duplicatedElement } = createDuplicateRollback(rollback, newGuid, newName);
            expect(duplicatedElement).toEqual(
                expect.objectContaining(Object.assign(rollback, { name: newName, guid: newGuid }))
            );
        });
    });

    describe('createRollbackMetadataObject Function', () => {
        it('returns a new rollback metadata object from a store rollback object', () => {
            const result = createRollbackMetadataObject(testRollbackElement);
            expect(result).toMatchObject(testRollbackMetadataElement);
        });
    });
});
