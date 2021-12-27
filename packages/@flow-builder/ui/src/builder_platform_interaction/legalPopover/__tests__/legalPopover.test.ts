import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { createElement } from 'lwc';
import LegalPopover from '../legalPopover';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-legal-popover', {
        is: LegalPopover
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

describe('legal popover', () => {
    describe('legal text', () => {
        it('displays text after the URL if present', () => {
            const legalPopoverComponent = createComponentUnderTest({
                legalTextFirstPart: 'First',
                agreementUrlLabel: 'Label',
                legalTextSecondPart: 'Second',
                notices: [{ header: 'Header' }]
            });
            const legalText = legalPopoverComponent.shadowRoot.querySelector('p[id^=Header]');
            expect(legalText).not.toBeNull();
            expect(legalText.textContent).toContain('Second');
        });
        it('displays only first part if there is no remaining text', () => {
            const legalPopoverComponent = createComponentUnderTest({
                legalTextFirstPart: 'First',
                agreementUrlLabel: 'Label',
                notices: [{ header: 'Header' }]
            });
            const legalText = legalPopoverComponent.shadowRoot.querySelector('p[id^=Header]');
            expect(legalText).not.toBeNull();
            expect(legalText.textContent).toContain('First');
        });
    });
});
