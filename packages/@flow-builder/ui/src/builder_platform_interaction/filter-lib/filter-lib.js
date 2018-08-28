import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { booleanMatcher, containsMatcher, notEqualsMatcher } from './matchers';

export * from './matchers';

/**
 * Creates a filter function that finds objects containing the given pattern in
 * their label field.
 *
 * @param {String}
 *            pattern the substring to search for
 * @return {Function} a filter function that finds elements containing the given
 *         pattern in their label
 */
export const labelFilter = (pattern) => {
    return (obj) => {
        return pattern ? containsMatcher(obj, 'label', pattern) : true;
    };
};

/**
 * Creates a filter that finds canvas or non-canvas elements containing the
 * given pattern in their name.
 *
 * @param {boolean}
 *            isCanvasElement true for just canvas elements, false for just
 *            non-canvas elements
 * @param {String}
 *            pattern the substring to search for
 * @return {Function} a filter function that finds elements containing the given
 *         pattern in their label
 */
export const resourceFilter = (isCanvasElement, pattern) => {
    return (obj) => {
        // TODO: Temporarily filtering out the Start Element until it becomes a
        // first class element.
        let result = notEqualsMatcher(obj, 'elementType', ELEMENT_TYPE.START_ELEMENT) &&
            booleanMatcher(obj, 'isCanvasElement', isCanvasElement);

        if (pattern) {
            result = result && containsMatcher(obj, 'name', pattern);
        }

        return result;
    };
};