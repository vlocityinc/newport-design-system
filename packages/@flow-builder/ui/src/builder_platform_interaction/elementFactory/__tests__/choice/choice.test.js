import {
    createValidationRuleForUserInput,
    createUserInputForChoice,
    createChoice,
    createChoiceForStore,
    createChoiceMetadataObject
} from '../../choice.js';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
        })
    };
});

const validationRule = {
    errorMessage: 'mock error message value',
    formulaExpression: 'mock formula'
};

const defaultValidationRule = {
    errorMessage: '',
    formulaExpression: ''
};

const userInput = {
    isRequired: true,
    promptText: 'mock prompt text',
    validationRule
};

const defaultUserInput = {
    isRequired: false,
    promptText: '',
    validationRule: undefined
};

const choiceElementWithoutUserInput = {
    choiceText: 'mock choice text',
    name: 'mock name for choice element',
    description: '',
    dataType: 'String',
    value: {
        stringValue: 'test String value'
    },
};

const choiceElementWithUserInput = {
    choiceText: 'mock choice text',
    name: 'mock name for choice element',
    description: '',
    dataType: 'String',
    value: {
        stringValue: 'test String value'
    },
    userInput
};

const choiceElementWithUserInputAndNoValidationRule = {
    choiceText: 'mock choice text',
    name: 'mock name for choice element',
    description: '',
    dataType: 'String',
    value: {
        stringValue: 'test String value'
    },
    userInput : {
    isRequired: false,
    promptText: 'test prompt text',
    validationRule: undefined
    }
};

const defaultChoiceElement = {
    elementType: 'CHOICE',
    description: '',
    name: '',
    choiceText: '',
    guid: 'testGUID',
    dataType: null,
    storedValue: null,
    storedValueDataType: null,
    isShowInputSelected: false,
    isValidateSelected: false,
    userInput: undefined
};

const choiceElementForStore = {
    elementType: 'CHOICE',
    description:'',
    name: 'mock name for choice element',
    choiceText: 'mock choice text',
    guid: 'testGUID',
    dataType: 'String',
    storedValue: 'test String value',
    storedValueDataType: 'String',
    isShowInputSelected: true,
    isValidateSelected: true,
    userInput
};

describe('createValidationRuleForUserInput function', () => {
    it('returns a new validation rule object with default values when no arguments are passed', () => {
        const actualResult = createValidationRuleForUserInput();
        expect(actualResult).toMatchObject(defaultValidationRule);
    });

    describe('when existing validation rule object is passed', () => {
        it('returns a new validation rule object with the same value', () => {
            const actualResult = createValidationRuleForUserInput(validationRule);
            expect(actualResult).toMatchObject(validationRule);
        });
        it('returns a new validation rule object', () => {
            const actualResult = createValidationRuleForUserInput(validationRule);
            expect(actualResult).not.toBe(validationRule);
        });
    });
});

describe('createUserInputForChoice function', () => {
    it('returns a new userInput object with default values when no arguments are passed', () => {
        const actualResult = createUserInputForChoice();
        expect(actualResult).toMatchObject(defaultUserInput);
    });

    describe('when existing userInput object is passed', () => {
        it('returns a new userInput object with the same value', () => {
            const actualResult = createUserInputForChoice(userInput);
            expect(actualResult).toMatchObject(userInput);
        });
        it('returns a new userInput object', () => {
            const actualResult = createUserInputForChoice(userInput);
            expect(actualResult).not.toBe(userInput);
        });
    });
});

describe('createChoice function', () => {
    it('returns a new choice element object with default values when no arguments are passed', () => {
        const actualResult = createChoice();
        expect(actualResult).toMatchObject(defaultChoiceElement);
    });

    describe('with no userInput object passed', () => {
        const expectedResult = {
            elementType: 'CHOICE',
            name: 'mock name for choice element',
            choiceText: 'mock choice text',
            guid: 'testGUID',
            dataType: 'String',
            storedValue: 'test String value',
            storedValueDataType: 'String',
            isShowInputSelected: false,
            isValidateSelected: false,
            userInput: undefined
        };
        const actualResult = createChoice(choiceElementWithoutUserInput);
        it('returns a new choice object with userInput undefined', () => {
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('returns a new choice object with isShowInputSelected as false', () => {
            expect(actualResult.isShowInputSelected).toBe(false);
        });
        it('returns a new choice object with isValidateSelected as false', () => {
            expect(actualResult.isValidateSelected).toBe(false);
        });
    });
    describe('with userInput object containing validationRule object is passed', () => {
        const expectedResult = {
            elementType: 'CHOICE',
            name: 'mock name for choice element',
            choiceText: 'mock choice text',
            guid: 'testGUID',
            dataType: 'String',
            storedValue: 'test String value',
            storedValueDataType: 'String',
            isShowInputSelected: true,
            isValidateSelected: true,
            userInput
        };
        const actualResult = createChoice(choiceElementWithUserInput);
        it('returns a new choice object with userInput', () => {
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('returns a new choice object with isShowInputSelected as true', () => {
            expect(actualResult.isShowInputSelected).toBe(true);
        });
        it('returns a new choice object with isValidateSelected as true', () => {
            expect(actualResult.isValidateSelected).toBe(true);
        });
    });
    describe('with userInput object without validationRule object is passed', () => {
        const expectedResult = {
            elementType: 'CHOICE',
            name: 'mock name for choice element',
            choiceText: 'mock choice text',
            guid: 'testGUID',
            dataType: 'String',
            storedValue: 'test String value',
            storedValueDataType: 'String',
            isShowInputSelected: true,
            isValidateSelected: false,
            userInput : {
                isRequired: false,
                promptText: 'test prompt text',
                validationRule: undefined
            }
        };
        const actualResult = createChoice(choiceElementWithUserInputAndNoValidationRule);
        it('returns a new choice object with userInput', () => {
            expect(actualResult).toMatchObject(expectedResult);
        });
        it('returns a new choice object with isShowInputSelected as true', () => {
            expect(actualResult.isShowInputSelected).toBe(true);
        });
        it('returns a new choice object with isValidateSelected as false', () => {
            expect(actualResult.isValidateSelected).toBe(false);
        });
    });
});

describe('createChoiceForStore function', () => {
    it('returns a new choice element object for Store with default values when no arguments are passed', () => {
        const actualResult = createChoiceForStore();
        const expectedObject = {
            testGUID: defaultChoiceElement
        };
        expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
    });
    it('returns a new choice object for store with same values when an existing choice object is passed', () => {
        const actualResult = createChoiceForStore(choiceElementForStore);
        const expectedObject = {
            testGUID: choiceElementForStore
        };
        expect(Object.values(actualResult)[0]).toMatchObject(expectedObject);
    });
});

describe('createChoiceMetadataObject function', () => {
    it('throws an error when called without a choice Element object', () => {
            expect(() => {
                createChoiceMetadataObject();
            }).toThrow();
    });
    it('returns a new choice meta data object when a valid choice object is passed', () => {
        const actualResult = createChoiceMetadataObject(choiceElementForStore);
        expect(actualResult).toMatchObject(choiceElementWithUserInput);
    });
});