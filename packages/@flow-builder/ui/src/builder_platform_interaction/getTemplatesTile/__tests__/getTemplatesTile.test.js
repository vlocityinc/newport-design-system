import GetTemplatesTile from "builder_platform_interaction/getTemplatesTile";
import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { APP_EXCHANGE_LINK } from "builder_platform_interaction/commonUtils";

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-get-templates-tile', { is: GetTemplatesTile });
    document.body.appendChild(el);
    return el;
}

const SELECTORS = {
    APP_EXCHANGE_LINK_BUTTON: 'a.slds-button',
};

describe('Get Templates Tile', () => {
    it('points to app exchange store link', () => {
        const element = createComponentForTest();
        const link = getShadowRoot(element).querySelector(SELECTORS.APP_EXCHANGE_LINK_BUTTON);
        expect(link.href).toEqual(APP_EXCHANGE_LINK);
        expect(link.target).toEqual('_blank');
    });
});