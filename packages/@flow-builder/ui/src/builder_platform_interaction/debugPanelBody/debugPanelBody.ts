// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS, failedToCRUDRecordAbsoluteMatches, failedToCRUDRecordRelativeMatches } from './debugPanelBodyLabels';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ResumeDebugFlowEvent } from 'builder_platform_interaction/events';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

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

    @api waitevents;

    @api resumetime;

    @api limits;

    _ifblockresume;

    @api
    get ifblockresume() {
        return this._ifblockresume;
    }

    set ifblockresume(newVal) {
        this._ifblockresume = newVal;
    }

    @api showGovLim;

    govLimSubtitle = LABELS.govInfo;

    get showLim() {
        return !!this.showGovLim && !!this.limits;
    }

    /* store the selected wait event name and resume time*/
    selectedEvent;

    handleWaitEventSelection(event) {
        this.selectedEvent = {
            name: event.detail.value,
            resumetime: this.resumetime.get(event.detail.value)
        };
    }

    handleWaitEventSubmit(event) {
        event.preventDefault();
        this._ifblockresume = true;
        const resumeDebugFlowEvent = new ResumeDebugFlowEvent(this.selectedEvent.name);
        this.dispatchEvent(resumeDebugFlowEvent);
    }

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

        /* initialize options of wait event and default selection */
        if (this.waitevents && !!this.waitevents[0]) {
            /* if this's the first time to load this page */
            if (this.selectedEvent === undefined) {
                this.selectedEvent = {
                    name: this.waitevents[0].label,
                    resumetime: this.resumetime.get(this.waitevents[0].label)
                };
            }
            const slection = {
                options: this.waitevents,
                default: this.selectedEvent.name,
                helpText: LABELS.waitEventSelectionHelpText,
                label: LABELS.waitEventSelectionLabel,
                isSelection: true,
                isSelectionButton: false,
                id: generateGuid()
            };
            obj.push(slection);
        }

        for (let i = 0; i < this.lines.length; i++) {
            let curr = this.lines[i].replace(/\\"/g, '');
            curr = curr.trim();

            if (curr !== '' && !curr.includes('$$:') && curr !== this.title) {
                const temp = {
                    value: curr,
                    isSubTitle: false,
                    isWarn: false,
                    isError: false,
                    class: '',
                    id: generateGuid()
                };

                if (curr === LABELS.resultLabel || curr === LABELS.inputLabel) {
                    temp.isSubTitle = true;
                } else if (curr.charAt(curr.length - 1) === ':') {
                    temp.value = curr.slice(0, -1);
                    temp.isSubTitle = true;
                } else if (this.needsWarningIcon(curr)) {
                    temp.isWarn = true;
                } else if (this.needsTopPadding(curr)) {
                    temp.class = 'top-padding-selection slds-p-top_small ';
                }

                /* if there's wait event selection card, then append the resume time selected if there's */
                if (this.waitevents && !!this.waitevents[0] && !!this.selectedEvent.resumetime) {
                    temp.value =
                        '<b>' +
                        LABELS.alarmEventHelpTextHeader +
                        ' </b>' +
                        format(temp.value, this.selectedEvent.resumetime);
                }

                obj.push(temp);
            }
        }

        /* if there's wait event selection card, and then generate a button */
        if (this.waitevents && !!this.waitevents[0]) {
            obj.push({
                label: LABELS.waitEventSubmitLabel,
                isSelection: false,
                isSelectionButton: true,
                id: generateGuid()
            });
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
            class: '',
            id: generateGuid()
        };
    }

    needsWarningIcon(currString) {
        if (failedToCRUDRecordAbsoluteMatches.includes(currString)) {
            return true;
        }
        return (
            failedToCRUDRecordRelativeMatches.map((e) => currString.startsWith(e)).filter((e) => e === true).length > 0
        );
    }

    needsTopPadding(currString) {
        return currString.startsWith(LABELS.exitDetermination.concat(' Flow ('));
    }
}
