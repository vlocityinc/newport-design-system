import { createElement } from 'engine';
import Toolbar from 'builder_platform_interaction-toolbar';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.toolbar',
    save: '.toolbar-save'
};

describe('toolbar', () => {
    it('fires save event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener('save', eventCallback);
            toolbarComponent.querySelector(selectors.save).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});
