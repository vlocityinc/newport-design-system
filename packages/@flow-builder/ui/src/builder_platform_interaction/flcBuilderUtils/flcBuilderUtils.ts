// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

/**
 * @return true iff an element can have children
 */
export function supportsChildren({ elementType }) {
    return elementType === ELEMENT_TYPE.DECISION || elementType === ELEMENT_TYPE.WAIT;
}

/**
 * Maps a flow ELEMENT_TYPE to an FLC ElementType
 */
export function getFlcElementType(elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.WAIT:
            return ElementType.BRANCH;
        case ELEMENT_TYPE.LOOP:
            return ElementType.LOOP;
        case ELEMENT_TYPE.START_ELEMENT:
            return ElementType.START;
        case ELEMENT_TYPE.END_ELEMENT:
            return ElementType.END;
        case ELEMENT_TYPE.ROOT_ELEMENT:
            return ElementType.ROOT;
        default:
            return ElementType.DEFAULT;
    }
}

/**
 * Extra properties used by the flc canvas for elements
 */
export const flcExtraProps = ['next', 'prev', 'children', 'parent', 'childIndex', 'isTerminal'];

/**
 * Adds flc props that are not undefined to an object
 * @param {*} object Object to add flc props to
 * @param {*} flcProperties Object containing flc props
 */
export function addFlcProperties(object, flcProperties) {
    if (useFixedLayoutCanvas()) {
        flcExtraProps.forEach(propName => {
            const propValue = flcProperties[propName];
            if (propValue !== undefined) {
                object[propName] = propValue;
            }
        });
    }

    return object;
}
