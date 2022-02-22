import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import TestPanelBody from '../testPanelBody';
import { TEST_BODY_LABELS } from '../testPanelBodyLabels';

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

const statusVal = 'PASS';
const testData = { status: statusVal };

describe('test-panel-body', () => {
    let testPanelBody;
    // more than one assertion test is done in the debug panel since we only pass one assertion the the test body
    it('displays test outcome logs for a flow test with one assertion that passes', () => {
        testPanelBody = createComponentUnderTest({ testAssertionTrace: testData });
        const subtitles = testPanelBody.shadowRoot.querySelectorAll(SELECTORS.SUBTITLE);
        // eslint-disable-next-line
        expect(subtitles[0].innerHTML).toEqual(TEST_BODY_LABELS.conditionSubtitle);
        // eslint-disable-next-line
        expect(subtitles[1].innerHTML).toEqual(TEST_BODY_LABELS.outcomeConditionSubtitle);
    });
});
