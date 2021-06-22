// @ts-nocheck
import { createElement } from 'lwc';
import ResourceEditorContainer from '../resourceEditorContainer';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/variableConstantEditor', () =>
    require('builder_platform_interaction_mocks/variableConstantEditor')
);

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-resource-editor-container', {
        is: ResourceEditorContainer
    });
    if (props) {
        Object.assign(element, props);
    }
    setDocumentBodyChildren(element);
    return element;
};

const EDITOR_SELECTOR = '.editor_template';

const mockNode = { elementType: ELEMENT_TYPE.VARIABLE };
const mockNode2 = { elementType: ELEMENT_TYPE.VARIABLE, dataType: 'string', name: 'var1' };

jest.mock('builder_platform_interaction/propertyEditorFactory', () => {
    return {
        getElementForPropertyEditor: jest.fn().mockImplementation((node) => node)
    };
});

describe('resource-editor-container', () => {
    const selectedResourceType = 'variable';
    const newResourceInfo = { newResource: { name: 'var1' }, dataType: 'string' };

    it('should not have an inner node element without selected resource', () => {
        const container = setupComponentUnderTest();
        const innerNode = container.getNode();
        expect(innerNode).toBeUndefined();
    });

    it('should accept the selected resource', () => {
        const container = setupComponentUnderTest({ selectedResourceType });
        expect(container.selectedResourceType).toEqual(selectedResourceType);
    });

    it('should create, mutate, and hydrate a flow element when resource is selected', () => {
        const container = setupComponentUnderTest({ selectedResourceType });
        const innerNode = container.shadowRoot.querySelector(EDITOR_SELECTOR);
        innerNode.getNode.mockReturnValueOnce(mockNode);
        const retVal = container.getNode();
        expect(retVal).toEqual(mockNode);
        expect(getElementForPropertyEditor).toHaveBeenCalled();
    });

    it('should create the correct flow element when resource type is selected and new resource info is provided', () => {
        setupComponentUnderTest({ selectedResourceType, newResourceInfo });
        expect(getElementForPropertyEditor).toHaveBeenCalledWith(mockNode2);
    });

    it('should call validate on the inner element when resource is selected', () => {
        const container = setupComponentUnderTest({ selectedResourceType });
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
