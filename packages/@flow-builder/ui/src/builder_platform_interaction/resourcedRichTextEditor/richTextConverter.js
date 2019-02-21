import quillLib from 'lightning/quillLib';

const INPUT_RICH_TEXT_FONTS = quillLib.inputRichTextLibrary.FONT_LIST.map(item => ({ fontName : item.label.toUpperCase(), value : item.value }));

/**
 * This function converts HTML edited in Cloud Flow Designer (either in the flash rich text editor or in a textarea) to HTML that lightning-input-rich-text (which is using Quill) can understand.
 *
 * @param {string} htmlText html text we want to convert
 * @returns {string} converted html
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

/*
 * Process the given node
 *
 * @param {HtmlElement} node
 */
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
 *
 * @param {HtmlElement} node the div node
 * @returns {HtmlElement} the processed div node
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
 * When source HTML comes from the CFD RTE, it can contain li tags without ul parents.
 * We add a parent ul to li tags so that Quill can correctly convert them using matchers.
 *
 * @param {HtmlElement} node the li node
 * @returns {HtmlElement} node once processed
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
 *
 * @param {HtmlElement} node the font node
 * @returns {HtmlElement} the corresponding span node
 */
function processFontNode(node) {
    const renamedNode = renameNode(node, 'span');

    const attributesToRemove = [];
    const attributes = renamedNode.attributes;

    for (const attribute of attributes) {
        const attrNameUpperCase = attribute.name.toUpperCase();
        if (attrNameUpperCase === 'FACE') {
            const font = convertToSupportedFontFamily(attribute.value);
            if (font) {
                renamedNode.style.fontFamily = font;
            }
            attributesToRemove.push(attribute.name);
        } else if (attrNameUpperCase === 'COLOR') {
            renamedNode.style.color = attribute.value;
            attributesToRemove.push(attribute.name);
        }
    }

    attributesToRemove.forEach(attribute => {
        renamedNode.removeAttribute(attribute);
    });

    return renamedNode;
}

/*
 * Convert the fontName to one of the font supported by inputRichText if possible
 *
 * @param {string} fontName the font name to convert
 * @returns {string|undefined} the font name to use or undefined if it is the default font
 */
function convertToSupportedFontFamily(fontName) {
    const fontNameUppercase = fontName.toUpperCase();
    const elementFound = INPUT_RICH_TEXT_FONTS.find(element => element.fontName === fontNameUppercase);
    if (elementFound) {
        if (elementFound.value === 'default') {
            return undefined;
        }
        return elementFound.value;
    }
    return fontName;
}

/*
 * This function removes unsupported tag but keeps its children.
 *
 * @param {HtmlElement} node the node to process
 * @returns {HtmlElement} the parent node
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
 * @param {HtmlElement} node
 * @return {boolean}
 */
function isElementSupported(node) {
    return !(node instanceof HTMLUnknownElement);
}