import {
    createFlowElement,
    elementTypeToConfigMap,
    ELEMENT_TYPE,
    getConfigForElementType,
    isCanvasElement
} from '../element-config';
import {CONDITION_LOGIC} from 'builder_platform_interaction-flow-metadata';

function verifyConfig(elementType, config) {
    let expectedConfig = elementTypeToConfigMap[elementType];
    if (!expectedConfig) {
        expectedConfig = elementTypeToConfigMap[ELEMENT_TYPE.DEFAULT];
    }
    expect(config.descriptor).toEqual(expectedConfig.descriptor);
}

function verifyElement(elementType, element) {
    const config = elementTypeToConfigMap[elementType];
    expect(element.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
    expect(element.guid).toBeTruthy();
    expect(element.maxConnections).toEqual(config.nodeConfig.maxConnections);
}

describe('element-config', () => {
    describe('getConfigForElementType', () => {
        it('returns a default element config when element type is empty', () => {
            verifyConfig(undefined, getConfigForElementType());
        });

        it('returns a default element config when element type is unknown', () => {
            const elementType = 'invalid';
            verifyConfig(elementType, getConfigForElementType(elementType));
        });

        it('returns the assignment element config', () => {
            const elementType = ELEMENT_TYPE.ASSIGNMENT;
            verifyConfig(elementType, getConfigForElementType(elementType));
        });
    });

    describe('isCanvasElement', () => {
        it('returns false for an empty element type', () => {
            expect(isCanvasElement()).toEqual(false);
        });

        it('returns false for a non-canvas element type', () => {
            expect(isCanvasElement(ELEMENT_TYPE.VARIABLE)).toEqual(false);
        });

        it('returns true for a canvas element type', () => {
            expect(isCanvasElement(ELEMENT_TYPE.ASSIGNMENT)).toEqual(true);
        });
    });

    describe('createFlowElement', () => {
        it('should throw an exception for unknown element types', () => {
            let template;
            let typeError;
            try {
                template = createFlowElement('foo');
            } catch (e) {
                typeError = e;
            }
            expect(template).toBeUndefined();
            expect(typeError).toBeInstanceOf(TypeError);
        });

        it('should throw an exception for element types without a template', () => {
            let template;
            let error;
            try {
                template = createFlowElement(ELEMENT_TYPE.DEFAULT);
            } catch (e) {
                error = e;
            }
            expect(template).toBeUndefined();
            expect(error).toBeDefined();
        });

        it('attempts to set maxConnections by default', () => {
            const elementType = ELEMENT_TYPE.ASSIGNMENT;
            const element = createFlowElement(elementType);

            expect(element.maxConnections).not.toBeNull();
        });

        it('does not set maxConnections if hasConnections = false', () => {
            const elementType = ELEMENT_TYPE.ASSIGNMENT;
            const element = createFlowElement(elementType, false);

            expect(element.maxConnections).not.toBeDefined();
        });

        it('returns a new instance of an assignment node with the appropriate fields populated', () => {
            const elementType = ELEMENT_TYPE.ASSIGNMENT;
            const element = createFlowElement(elementType);
            verifyElement(elementType, element);
        });

        it('returns a new instance of an outcome node with the appropriate fields populated', () => {
            const elementType = ELEMENT_TYPE.OUTCOME;
            const element = createFlowElement(elementType, false);

            expect(element.label).toEqual('');
            expect(element.conditionLogic).toEqual(CONDITION_LOGIC.AND);
            expect(element.conditions).toEqual([{
                leftValueReference: '',
                operator: '',
                rightValue: {
                    stringValue: ''
                },
            }]);
        });
    });
});
