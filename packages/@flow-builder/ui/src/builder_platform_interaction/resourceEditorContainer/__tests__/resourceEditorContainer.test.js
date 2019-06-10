import { createElement } from 'lwc';
import ResourceEditorContainer from '../resourceEditorContainer';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';

jest.mock('builder_platform_interaction/variableConstantEditor', () =>
    require('builder_platform_interaction_mocks/variableConstantEditor')
);

const setupComponentUnderTest = props => {
    const element = createElement(
        'builder_platform_interaction-resource-editor-container',
        {
            is: ResourceEditorContainer
        }
    );
    if (props) {
        Object.assign(element, props);
    }
    document.body.appendChild(element);
    return element;
};

const EDITOR_SELECTOR = '.editor_template';

const mockNode = { elementType: ELEMENT_TYPE.VARIABLE };

jest.mock('builder_platform_interaction/propertyEditorFactory', () => {
    return {
        getElementForPropertyEditor: jest.fn().mockImplementation(node => node)
    };
});

describe('resource-editor-container', () => {
    const selectedResource = 'variable';

    it('should not have an inner node element without selected resource', () => {
        const container = setupComponentUnderTest();
        const innerNode = container.getNode();
        expect(innerNode).toBeUndefined();
    });

    it('should accept the selected resource', () => {
        const container = setupComponentUnderTest({ selectedResource });
        expect(container.selectedResource).toEqual(selectedResource);
    });

    it('should create, mutate, and hydrate a flow element when resource is selected', () => {
        const container = setupComponentUnderTest({ selectedResource });
        const innerNode = container.shadowRoot.querySelector(EDITOR_SELECTOR);
        innerNode.getNode.mockReturnValueOnce(mockNode);
        const retVal = container.getNode();
        expect(retVal).toEqual(mockNode);
        expect(getElementForPropertyEditor).toHaveBeenCalled();
    });

    it('should call validate on the inner element when resource is selected', () => {
        const container = setupComponentUnderTest({ selectedResource });
        const innerNode = container.shadowRoot.querySelector(EDITOR_SELECTOR);
        const mockValidationResult = 'mock validation result';
        innerNode.validate.mockReturnValueOnce(mockValidationResult);
        const retVal = container.validate();
        expect(retVal).toEqual(mockValidationResult);
    });

    it('should return undefined when validate is called and resource type is not selected', () => {
        const container = setupComponentUnderTest();
        const retVal = container.validate();
        expect(retVal).toBeUndefined();
    });
});
