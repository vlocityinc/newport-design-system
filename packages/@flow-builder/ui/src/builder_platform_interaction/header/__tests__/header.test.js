import { createElement } from 'engine';
import Header from '../header';

function createComponentForTest(name, version) {
    const el = createElement('builder_platform_interaction-header', { is: Header });
    el.flowName = name;
    el.flowVersion = version;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    root: '.header',
    flowName: '.flow-name-label',
    appName: '.app-name',
    backLabel: '.back-label',
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
});