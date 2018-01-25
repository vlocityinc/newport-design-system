import { createElement } from 'engine';
import Editor from 'builder_platform_interaction-editor';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.editor',
    save: '.toolbar-save'
};

describe('editor', () => {
    it('fires saveflow event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener('saveflow', eventCallback);
            toolbarComponent.querySelector(selectors.save).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});
