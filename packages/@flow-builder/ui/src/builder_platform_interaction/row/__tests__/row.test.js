import { createElement } from 'lwc';
import Row from 'builder_platform_interaction/row';
import { DeleteListItemEvent } from 'builder_platform_interaction/events';

const prefix = 'myAwesomePrefix';
const itemIndex = 3;

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-row', {
        is: Row
    });

    Object.assign(el, props);

    document.body.appendChild(el);
    return el;
};

const selectors = {
    prefix: 'legend strong',
    deleteButton: 'lightning-button-icon'
};

describe('Row delete button', () => {
    it('check delete button is disabled by default when showDelete not specified', () => {
        const myrowElement = createComponentUnderTest();
        const deleteButton = myrowElement.shadowRoot.querySelector(
            selectors.deleteButton
        );
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button is disabled when showDelete specified to false', () => {
        const myrowElement = createComponentUnderTest({ showDelete: false });
        const deleteButton = myrowElement.shadowRoot.querySelector(
            selectors.deleteButton
        );
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button enabled when showDelete specified to true', () => {
        const myrowElement = createComponentUnderTest({ showDelete: true });
        const deleteButton = myrowElement.shadowRoot.querySelector(
            selectors.deleteButton
        );
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeFalsy();
    });

    it('check delete button not rendered when showDeleteButton specified to false', () => {
        const myrowElement = createComponentUnderTest({
            showDeleteButton: false
        });
        const deleteButton = myrowElement.shadowRoot.querySelector(
            selectors.deleteButton
        );
        expect(deleteButton).toBeNull();
    });
});

describe('Row prefix', () => {
    it('check prefix is displayed when showprefix true and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: true,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(
            selectors.prefix
        );
        expect(firstRow.textContent).toMatch(prefix);
    });
    it('check prefix is not displayed when showprefix false and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: false,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(
            selectors.prefix
        );
        expect(firstRow).toBeNull();
    });
    it('check prefix is not displayed when showprefix undefined and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: undefined,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(
            selectors.prefix
        );
        expect(firstRow).toBeNull();
    });
});

describe('Row Events', () => {
    it('Row delete event should be fired when delete button is clicked for a row with proper index info in the event detail', () => {
        const myrowElement = createComponentUnderTest();
        myrowElement.itemIndex = itemIndex;
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            myrowElement.addEventListener(
                DeleteListItemEvent.EVENT_NAME,
                eventCallback
            );
            const deleteButton = myrowElement.shadowRoot.querySelector(
                selectors.deleteButton
            );
            deleteButton.click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { index: itemIndex }
            });
        });
    });
});
