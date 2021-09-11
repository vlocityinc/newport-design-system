// @ts-nocheck
import { createElement } from 'lwc';
import {
    EditFlowPropertiesEvent,
    SaveFlowEvent,
    DuplicateEvent,
    ToggleFlowStatusEvent,
    ToggleSelectionModeEvent,
    CopyOnCanvasEvent,
    ClosePropertyEditorEvent,
    EditFlowEvent,
    ToggleCanvasModeEvent,
    NewDebugFlowEvent,
    RestartDebugFlowEvent,
    DebugFlowEvent
} from 'builder_platform_interaction/events';
import Toolbar from 'builder_platform_interaction/toolbar';
import { parseMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { LABELS } from '../toolbarLabels';
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';
import { getPropertyOrDefaultToTrue } from 'builder_platform_interaction/commonUtils';
import {
    changeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { CanvasMode } from 'builder_platform_interaction/builderUtils';
import { setup } from '@sa11y/jest';

jest.mock('builder_platform_interaction/storeLib');

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-toolbar', {
        is: Toolbar
    });
    Object.assign(el, props, {
        showCopyPasteButton: getPropertyOrDefaultToTrue(props, 'showCopyPasteButton'),
        showEditFlowPropertiesButton: getPropertyOrDefaultToTrue(props, 'showEditFlowPropertiesButton'),
        showCanvasModeCombobox: getPropertyOrDefaultToTrue(props, 'showCanvasModeCombobox'),
        showFlowStatus: getPropertyOrDefaultToTrue(props, 'showFlowStatus'),
        showRunButton: getPropertyOrDefaultToTrue(props, 'showRunButton'),
        showDebugButton: getPropertyOrDefaultToTrue(props, 'showDebugButton')
    });

    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    select: '.test-toolbar-select',
    undoRedo: '.test-undo-redo',
    cut: '.test-toolbar-cut',
    copy: '.test-toolbar-copy',
    editflowproperties: '.test-toolbar-editflowproperties',
    saveas: '.test-toolbar-saveas',
    save: '.test-toolbar-save',
    lastSave: '.toolbar-last-saved',
    duplicate: '.test-toolbar-duplicate',
    activate: '.test-toolbar-activate',
    relativedatetime: 'lightning-relative-date-time',
    canvasModeCombobox: '.canvas-mode-combobox',
    editFlow: '.test-toolbar-editflow',
    debug: '.test-toolbar-debug',
    newDebug: '.test-toolbar-newdebug',
    restartRun: '.test-toolbar-restartrun'
};

jest.mock('builder_platform_interaction/dateTimeUtils', () => ({
    parseMetadataDateTime: jest.fn().mockName('parseMetadataDateTime')
}));

const change = (component, newValue) => component.dispatchEvent(changeEvent(newValue));

