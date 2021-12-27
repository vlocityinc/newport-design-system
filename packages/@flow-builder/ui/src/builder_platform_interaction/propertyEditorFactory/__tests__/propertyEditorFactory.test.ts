// @ts-nocheck
import { goldObjectMatchers } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    accountSObjectVariable,
    dateVariable,
    deleteAccount,
    deleteAccountWithFilters,
    elementsForPropertyEditors,
    emailScreenField,
    emailScreenFieldAutomaticOutput,
    flowWithAllElementsUIModel,
    numberVariable,
    screenWithSection,
    staticChoiceOther,
    stringCollectionVariable1,
    stringConstant,
    stringVariable,
    textTemplate1,
    textTemplate2
} from 'mock/storeData';
import { getElementForPropertyEditor, getElementForStore } from '../propertyEditorFactory';

expect.extend(goldObjectMatchers);

type possFactoryState = 'noMock' | 'initialization' | 'propertyEditor' | 'closePropertyEditor' | 'error';
let mockFactoryState: possFactoryState = 'noMock';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
const mockActualElementConfig = jest.requireActual('builder_platform_interaction/elementConfig');

const mockInitialization = jest.fn().mockImplementation((element) => {
    return element;
});
const mockPropertyEditor = jest.fn().mockImplementation((element) => {
    return element;
});
const mockClosePropertyEditor = jest.fn().mockImplementation((element) => {
    return element;
});

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        getConfigForElement: jest.fn().mockImplementation((element: UI.ElementConfig) => {
            const elementConfig = mockActualElementConfig.getConfigForElement(element);
            switch (mockFactoryState) {
                case 'noMock':
                    return elementConfig;
                case 'initialization':
                    if (elementConfig.factory) {
                        elementConfig.factory.initialization = mockInitialization;
                    }
                    return elementConfig;
                case 'propertyEditor':
                    if (elementConfig.factory) {
                        elementConfig.factory.propertyEditor = mockPropertyEditor;
                    }
                    return elementConfig;
                case 'closePropertyEditor':
                    if (elementConfig.factory) {
                        elementConfig.factory.closePropertyEditor = mockClosePropertyEditor;
                    }
                    return elementConfig;
                default:
                    throw new Error('Error in propertyEditorFactory.test - mockFactoryState not expected');
            }
        })
    };
});

const subflowElement = {
    elementType: ELEMENT_TYPE.SUBFLOW
};
const startElement = {
    elementType: ELEMENT_TYPE.START_ELEMENT
};

describe('propertyEditorFactory', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    afterEach(() => {
        mockFactoryState = 'noMock';
    });
    describe('getElementForStore', () => {
        it('throws error if element is not passed to the function', () => {
            expect(() => {
                getElementForStore();
            }).toThrow();
        });
        it('throws error if elementType is not in the element passed to the function', () => {
            const missingTypeSampleElement = Object.assign({}, subflowElement);
            delete missingTypeSampleElement.elementType;
            expect(() => {
                getElementForStore(missingTypeSampleElement);
            }).toThrow();
        });
        it('calls the appropriate function (mockInitialization) based on the factory it is given from getConfigForElement', () => {
            mockFactoryState = 'initialization';
            getElementForStore(startElement);
            expect(mockInitialization).toHaveBeenCalled();
        });
        it('calls the appropriate function (mockPropertyEditor) based on the factory it is given from getConfigForElement', () => {
            mockFactoryState = 'propertyEditor';
            getElementForStore(subflowElement);
            expect(mockPropertyEditor).toHaveBeenCalled();
        });
        it('calls the appropriate function (mockClosePropertyEditor) based on the factory it is given from getConfigForElement', () => {
            mockFactoryState = 'closePropertyEditor';
            getElementForStore(subflowElement);
            expect(mockClosePropertyEditor).toHaveBeenCalled();
        });
    });
    describe('getElementForPropertyEditor', () => {
        beforeEach(() => {
            mockFactoryState = 'noMock';
        });
        it('throws error if elementType is not in the element passed to the function', () => {
            const missingTypeSampleElement = Object.assign({}, subflowElement);
            delete missingTypeSampleElement.elementType;
            expect(() => {
                getElementForPropertyEditor(missingTypeSampleElement);
            }).toThrow();
        });
        it('returns expected hydrated elements', () => {
            const elements = [
                stringVariable,
                numberVariable,
                dateVariable,
                stringCollectionVariable1,
                accountSObjectVariable,
                textTemplate1,
                textTemplate2,
                stringConstant,
                emailScreenField,
                emailScreenFieldAutomaticOutput,
                deleteAccountWithFilters,
                deleteAccount,
                staticChoiceOther,
                screenWithSection
            ];
            const actualElementsForPropertyEditors = elements.reduce((acc, element) => {
                acc[element.name] = getElementForPropertyEditor(element);
                return acc;
            }, {});
            expect(actualElementsForPropertyEditors).toEqualGoldObject(
                elementsForPropertyEditors,
                'elementsForPropertyEditors in mock_store_data/elementsForPropertyEditors'
            );
        });
    });
});
