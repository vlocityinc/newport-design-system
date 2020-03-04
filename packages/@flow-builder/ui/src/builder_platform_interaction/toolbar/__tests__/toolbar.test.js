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
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/loggingUtils', () => ({
    logInteraction: jest.fn()
}));

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });

    el.lastModifiedDate = props.lastModifiedDate;
    el.saveAndPendingOperationStatus = props.saveAndPendingOperationStatus;
    el.flowStatus = props.flowStatus;
    el.hasUnsavedChanges = props.hasUnsavedChanges;
    el.flowVersion = props.flowVersion;

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
    it('fires editflowproperties event when edit flow properties button is clicked', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(EditFlowPropertiesEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.editflowproperties).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Button Group should be present', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const toolbarButtonGroup = toolbarComponent.shadowRoot.querySelector('lightning-button-group');
        expect(toolbarButtonGroup).not.toBeNull();
    });

    it('Status Icons section should be present', async () => {
        const toolbarComponent = createComponentUnderTest();
        await ticks(1);
        const toolbarStatusIcons = toolbarComponent.shadowRoot.querySelector(
            'builder_platform_interaction-toolbar-status-icons'
        );
        expect(toolbarStatusIcons).not.toBeNull();
    });

    it('Activate button should be present', async () => {
        const toolbarComponent = createComponentUnderTest();
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton).not.toBeNull();
    });

    it('Activate button text should be "deactivate" when flow is active', async () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.ACTIVE
        });
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.label).toBe(LABELS.deactivateTitle);
    });

    it('Activate button should be disabled when flow has unsaved changes', async () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.DRAFT,
            hasUnsavedChanges: true
        });
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be disabled when flow is invalid', async () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.INVALID_DRAFT
        });
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be active when flow is a draft and has no unsaved changes', async () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.DRAFT,
            hasUnsavedChanges: false
        });
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('Activate button should be active when flow is deactivated', async () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.OBSOLETE,
            hasUnsavedChanges: false
        });
        await ticks(1);
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('fires save event when save button is clicked', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.save).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE);
    });

    it('fires saveas event when save as button is clicked', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS);
    });

    it('fires toggle flow status event when activate button is clicked', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(ToggleFlowStatusEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.activate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('fires duplicate event when duplicate element button is clicked', async () => {
        const toolbarComponent = createComponentUnderTest();

        await ticks(1);
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(DuplicateEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.duplicate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    describe('Flow Status Indicator', () => {
        it('Displays "Inactive\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Draft', async () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);
            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
            expect(relativeDateTimeComponent.value).toEqual(currentDate);
            expect(parseMetadataDateTime).toHaveBeenCalledWith(currentDate.toISOString(), true);
        });

        it('Displays "Inactive\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Invalid Draft', async () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.INVALID_DRAFT,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Active\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Active', async () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.ACTIVE,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Deactivated\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Obsolete', async () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.OBSOLETE,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Activating ..." in the toolbar when saveAndPendingOperationStatus is set to activating and flow status is Draft', async () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.ACTIVATING,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.activating);
            expect(relativeDateTimeComponent).toBeNull();
        });

        it('Displays "Saving..." in the toolbar when saveAndPendingOperationStatus is set to the same flowStatus is draft', async () => {
            const toolbarComponent = createComponentUnderTest({
                saveAndPendingOperationStatus: FLOW_STATUS.SAVING,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            await ticks(1);
            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);
            expect(lastSavedButton.textContent).toBe(LABELS.savingStatus);
            expect(relativeDateTimeComponent).toBeNull();
        });
    });
});
