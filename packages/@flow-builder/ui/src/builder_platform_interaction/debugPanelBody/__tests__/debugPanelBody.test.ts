import { createElement } from 'lwc';
import { LABELS } from '../debugPanelBodyLabels';
import DebugPanelBody from '../debugPanelBody';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

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
    ERROR: '.error'
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
const failedFind = {
    lines: [LABELS.failedFind],
    title: TITLE
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
    title: TITLE
};
describe('GovernorLimits cases check:', () => {
    let debugPanelBody;
    describe('governor limit field in entrry', () => {
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
});

describe('debug-panel-body', () => {
    let debugPanelBody;
    describe('warning icons positive cases', () => {
        it('has warning icon when there variable "Equals" null', () => {
            debugPanelBody = createComponentUnderTest(varEqualsNull);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning icon when there variable "=" null', () => {
            debugPanelBody = createComponentUnderTest(varEqualSignNull);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
        });
        it('has warning when record not found', () => {
            debugPanelBody = createComponentUnderTest(failedFind);
            const warningIcon = debugPanelBody.shadowRoot.querySelector(SELECTORS.WARNING);
            expect(warningIcon).not.toBeNull();
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
