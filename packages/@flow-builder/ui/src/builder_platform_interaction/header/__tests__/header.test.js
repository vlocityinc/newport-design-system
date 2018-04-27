import { createElement } from 'engine';
import Header from '../header';

function createComponentForTest(name, version, backUrl, helpUrl) {
    const el = createElement('builder_platform_interaction-header', { is: Header });
    el.flowName = name;
    el.flowVersion = version;
    el.backUrl = backUrl;
    el.helpUrl = helpUrl;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    root: '.header',
    flowName: '.flow-name-label',
    appName: '.app-name',
    backUrl: '.back-url',
    backLabel: '.back-label',
    helpUrl: '.help-url',
    helpLabel: '.help-label',
    flowIcon: '.flow-utility-icon',
    backIcon: '.back-utility-icon',
    helpIcon: '.help-utility-icon'
};


describe('HEADER', () => {
    it('checks the rendering FLOW UTILITY Icon', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.flowIcon).iconName).toEqual("utility:flow");
        });
    });

    it('checks the rendering APP NAME label', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.appName).textContent).toEqual("Flow Builder");
        });
    });

    it('checks the rendering FLOW NAME', () => {
        const headerComponent = createComponentForTest('Flow Name', '1');
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.flowName).textContent).toEqual("Flow Name - V1");
        });
    });

    it('checks the rendering BACK UTILITY Icon', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.backIcon).iconName).toEqual("utility:back");
        });
    });

    it('checks the rendering BACK URL when its undefined and should return NULL', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.backUrl).href).toEqual("null");
        });
    });

    it('checks the rendering BACK URL when ProcessUIFlow value is provided should return /300', () => {
        const headerComponent = createComponentForTest('Flow Name', '1', '/300');
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.backUrl).href).toEqual("/300");
        });
    });

    it('checks the rendering BACK label', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.backLabel).textContent).toEqual("Back");
        });
    });

    it('checks the rendering HELP UTILITY Icon', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.helpIcon).iconName).toEqual("utility:help");
        });
    });

    it('checks the rendering HELP label', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.helpLabel).textContent).toEqual("Help");
        });
    });

    it('checks the rendering HELP URL when its undefined and should return NULL', () => {
        const headerComponent = createComponentForTest();
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.helpUrl).href).toEqual("null");
        });
    });

    it('checks the rendering HELP URL when ProcessUIFlow value is provided should return /HELP', () => {
        const headerComponent = createComponentForTest('Flow Name', '1', '/300', '/HELP');
        return Promise.resolve().then(() => {
            expect(headerComponent.querySelector(selectors.helpUrl).href).toEqual("/HELP");
        });
    });
});