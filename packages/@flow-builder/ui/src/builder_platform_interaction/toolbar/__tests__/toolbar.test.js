import { createElement } from 'lwc';
import { EditFlowPropertiesEvent, RunFlowEvent, DebugFlowEvent, SaveFlowEvent } from "builder_platform_interaction/events";
import Toolbar from "builder_platform_interaction/toolbar";
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from "../toolbarLabels";

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });

    el.lastModifiedDate = props.lastModifiedDate;
    el.saveStatus = props.saveStatus;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.toolbar',
    run: '.test-toolbar-run',
    editflowproperties: '.test-toolbar-editflowproperties',
    debug: '.test-toolbar-debug',
    saveas: '.test-toolbar-saveas',
    save: '.test-toolbar-save',
    lastSave: '.test-toolbar-last-saved'
};

describe('toolbar', () => {
    it('fires editflowproperties event when edit flow properties button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(EditFlowPropertiesEvent.EVENT_NAME, eventCallback);
            toolbarComponent.querySelector(selectors.editflowproperties).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

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

    it('Displays "Saving..." in the toolbar when saveStatus is set to the same', () => {
        const toolbarComponent = createComponentUnderTest({
            saveStatus: LABELS.savingStatus
        });

        return Promise.resolve().then(() => {
            const lastSavedButton = getShadowRoot(toolbarComponent).querySelector(selectors.lastSave);
            const relativeDateTimeComponent = getShadowRoot(toolbarComponent).querySelector('lightning-relative-date-time');
            expect(lastSavedButton.textContent).toBe(LABELS.savingStatus);
            expect(relativeDateTimeComponent).toBeNull();
        });
    });

    it('Displays "Saved {relative time}" in the toolbar when saveStatus is set to "Saved"', () => {
        const currentDate = new Date();
        const toolbarComponent = createComponentUnderTest({
            lastModifiedDate: currentDate,
            saveStatus: LABELS.savedStatus
        });

        return Promise.resolve().then(() => {
            const lastSavedButton = getShadowRoot(toolbarComponent).querySelector(selectors.lastSave);
            const relativeDateTimeComponent = getShadowRoot(toolbarComponent).querySelector('lightning-relative-date-time');
            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.savedStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
            expect(relativeDateTimeComponent.value).toEqual(currentDate);
        });
    });
});
