// @ts-nocheck
import { createElement } from 'lwc';
import RightPanel from '../rightPanel';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-right-panel', {
        is: RightPanel
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

describe('Right Panel', () => {
    describe('fixed width', () => {
        const FIXED_WIDTH_CLASS = 'fixed-width';

        it('is set if !is-variable-width', () => {
            const element = createComponentUnderTest({});

            const div = element.shadowRoot.querySelector('div');

            expect(div.classList).toContain(FIXED_WIDTH_CLASS);
        });

        it('is not set if is-variable-width', () => {
            const element = createComponentUnderTest({
                isVariableWidth: true
            });

            const div = element.shadowRoot.querySelector('div');

            expect(div.classList).not.toContain(FIXED_WIDTH_CLASS);
        });
    });
});
