import { createElement } from 'lwc';
import VariableConstantEditor from "../variableConstantEditor";
import { variableConstantValidation } from "../variableConstantValidation.js";
import * as mockStoreData from "mock/storeData";
import { deepCopy } from "builder_platform_interaction/storeLib";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-constant-editor', {
        is: VariableConstantEditor,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

describe('Variable Validation', () => {
    let stringVar;

    const validate = (node) => {
        return getErrorsFromHydratedElement(variableConstantValidation.validateAll(node));
    };

    it('returns error for variable with no dataType', () => {
        stringVar = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.stringVariableGuid]);
        stringVar.dataType.value = undefined;
        const variable = setupComponentUnderTest(stringVar);
        const node = variable.node;
        const errors = validate(node);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toHaveProperty('key', 'dataType');
    });

    it('returns error for sobject variable with no sobject type', () => {
        const sobjectVar = deepCopy(mockStoreData.mutatedVariablesAndConstants[mockStoreData.accountSObjectVariableGuid]);
        sobjectVar.subtype.value = undefined;
        const variable = setupComponentUnderTest(sobjectVar);
        const errors = validate(variable.node);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toHaveProperty('key', 'subtype');
    });
});