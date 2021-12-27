// @ts-nocheck
import { LIGHTNING_COMPONENTS_SELECTORS, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import ModalBody from 'builder_platform_interaction/modalBody';
import { createElement } from 'lwc';

const SELECTORS = {
    SPAN: 'p'
};

const bodyOneContent = 'body 1';
const bodyTwoContent = 'body 2';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-modal-body', { is: ModalBody });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Body has body one only', () => {
    let testModalBody;
    beforeEach(() => {
        testModalBody = createComponentForTest({
            bodyTextOne: bodyOneContent
        });
    });
    it('Body 1 is displayed', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        const bodyOne = spans[0];
        expect(bodyOne.textContent).toEqual(bodyOneContent);
    });
    it('Body 2 is not displayed in standard mode', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        expect(spans.length).toBe(1);
    });
    it('Body 2 is not displayed in variant mode', () => {
        const accordion = testModalBody.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ACCORDION);
        expect(accordion).toBeNull();
    });
});

describe('Body has body one and standard body two', () => {
    let testModalBody;
    beforeEach(() => {
        testModalBody = createComponentForTest({
            bodyTextOne: bodyOneContent,
            bodyTextTwo: bodyTwoContent
        });
    });
    it('Body 1 is displayed', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        const bodyOne = spans[0];
        expect(bodyOne.textContent).toEqual(bodyOneContent);
    });
    it('Body 2 is displayed in standard mode', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        expect(spans.length).toBe(2);
        const bodyTwo = spans[1];
        expect(bodyTwo.textContent).toEqual(bodyTwoContent);
    });
    it('Body 2 is not displayed in variant mode', () => {
        const accordion = testModalBody.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ACCORDION);
        expect(accordion).toBeNull();
    });
});

describe('Body has body one and variant body two', () => {
    let testModalBody;
    beforeEach(() => {
        testModalBody = createComponentForTest({
            bodyTextOne: bodyOneContent,
            bodyTextTwo: bodyTwoContent,
            showBodyTwoVariant: true
        });
    });
    it('Body 1 is displayed', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        const bodyOne = spans[0];
        expect(bodyOne.textContent).toEqual(bodyOneContent);
    });
    it('Body 2 is not displayed in standard mode', () => {
        const spans = testModalBody.shadowRoot.querySelectorAll(SELECTORS.SPAN);
        expect(spans).not.toBeNull();
        expect(spans.length).toBe(1);
    });
    it('Body 2 is displayed in variant mode', () => {
        const accordion = testModalBody.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ACCORDION);
        expect(accordion).not.toBeNull();
    });
});
