// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import GetTemplatesTile from 'builder_platform_interaction/getTemplatesTile';
import { createElement } from 'lwc';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-get-templates-tile', { is: GetTemplatesTile });
    setDocumentBodyChildren(el);
    return el;
}

const SELECTORS = {
    APP_EXCHANGE_LINK_BUTTON: 'a.slds-button'
};

describe('Get Templates Tile', () => {
    it('points to app exchange store link', () => {
        const element = createComponentForTest();
        const link = element.shadowRoot.querySelector(SELECTORS.APP_EXCHANGE_LINK_BUTTON);
        expect(link.href).toEqual(APP_EXCHANGE_LINK);
        expect(link.target).toEqual('_blank');
    });
});
