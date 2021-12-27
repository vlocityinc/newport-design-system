import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import DebugPanelBody from '../debugPanelBody';
import { failedToCRUDRecordAbsoluteMatches, failedToCRUDRecordRelativeMatches, LABELS } from '../debugPanelBodyLabels';
const { format } = commonUtils;

const createComponentUnderTest = (props = {}) => {
    const element = createElement('builder_platform_interaction-debug-panel-body', { is: DebugPanelBody });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};
const SELECTORS = {
    NORMALTEXT: '.normal',
    SUBTITLE: '.sub-title',
    BOX: '.box',
    WARNING: '.warning',
    ERROR: '.error',
    COMBOBOX: '.wait-event-selection',
    SUBMITBUTTON: '.wait-event-selection-button'
};
const TITLE = 'Test Title';
const NORMALINPUT = {
    lines: ['Admin User (005xx000001X7ib) started the flow interview'],
    title: TITLE
};
const varEqualsNull = {
    lines: ['{!var4} ' + LABELS.equals + ' null'],
    title: TITLE
};
const varEqualSignNull = {
    lines: ['var4 = null'],
    title: TITLE
};

const failedCrudOperations = {
    failedRecordLookups: {
        lines: [failedToCRUDRecordAbsoluteMatches[0]],
        title: TITLE
    },
    failedRecordLookup: {
        lines: [failedToCRUDRecordAbsoluteMatches[1]],
        title: TITLE
    },
    failedRecordCreates: {
        lines: [failedToCRUDRecordAbsoluteMatches[2]],
        title: TITLE
    },
    failedRecordCreate: {
        lines: [failedToCRUDRecordAbsoluteMatches[3]],
        title: TITLE
    },
    failedRecordUpdates: {
        lines: [failedToCRUDRecordRelativeMatches[0] + ' {!sobjectCCollectionVariable}.'],
        title: TITLE
    },
    failedRecordUpdate: {
        lines: [failedToCRUDRecordAbsoluteMatches[4]],
        title: TITLE
    },
    failedRecordDeletes: {
        lines: [failedToCRUDRecordRelativeMatches[1] + ' {!sobjectCCollectionVariable}.'],
        title: TITLE
    },
    failedRecordDelete: {
        lines: [failedToCRUDRecordAbsoluteMatches[5]],
        title: TITLE
    }
};
const varNameIsNull = {
    lines: ['null = text'],
    title: TITLE
};
const nullPartofString = {
    lines: ['{!var} = nullify'],
    title: TITLE
};
const nullPartofStringAtEnd = {
    lines: ['{!var} = annull'],
    title: TITLE
};
const failedCRUDNonAbsoluteMatch = {
    lines: [failedToCRUDRecordAbsoluteMatches[0] + 'extra string at end'],
    title: TITLE
};
const nullAtEnd = {
    lines: ['emailBody = this is null'],
    title: TITLE
};

const twoEquals = {
    lines: ['emailBody = this = null'],
    title: TITLE
};

const errorOccurredString = {
    error: LABELS.faultMess + ': something happened',
    lines: ['some config values'],
    title: TITLE,
    expectedNormal: 'something happened'
};
const errorElementTitle = {
    error: 'The flow failed because something happened',
    title: LABELS.errorBody
};
const resultLabelString = {
    lines: ['var = hello', LABELS.resultLabel],
    title: 'ASSIGNMENT: assign'
};
const stringEndsWithColon = {
    lines: ['Find all Task records where:'],
    title: 'FAST LOOKUP: lookup',
    expected: 'Find all Task records where'
};
const endWithColonWhitespave = {
    lines: ['Find all Task records where:     '],
    title: 'FAST LOOKUP: lookup',
    expected: 'Find all Task records where'
};
const governorLimits = {
    lines: [],
    limits: [{ limit: 'soome limit information', id: 'abbc' }],
    title: TITLE,
    showGovLim: true
};

