import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import TestPanelBody from '../testPanelBody';

const createComponentUnderTest = (props = {}) => {
    const element = createElement('builder_platform_interaction-test-panel-body', { is: TestPanelBody });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

const SELECTORS = {
    NORMALTEXT: '.normal',
    SUBTITLE: '.sub-title'
};

const subTitleOne = 'Outcome 1';
const subTitleTwo = 'Outcome 2';
const testLogOne = 'Condition {Var 1} equals 2. Expected = 4. Result: Failed';
const testLogTwo = 'Condition {Var 2} equals 4. Expected = 4. Result: Passed';
const assertionEntryOne = { lines: [subTitleOne, testLogOne] };
const assertionEntryTwo = { lines: [subTitleTwo, testLogTwo] };
const traceWithTwoOutcomes = {
    devNameOneAsc: assertionEntryOne,
    devNameOneDesc: assertionEntryTwo
};

describe('test-panel-body', () => {
    let testPanelBody;
    it('displays test outcome logs for a flow test with two assertions', () => {
        testPanelBody = createComponentUnderTest({ testAssertionTrace: traceWithTwoOutcomes });
        const subtitles = testPanelBody.shadowRoot.querySelectorAll(SELECTORS.SUBTITLE);
        expect(subtitles[0].textContent).toEqual(subTitleOne);
        expect(subtitles[1].textContent).toEqual(subTitleTwo);

        const testLogs = testPanelBody.shadowRoot.querySelectorAll(SELECTORS.NORMALTEXT);
        expect(testLogs[0].value).toEqual(testLogOne);
        expect(testLogs[1].value).toEqual(testLogTwo);
    });
});
