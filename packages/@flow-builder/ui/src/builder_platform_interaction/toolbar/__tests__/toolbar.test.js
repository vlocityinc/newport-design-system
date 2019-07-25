import { createElement } from 'lwc';
import {
    EditFlowPropertiesEvent,
    SaveFlowEvent,
    DuplicateEvent,
    ToggleFlowStatusEvent
} from 'builder_platform_interaction/events';
import Toolbar from 'builder_platform_interaction/toolbar';
import { parseMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { LABELS } from '../toolbarLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });

    el.lastModifiedDate = props.lastModifiedDate;
    el.saveStatus = props.saveStatus;
    el.flowStatus = props.flowStatus;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    editflowproperties: '.test-toolbar-editflowproperties',
    saveas: '.test-toolbar-saveas',
    save: '.test-toolbar-save',
    lastSave: '.test-toolbar-last-saved',
    duplicate: '.test-toolbar-duplicate',
    activate: '.test-toolbar-activate',
    relativedatetime: 'lightning-relative-date-time'
};

jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        parseMetadataDateTime: jest.fn().mockName('parseMetadataDateTime')
    };
});

describe('toolbar', () => {
    it('fires editflowproperties event when edit flow properties button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(
                EditFlowPropertiesEvent.EVENT_NAME,
                eventCallback
            );
            toolbarComponent.shadowRoot
                .querySelector(selectors.editflowproperties)
                .click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('Button Group should be present', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const toolbarButtonGroup = toolbarComponent.shadowRoot.querySelector(
                'lightning-button-group'
            );
            expect(toolbarButtonGroup).not.toBeNull();
        });
    });

    it('Status Icons section should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const toolbarStatusIcons = toolbarComponent.shadowRoot.querySelector(
                'builder_platform_interaction-toolbar-status-icons'
            );
            expect(toolbarStatusIcons).not.toBeNull();
        });
    });

    it('fires save event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(
                SaveFlowEvent.EVENT_NAME,
                eventCallback
            );
            toolbarComponent.shadowRoot.querySelector(selectors.save).click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.type).toBe(
                SaveFlowEvent.Type.SAVE
            );
        });
    });

    it('fires saveas event when save as button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(
                SaveFlowEvent.EVENT_NAME,
                eventCallback
            );
            toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail.type).toBe(
                SaveFlowEvent.Type.SAVE_AS
            );
        });
    });

    it('fires toggle flow status event when activate button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(
                ToggleFlowStatusEvent.EVENT_NAME,
                eventCallback
            );
            toolbarComponent.shadowRoot
                .querySelector(selectors.activate)
                .click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('fires duplicate event when duplicate element button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();

        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(
                DuplicateEvent.EVENT_NAME,
                eventCallback
            );
            toolbarComponent.shadowRoot
                .querySelector(selectors.duplicate)
                .click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Flow Status Indicator', () => {
        it('Displays "Inactive: Saved {relative time}" in the toolbar when saveStatus is set to "Saved" and flow status is Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savedStatus,
                flowStatus: FLOW_STATUS.DRAFT
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );
                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.draftLabel + ':' + LABELS.savedStatus
                );
                expect(relativeDateTimeComponent).not.toBeNull();
                expect(relativeDateTimeComponent.value).toEqual(currentDate);
                expect(parseMetadataDateTime).toHaveBeenCalledWith(
                    currentDate.toISOString(),
                    true
                );
            });
        });

        it('Displays "Inactive: Saved {relative time}" in the toolbar when saveStatus is set to "Saved" and flow status is Invalid Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savedStatus,
                flowStatus: FLOW_STATUS.INVALID_DRAFT
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.draftLabel + ':' + LABELS.savedStatus
                );
                expect(relativeDateTimeComponent).not.toBeNull();
            });
        });

        it('Displays "Active: Saved {relative time}" in the toolbar when saveStatus is set to "Saved" and flow status is Active', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savedStatus,
                flowStatus: FLOW_STATUS.ACTIVE
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.activeLabel + ':' + LABELS.savedStatus
                );
                expect(relativeDateTimeComponent).not.toBeNull();
            });
        });

        it('Displays "Deactivated: Saved {relative time}" in the toolbar when saveStatus is set to "Saved" and flow status is Obsolete', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savedStatus,
                flowStatus: FLOW_STATUS.OBSOLETE
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.deactivatedLabel + ':' + LABELS.savedStatus
                );
                expect(relativeDateTimeComponent).not.toBeNull();
            });
        });

        it('Displays "Activating ..." in the toolbar when saveStatus is set to "Saved" and flow status is Activating', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savedStatus,
                flowStatus: FLOW_STATUS.ACTIVATING
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.activating
                );
                expect(relativeDateTimeComponent).toBeNull();
            });
        });

        it('Displays "Saving..." in the toolbar when saveStatus is set to the same and flow status is not defined', () => {
            const toolbarComponent = createComponentUnderTest({
                saveStatus: LABELS.savingStatus
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );
                expect(lastSavedButton.textContent).toBe(LABELS.savingStatus);
                expect(relativeDateTimeComponent).toBeNull();
            });
        });

        it('Displays "Saving ..." in the toolbar when saveStatus is set to "Saving" and flow status is Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savingStatus,
                flowStatus: FLOW_STATUS.DRAFT
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.savingStatus
                );
                expect(relativeDateTimeComponent).toBeNull();
            });
        });

        it('Displays "Saving ..." in the toolbar when saveStatus is set to "Saving" and flow status is Invalid Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savingStatus,
                flowStatus: FLOW_STATUS.INVALID_DRAFT
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.savingStatus
                );
                expect(relativeDateTimeComponent).toBeNull();
            });
        });

        it('Displays "Saving ..." in the toolbar when saveStatus is set to "Saving" and flow status is Active', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savingStatus,
                flowStatus: FLOW_STATUS.ACTIVE
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.savingStatus
                );
                expect(relativeDateTimeComponent).toBeNull();
            });
        });

        it('Displays "Saving ..." in the toolbar when saveStatus is set to "Saving" and flow status is Obsolete', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveStatus: LABELS.savingStatus,
                flowStatus: FLOW_STATUS.OBSOLETE
            });

            return Promise.resolve().then(() => {
                const lastSavedButton = toolbarComponent.shadowRoot.querySelector(
                    selectors.lastSave
                );
                const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(
                    selectors.relativedatetime
                );

                expect(lastSavedButton.textContent.trim()).toEqual(
                    LABELS.savingStatus
                );
                expect(relativeDateTimeComponent).toBeNull();
            });
        });
    });
});
