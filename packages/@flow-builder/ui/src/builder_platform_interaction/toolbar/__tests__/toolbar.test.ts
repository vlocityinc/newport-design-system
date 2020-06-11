// @ts-nocheck
import { createElement } from 'lwc';
import {
    EditFlowPropertiesEvent,
    SaveFlowEvent,
    DuplicateEvent,
    ToggleFlowStatusEvent,
    ToggleSelectionModeEvent,
    CopyEvent,
    ClosePropertyEditorEvent
} from 'builder_platform_interaction/events';
import Toolbar from 'builder_platform_interaction/toolbar';
import { parseMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { LABELS } from '../toolbarLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';
import { setUseFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

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
    el.isCutCopyDisabled = props.isCutCopyDisabled;
    el.isSelectionMode = props.isSelectionMode;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    select: '.test-toolbar-select',
    undoRedo: '.test-undo-redo',
    cut: '.test-toolbar-cut',
    copy: '.test-toolbar-copy',
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
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(EditFlowPropertiesEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.editflowproperties).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Undo Redo should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(selectors.undoRedo);
        expect(undoRedoGroup).not.toBeNull();
    });

    it('Status Icons section should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const toolbarStatusIcons = toolbarComponent.shadowRoot.querySelector(
            'builder_platform_interaction-toolbar-status-icons'
        );
        expect(toolbarStatusIcons).not.toBeNull();
    });

    it('Activate button should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton).not.toBeNull();
    });

    it('Activate button text should be "deactivate" when flow is active', () => {
        const toolbarComponent = createComponentUnderTest({ flowStatus: FLOW_STATUS.ACTIVE });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.label).toBe(LABELS.deactivateTitle);
    });

    it('Activate button should be disabled when flow has unsaved changes', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.DRAFT,
            hasUnsavedChanges: true
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button is enabled when given flow is a normal Flow and flow status is valid', () => {
        const toolbarComponent = createComponentUnderTest({
            flowId: '301xx000003GZDLAA4',
            flowStatus: FLOW_STATUS.ACTIVE
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBeUndefined();
    });

    it('Activate button should be disabled when given flow is a Standard (File Based) Flow', () => {
        const toolbarComponent = createComponentUnderTest({
            flowId: 'sfdc_checkout__CartToOrder-1'
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be disabled when flow is invalid', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.INVALID_DRAFT
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be active when flow is a draft and has no unsaved changes', () => {
        const toolbarComponent = createComponentUnderTest({ flowStatus: FLOW_STATUS.DRAFT, hasUnsavedChanges: false });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('Activate button should be active when flow is deactivated', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.OBSOLETE,
            hasUnsavedChanges: false
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(selectors.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('fires save event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.save).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE);
    });

    it('fires saveas event when save as button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS);
    });

    it('fires toggle flow status event when activate button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(ToggleFlowStatusEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.activate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('fires duplicate event when duplicate element button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(DuplicateEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.duplicate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('fires close property editor event when duplicate button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(selectors.duplicate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    describe('Flow Status Indicator', () => {
        it('Displays "Inactive\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);
            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
            expect(relativeDateTimeComponent.value).toEqual(currentDate);
            expect(parseMetadataDateTime).toHaveBeenCalledWith(currentDate.toISOString(), true);
        });

        it('Displays "Inactive\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Invalid Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.INVALID_DRAFT,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Active\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Active', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.ACTIVE,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Deactivated\u2014Saved {relative time}" in the toolbar when saveAndPendingOperationStatus is set to "Saved" and flow status is Obsolete', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.SAVED,
                flowStatus: FLOW_STATUS.OBSOLETE,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.toolbarStatus);
            expect(relativeDateTimeComponent).not.toBeNull();
        });

        it('Displays "Activating ..." in the toolbar when saveAndPendingOperationStatus is set to activating and flow status is Draft', () => {
            const currentDate = new Date();
            parseMetadataDateTime.mockReturnValueOnce({ date: currentDate });
            const toolbarComponent = createComponentUnderTest({
                lastModifiedDate: currentDate.toISOString(),
                saveAndPendingOperationStatus: FLOW_STATUS.ACTIVATING,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.activating);
            expect(relativeDateTimeComponent).toBeNull();
        });

        it('Displays "Saving..." in the toolbar when saveAndPendingOperationStatus is set to the same flowStatus is draft', () => {
            const toolbarComponent = createComponentUnderTest({
                saveAndPendingOperationStatus: FLOW_STATUS.SAVING,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(selectors.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(selectors.relativedatetime);
            expect(lastSavedButton.textContent).toBe(LABELS.savingStatus);
            expect(relativeDateTimeComponent).toBeNull();
        });
    });

    describe('Fixed Layout Canvas Mode', () => {
        let toolbarComponent;
        beforeEach(() => {
            setUseFixedLayoutCanvas(true);
        });

        describe('Base Mode', () => {
            beforeEach(() => {
                toolbarComponent = createComponentUnderTest();
            });

            it('Displays Select Button with right configuration when in Base Mode', () => {
                const selectButton = toolbarComponent.shadowRoot.querySelector(selectors.select);
                expect(selectButton).not.toBeNull();
                expect(selectButton.label).toBe(LABELS.selectLabel);
                expect(selectButton.title).toBe(LABELS.selectTitle);
                expect(selectButton.iconName).toBe('utility:multi_select_checkbox');
                expect(selectButton.variant).toBe('neutral');
            });

            it('Displays the undo redo group in Base Mode', () => {
                const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(selectors.undoRedo);
                expect(undoRedoGroup).not.toBeNull();
            });

            it('Does not display Duplicate Button in Base Mode', () => {
                const duplicateButton = toolbarComponent.shadowRoot.querySelector(selectors.duplicate);
                expect(duplicateButton).toBeNull();
            });

            it('Does not display Cut Button in Base Mode', () => {
                const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
                expect(cutButton).toBeNull();
            });

            it('Does not display Copy Button in Base Mode', () => {
                const copyButton = toolbarComponent.shadowRoot.querySelector(selectors.copy);
                expect(copyButton).toBeNull();
            });

            it('Click on the Select Button should fire the ToggleSelectionModeEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(ToggleSelectionModeEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(selectors.select).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });

        describe('Selection Mode', () => {
            beforeEach(() => {
                toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: true, isSelectionMode: true });
            });

            it('Displays Select Button with right configuration when in Selection Mode', () => {
                const selectButton = toolbarComponent.shadowRoot.querySelector(selectors.select);
                expect(selectButton).not.toBeNull();
                expect(selectButton.label).toBe(LABELS.selectLabel);
                expect(selectButton.title).toBe(LABELS.selectTitle);
                expect(selectButton.iconName).toBe('utility:multi_select_checkbox');
                expect(selectButton.variant).toBe('brand');
            });

            it('Click on the Select Button should fire the ToggleSelectionModeEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(ToggleSelectionModeEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(selectors.select).click();
                expect(eventCallback).toHaveBeenCalled();
            });

            it('Does not display the undo redo group in Selection Mode', () => {
                const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(selectors.undoRedo);
                expect(undoRedoGroup).toBeNull();
            });

            it('Does not display Duplicate Button in Selection Mode', () => {
                const duplicateButton = toolbarComponent.shadowRoot.querySelector(selectors.duplicate);
                expect(duplicateButton).toBeNull();
            });

            it('Displays the Cut Button with right configuration when in Selection Mode', () => {
                const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
                expect(cutButton).not.toBeNull();
                expect(cutButton.alternativeText).toBe(LABELS.cutAltText);
                expect(cutButton.title).toBe(LABELS.cutTitle);
                expect(cutButton.disabled).toBeTruthy();
                expect(cutButton.iconName).toBe('utility:cut');
            });

            it('The cut button should be enabled when isCutCopyDisabled is false', () => {
                toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: false, isSelectionMode: true });
                const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
                expect(cutButton.disabled).toBeFalsy();
            });

            it('Displays the Copy Button with right configuration when in Selection Mode', () => {
                const copyButton = toolbarComponent.shadowRoot.querySelector(selectors.copy);
                expect(copyButton).not.toBeNull();
                expect(copyButton.alternativeText).toBe(LABELS.copyAltText);
                expect(copyButton.title).toBe(LABELS.copyTitle);
                expect(copyButton.disabled).toBeTruthy();
                expect(copyButton.iconName).toBe('utility:copy_to_clipboard');
            });

            it('The copy button should be enabled when isCutCopyDisabled is false', () => {
                toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: false, isSelectionMode: true });
                const copyButton = toolbarComponent.shadowRoot.querySelector(selectors.copy);
                expect(copyButton.disabled).toBeFalsy();
            });

            it('Click on the Copy Button should fire the CopyEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(CopyEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(selectors.copy).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
});
