import {
    elementTypeToConfigMap,
    getConfigForElementType,
    isCanvasElement,
    isChildElement,
    getElementCategory,
} from "../elementConfig";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { LABELS } from "../elementConfigLabels";

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

    describe('assigns menu item category', () => {
        it('for elements', () => {
            expect(getElementCategory(ELEMENT_TYPE.ASSIGNMENT)).toEqual(LABELS.assignmentPluralLabel);
        });
        it('for collections', () => {
            expect(getElementCategory(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.NUMBER, true)).toEqual(LABELS.collectionVariablePluralLabel);
        });
        it('for sobjects', () => {
            expect(getElementCategory(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.SOBJECT.value, false)).toEqual(LABELS.sObjectVariablePluralLabel);
        });
        it('for sobject collections', () => {
            expect(getElementCategory(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.SOBJECT.value, true)).toEqual(LABELS.sObjectCollectionVariablePluralLabel);
        });
        it('for apex variables', () => {
            expect(getElementCategory(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.APEX.value, false)).toEqual(LABELS.apexVariablePluralLabel);
        });
        it('for apex variable collections', () => {
            expect(getElementCategory(ELEMENT_TYPE.VARIABLE, FLOW_DATA_TYPE.APEX.value, true)).toEqual(LABELS.apexCollectionVariablePluralLabel);
        });
    });
});
