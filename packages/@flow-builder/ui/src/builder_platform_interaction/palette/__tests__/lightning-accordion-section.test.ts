// @ts-ignore
import accordionSection from 'lightning/accordionSection';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';

jest.requireActual('lightning/accordionSection');
jest.requireActual('lightning/inputUtils');
jest.requireActual('lightning/utilsPrivate');

describe('lightning-accordion-section', () => {
    // The palette component code queries into the lightning/accordionSection's shadowRoot.
    // This test is to insure we catch any changes to that components' implementation we depend on.
    it('has a button to expand the section', async () => {
        const el = await createComponent('lightning-accordion-section', {
            is: accordionSection
        });

        expect(el.shadowRoot.querySelector('button.section-control')).toBeTruthy();
    });
});