const governorLimitsWithFilterOff = {
    lines: ['Hi other text in here'],
    limits: [{ limit: 'some limit information', id: 'abbc' }],
    title: TITLE,
    showGovLim: false
};

const waitEvents = {
    lines: ['This element will pause when all conditions are met and will resume again on {0}'],
    title: TITLE,
    waitevents: [
        { label: 'PC1', value: 'PC1' },
        { label: 'PC2', value: 'PC2' }
    ],
    resumetime: new Map([
        ['PC1', 'Jan 1 2022, 4:00:00 PM'],
        ['PC2', 'Jan 2 2022, 8:40:00 AM']
    ])
};
const waitEventsWithResumeBlock = {
    lines: ['This element will pause when all conditions are met and will resume again on {0}'],
    title: TITLE,
    waitevents: [
        { label: 'PC1', value: 'PC1' },
        { label: 'PC2', value: 'PC2' }
    ],
    resumetime: new Map([
        ['PC1', 'Jan 1 2022, 4:00:00 PM'],
        ['PC2', 'Jan 2 2022, 8:40:00 AM']
    ]),
    ifblockresume: true
};

describe('GovernorLimits cases check:', () => {
    let debugPanelBody;
    describe('governor limit field in entry', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(governorLimits);
        });
        it('normal text that shows the information', () => {
            const normal = debugPanelBody.shadowRoot.querySelector(SELECTORS.NORMALTEXT);
            expect(normal).not.toBeNull();

            const text = normal.value;
            expect(text).toContain(governorLimits.limits[0].limit);
        });
        it('has Element Governor Limits Info as the title', () => {
            const subtitle = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(subtitle).not.toBeNull();

            const text = subtitle.textContent;
            expect(text).toContain(LABELS.govInfo);
        });
    });

    describe('governor limit field is hidden when filtered out', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(governorLimitsWithFilterOff);
        });
        it('normal text hides only the gov lim information', () => {
            const normal = debugPanelBody.shadowRoot.querySelector(SELECTORS.NORMALTEXT);
            expect(normal).not.toBeNull();
            const text = normal.value;
            expect(text).not.toContain(governorLimitsWithFilterOff.limits[0].limit);
            expect(text).toContain(governorLimitsWithFilterOff.lines[0]);
        });
        it('Does not have Element Governor Limits Info as the title', () => {
            const subtitle = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(subtitle).toBeNull();
        });
    });
});

