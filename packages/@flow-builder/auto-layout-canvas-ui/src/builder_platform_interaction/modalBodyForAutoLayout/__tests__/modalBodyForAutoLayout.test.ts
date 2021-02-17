// @ts-nocheck
import { createElement } from 'lwc';
import ModalBodyForAutoLayout from 'builder_platform_interaction/modalBodyForAutoLayout';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

const SELECTORS = {
    SPAN: 'p'
};

const bodyOneContent = 'body 1';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-modal-body-for-auto-layout', { is: ModalBodyForAutoLayout });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Body has body', () => {
    it('Body 1 is displayed', () => {
        const testModalBody = createComponentForTest({
            bodyTextOne: bodyOneContent
        });
        const span = testModalBody.shadowRoot.querySelector(SELECTORS.SPAN);
        expect(span.textContent).toEqual(bodyOneContent);
    });
});
