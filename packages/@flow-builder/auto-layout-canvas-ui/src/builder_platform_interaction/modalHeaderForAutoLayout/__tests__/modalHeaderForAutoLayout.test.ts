// @ts-nocheck
import { createElement } from 'lwc';
import ModalHeaderForAutoLayout from 'builder_platform_interaction/modalHeaderForAutoLayout';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

const title = 'modal header';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-modal-header-for-auto-layout', {
        is: ModalHeaderForAutoLayout
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('Header title', () => {
    it('header title should be correctly displayed', () => {
        const testModalBody = createComponentForTest({
            headerTitle: title
        });
        const header = testModalBody.shadowRoot.querySelector('h2');
        expect(header.textContent).toEqual(title);
    });
});

describe('Screen reader text', () => {
    it('screen reader text should be the same as the header title', () => {
        const testModalBody = createComponentForTest({
            headerTitle: title
        });
        const screenReaderText = testModalBody.shadowRoot.querySelector('p');
        expect(screenReaderText.textContent).toEqual(title);
    });
});
