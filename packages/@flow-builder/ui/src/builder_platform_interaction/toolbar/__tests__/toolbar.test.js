import { createElement } from 'engine';
import { RunFlowEvent, DebugFlowEvent, SaveFlowEvent } from 'builder_platform_interaction-events';
import Toolbar from 'builder_platform_interaction-toolbar';
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.toolbar',
    run: '.test-toolbar-run',
    debug: '.test-toolbar-debug',
    saveas: '.test-toolbar-saveas',
    save: '.test-toolbar-save'
};

describe('toolbar', () => {
    it('fires run event when run button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(RunFlowEvent.EVENT_NAME, eventCallback);
            toolbarComponent.querySelector(selectors.run).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('fires debug event when debug button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(DebugFlowEvent.EVENT_NAME, eventCallback);
            toolbarComponent.querySelector(selectors.debug).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('fires save event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
            getShadowRoot(toolbarComponent).querySelector(selectors.save).click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE);
        });
    });

    it('fires saveas event when save as button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
            getShadowRoot(toolbarComponent).querySelector(selectors.saveas).click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS);
        });
    });
});
