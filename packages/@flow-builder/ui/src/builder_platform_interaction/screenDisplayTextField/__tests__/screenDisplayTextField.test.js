import { createElement } from 'lwc';
import ScreenDisplayField from "builder_platform_interaction/screenDisplayTextField";
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    RICH : 'lightning-formatted-rich-text',
    BASIC: 'lightning-formatted-text'
};

function createComponentForTest({ value = {value: '', error: null}, title = 'display1',  typeName = 'DisplayText' } = {}) {
    const el = createElement('builder_platform_interaction-screen-display-text-field', { is: ScreenDisplayField });
    Object.assign(el, { value, title, typeName });
    document.body.appendChild(el);
    return el;
}

describe('Rich text display field', () => {
    let displayWrapperCmp;
    it('Value should be displayed', () => {
        displayWrapperCmp = createComponentForTest({value: {value: 'Poshe Text', error: null}});
        return Promise.resolve().then(() => {
            const disp = getShadowRoot(displayWrapperCmp).querySelector(SELECTORS.RICH);
            expect(disp.value).toEqual('Poshe Text');
        });
    });
    it('should replace new lines with <br/>', () => {
        displayWrapperCmp = createComponentForTest({value: {value: 'first line\nsecond line', error: null}});
        return Promise.resolve().then(() => {
            const disp = getShadowRoot(displayWrapperCmp).querySelector(SELECTORS.RICH);
            expect(disp.value).toEqual('first line<br />second line');
        });
    });
});
