/**
 * Deep find given element in object
 * @param {Object} object
 * @param {Object} element
 * @param {Function} [isEqual] the comparison function
 * @param {string} [path=''] current path
 * @return {string|undefined} the path to the element in object
 */
export const deepFind = (object, element, isEqual = (e1, e2) => e1 === e2, path = 'object') => {
    if (!isEqual(element, element)) {
        // we won't find anything
        return undefined;
    }
    if (isEqual(object, element)) {
        return path;
    }
    if (object == null) {
        return undefined;
    }
    const iterable = typeof object[Symbol.iterator] === 'function';
    if (iterable && typeof object !== 'string') {
        let i = 0;
        for (const value of object) {
            const found = deepFind(value, element, isEqual, path + `[${i++}]`);
            if (found !== undefined) {
                return found;
            }
        }
    } else if (typeof object === 'object') {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                let found = deepFind(key, element, isEqual, path + `.${key}`);
                if (found !== undefined) {
                    return found;
                }
                found = deepFind(object[key], element, isEqual, path + `.${key}`);
                if (found !== undefined) {
                    return found;
                }
            }
        }
    }
    return undefined;
};

/**
 * Deep find a common element between object1 and object2
 * @param {Object} object1
 * @param {Object} object2
 * @param {Function} [isEqual] the comparison function
 * @return {[string]|undefined} first element is path in object1, second element is path in object2
 */
export const deepFindCommonElement = (object1, object2, isEqual = (e1, e2) => e1 === e2, pathObject1 = 'object1', pathObject2 = 'object2') => {
    const path = deepFind(object1, object2, isEqual, pathObject1);
    if (path !== undefined) {
        return [path, pathObject2];
    }
    const iterable = typeof object2[Symbol.iterator] === 'function';
    if (iterable && typeof object2 !== 'string') {
        let i = 0;
        for (const value of object2) {
            const paths = deepFindCommonElement(object1, value, isEqual, pathObject1, pathObject2 + `[${i}]`);
            if (paths !== undefined) {
                return paths;
            }
            i++;
        }
    } else if (typeof object2 === 'object') {
        for (const key in object2) {
            if (Object.prototype.hasOwnProperty.call(object2, key)) {
                let paths = deepFindCommonElement(object1, key, isEqual, pathObject1, pathObject2 + `.${key}`);
                if (paths !== undefined) {
                    return paths;
                }
                paths = deepFindCommonElement(object1, object2[key], isEqual, pathObject1, pathObject2 + `.${key}`);
                if (paths !== undefined) {
                    return paths;
                }
            }
        }
    }
    return undefined;
};

const isImmutable = (element) => element == null || typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean';

export const matchers = {
    toHaveNoCommonMutableObjectWith(received, object2) {
        const paths = deepFindCommonElement(received, object2, (e1, e2) =>  e1 === e2 && !isImmutable(e1));
        if (!paths) {
            return {
                message: () => 'objects do not have a common mutable object',
                pass: true,
            };
        }
        return {
            message: () => `objects have a common mutable object : ${paths[0]}===${paths[1]}`,
            pass: false,
        };
    },
};