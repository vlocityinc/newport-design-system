// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { DeleteListItemEvent, EditListItemEvent } from 'builder_platform_interaction/events';
import Row from 'builder_platform_interaction/row';
import { createElement } from 'lwc';

const prefix = 'myAwesomePrefix';
const itemIndex = 3;

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-row', {
        is: Row
    });
    Object.assign(el, props);

    setDocumentBodyChildren(el);
    return el;
};

const getButtonIconFromName = (myrowElement, iconName) => {
    const buttonIcons = Array.from(myrowElement.shadowRoot.querySelectorAll(selectors.buttonIcon));
    if (buttonIcons?.length > 0) {
        const filteredButtonIcons = buttonIcons.filter((item) => item.iconName === iconName);
        if (filteredButtonIcons) {
            return filteredButtonIcons[0];
        }
    }
    return null;
};

const iconTypes = {
    deleteButtonIcon: 'utility:delete',
    editButtonIcon: 'utility:edit'
};

const selectors = {
    prefix: 'legend strong',
    buttonIcon: 'lightning-button-icon'
};

describe('Row delete button', () => {
    it('check delete button is disabled by default when showDelete not specified', () => {
        const myrowElement = createComponentUnderTest({});
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button is disabled when showDelete specified to false', () => {
        const myrowElement = createComponentUnderTest({ showDelete: false });
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeTruthy();
    });
    it('check delete button enabled when showDelete specified to true', () => {
        const myrowElement = createComponentUnderTest({ showDelete: true });
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).not.toBeNull();
        expect(deleteButton.disabled).toBeFalsy();
    });

    it('check delete button not rendered when showDeletable specified to false', () => {
        const myrowElement = createComponentUnderTest({
            isDeletable: false
        });
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).toBeNull();
    });
});

describe('Row prefix', () => {
    it('check prefix is displayed when showprefix true and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: true,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(selectors.prefix);
        expect(firstRow.textContent).toMatch(prefix);
    });
    it('check prefix is not displayed when showprefix false and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: false,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(selectors.prefix);
        expect(firstRow).toBeNull();
    });
    it('check prefix is not displayed when showprefix undefined and prefix is given', () => {
        const myrowElement = createComponentUnderTest({
            showPrefix: undefined,
            itemPrefix: prefix
        });
        const firstRow = myrowElement.shadowRoot.querySelector(selectors.prefix);
        expect(firstRow).toBeNull();
    });
});

// TODO add tests for disableDelete when it is renamed!

describe('isEditDisabled', () => {
    it('if we have a enableEdit value of some sample guid and showDeletableAndEditable is true should return false', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: '98908',
            isEditable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton.disabled).toBeFalsy();
    });

    it('if we have a undefined enableEdit and showDeletableAndEditable is true should return true', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: undefined,
            isEditable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton.disabled).toBeTruthy();
    });

    it('if we have a null enableEdit and showDeletableAndEditable is true should return true', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: null,
            isEditable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton.disabled).toBeTruthy();
    });

    it('if we have a false enableEdit and showDeletableAndEditable is true should return true', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: false,
            isEditable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton.disabled).toBeTruthy();
    });

    it('if we have a true enableEdit and showDeletableAndEditable is true should return false', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: true,
            isEditable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton.disabled).toBeFalsy();
    });
});

describe('isDeletableAndEditable and isDeletableOnly', () => {
    it('if we have isEditable is true and isDeletable is true, we should have both buttons', async () => {
        const myrowElement = createComponentUnderTest({
            isEditable: true,
            isDeletable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton).not.toBeUndefined();
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).not.toBeUndefined();
    });
    it('if we have isDeletable is true and isEditable is false, we should have both buttons', async () => {
        const myrowElement = createComponentUnderTest({
            isEditable: false,
            isDeletable: true
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton).toBeUndefined();
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).not.toBeUndefined();
    });
    it('if we have isEditable is true and isDeletable is false, we should NOT have EITHER button', async () => {
        const myrowElement = createComponentUnderTest({
            isEditable: true,
            isDeletable: false
        });
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        expect(editButton).toBeNull();
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        expect(deleteButton).toBeNull();
    });
});

describe('Row Events', () => {
    it('Row delete event should be fired when delete button is clicked for a row with proper index info in the event detail', async () => {
        const myrowElement = createComponentUnderTest({});
        myrowElement.itemIndex = itemIndex;
        await ticks(1);
        const eventCallback = jest.fn();
        myrowElement.addEventListener(DeleteListItemEvent.EVENT_NAME, eventCallback);
        const deleteButton = getButtonIconFromName(myrowElement, iconTypes.deleteButtonIcon);
        deleteButton.click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0]).toMatchObject({
            detail: { index: itemIndex }
        });
    });

    it('Row edit event should be fired when edit button is clicked for a row with proper index info in the event detail', async () => {
        const myrowElement = createComponentUnderTest({
            enableEdit: undefined,
            isEditable: true
        });
        myrowElement.itemIndex = itemIndex;
        await ticks(1);
        const eventCallback = jest.fn();
        myrowElement.addEventListener(EditListItemEvent.EVENT_NAME, eventCallback);
        const editButton = getButtonIconFromName(myrowElement, iconTypes.editButtonIcon);
        editButton.click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0]).toMatchObject({
            detail: { index: itemIndex }
        });
    });
});
