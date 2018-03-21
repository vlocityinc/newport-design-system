import {createElement} from 'engine';
import Row from 'builder_platform_interaction-row';
import {DeleteListItemEvent} from 'builder_platform_interaction-events';

const prefix = "myAwesomePrefix";
const itemIndex = 3;

const createComponentUnderTest = (showDel) => {
    const el = createElement('builder_platform_interaction-row', {
        is: Row
    });
    el.showDelete = showDel;
    document.body.appendChild(el);
    return el;
};

const createComponentUnderTestWithPrefix = (showPrefix, itemPrefix) => {
    const el = createElement('builder_platform_interaction-row', {
        is: Row
    });
    el.showPrefix = showPrefix;
    el.itemPrefix = itemPrefix;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    deleteButton: 'lightning-button',
    column : '.slds-col'
};

describe('Row delete button', () => {
    it('check delete button is disabled by default when showDelete not specified', () => {
        const myrowElement = createComponentUnderTest();
        const deleteButton = myrowElement.querySelector(selectors.deleteButton);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button is disabled when showDelete specified to false', () => {
        const myrowElement = createComponentUnderTest(false);
        const deleteButton = myrowElement.querySelector(selectors.deleteButton);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button enabled when showDelete specified to true', () => {
        const myrowElement = createComponentUnderTest(true);
        const deleteButton = myrowElement.querySelector(selectors.deleteButton);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeFalsy();
    });
});

describe('Row prefix', () => {
    it('check prefix is displayed when showprefix true and prefix is given', () => {
        const myrowElement = createComponentUnderTestWithPrefix(true, prefix);
        const firstRow = myrowElement.querySelector(selectors.column);
        expect(firstRow.textContent).toMatch(prefix);
    });
    it('check prefix is not displayed when showprefix false and prefix is given', () => {
        const myrowElement = createComponentUnderTestWithPrefix(false, prefix);
        const firstRow = myrowElement.querySelector(selectors.column);
        expect(firstRow.textContent).not.toMatch(prefix);
    });
    it('check prefix is not displayed when showprefix undefined and prefix is given', () => {
        const myrowElement = createComponentUnderTestWithPrefix(undefined, prefix);
        const firstRow = myrowElement.querySelector(selectors.column);
        expect(firstRow.textContent).not.toMatch(prefix);
    });
});

describe('Row Events', () => {
    it('Row delete event should be fired when delete button is clicked for a row with proper index info in the event detail', () => {
        const myrowElement = createComponentUnderTest();
        myrowElement.itemIndex = itemIndex;
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            myrowElement.addEventListener(DeleteListItemEvent.EVENT_NAME, eventCallback);
            const deleteButton = myrowElement.querySelector(selectors.deleteButton);
            deleteButton.click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {index: itemIndex}});
        });
    });
});

