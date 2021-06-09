/**
 * Returns element given the path though nested shadow roots.
 *
 * @param element
 * @param selectorsArray
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

export const setDocumentBodyChildren = <T extends Node>(...children: T[]) => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    for (const child of children) {
        document.body.appendChild(child);
    }
};

export const removeDocumentBodyChildren = setDocumentBodyChildren.bind(null);
