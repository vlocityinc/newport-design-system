// @ts-nocheck
import { createElement } from 'lwc';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-alc-menu', {
        is: AlcMenu
    });
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    header: 'div.header',
    body: 'div.body',
    footer: 'div.footer'
};

describe('alcMenu', () => {
    describe('sections', () => {
        it('should have a header body and footer', () => {
            const alcMenu = createComponentUnderTest();
            const header = alcMenu.shadowRoot.querySelector(selectors.header);
            const body = alcMenu.shadowRoot.querySelector(selectors.body);
            const footer = alcMenu.shadowRoot.querySelector(selectors.footer);
            expect(header).toBeTruthy();
            expect(body).toBeTruthy();
            expect(footer).toBeTruthy();
        });
    });
});
