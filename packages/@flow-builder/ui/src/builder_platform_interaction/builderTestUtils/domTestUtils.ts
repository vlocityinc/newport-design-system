/**
 * Returns element given the path though nested shadow roots.
 */
export const deepQuerySelector = (element, selectorsArray: string[]) => {
    let result = element;
    for (const selector of selectorsArray) {
        result = result.shadowRoot.querySelector(selector);
        if (result === null) {
            return result;
        }
    }
    return result;
};
