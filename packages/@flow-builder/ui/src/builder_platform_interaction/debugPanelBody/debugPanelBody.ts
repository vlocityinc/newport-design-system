import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelBodyLabels';

const NULL = 'null';
const NEWLINE = '\\n';

// Labels with "{0}" or "{1}" need to be replaced"
const ERROR = LABELS.faultMess.replace('{0}', '');
const DML = LABELS.dml.replace(/\{0\}|\{1\}/, '[0-9]+');
const DMLROW = LABELS.dmlRow.replace(/\{0\}|\{1\}/, '[0-9]+');
const SOQL = LABELS.soql.replace(/\{0\}|\{1\}/, '[0-9]+');
const SOQLROW = LABELS.soqlRow.replace(/\{0\}|\{1\}/, '[0-9]+');
const ERRBODY = LABELS.errorBody.replace(/ \{0\} \(\{1\}\)./, '').trim();

export default class debugPanelBody extends LightningElement {
    @api rawText;
    @api title;
    textObj = [{}];

    connectedCallback() {
        this.getDebugInfoBody();
    }

    getDebugInfoBody() {
        let splitText = this.rawText.split([NEWLINE]);
        let needsGovTitle = true;

        if (splitText[0] === '') {
            splitText = splitText.slice(1);
        }
        for (let i = 0; i < splitText.length; i++) {
            // Get rid of \" in strings
            let curr = splitText[i].replace(/\\"/g, '');
            // Trim ending whitespace (for bolding purposes)
            curr = curr.trim();

            // Check for "Error Occurred:" string
            if (curr.includes(ERROR)) {
                this.formatErrorMessage(curr);
                // Keep out empty strings, breadcrumb, titles
            } else if (curr.includes(ERRBODY)) {
                this.formatErrorBody(curr, i, splitText);
                // After error message, no other strings remain
                break;
            } else if (curr !== '' && !curr.includes('$$:') && curr !== this.title) {
                const temp = { value: curr, isTitle: false, isWarn: false };
                // Check for bold or gov limit info
                if (curr === LABELS.resultLabel || curr === LABELS.inputLabel) {
                    temp.isTitle = true;
                } else if (curr.charAt(curr.length - 1) === ':') {
                    // remove ":" at the end
                    temp.value = curr.slice(0, -1);
                    temp.isTitle = true;
                } else if (curr.includes(NULL) || curr === LABELS.failedFind) {
                    // for now, inserting warning icon whenver there is "null" and for failed to find
                    temp.isWarn = true;
                } else if (needsGovTitle && this.isGovLimit(curr)) {
                    // Only need one title
                    needsGovTitle = false;
                    // Insert gov limit title
                    this.textObj.push({ value: LABELS.govInfo, isTitle: true, isWarn: false });
                }
                this.textObj.push(temp);
            }
        }
    }

    // for errors that start with "Error Occurred:"
    formatErrorMessage(currString) {
        // Bold "Error Occurred:" part, leave the rest
        const boldEnd = currString.indexOf(':') + 1;
        const temp = {
            bold: currString.substring(0, boldEnd),
            value: currString.substring(boldEnd),
            isTitle: false,
            isWarn: false,
            isError: true
        };
        this.textObj.push(temp);
    }

    formatErrorBody(currString, index, splitText) {
        const temp = {
            value: currString,
            isTitle: false,
            isWarn: false,
            isError: true
        };
        // Error message may include other strings in array
        for (let i = index + 1; i < splitText.length; i++) {
            if (i !== '') {
                temp.value = temp.value + '\n' + splitText[i];
            }
        }
        this.textObj.push(temp);
    }

    isGovLimit(currString) {
        // check for gov limit info
        return currString.match(DML) || currString.match(DMLROW) || currString.match(SOQL) || currString.match(SOQLROW);
    }
}