describe('debug-panel-body', () => {
    let debugPanelBody;
    describe('wait event selection when resume is blocked', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(waitEventsWithResumeBlock);
        });
        it('has combobox and submit button but they are disabled', () => {
            const combobox = debugPanelBody.shadowRoot.querySelector(SELECTORS.COMBOBOX);
            expect(combobox).not.toBeNull();
            expect(combobox.disabled).toBe(true);

            const submitbutton = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBMITBUTTON);
            expect(submitbutton).not.toBeNull();
            expect(submitbutton.disabled).toBe(true);
        });
    });
    describe('wait event selection', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(waitEvents);
        });
        it('has combobox', () => {
            const combobox = debugPanelBody.shadowRoot.querySelector(SELECTORS.COMBOBOX);
            expect(combobox).not.toBeNull();
            const normal = debugPanelBody.shadowRoot.querySelectorAll(SELECTORS.NORMALTEXT);
            expect(normal).not.toBeNull();
            const len = normal.length;
            const text = normal[len - 2].value;
            const expected = format(waitEvents.lines[0], waitEvents.resumetime.get(combobox.value));
            expect(text).toContain(expected);
        });
        it('has submit button', () => {
            const submitbutton = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBMITBUTTON);
            expect(submitbutton).not.toBeNull();
        });
    });

    describe('Error boxes should appear for strings with Error Occurred:', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(errorOccurredString);
        });
        it('has error box with normal text describing the error', () => {
            const box = debugPanelBody.shadowRoot.querySelector(SELECTORS.BOX);
            expect(box).not.toBeNull();

            const content = box.value;
            expect(content).toContain(errorOccurredString.expectedNormal);
        });
        it('has error icon in error box', () => {
            const icon = debugPanelBody.shadowRoot.querySelector(SELECTORS.ERROR);
            expect(icon).not.toBeNull();
        });
        it('has has title in error box', () => {
            const title = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(title).not.toBeNull();

            const text = title.textContent;
            expect(text).toContain(LABELS.faultMess);
        });
    });

    describe('has error box when a title is: Error element', () => {
        beforeEach(() => {
            debugPanelBody = createComponentUnderTest(errorElementTitle);
        });
        it('has error box with normal text describing the error', () => {
            const temp = debugPanelBody.shadowRoot.querySelector(SELECTORS.BOX);
            expect(temp).not.toBeNull();

            const text = temp.value;
            expect(text).toContain(errorElementTitle.error);
        });
        it('has error icon in error box', () => {
            const icon = debugPanelBody.shadowRoot.querySelector(SELECTORS.ERROR);
            expect(icon).not.toBeNull();
        });
        it('has title in error box', () => {
            const title = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(title).not.toBeNull();

            const text = title.textContent;
            expect(text).toContain(LABELS.faultMess);
        });
    });

    describe('Titles are given to Result label and strings ending with :', () => {
        it('has a title when the result label appears', () => {
            debugPanelBody = createComponentUnderTest(resultLabelString);
            const temp = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(temp).not.toBeNull();

            const text = temp.textContent;
            expect(text).toContain(LABELS.resultLabel);
        });
        it('has a title when string ends with : and : is removed', () => {
            debugPanelBody = createComponentUnderTest(stringEndsWithColon);
            const temp = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(temp).not.toBeNull();

            const text = temp.textContent;
            expect(text).toContain(stringEndsWithColon.expected);
        });
        it('has a title when string ends with : and trailing whitespace and : removed', () => {
            debugPanelBody = createComponentUnderTest(endWithColonWhitespave);
            const temp = debugPanelBody.shadowRoot.querySelector(SELECTORS.SUBTITLE);
            expect(temp).not.toBeNull();

            const text = temp.textContent;
            expect(text).toContain(stringEndsWithColon.expected);
        });
    });
});

describe('warning icon test cases', () => {
    let debugPanelBody;

    describe('warning icon positive cases for failed crud', () => {
        it('has warning when a single record is not found', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordLookup);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a multiple records are not found', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordLookups);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a single record is not created', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordCreate);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a multiple records are not created', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordCreates);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a single record is not updated', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordUpdate);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a multiple records are not updated', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordUpdates);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a single record is not deleted', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordDelete);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when a multiple records are not deleted', () => {
            debugPanelBody = createComponentUnderTest(failedCrudOperations.failedRecordDeletes);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
    });
    describe('warning icons negative cases for null', () => {
        it('has warning icon when there variable "Equals" null', () => {
            debugPanelBody = createComponentUnderTest(varEqualsNull);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has warning icon when there variable "=" null', () => {
            debugPanelBody = createComponentUnderTest(varEqualSignNull);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
    });
    describe('Warning Icon negative cases', () => {
        it('will not have warning icons for base cases', () => {
            debugPanelBody = createComponentUnderTest(NORMALINPUT);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when the name of a var is null', () => {
            debugPanelBody = createComponentUnderTest(varNameIsNull);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when null is part of a string', () => {
            debugPanelBody = createComponentUnderTest(nullPartofString);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when null is part of a string and null is at the end', () => {
            debugPanelBody = createComponentUnderTest(nullPartofStringAtEnd);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when null is at the end', () => {
            debugPanelBody = createComponentUnderTest(nullAtEnd);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when this = null is a value', () => {
            debugPanelBody = createComponentUnderTest(twoEquals);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
        it('has no warning when failed CRUD message is not an absolute match', () => {
            debugPanelBody = createComponentUnderTest(failedCRUDNonAbsoluteMatch);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).toBeNull();
        });
    });
});
