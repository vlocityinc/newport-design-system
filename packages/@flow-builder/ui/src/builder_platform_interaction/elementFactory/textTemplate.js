import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource, baseElementsArrayToMap } from './base/baseElement';
import { baseResourceMetadataObject } from './base/baseMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.TEXT_TEMPLATE;

export function createTextTemplate(textTemplate = {}) {
    const newTextTemplate = baseResource(textTemplate);
    const { text = '' } = textTemplate;
    const textTemplateObject = Object.assign(newTextTemplate, {
        elementType,
        text,
        dataType: FLOW_DATA_TYPE.STRING.value
    });

    return textTemplateObject;
}

export function createTextTemplateForStore(textTemplate = {}) {
    const newTextTemplate = createTextTemplate(textTemplate);
    return baseElementsArrayToMap([newTextTemplate]);
}

export function createTextTemplateMetadataObject(textTemplate) {
    if (!textTemplate) {
        throw new Error('textTemplate is not defined');
    }
    const newTextTemplate = baseResourceMetadataObject(textTemplate);
    const { text } = textTemplate;

    return Object.assign(newTextTemplate, {
        text
    });
}
