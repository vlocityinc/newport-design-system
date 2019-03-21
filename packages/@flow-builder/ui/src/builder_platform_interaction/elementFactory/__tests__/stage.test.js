import { createStage, createStageForStore, createStageMetadataObject } from '../stage';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
        })
    };
});

const defaultStageElement = {
    elementType: ELEMENT_TYPE.STAGE,
    description: '',
    name: '',
    guid: 'testGUID',
    label: '',
    stageOrder: null,
    isActive: false
};
const stageElementForStore = {
    elementType: ELEMENT_TYPE.STAGE,
    description: 'mock description for stage element',
    name: 'mock name for stage element',
    guid: 'testGUID',
    label: 'mock label for stage element',
    stageOrder: '2',
    isActive: true
};
describe('Stage Element Factory', () => {
    describe('createStage Function', () => {
        it('returns a new stage element object with default values when no arguments are passed', () => {
            const actualResult = createStage();
            expect(actualResult).toMatchObject(defaultStageElement);
        });
    });
    describe('createStageForStore function', () => {
        it('returns a new stage element object for Store with default values when no arguments are passed', () => {
            const actualResult = createStageForStore();
            const expectedObject = {
                testGUID: defaultStageElement
            };
            expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
        });
        it('returns a new stage object for store with same values when an existing stage object is passed', () => {
            const actualResult = createStageForStore(stageElementForStore);
            const expectedObject = {
                testGUID: stageElementForStore
            };
            expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
        });
    });
    describe('createStageMetadataObject function', () => {
        it('throws an error when called without a stage Element object', () => {
                expect(() => {
                    createStageMetadataObject();
                }).toThrow();
        });
    });
});