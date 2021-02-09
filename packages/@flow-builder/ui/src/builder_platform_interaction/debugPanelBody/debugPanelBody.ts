import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelBodyLabels';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * This is the debug panel body that shows the debug run info inside each accordion on
 * builder canvas (debugMode)
 *
 * - Strings with "Error Occurred:" or "Error element" titles recieve an error box
 * - Warning icon appears when a variable is null or (null) and "Failed to find record"
 * - Governor limit info recieves one "Governor Limit Info" title
 * - Titles are "Result" or any string that ends with ":"
 */

const NULL = '^[^ ]+ = null$';
const EQUALSNULL = '^[^ ]+ ' + LABELS.equals + ' null$';
const NULLPARENS = '(null)';

/* Labels with "{0}" or "{1}" need to be replaced" for proper checking */
const ERROR_OCCURRED = LABELS.faultMess.replace('{0}', '');
const ELEMENT_ERR_TITLE = LABELS.errorBody.replace(/ \{0\} \(\{1\}\)./, '').trim();

export default class debugPanelBody extends LightningElement {
    @api lines;

    @api error;

    @api title;

    @api limits;

    govLimSubtitle = LABELS.govInfo;

    get textObj() {
        return this.getDebugInfoBody();
    }

    /**
     * Main function to format the string. Each string will have an object with
     * booleans to indicate if it will be need special formatting
     */
    getDebugInfoBody() {
        let obj = [{}];

        /* removes empty object in array */
        obj = obj.splice(1);

        /* element error will take up an entire card */
        if (this.title.includes(ELEMENT_ERR_TITLE)) {
            obj.push(this.formatErrorMessage());
            return obj;
        }

        for (let i = 0; i < this.lines.length; i++) {
            let curr = this.lines[i].replace(/\\"/g, '');
            curr = curr.trim();

            if (curr !== '' && !curr.includes('$$:') && curr !== this.title) {
                const temp = { value: curr, isSubTitle: false, isWarn: false, isError: false, id: generateGuid() };

                if (curr === LABELS.resultLabel || curr === LABELS.inputLabel) {
                    temp.isSubTitle = true;
                } else if (curr.charAt(curr.length - 1) === ':') {
                    temp.value = curr.slice(0, -1);
                    temp.isSubTitle = true;
                } else if (this.needsWarningIcon(curr)) {
                    temp.isWarn = true;
                }

                obj.push(temp);
            }
        }

        /* different from element error, this adds the fault detail at the end of debug card */
        if (this.error) {
            obj.push(this.formatErrorMessage());
        }

        return obj;
    }

    /**
     * Handles error messages that begin with "Error Occurred:"
     * - All text is placed in an error box
     * - "Error Occurred:" portion is set as the title
     */
    formatErrorMessage() {
        let errorSubtitleEnd = 0;
        if (this.error.includes(ERROR_OCCURRED)) {
            errorSubtitleEnd = this.error.indexOf(':') + 1;
        }
        return {
            bold: ERROR_OCCURRED,
            value: this.error.substring(errorSubtitleEnd),
            isSubTitle: false,
            isWarn: false,
            isError: true,
            id: generateGuid()
        };
    }

    needsWarningIcon(currString) {
        return (
            currString.match(NULL) ||
            currString.match(EQUALSNULL) ||
            currString.includes(NULLPARENS) ||
            currString === LABELS.failedFind
        );
    }
}
