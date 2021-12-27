// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseElementsArrayToMap } from '../base/baseElement';
import {
    createCollectionChoiceSet,
    createCollectionChoiceSetForStore,
    createCollectionChoiceSetMetadataObject
} from '../collectionChoiceSet';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        Store: {
            getStore: () => {
                return {
                    getCurrentState: () => {
                        return { elements: {} };
                    }
                };
            }
        },
        generateGuid: jest.fn().mockImplementation(() => {
            return 'MOCK_GUID';
        })
    };
});

jest.mock('builder_platform_interaction/referenceToVariableUtil', () => {
    return {
        getVariableOrField: jest.fn().mockImplementation((collRef) => {
            if (collRef) {
                return {
                    subtype: 'Account'
                };
            }
            return {};
        })
    };
});

jest.mock('../base/dynamicChoiceSet', () => {
    return {
        createDynamicChoiceSet: jest
            .fn(() => {
                return {};
            })
            .mockName('createDynamicChoiceSet'),
        createDynamicChoiceSetMetadataObject: jest
            .fn(() => {
                return {};
            })
            .mockName('createDynamicChoiceSetMetadataObject')
    };
});
jest.mock('../base/baseElement', () => {
    return {
        baseElementsArrayToMap: jest
            .fn(() => {
                return {};
            })
            .mockName('baseElementsArrayToMap')
    };
});
const mockDefaultValuesForCollectionChoiceSet = {
    elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
    collectionReference: null
};
const paramElementForCollectionChoiceSet = {
    collectionReference: 'mockCollectionReference',
    object: 'Account'
};
const mockCollectionChoiceSetResult = {
    elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
    collectionReference: 'mockCollectionReference'
};
describe('createCollectionChoiceSet', () => {
    it('with empty param produces default value object', () => {
        const result = createCollectionChoiceSet();
        expect(result).toMatchObject(mockDefaultValuesForCollectionChoiceSet);
    });
    describe('with a valid element', () => {
        const result = createCollectionChoiceSet(paramElementForCollectionChoiceSet);
        it('result object matches the mockCollectionChoiceSetResult object', () => {
            expect(result).toMatchObject(mockCollectionChoiceSetResult);
        });
    });
});

describe('createCollectionChoiceSetMetadataObject', () => {
    it('throws an error when no element param is passed', () => {
        expect(() => {
            createCollectionChoiceSetMetadataObject();
        }).toThrow();
    });
    describe('when a valid element is passed as param', () => {
        const result = createCollectionChoiceSetMetadataObject(paramElementForCollectionChoiceSet);
        it('result object matches the paramElementForCollectionChoiceSet object', () => {
            expect(result).toEqual(paramElementForCollectionChoiceSet);
        });
    });
});

describe('createCollectionChoiceForStore', () => {
    it('throws when no valid element is passed', () => {
        expect(() => {
            createCollectionChoiceSetForStore();
        }).toThrow();
    });
    it('calls the baseElementsArrayToMap function with the right param', () => {
        createCollectionChoiceSetForStore(mockCollectionChoiceSetResult);
        expect(baseElementsArrayToMap.mock.calls[0][0]).toMatchObject([mockCollectionChoiceSetResult]);
    });
});
