import { createElement } from 'lwc';
import ScreenDisplayField from 'builder_platform_interaction-screen-display-text-field';
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    RICH : 'lightning-formatted-rich-text',
    BASIC: 'lightning-formatted-text'
};

const titleValue = 'display1';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-display-text-field', { is: ScreenDisplayField });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Rich text display field', () => {
    let displayWrapperCmp;
    const displayValue = 'Poshe Text';
    beforeEach(() => {
        displayWrapperCmp = createComponentForTest({
            value: {value: displayValue, error: null},
            title: titleValue,
            typeName: 'DisplayRichText'
        });
    });
    it('Value should be displayed', () => {
        return Promise.resolve().then(() => {
            const disp = getShadowRoot(displayWrapperCmp).querySelector(SELECTORS.RICH);
            expect(disp.value).toEqual(displayValue);
        });
    });
});

describe('Text display field', () => {
    let displayWrapperCmp;
    const displayValue = 'Happy Trails';
    beforeEach(() => {
        displayWrapperCmp = createComponentForTest({
            value: {value: displayValue, error: null},
            title: titleValue,
            typeName: 'DisplayText'
        });
    });
    it('Value shoudld be displayed ', () => {
        return Promise.resolve().then(() => {
            const disp = getShadowRoot(displayWrapperCmp).querySelector(SELECTORS.BASIC);
            expect(disp.value).toEqual(displayValue);
        });
    });
});

