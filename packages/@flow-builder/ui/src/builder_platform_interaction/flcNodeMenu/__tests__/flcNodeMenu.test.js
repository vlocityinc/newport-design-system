import { createElement } from 'lwc';
import FlcNodeMenu from 'builder_platform_interaction/flcNodeMenu';
import {
    CopySingleElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    ToggleMenuEvent
} from 'builder_platform_interaction/events';

const dummyRegularElement = {
    section: 'Dummy_Section',
    icon: 'standard:lightning_component',
    description: 'Dummy Description',
    label: 'Dummy_Label',
    value: 'Dummy_Value',
    elementType: 'Dummy_ElementType',
    type: 'default'
};

const dummyEndElement = {
    section: 'Logic',
    icon: 'standard:first_non_empty',
    description: 'End Description',
    label: 'End',
    value: 'END_ELEMENT',
    elementType: 'END_ELEMENT',
    type: 'end'
};

const selectors = {
    header: '.node-menu-header',
    cancelButton: '.test-cancel-button',
    headerLabel: '.test-header-label',
    headerDescription: '.test-header-description',
    menuActionRow: '.slds-dropdown__item',
    footer: '.test-footer',
    editButton: '.test-edit-button'
};

const createComponentUnderTest = metaData => {
    const el = createElement('builder_platform_interaction-flc-node-menu', {
        is: FlcNodeMenu
    });
    el.elementMetadata = metaData;
    document.body.appendChild(el);
    return el;
};

describe('Node Menu', () => {
    describe('Base Node Menu', () => {
        let menu;
        beforeEach(() => {
            menu = createComponentUnderTest(dummyRegularElement);
        });

        it('renders the element action contextual menu', () => {
            expect(menu).toBeDefined();
        });

        it('Should have a cancel button in the header', () => {
            const header = menu.shadowRoot.querySelector(selectors.header);
            const cancelButton = header.querySelector(selectors.cancelButton);
            expect(cancelButton).not.toBeNull();
        });

        it('Clicking on the Cancel Button should dispatch ToggleMenuEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
            const header = menu.shadowRoot.querySelector(selectors.header);
            header.querySelector(selectors.cancelButton).click();
            expect(callback).toHaveBeenCalled();
        });

        it('Should have a label in the header', () => {
            const header = menu.shadowRoot.querySelector(selectors.header);
            const label = header.querySelector(selectors.headerLabel);
            expect(label.textContent).toEqual(dummyRegularElement.label);
        });

        it('Should have a description in the header', () => {
            const header = menu.shadowRoot.querySelector(selectors.header);
            const description = header.querySelector(selectors.headerDescription);
            expect(description.textContent).toEqual(dummyRegularElement.description);
        });
    });

    describe('Element Action Node Menu for a Regular Element', () => {
        let menu;
        beforeEach(() => {
            menu = createComponentUnderTest(dummyRegularElement);
        });

        it('Clicking on the Copy Action dispatches the CopySingleElementEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(CopySingleElementEvent.EVENT_NAME, callback);
            menu.shadowRoot.querySelectorAll(selectors.menuActionRow)[0].click();
            expect(callback).toHaveBeenCalled();
        });

        it('Clicking on the Delete Action dispatches the DeleteElementEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            menu.shadowRoot.querySelectorAll(selectors.menuActionRow)[1].click();
            expect(callback).toHaveBeenCalled();
        });

        it('The custom event case dispatches the toggle menu event ', () => {
            const callback = jest.fn();
            menu.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
            menu.shadowRoot.querySelector(selectors.menuActionRow).click();
            expect(callback).toHaveBeenCalled();
        });

        it('Should have a Footer area', () => {
            const footer = menu.shadowRoot.querySelector(selectors.footer);
            expect(footer).not.toBeNull();
        });

        it('Should have edit button in the Footer', () => {
            const footer = menu.shadowRoot.querySelector(selectors.footer);
            const editButton = footer.querySelector(selectors.editButton);
            expect(editButton).not.toBeNull();
        });

        it('Clicking the Edit Button should dispatch EditElementEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(EditElementEvent.EVENT_NAME, callback);
            const footer = menu.shadowRoot.querySelector(selectors.footer);
            footer.querySelector(selectors.editButton).click();
            expect(callback).toHaveBeenCalled();
        });

        it('Clicking the Edit Button should dispatch ToggleMenuEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
            const footer = menu.shadowRoot.querySelector(selectors.footer);
            footer.querySelector(selectors.editButton).click();
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Element Action Node Menu for End Element', () => {
        let menu;
        beforeEach(() => {
            menu = createComponentUnderTest(dummyEndElement);
        });

        it('Should only have one dropdown item', () => {
            const dropDownItems = menu.shadowRoot.querySelectorAll(selectors.menuActionRow);
            expect(dropDownItems).toHaveLength(1);
        });

        it('Clicking on the Delete Action dispatches the DeleteElementEvent', () => {
            const callback = jest.fn();
            menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            menu.shadowRoot.querySelector(selectors.menuActionRow).click();
            expect(callback).toHaveBeenCalled();
        });

        it('The custom event case dispatches the toggle menu event ', () => {
            const callback = jest.fn();
            menu.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
            menu.shadowRoot.querySelector(selectors.menuActionRow).click();
            expect(callback).toHaveBeenCalled();
        });

        it('Should not have a Footer area', () => {
            const footer = menu.shadowRoot.querySelector(selectors.footer);
            expect(footer).toBeNull();
        });
    });
});
