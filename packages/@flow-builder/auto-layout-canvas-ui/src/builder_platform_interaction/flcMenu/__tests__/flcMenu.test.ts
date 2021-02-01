// @ts-nocheck
import { createElement } from 'lwc';
import FlcMenu from 'builder_platform_interaction/flcMenu';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-flc-menu', {
        is: FlcMenu
    });
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    header: 'div.header',
    body: 'div.body',
    footer: 'div.footer'
};

describe('flcMenu', () => {
    describe('sections', () => {
        it('should have a header body and footer', () => {
            const flcMenu = createComponentUnderTest();
            const header = flcMenu.shadowRoot.querySelector(selectors.header);
            const body = flcMenu.shadowRoot.querySelector(selectors.body);
            const footer = flcMenu.shadowRoot.querySelector(selectors.footer);
            expect(header).toBeTruthy();
            expect(body).toBeTruthy();
            expect(footer).toBeTruthy();
        });
    });
});
