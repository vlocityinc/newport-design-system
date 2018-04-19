import { createElement } from 'engine';
import VariableEditor from '../variable-editor';
import { elements, stringVariableGuid, variable } from 'mock-store-data';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
};

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

    it('has label description component', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        const labelDescription = variableEditor.querySelector(SELECTORS.LABEL_DESCRIPTION);
        expect(labelDescription).toBeDefined();
        expect(labelDescription.description).toBe(stringVariable.description);
        expect(labelDescription.devName).toBe(stringVariable.name);
    });

    it('handles the property changed event and updates the property', () => {
        const variableEditor = setupComponentUnderTest(stringVariable);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            variableEditor.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(variableEditor.node.description.value).toBe('new desc');
            expect(variableEditor.node.description.error).toBeNull();
        });
    });
});