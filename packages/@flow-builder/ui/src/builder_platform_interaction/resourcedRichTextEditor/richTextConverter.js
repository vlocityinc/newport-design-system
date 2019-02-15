const FONT_ATTRIBUTE_MAPPING = {
    'FACE': 'font-family',
    'COLOR': 'color',
};

/*
 * This function converts HTML edited in Cloud Flow Designer (either in the flash rich text editor or in a textarea) to HTML that lightning-input-rich-text (which is using Quill) can understand.
 */
export function convertHTMLToQuillHTML(htmlText) {
    if (htmlText) {
        const document = new DOMParser().parseFromString(htmlText, 'text/html');

        document.childNodes.forEach(node => {
            processNode(node, document);
        });

        const convertedString = new XMLSerializer().serializeToString(document.documentElement.querySelector('body'));
        return convertedString.replace(/<\/?body[^>]*>/ig, '');
    }
    return htmlText;
}

function processNode(node) {
    let newNode;
    const nodeName = node.nodeName;

    if (nodeName === 'DIV') {
        newNode = processDivNode(node);
    } else if (nodeName === 'FONT') {
        newNode = processFontNode(node);
    } else if (nodeName === 'UL') {
        newNode = processUlNode(node);
    } else if (nodeName === 'LI') {
        newNode = processLiNode(node);
    } else if (!isElementSupported(node)) {
        newNode = processUnsupportedNode(node);
    } else {
        newNode = node;
    }

    if (newNode) {
        newNode.childNodes.forEach(childNode => {
            processNode(childNode, newNode);
        });
    }
}

/*
 * Align is deprecated on DIV, this function transforms it to style attribute.
 */
function processDivNode(node) {
    const alignment = node.getAttribute('ALIGN');
    if (alignment) {
        node.removeAttribute('ALIGN');
        node.style.textAlign = alignment.toLowerCase();
    }
    return node;
}

/*
 * The source HTML contains li tags without ul parents. To be valid we need to add the parent to the li tag.
 */
function processLiNode(node) {
    if (node.parentNode.nodeName !== 'UL') {
        const ulNode = createElement('ul');
        const liNode = node.parentNode.replaceChild(ulNode, node);
        ulNode.appendChild(liNode);
        return liNode;
    }
    return node;
}

function processUlNode(node) {
    if (node.nextSibling && node.nextSibling.nodeName === 'LI') {
        const liNode = node.parentNode.removeChild(node.nextSibling);
        node.appendChild(liNode);
        return liNode;
    }
    return node;
}

/*
 * font tag is deprecated. This function converts it to CSS.
 * See Document : https://docs.google.com/document/d/1wdQSznex5PsRnHuzheKz06tZuojBmdJbTNEMdgCqVoY/edit#
 */
function processFontNode(node) {
    const renamedNode = renameNode(node, 'span');

    const attributesToRemove = [];
    const attributes = renamedNode.attributes;

    for (const attribute of attributes) {
        const attrNameUpperCase = attribute.name.toUpperCase();
        const newAttribute = FONT_ATTRIBUTE_MAPPING[attrNameUpperCase];
        if (newAttribute) {
            renamedNode.style[newAttribute] = attribute.value;

            attributesToRemove.push(attribute.name);
        }
    }

    attributesToRemove.forEach(attribute => {
        renamedNode.removeAttribute(attribute);
    });

    return renamedNode;
}

/*
 * This function removes unsupported tag but keeps its children.
 */
function processUnsupportedNode(node) {
    const parentNode = node.parentNode;
    if (node.hasChildNodes()) {
        let childNode = node.childNodes[0];
        parentNode.replaceChild(childNode, node);
        node.childNodes.forEach(childNodeTmp => {
            insertAfter(childNodeTmp, childNode);
            childNode = childNodeTmp;
        });
    } else {
        parentNode.removeChild(node);
    }
    return parentNode;
}

function renameNode(node, newNodeName) {
    const newNode = createElement(newNodeName);
    Array.from(node.attributes).forEach(attr => newNode.setAttribute(attr.localName, attr.value));
    Array.from(node.childNodes).forEach(childNode => newNode.appendChild(childNode));

    node.parentElement.insertBefore(newNode, node);
    node.parentElement.removeChild(node);
    return newNode;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createElement(tagName) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
}

/*
 * Feature test HTML element support
 *
 * @param {String} node
 * @return {Boolean}
 */
function isElementSupported(node) {
    return !(node instanceof HTMLUnknownElement);
}