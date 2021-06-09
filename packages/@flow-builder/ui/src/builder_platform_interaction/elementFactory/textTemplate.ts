// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource, baseElementsArrayToMap } from './base/baseElement';
import { baseResourceMetadataObject } from './base/baseMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.TEXT_TEMPLATE;

/**
 * @param textTemplate
 */
export function createTextTemplate(textTemplate = {}) {
    const newTextTemplate = baseResource(textTemplate);
    const { text = '' } = textTemplate;
    const textTemplateObject = Object.assign(newTextTemplate, {
        elementType,
        text,
        dataType: FLOW_DATA_TYPE.STRING.value,
        isViewedAsPlainText: textTemplate.isViewedAsPlainText || false
    });
    return textTemplateObject;
}

/**
 * @param textTemplate
 */
export function createTextTemplateForStore(textTemplate = {}) {
    const newTextTemplate = createTextTemplate(textTemplate);
    return baseElementsArrayToMap([newTextTemplate]);
}

/**
 * @param textTemplate
 */
export function createTextTemplateMetadataObject(textTemplate) {
    if (!textTemplate) {
        throw new Error('textTemplate is not defined');
    }
    const newTextTemplate = baseResourceMetadataObject(textTemplate);
    const { text, isViewedAsPlainText } = textTemplate;

    return Object.assign(newTextTemplate, {
        text,
        isViewedAsPlainText
    });
}
