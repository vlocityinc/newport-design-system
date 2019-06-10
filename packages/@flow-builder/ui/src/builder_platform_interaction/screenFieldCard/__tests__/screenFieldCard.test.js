import { createElement } from 'lwc';
import ScreenFieldCard from '../screenFieldCard';

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-ScreenFieldCard', {
        is: ScreenFieldCard
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    CONTAINER: 'div.slds-card',
    ICON: 'lightning-icon',
    HEADER: 'div.slds-card__header',
    BODY: 'div.slds-card__body',
    HEADER_TEXT: 'p.slds-text-heading_small',
    BODY_TEXT: 'div.slds-text-body_small'
};

describe('ScreenFieldCard with errors', () => {
    const fieldProps = {
        error: true,
        title: 'invalid component',
        text: 'invalid'
    };
    it('should have has-error class in its CONTAINER', () => {
        const element = createComponentUnderTest(fieldProps);
        const container = element.shadowRoot.querySelector(SELECTORS.CONTAINER);
        expect(container.className).toEqual(
            expect.stringContaining('has-error')
        );
    });
    it('should display an error icon on error', () => {
        const element = createComponentUnderTest(fieldProps);
        const icon = element.shadowRoot.querySelector(SELECTORS.ICON);
        expect(icon.iconName).toBe('utility:error');
    });
    it('icon variant should be error', () => {
        const element = createComponentUnderTest(fieldProps);
        const icon = element.shadowRoot.querySelector(SELECTORS.ICON);
        expect(icon.variant).toBe('error');
    });
});

describe('ScreenFieldCard without errors', () => {
    const fieldProps = {
        title: 'component header',
        text: 'component text',
        icon: 'custom:custom9'
    };
    it('should have bordered class in its CONTAINER', () => {
        const element = createComponentUnderTest(fieldProps);
        const container = element.shadowRoot.querySelector(SELECTORS.CONTAINER);
        expect(container.className).toEqual(
            expect.stringContaining('bordered')
        );
    });
    it('should display the title', () => {
        const element = createComponentUnderTest(fieldProps);
        const headerBody = element.shadowRoot.querySelector(
            SELECTORS.HEADER_TEXT
        );
        expect(headerBody.textContent).toBe('component header');
    });
    it('should display the text if set', () => {
        const element = createComponentUnderTest(fieldProps);
        const body = element.shadowRoot.querySelector(SELECTORS.BODY_TEXT);
        expect(body.textContent).toBe('component text');
    });
    it('should not display the text div if no text has been set', () => {
        const element = createComponentUnderTest({
            title: 'component header',
            icon: 'custom:custom9'
        });
        const body = element.shadowRoot.querySelector(SELECTORS.BODY_TEXT);
        expect(body).toBeNull();
    });
});