describe('toolbar', () => {
    beforeAll(() => {
        setup();
    });

    it('accessibility', async () => {
        const toolbarComponent = createComponentUnderTest({
            saveAndPendingOperationStatus: FLOW_STATUS.SAVING
        });
        await expect(toolbarComponent).toBeAccessible();
    });

    it('fires editflowproperties event when edit flow properties button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(EditFlowPropertiesEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(SELECTORS.editflowproperties).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Undo Redo should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(SELECTORS.undoRedo);
        expect(undoRedoGroup).not.toBeNull();
    });

    it('Edit Flow button should not be present by default', () => {
        const toolbarComponent = createComponentUnderTest();
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.editFlow);
        expect(editFlowButton).toBeNull();
    });

    it('Edit Flow button should be present if api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ showEditFlowButton: true });
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.editFlow);
        expect(editFlowButton).not.toBeNull();
    });

    it('Edit Flow button fires edit flow event when clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showEditFlowButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(EditFlowEvent.EVENT_NAME, eventCallback);
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.editFlow);
        editFlowButton.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Debug button should not be present if show debug button api property is not set', () => {
        const toolbarComponent = createComponentUnderTest({ showDebugButton: false });
        const debug = toolbarComponent.shadowRoot.querySelector(SELECTORS.debug);
        expect(debug).toBeNull();
    });

    it('Old Debug button should not be present if new debug is supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const debug = toolbarComponent.shadowRoot.querySelector(SELECTORS.debug);
        expect(debug).toBeNull();
    });

    it('Old Debug button should be present if show debug button api property is set and new debug is not supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: false, showDebugButton: true });
        const debug = toolbarComponent.shadowRoot.querySelector(SELECTORS.debug);
        expect(debug).not.toBeNull();
    });

    it('Debug button should fire the debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showDebugButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(DebugFlowEvent.EVENT_NAME, eventCallback);
        const debug = toolbarComponent.shadowRoot.querySelector(SELECTORS.debug);
        debug.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('New Debug button should not be present if new debug is not supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: false, showDebugButton: true });
        const newDebug = toolbarComponent.shadowRoot.querySelector(SELECTORS.newDebug);
        expect(newDebug).toBeNull();
    });

    it('New Debug button should not be present if show debug button api property is not set', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: false });
        const newDebug = toolbarComponent.shadowRoot.querySelector(SELECTORS.newDebug);
        expect(newDebug).toBeNull();
    });

    it('New Debug button should be present if new debug is supported and show debug button api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const newDebug = toolbarComponent.shadowRoot.querySelector(SELECTORS.newDebug);
        expect(newDebug).not.toBeNull();
    });

    it('New Debug button should fire the new debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(NewDebugFlowEvent.EVENT_NAME, eventCallback);
        const newDebug = toolbarComponent.shadowRoot.querySelector(SELECTORS.newDebug);
        newDebug.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Restart Run button should not be present by default', () => {
        const toolbarComponent = createComponentUnderTest();
        const restartRun = toolbarComponent.shadowRoot.querySelector(SELECTORS.restartRun);
        expect(restartRun).toBeNull();
    });

    it('Restart Run button should be present if api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ showRestartRunButton: true });
        const restartRun = toolbarComponent.shadowRoot.querySelector(SELECTORS.restartRun);
        expect(restartRun).not.toBeNull();
    });

    it('Restart Debug button should fire the restart debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showRestartRunButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(RestartDebugFlowEvent.EVENT_NAME, eventCallback);
        const newDebug = toolbarComponent.shadowRoot.querySelector(SELECTORS.restartRun);
        newDebug.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Status Icons section should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const toolbarStatusIcons = toolbarComponent.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.TOOLBAR_STATUS_ICONS
        );
        expect(toolbarStatusIcons).not.toBeNull();
    });

    it('Activate button should be present', () => {
        const toolbarComponent = createComponentUnderTest();
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton).not.toBeNull();
    });

    it('Activate button text should be "deactivate" when flow is active', () => {
        const toolbarComponent = createComponentUnderTest({ flowStatus: FLOW_STATUS.ACTIVE });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.label).toBe(LABELS.deactivateTitle);
    });

    it('Activate button should be disabled when flow has unsaved changes', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.DRAFT,
            hasUnsavedChanges: true
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button is enabled when given flow is a normal Flow and flow status is valid', () => {
        const toolbarComponent = createComponentUnderTest({
            flowId: '301xx000003GZDLAA4',
            flowStatus: FLOW_STATUS.ACTIVE
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBeUndefined();
    });

    it('Activate button should be disabled when given flow is a Standard (File Based) Flow', () => {
        const toolbarComponent = createComponentUnderTest({
            flowId: 'sfdc_checkout__CartToOrder-1'
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be disabled when flow is invalid', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.INVALID_DRAFT
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBe(true);
    });

    it('Activate button should be active when flow is a draft and has no unsaved changes', () => {
        const toolbarComponent = createComponentUnderTest({ flowStatus: FLOW_STATUS.DRAFT, hasUnsavedChanges: false });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('Activate button should be active when flow is deactivated', () => {
        const toolbarComponent = createComponentUnderTest({
            flowStatus: FLOW_STATUS.OBSOLETE,
            hasUnsavedChanges: false
        });
        const activateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.activate);
        expect(activateButton.disabled).toBe(false);
    });

    it('fires save event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(SELECTORS.save).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE);
    });

    describe('save type', () => {
        it.each`
            isOverridable | isTemplate | canOnlySaveAsNewDefinition | eventType
            ${false}      | ${false}   | ${false}                   | ${SaveFlowEvent.Type.SAVE_AS}
            ${true}       | ${false}   | ${false}                   | ${SaveFlowEvent.Type.SAVE_AS}
            ${false}      | ${true}    | ${false}                   | ${SaveFlowEvent.Type.SAVE_AS}
            ${false}      | ${false}   | ${true}                    | ${SaveFlowEvent.Type.SAVE_AS}
            ${true}       | ${false}   | ${true}                    | ${SaveFlowEvent.Type.SAVE_AS_OVERRIDDEN}
            ${false}      | ${true}    | ${true}                    | ${SaveFlowEvent.Type.SAVE_AS_TEMPLATE}
        `(
            'fires a ${eventType} event when save as button is clicked and isTemplate and isOverridable are disabled',
            async ({ isOverridable, isTemplate, canOnlySaveAsNewDefinition, eventType }) => {
                Store.getStore.mockImplementation(() => {
                    return {
                        getCurrentState: jest.fn(() => {
                            return {
                                properties: {
                                    isOverridable,
                                    isTemplate,
                                    canOnlySaveAsNewDefinition
                                },
                                elements: {}
                            };
                        }),
                        getStore: jest.fn(() => {
                            return {
                                getCurrentState
                            };
                        })
                    };
                });
                const toolbarComponent = createComponentUnderTest();
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(SaveFlowEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(SELECTORS.saveas).click();
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0].detail.type).toBe(eventType);
            }
        );
    });

    it('fires toggle flow status event when activate button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(ToggleFlowStatusEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(SELECTORS.activate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('fires duplicate event when duplicate element button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(DuplicateEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(SELECTORS.duplicate).click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('fires close property editor event when duplicate button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
        toolbarComponent.shadowRoot.querySelector(SELECTORS.duplicate).click();
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

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);
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

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);

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

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);

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

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);

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

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);

            expect(lastSavedButton.textContent.trim()).toEqual(LABELS.activating);
            expect(relativeDateTimeComponent).toBeNull();
        });

        it('Displays "Saving..." in the toolbar when saveAndPendingOperationStatus is set to the same flowStatus is draft', () => {
            const toolbarComponent = createComponentUnderTest({
                saveAndPendingOperationStatus: FLOW_STATUS.SAVING,
                flowStatus: FLOW_STATUS.DRAFT,
                flowVersion: 1
            });

            const lastSavedButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.lastSave);
            const relativeDateTimeComponent = toolbarComponent.shadowRoot.querySelector(SELECTORS.relativedatetime);
            expect(lastSavedButton.textContent).toBe(LABELS.savingStatus);
            expect(relativeDateTimeComponent).toBeNull();
        });
    });

    describe('Fixed Layout Canvas Mode', () => {
        let toolbarComponent;

        describe('Base Mode', () => {
            beforeEach(() => {
                toolbarComponent = createComponentUnderTest({ isAutoLayoutCanvas: true });
            });

            it('Displays Select Button with right configuration when in Base Mode', () => {
                const selectButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.select);
                expect(selectButton).not.toBeNull();
                expect(selectButton.label).toBe(LABELS.selectLabel);
                expect(selectButton.title).toBe(LABELS.selectTitle);
                expect(selectButton.iconName).toBe('utility:multi_select_checkbox');
                expect(selectButton.variant).toBe('neutral');
            });

            it('Select Button should not be available when hideSelectionButton is passed as true', () => {
                toolbarComponent = createComponentUnderTest({ isAutoLayoutCanvas: true, hideSelectionButton: true });
                const selectButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.select);
                expect(selectButton).toBeNull();
            });

            it('Displays the undo redo group in Base Mode', () => {
                const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(SELECTORS.undoRedo);
                expect(undoRedoGroup).not.toBeNull();
            });

            it('Does not display Duplicate Button in Base Mode', () => {
                const duplicateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.duplicate);
                expect(duplicateButton).toBeNull();
            });

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('Does not display Cut Button in Base Mode', () => {
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.cut);
            //     expect(cutButton).toBeNull();
            // });

            it('Does not display Copy Button in Base Mode', () => {
                const copyButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.copy);
                expect(copyButton).toBeNull();
            });

            it('Click on the Select Button should fire the ToggleSelectionModeEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(ToggleSelectionModeEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(SELECTORS.select).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });

        describe('Selection Mode', () => {
            beforeEach(() => {
                toolbarComponent = createComponentUnderTest({
                    isCutCopyDisabled: true,
                    isSelectionMode: true,
                    isAutoLayoutCanvas: true
                });
            });

            it('Displays Select Button with right configuration when in Selection Mode', () => {
                const selectButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.select);
                expect(selectButton).not.toBeNull();
                expect(selectButton.label).toBe(LABELS.selectLabel);
                expect(selectButton.title).toBe(LABELS.selectTitle);
                expect(selectButton.iconName).toBe('utility:multi_select_checkbox');
                expect(selectButton.variant).toBe('brand');
            });

            it('Click on the Select Button should fire the ToggleSelectionModeEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(ToggleSelectionModeEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(SELECTORS.select).click();
                expect(eventCallback).toHaveBeenCalled();
            });

            it('Does not display the undo redo group in Selection Mode', () => {
                const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(SELECTORS.undoRedo);
                expect(undoRedoGroup).toBeNull();
            });

            it('Does not display Duplicate Button in Selection Mode', () => {
                const duplicateButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.duplicate);
                expect(duplicateButton).toBeNull();
            });

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('Displays the Cut Button with right configuration when in Selection Mode', () => {
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.cut);
            //     expect(cutButton).not.toBeNull();
            //     expect(cutButton.alternativeText).toBe(LABELS.cutAltText);
            //     expect(cutButton.title).toBe(LABELS.cutTitle);
            //     expect(cutButton.disabled).toBeTruthy();
            //     expect(cutButton.iconName).toBe('utility:cut');
            // });

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('The cut button should be enabled when isCutCopyDisabled is false', () => {
            //     toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: false, isSelectionMode: true });
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.cut);
            //     expect(cutButton.disabled).toBeFalsy();
            // });

            it('Displays the Copy Button with right configuration when in Selection Mode', () => {
                const copyButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.copy);
                expect(copyButton).not.toBeNull();
                expect(copyButton.alternativeText).toBe(LABELS.copyAltText);
                expect(copyButton.title).toBe(LABELS.copyTitle);
                expect(copyButton.disabled).toBeTruthy();
                expect(copyButton.iconName).toBe('utility:copy_to_clipboard');
            });

            it('The copy button should be enabled when isCutCopyDisabled is false', () => {
                toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: false, isSelectionMode: true });
                const copyButton = toolbarComponent.shadowRoot.querySelector(SELECTORS.copy);
                expect(copyButton.disabled).toBeFalsy();
            });

            it('Click on the Copy Button should fire the CopyOnCanvasEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(CopyOnCanvasEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(SELECTORS.copy).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });

    describe('Canvas Mode Switching', () => {
        it('Displays the Canvas Mode Combobox with right configuration when in Auto-Layout Mode', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: true,
                showCanvasModeCombobox: true
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            const canvasModeComboboxButton = canvasModeCombobox.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );

            expect(canvasModeComboboxButton).not.toBeNull();
            expect(canvasModeComboboxButton.value).toBe(CanvasMode.AutoLayout);
        });

        it('Displays the Canvas Mode Combobox with right configuration when in Free-Form Mode', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeCombobox: true
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            const canvasModeComboboxButton = canvasModeCombobox.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );

            expect(canvasModeComboboxButton).not.toBeNull();
            expect(canvasModeComboboxButton.value).toBe(CanvasMode.FreeForm);
        });

        it('Should not display Canvas Mode Combobox when showCanvasModeCombobox is false and mode is Auto-Layout', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: true,
                showCanvasModeCombobox: false
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            expect(canvasModeCombobox).toBeNull();
        });

        it('Should not display Canvas Mode Combobox when showCanvasModeCombobox is false and mode is Free-Form', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeCombobox: false
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            expect(canvasModeCombobox).toBeNull();
        });

        it('When in Auto-Layout mode, clicking on the mode combobox button should fire ToggleCanvasModeEvent event and have right configuration', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: true,
                showCanvasModeCombobox: true
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            const canvasModeComboboxButton = canvasModeCombobox.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );

            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(ToggleCanvasModeEvent.EVENT_NAME, eventCallback);
            change(canvasModeComboboxButton, CanvasMode.FreeForm);
            expect(eventCallback).toHaveBeenCalled();
        });

        it('When in Free-Form, clicking on the mode combobox button should fire ToggleCanvasModeEvent event and have right configuration', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeCombobox: true
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            const canvasModeComboboxButton = canvasModeCombobox.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );

            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(ToggleCanvasModeEvent.EVENT_NAME, eventCallback);
            change(canvasModeComboboxButton, CanvasMode.AutoLayout);
            expect(eventCallback).toHaveBeenCalled();
        });

        it('When in Free-Form with hasUnsavedChanges, clicking on Auto-Layout does not change canvas mode', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeCombobox: true,
                hasUnsavedChanges: true
            });
            const canvasModeCombobox = toolbarComponent.shadowRoot.querySelector(SELECTORS.canvasModeCombobox);
            const canvasModeComboboxButton = canvasModeCombobox.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );

            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(ToggleCanvasModeEvent.EVENT_NAME, eventCallback);
            change(canvasModeComboboxButton, CanvasMode.AutoLayout);
            expect(eventCallback).toHaveBeenCalled();
            expect(canvasModeComboboxButton.value).toEqual(CanvasMode.FreeForm);
        });
    });
});
