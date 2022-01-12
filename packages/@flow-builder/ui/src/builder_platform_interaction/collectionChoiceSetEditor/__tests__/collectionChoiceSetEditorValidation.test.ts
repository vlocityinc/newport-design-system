// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import CollectionChoiceSetEditor from '../collectionChoiceSetEditor';
import { collectionChoiceSetValidation, getRules } from '../collectionChoiceSetValidation';

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING: actual.FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: (processType) => {
            return processType === 'Flow' ? 'Supported' : 'Unsupported';
        },
        isLookupTraversalSupported: jest.fn().mockImplementation(() => true)
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    }

    function getStore() {
        return {
            getCurrentState,
            subscribe: jest.fn().mockReturnValue({
                _unsubscribeStore: jest.fn()
            })
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
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

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn().mockReturnValue({
            subtype: 'Account'
        }),
        isDevNameInStore: jest.fn(),
        getTriggerType: jest.fn()
    };
});

const setupComponentUnderTest = (collectionChoiceSetObject) => {
    const element = createElement('builder_platform_interaction-collection-choice-set-editor', {
        is: CollectionChoiceSetEditor
    });
    element.node = collectionChoiceSetObject;
    setDocumentBodyChildren(element);
    return element;
};

describe('Collection Choice Set Validation', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });

    const collectionChoiceObjectWithoutCollection = {
        elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'collectionChoice1',
            error: null
        },
        description: {
            value: 'This is collection choice',
            error: null
        },
        collectionReference: {
            value: '',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        displayField: {
            value: null,
            error: null
        },
        valueField: {
            value: '',
            error: null
        },
        displayFieldIndex: {
            value: 'index9000',
            error: null
        },
        valueFieldIndex: {
            value: 'index9001',
            error: null
        }
    };
    const collectionChoiceObject = {
        elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'collectionChoice1',
            error: null
        },
        description: {
            value: 'This is collection choice',
            error: null
        },
        collectionReference: {
            value: ' d8e7e78-8s77s80-reference',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        displayField: {
            value: null,
            error: null
        },
        valueField: {
            value: 'AccountSource',
            error: null
        },
        displayFieldIndex: {
            value: 'index9000',
            error: null
        },
        valueFieldIndex: {
            value: 'index9001',
            error: null
        }
    };

    describe('validateAll', () => {
        const validate = (node) => {
            return getErrorsFromHydratedElement(
                (collectionChoiceSetValidation as any)().validateAll(node, getRules(node, true))
            );
        };
        const collectionChoice = setupComponentUnderTest(collectionChoiceObjectWithoutCollection);
        const node = collectionChoice.node;
        const errors = validate(node);

        it('Returns 3 errors for collectionChoiceSetObject', () => {
            expect(errors).toHaveLength(3);
        });
        it('Returns error for key collectionReference', () => {
            expect(errors[0]).toHaveProperty('key', 'collectionReference');
        });
        it('Returns error for key displayField', () => {
            expect(errors[1]).toHaveProperty('key', 'displayField');
        });
        it('Returns error for key valueField', () => {
            expect(errors[2]).toHaveProperty('key', 'valueField');
        });
    });

    describe('getRules', () => {
        describe('when second section is hidden', () => {
            const collectionChoice = setupComponentUnderTest(collectionChoiceObjectWithoutCollection);
            const node = collectionChoice.node;
            const rules = getRules(node, false);
            const keysFromRules = Object.keys(rules);
            const expectedKeysFromRules = ['label', 'name', 'collectionReference'];

            it('returns rules object with number of keys as 3', () => {
                expect(keysFromRules).toHaveLength(3);
            });

            it('rules object should contain rule for key:', () => {
                expect(keysFromRules).toEqual(expect.arrayContaining(expectedKeysFromRules));
            });
        });

        describe('when second section is shown', () => {
            const collectionChoice = setupComponentUnderTest(collectionChoiceObject);
            const node = collectionChoice.node;
            const rules = getRules(node, true);
            const keysFromRules = Object.keys(rules);
            const expectedKeysFromRules = [
                'collectionReference',
                'label',
                'name',
                'displayField',
                'dataType',
                'valueField'
            ];

            it('returns rules object with number of keys as 6', () => {
                expect(keysFromRules).toHaveLength(6);
            });

            it('rules object should contain rule for key:', () => {
                expect(keysFromRules).toEqual(expect.arrayContaining(expectedKeysFromRules));
            });
        });
    });
});
