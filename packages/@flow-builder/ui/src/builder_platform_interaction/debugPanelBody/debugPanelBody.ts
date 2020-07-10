import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelBodyLabels';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * This is the debug panel body that shows the debug run info inside each accordion on
 * builder canvas (debugMode)
 *
 * - Splits rawText by newline characters
 * - Strings with "Error Occurred:" or "Error element" recieve an error box
 * - Warning icon appears when a variable is null or (null) and "Failed to find record"
 * - Governor limit info recieves a "Governor Limit Info" title
 * - Titles are "Result" or any string that ends with ":"
 */

const NULL = ' null$';
const NULLPARENS = '(null)';
const NEWLINE = '\\n';

/* Labels with "{0}" or "{1}" need to be replaced" for proper checking */
const ERROR = LABELS.faultMess.replace('{0}', '');
const DML = LABELS.dml.replace(/\{0\}|\{1\}/, '[0-9]+');
const DMLROW = LABELS.dmlRow.replace(/\{0\}|\{1\}/, '[0-9]+');
const SOQL = LABELS.soql.replace(/\{0\}|\{1\}/, '[0-9]+');
const SOQLROW = LABELS.soqlRow.replace(/\{0\}|\{1\}/, '[0-9]+');
const ERRBODY = LABELS.errorBody.replace(/ \{0\} \(\{1\}\)./, '').trim();

export default class debugPanelBody extends LightningElement {
    @api rawText;

    @api title;

    get textObj() {
        return this.getDebugInfoBody();
    }

    /**
     * Main function to format the string. Each string will be marked by booleans that
     * indicate if it will be need special formatting
     * - Splits text by newline
     * - Removes /" characters from output
     * - Removes trailing whitespace to help with checking for titles
     */
    getDebugInfoBody() {
        const obj = [{}];
        const splitText = this.rawText.split(NEWLINE);
        let needsGovTitle = true;

        if (this.title.includes(ERRBODY)) {
            obj.push(this.formatErrorBody(splitText));
            return obj;
        }

        for (let i = 0; i < splitText.length; i++) {
            let curr = splitText[i].replace(/\\"/g, '');
            curr = curr.trim();

            if (curr.includes(ERROR)) {
                obj.push(this.formatErrorMessage(curr));
            } else if (curr !== '' && !curr.includes('$$:') && curr !== this.title) {
                const temp = { value: curr, isTitle: false, isWarn: false, id: generateGuid() };
                if (curr === LABELS.resultLabel || curr === LABELS.inputLabel) {
                    temp.isTitle = true;
                } else if (curr.charAt(curr.length - 1) === ':') {
                    temp.value = curr.slice(0, -1);
                    temp.isTitle = true;
                } else if (curr.match(NULL) || curr.includes(NULLPARENS) || curr === LABELS.failedFind) {
                    temp.isWarn = true;
                } else if (needsGovTitle && this.isGovLimit(curr)) {
                    needsGovTitle = false;
                    obj.push({ value: LABELS.govInfo, isTitle: true, isWarn: false });
                }
                obj.push(temp);
            }
        }
        obj[0] = { value: '', isTitle: false, isWarn: false, id: generateGuid() };
        return obj;
    }

    /**
     * Handles error messages that begin with "Error Occurred:"
     * - All text is placed in an error box
     * - "Error Occurred:" portion is set as the title
     */
    formatErrorMessage(currString) {
        const boldEnd = currString.indexOf(':') + 1;
        return {
            bold: currString.substring(0, boldEnd),
            value: currString.substring(boldEnd),
            isTitle: false,
            isWarn: false,
            isError: true,
            id: generateGuid()
        };
    }

    /**
     * Handles error messages with a header that begins with "Error element"
     * - All text is placed in an error box
     * - "Error Occurred:" portion is added as the title inside the error box
     */
    formatErrorBody(splitText) {
        const temp = {
            bold: ERROR,
            value: '',
            isTitle: false,
            isWarn: false,
            isError: true,
            id: generateGuid()
        };
        for (let i = 0; i < splitText.length; i++) {
            if (splitText[i] !== '') {
                temp.value = temp.value + '\n' + splitText[i];
            }
        }
        return temp;
    }

    /* Checks if a string is a gov limit info */
    isGovLimit(currString) {
        return currString.match(DML) || currString.match(DMLROW) || currString.match(SOQL) || currString.match(SOQLROW);
    }
}
