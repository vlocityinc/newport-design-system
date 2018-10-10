import { createElement } from 'lwc';
import PicklistChoiceSetEditor from '../picklistChoiceSetEditor';
import { picklistChoiceSetValidation } from '../picklistChoiceSetValidation';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

const setupComponentUnderTest = (picklistChoiceSetObject) => {
    const element = createElement('builder_platform_interaction-picklist-choice-set-editor', {
        is: PicklistChoiceSetEditor,
    });
    element.node = picklistChoiceSetObject;
    document.body.appendChild(element);
    return element;
};

describe('Picklist Choice Set Validation', () => {
    const picklistChoiceSetObject = {
        elementType: {
            value: 'CHOICE',
            error: null
        },
        guid: {
            value: 'guid_1',
            error: null
        },
        name: {
            value: 'pChoice_',
            error: null
        },
        description: {
            value: 'Desc',
            error: null
        },
        picklistObject: {
            value: null,
            error: null
        },
        dataType: {
            value: null,
            error: null
        },
        picklistField: {
            value: null,
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        }
    };

    const validate = (node) => {
        return getErrorsFromHydratedElement(picklistChoiceSetValidation.validateAll(node));
    };

    let errors;
    beforeEach(() => {
        const picklistChoice = setupComponentUnderTest(picklistChoiceSetObject);
        const node = picklistChoice.node;
        errors = validate(node);
    });

    it('Returns four errors for picklistChoiceSetObject', () => {
        expect(errors).toHaveLength(4);
    });

    it('Returns errors for choice with no name', () => {
        expect(errors[0]).toHaveProperty('key', 'name');
    });

    it('Returns errors for choice with no picklistObject', () => {
        expect(errors[1]).toHaveProperty('key', 'picklistObject');
    });

    it('Returns errors for choice with no dataType', () => {
        expect(errors[2]).toHaveProperty('key', 'dataType');
    });

    it('Returns errors for choice with no picklistField', () => {
        expect(errors[3]).toHaveProperty('key', 'picklistField');
    });
});