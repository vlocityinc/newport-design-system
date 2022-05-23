// @ts-nocheck
/* !
 * Clamp.js 0.5.1
 *
 * Copyright 2011-2013, Joseph Schmitt http://joe.sh
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 */

// UTILITY FUNCTIONS __________________________________________________________
/**
 * Adds the ellipsis character to the end of the label and sets the
 * innerText to the element and resets the height variable
 *
 * @param {string} label - current label string that is being clamped
 * @param {string} character - the truncation character
 * @returns {string} Text string witth appended truncation character.
 */
const textWithEllipsis = (label, character) => `${label}${character}`;

/**
 * Sets the text content of the element to the label
 *
 * @param {HTMLElement} element - element containing the text node to clamp.
 * @param {string} label - current label string that is being clamped
 */
const setTextContent = (element, label) => (element.textContent = label);

/**
 * Gets the max height of text block to truncate to.
 *
 * @param {number} lines - the number of lines to clamp to.
 * @param {number} lineHeight - the lineheight of the text.
 * @returns {number} Returns the total height of the text in px.
 */
const getMaxHeight = (lines, lineHeight) => lines * lineHeight;

/**
 * Gets the strings to possibly remove during truncation
 *
 * @param {string} label - what is left of truncated label
 * @param {string} splitChar - character to split string on.
 * @returns {Array<string>} Returns an array of pieces of delimited text.
 */
const getChunks = (label, splitChar) => label.split(splitChar);

/**
 * Gets the next string to use as a delimiter.
 *
 * @param {Array<string>} delimiters - array of delimiters left to use;
 * @returns {string} Returns the next delimiter or an empty string to split the label by.
 */
const getNextDelimiter = (delimiters) => {
    // If there are more characters to try, grab the next one
    if (delimiters.length > 0) {
        return delimiters.shift();
    }
    // No characters to chunk by. Go character-by-character
    return '';
};

// ____________________________________________________________________

/**
 * Clamps a text node.
 *
 * @param {HTMLElement} element - element containing the text node to clamp.
 * @param args
 * @param {Array<string>} args.delimiters - array of string delimiters to split on. Default to array with space string.
 * @param {string} args.label - the text label to apply or clamp
 * @param {number} args.lineHeight - the lineheight of the text. Default 20px.
 * @param {number} args.lines - the number of lines to clamp to. Default 2 lines.
 * @param {string} args.truncationChar - the character to add to thte end of the truncated string. Default to ...
 */
export const clamp = (element, { delimiters = [], label = '', lineHeight = 20, lines = 2, truncationChar = '...' }) => {
    if (!label) {
        return;
    }

    // Set the initial label to the DOM node
    setTextContent(element, label);

    const maxHeight = getMaxHeight(lines, lineHeight);
    let height = element.clientHeight,
        splitChar,
        chunks = null;

    // While the height is larger than the required max
    while (height >= maxHeight) {
        // Grab the next chunks (words/letters split on delimiter)
        if (!chunks) {
            splitChar = getNextDelimiter(delimiters);
            chunks = getChunks(label, splitChar);
        }

        // If there are chunks left to remove, remove the next one
        if (chunks.length > 1) {
            chunks.pop();
            const newLabel = textWithEllipsis(chunks.join(splitChar), truncationChar, element);
            // set the new height and textContent
            setTextContent(element, newLabel);
            height = element.clientHeight;
        }
    }
};
