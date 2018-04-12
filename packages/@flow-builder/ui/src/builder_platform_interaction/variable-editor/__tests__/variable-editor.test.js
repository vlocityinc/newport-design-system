import { createElement } from 'engine';
import VariableEditor from '../variable-editor';
import { elements, stringVariableGuid, variable } from 'mock-store-data';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

jest.mock('builder_platform_interaction-data-mutation-lib', () => {
    return {
        getErrorsFromHydratedElement: jest.fn(),
    };
});

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-variable-editor', {
        is: VariableEditor,
    });
    element.node = props;
    document.body.appendChild(element);
    return element;
};

describe('variable-editor', () => {
    const stringVariable = elements[stringVariableGuid];
    it('contains a variable element', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            expect(variableEditor.node.elementType).toEqual(variable);
            expect(variableEditor.getNode()).toEqual(stringVariable);
        });
    });

    it('has a validate method', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            variableEditor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledTimes(1);
        });
    });
});