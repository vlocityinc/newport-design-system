// @ts-nocheck
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
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
            if (collRef === 'mockCollectionReferenceSObject') {
                return {
                    subtype: 'Account',
                    dataType: 'SObject'
                };
            } else if (collRef === 'mockCollectionReferenceApex') {
                return {
                    dataType: 'Apex',
                    subtype: 'xyz'
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
const paramElementForSObjectCollectionChoiceSet = {
    collectionReference: 'mockCollectionReferenceSObject',
    object: 'Account'
};
const paramElementForApexCollectionChoiceSet = {
    collectionReference: 'mockCollectionReferenceApex',
    dataType: FLOW_DATA_TYPE.APEX.value
};
const mockCollectionChoiceSetResult = {
    elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
    collectionReference: 'mockCollectionReferenceSObject'
};
describe('createCollectionChoiceSet', () => {
    it('with empty param produces default value object', () => {
        const result = createCollectionChoiceSet();
        expect(result).toMatchObject(mockDefaultValuesForCollectionChoiceSet);
    });
    describe('with a valid element', () => {
        const result = createCollectionChoiceSet(paramElementForSObjectCollectionChoiceSet);
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
        it('result matches the expected metadata shape for SObject CCS and object is set', () => {
            paramElementForSObjectCollectionChoiceSet.dataType = FLOW_DATA_TYPE.SOBJECT.value;
            const result = createCollectionChoiceSetMetadataObject(paramElementForSObjectCollectionChoiceSet);
            delete paramElementForSObjectCollectionChoiceSet.dataType;
            expect(result).toEqual(paramElementForSObjectCollectionChoiceSet);
        });
        it('result matches the expected metadata shape for Apex CCS and object is set to null', () => {
            const result = createCollectionChoiceSetMetadataObject(paramElementForApexCollectionChoiceSet);
            delete paramElementForApexCollectionChoiceSet.dataType;
            paramElementForApexCollectionChoiceSet.object = null;
            expect(result).toEqual(paramElementForApexCollectionChoiceSet);
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
