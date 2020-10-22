// @ts-nocheck
import {
    elementTypeToConfigMap,
    getConfigForElementType,
    isCanvasElement,
    isChildElement,
    updateElementConfigMapWithSubtypes
} from '../elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

function verifyConfig(elementType, config) {
    let expectedConfig = elementTypeToConfigMap[elementType];
    if (!expectedConfig) {
        expectedConfig = elementTypeToConfigMap[ELEMENT_TYPE.DEFAULT];
    }
    expect(config.descriptor).toEqual(expectedConfig.descriptor);
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

    describe('isChildElement', () => {
        it('returns false for an empty element type', () => {
            expect(isChildElement()).toEqual(false);
        });

        it('returns true for non-top level element', () => {
            expect(isChildElement(ELEMENT_TYPE.OUTCOME)).toEqual(true);
        });

        it('returns false for a top level element', () => {
            expect(isChildElement(ELEMENT_TYPE.ASSIGNMENT)).toEqual(false);
        });
    });

    describe('updateElementConfigMapWithSubtypes', () => {
        it('updates the elementTypeToConfigMap to include subtype configuration', () => {
            const elements = [
                {
                    isElementSubtype: 'true',
                    name: 'test_subtype_name',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    label: 'test_label',
                    color: 'test_color',
                    icon: 'test_icon',
                    description: 'test_description',
                    configComponent: 'test_flowBuilderConfigComponent'
                }
            ];
            updateElementConfigMapWithSubtypes(elements);
            verifyConfig('test_subtype_name', getConfigForElementType('test_subtype_name'));
        });
    });
});
