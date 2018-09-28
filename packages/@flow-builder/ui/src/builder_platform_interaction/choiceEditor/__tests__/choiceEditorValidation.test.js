import { createElement } from 'lwc';
import ChoiceEditor from '../choiceEditor';
import { choiceValidation } from '../choiceValidation.js';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

const setupComponentUnderTest = (defaultChoiceObject) => {
    const element = createElement('builder_platform_interaction-choice-editor', {
        is: ChoiceEditor,
    });
    element.node = defaultChoiceObject;
    document.body.appendChild(element);
    return element;
};

describe('Choice Validation', () => {
    const userInputChoiceObject = {
        choiceText: {
            value: '',
            error: null
        },
        dataType: {
            value: null,
            error: null
        },
        description: {
            value: 'Desc',
            error: null
        },
        elementType: {
            value: 'CHOICE',
            error: null
        },
        guid: {
            value: 'guid_1',
            error: null
        },
        isShowInputSelected: true,
        isValidateSelected: false,
        name: {
            value: 'choice1',
            error: null
        },
        storedValue: {
            value: 'storedValue',
            error: null
        },
        userInput: {
            promptText: {
                value: '',
                error: null
            },
            isRequired: true,
            validationRule: undefined
        }
    };

    const validate = (node) => {
        return getErrorsFromHydratedElement(choiceValidation.validateAll(node));
    };

    let errors;
    beforeEach(() => {
        const choice = setupComponentUnderTest(userInputChoiceObject);
        const node = choice.node;
        errors = validate(node);
    });

    it('Returns three errors for userInputChoiceObject', () => {
        expect(errors).toHaveLength(3);
    });

    it('Returns errors for choice with no choiceText', () => {
        expect(errors[0]).toHaveProperty('key', 'choiceText');
    });

    it('Returns errors for choice with no dataType', () => {
        expect(errors[1]).toHaveProperty('key', 'dataType');
    });

    it('Returns errors for choice with no promptText', () => {
        expect(errors[2]).toHaveProperty('key', 'promptText');
    });
});