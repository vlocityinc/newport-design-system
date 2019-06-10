import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
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
export const labelFilter = pattern => {
    return obj => {
        return pattern ? containsMatcher(obj, 'label', pattern) : true;
    };
};

/**
 * Creates a filter that finds resources (non canvas elements and elements in automatic handling mode) containing the
 * given pattern in their name.
 *
 * @param {String}
 *            pattern the substring to search for
 * @return {Function} a filter function that finds resources containing the given
 *         pattern in their label
 */
export const resourceFilter = pattern => {
    return obj => {
        let result =
            booleanMatcher(obj, 'isCanvasElement', false) ||
            booleanMatcher(obj, 'storeOutputAutomatically', true);
        if (pattern) {
            result = result && containsMatcher(obj, 'name', pattern);
        }

        return result;
    };
};

/**
 * Creates a filter that finds canvas elements containing the given pattern in their name.
 *
 * @param {String}
 *            pattern the substring to search for
 * @return {Function} a filter function that finds canvas elements containing the given
 *         pattern in their label
 */
export const canvasElementFilter = pattern => {
    return obj => {
        // TODO: Temporarily filtering out the Start Element until it becomes a
        // first class element.
        let result =
            notEqualsMatcher(obj, 'elementType', ELEMENT_TYPE.START_ELEMENT) &&
            booleanMatcher(obj, 'isCanvasElement', true);
        if (pattern) {
            result = result && containsMatcher(obj, 'name', pattern);
        }
        return result;
    };
};
