// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';

const createComponentUnderTest = async () => {
    return createComponent('builder_platform_interaction-alc-menu');
};

const selectors = {
    header: 'div.header',
    body: 'div.body',
    footer: 'div.footer'
};

describe('alcMenu', () => {
    describe('sections', () => {
        it('should have a header body and footer', async () => {
            const alcMenu = await createComponentUnderTest();
            const header = alcMenu.shadowRoot.querySelector(selectors.header);
            const body = alcMenu.shadowRoot.querySelector(selectors.body);
            const footer = alcMenu.shadowRoot.querySelector(selectors.footer);
            expect(header).toBeTruthy();
            expect(body).toBeTruthy();
            expect(footer).toBeTruthy();
        });
    });
});
