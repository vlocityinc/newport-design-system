import { createStep, createStepWithConnectorsForStore, createStepMetadataObject } from '../step';

const defaultStepElement = {
    elementType: 'STEP',
    description: '',
    name: '',
    guid: 'testGUID',
    label: '',
    maxConnections: -1,
    locationX: 0,
    locationY:0,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0
};

const stepElementForStore = {
    elementType: 'STEP',
    description:'mock description for step element',
    name: 'mock name for step element',
    guid: 'testGUID',
    locationX: 0,
    locationY: 0,
    isCanvasElement: true,
    label: 'mock label for step element'
};

const stepElementWithUserInput = {
    description:'mock description for step element',
    name: 'mock name for step element',
    label: 'mock label for step element',
    locationX: 0,
    locationY: 0
};

const stepElement = {
    guid: 'guid_1',
    name: 'Step 1',
    description: 'This is description for step 1',
    label: 'Step 1',
    locationX: 10,
    locationY: 20,
    connectorCount: -1,
    availableConnections: ['connector1', 'connector2'],
    config: {
        isSelected: true
    },
    elementType: 'STEP'
};

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
        })
    };
});

describe('Step Element Factory', () => {
    describe('createStep Function', () => {
        it('returns a new step element object with default values when no arguments are passed', () => {
            const actualResult = createStep();
            expect(actualResult).toMatchObject(defaultStepElement);
        });
    });
    describe('createStepWithConnectorsForStore function', () => {
        it('returns a new step element object for Store with default values when no arguments are passed', () => {
            const actualResult = createStepWithConnectorsForStore();
            const expectedObject = {
                testGUID: defaultStepElement
            };
            expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
        });
        it('returns a new step object for store with same values when an existing step object is passed', () => {
            const actualResult = createStepWithConnectorsForStore(stepElementForStore);
            const expectedObject = {
                testGUID: stepElementForStore
            };
            expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
        });
    });
    describe('createStepMetadataObject function', () => {
        it('throws an error when called without a step Element object', () => {
                expect(() => {
                    createStepMetadataObject();
                }).toThrow();
        });
        it('returns a new step meta data object when a valid step object is passed', () => {
            const actualResult = createStepMetadataObject(stepElementForStore);
            expect(actualResult).toMatchObject(stepElementWithUserInput);
        });
        it('returns a new canvas object with updated location when existing step element object and config is passed as arguments', () => {
            const config = {
                xyTranslate: {
                    translateX: 10,
                    translateY: 20
                },
                connectorMap: {
                    'guid_1': [{
                        type: 'REGULAR',
                        source: 'guid_1',
                        target: 'guid_2'
                    }]
                }
            };
            const expectedStepResult = {
                name: 'Step 1',
                description: 'This is description for step 1',
                label: 'Step 1',
                locationX: 20,
                locationY: 40,
                connectors: [{
                    targetReference: 'guid_2'
                }]
            };
            const actualResult = createStepMetadataObject(stepElement, config);
            expect(actualResult).toMatchObject(expectedStepResult);
        });
    });
});
