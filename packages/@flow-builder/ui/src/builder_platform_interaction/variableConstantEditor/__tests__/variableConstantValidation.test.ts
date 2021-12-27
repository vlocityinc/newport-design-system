// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { createElement } from 'lwc';
import * as mockStoreData from 'mock/storeData';
import VariableConstantEditor from '../variableConstantEditor';
import { getRules, variableConstantValidation } from '../variableConstantValidation';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-constant-editor', {
        is: VariableConstantEditor
    });
    element.node = props;
    element.node.subtypeIndex = { value: 'guid', error: null };
    setDocumentBodyChildren(element);
    return element;
};

describe('Variable Validation', () => {
    let stringVar;

    const validate = (node) => {
        return getErrorsFromHydratedElement(variableConstantValidation.validateAll(node, getRules(node)));
    };

    it('returns error for variable with no dataType', () => {
        stringVar = mockStoreData.stringVariableForPropertyEditor();
        stringVar.dataType.value = undefined;
        const variable = setupComponentUnderTest(stringVar);
        const node = variable.node;
        const errors = validate(node);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toHaveProperty('key', 'dataType');
    });

    it('returns error for sobject variable with no sobject type', () => {
        const sobjectVar = mockStoreData.accountSObjectVariableForPropertyEditor();
        sobjectVar.subtype.value = undefined;
        const variable = setupComponentUnderTest(sobjectVar);
        const errors = validate(variable.node);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toHaveProperty('key', 'subtype');
    });
});
