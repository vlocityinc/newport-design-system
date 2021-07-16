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
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib');

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
    el.isAutoLayoutCanvas = props.isAutoLayoutCanvas;
    el.isNewDebugSupported = props.isNewDebugSupported;
    el.showCopyPasteButton = getPropertyOrDefaultToTrue(props, 'showCopyPasteButton');
    el.showEditFlowPropertiesButton = getPropertyOrDefaultToTrue(props, 'showEditFlowPropertiesButton');
    el.showCanvasModeToggle = getPropertyOrDefaultToTrue(props, 'showCanvasModeToggle');
    el.showFlowStatus = getPropertyOrDefaultToTrue(props, 'showFlowStatus');
    el.showEditFlowButton = props.showEditFlowButton;
    el.showRunButton = getPropertyOrDefaultToTrue(props, 'showRunButton');
    el.showDebugButton = getPropertyOrDefaultToTrue(props, 'showDebugButton');
    el.showRestartRunButton = props.showRestartRunButton;
    el.hideSelectionButton = props.hideSelectionButton;

    setDocumentBodyChildren(el);
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
    relativedatetime: 'lightning-relative-date-time',
    canvasModeToggle: '.canvas-mode-toggle',
    editFlow: '.test-toolbar-editflow',
    debug: '.test-toolbar-debug',
    newDebug: '.test-toolbar-newdebug',
    restartRun: '.test-toolbar-restartrun'
};

jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        parseMetadataDateTime: jest.fn().mockName('parseMetadataDateTime')
    };
});

const change = (component, checked = false) => {
    const changeEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: {
            checked
        }
    });
    component.dispatchEvent(changeEvent);
};

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

    it('Edit Flow button should not be present by default', () => {
        const toolbarComponent = createComponentUnderTest();
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(selectors.editFlow);
        expect(editFlowButton).toBeNull();
    });

    it('Edit Flow button should be present if api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ showEditFlowButton: true });
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(selectors.editFlow);
        expect(editFlowButton).not.toBeNull();
    });

    it('Edit Flow button fires edit flow event when clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showEditFlowButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(EditFlowEvent.EVENT_NAME, eventCallback);
        const editFlowButton = toolbarComponent.shadowRoot.querySelector(selectors.editFlow);
        editFlowButton.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Debug button should not be present if show debug button api property is not set', () => {
        const toolbarComponent = createComponentUnderTest({ showDebugButton: false });
        const debug = toolbarComponent.shadowRoot.querySelector(selectors.debug);
        expect(debug).toBeNull();
    });

    it('Old Debug button should not be present if new debug is supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const debug = toolbarComponent.shadowRoot.querySelector(selectors.debug);
        expect(debug).toBeNull();
    });

    it('Old Debug button should be present if show debug button api property is set and new debug is not supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: false, showDebugButton: true });
        const debug = toolbarComponent.shadowRoot.querySelector(selectors.debug);
        expect(debug).not.toBeNull();
    });

    it('Debug button should fire the debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showDebugButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(DebugFlowEvent.EVENT_NAME, eventCallback);
        const debug = toolbarComponent.shadowRoot.querySelector(selectors.debug);
        debug.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('New Debug button should not be present if new debug is not supported', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: false, showDebugButton: true });
        const newDebug = toolbarComponent.shadowRoot.querySelector(selectors.newDebug);
        expect(newDebug).toBeNull();
    });

    it('New Debug button should not be present if show debug button api property is not set', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: false });
        const newDebug = toolbarComponent.shadowRoot.querySelector(selectors.newDebug);
        expect(newDebug).toBeNull();
    });

    it('New Debug button should be present if new debug is supported and show debug button api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const newDebug = toolbarComponent.shadowRoot.querySelector(selectors.newDebug);
        expect(newDebug).not.toBeNull();
    });

    it('New Debug button should fire the new debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ isNewDebugSupported: true, showDebugButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(NewDebugFlowEvent.EVENT_NAME, eventCallback);
        const newDebug = toolbarComponent.shadowRoot.querySelector(selectors.newDebug);
        newDebug.click();
        expect(eventCallback).toHaveBeenCalled();
    });

    it('Restart Run button should not be present by default', () => {
        const toolbarComponent = createComponentUnderTest();
        const restartRun = toolbarComponent.shadowRoot.querySelector(selectors.restartRun);
        expect(restartRun).toBeNull();
    });

    it('Restart Run button should be present if api property is set', () => {
        const toolbarComponent = createComponentUnderTest({ showRestartRunButton: true });
        const restartRun = toolbarComponent.shadowRoot.querySelector(selectors.restartRun);
        expect(restartRun).not.toBeNull();
    });

    it('Restart Debug button should fire the restart debug event if clicked', () => {
        const toolbarComponent = createComponentUnderTest({ showRestartRunButton: true });
        const eventCallback = jest.fn();
        toolbarComponent.addEventListener(RestartDebugFlowEvent.EVENT_NAME, eventCallback);
        const newDebug = toolbarComponent.shadowRoot.querySelector(selectors.restartRun);
        newDebug.click();
        expect(eventCallback).toHaveBeenCalled();
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

    it('fires saveas event when save as button is clicked and isTemplate and isOverridable are disabled', () => {
        Store.getStore.mockImplementation(() => {
            return {
                getCurrentState: jest.fn(() => {
                    return {
                        properties: {
                            isOverridable: false,
                            isTemplate: false
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
        toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS);
    });

    it('fires saveasoverridden event when save as button is clicked and isOverridable is enabled', () => {
        Store.getStore.mockImplementation(() => {
            return {
                getCurrentState: jest.fn(() => {
                    return {
                        properties: {
                            isOverridable: true,
                            isTemplate: false
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
        toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS_OVERRIDDEN);
    });

    it('fires saveastemplate event when save as button is clicked and isTemplate is enabled', () => {
        Store.getStore.mockImplementation(() => {
            return {
                getCurrentState: jest.fn(() => {
                    return {
                        properties: {
                            isOverridable: false,
                            isTemplate: true
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
        toolbarComponent.shadowRoot.querySelector(selectors.saveas).click();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail.type).toBe(SaveFlowEvent.Type.SAVE_AS_TEMPLATE);
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

        describe('Base Mode', () => {
            beforeEach(() => {
                toolbarComponent = createComponentUnderTest({ isAutoLayoutCanvas: true });
            });

            it('Displays Select Button with right configuration when in Base Mode', () => {
                const selectButton = toolbarComponent.shadowRoot.querySelector(selectors.select);
                expect(selectButton).not.toBeNull();
                expect(selectButton.label).toBe(LABELS.selectLabel);
                expect(selectButton.title).toBe(LABELS.selectTitle);
                expect(selectButton.iconName).toBe('utility:multi_select_checkbox');
                expect(selectButton.variant).toBe('neutral');
            });

            it('Select Button should not be available when hideSelectionButton is passed as true', () => {
                toolbarComponent = createComponentUnderTest({ isAutoLayoutCanvas: true, hideSelectionButton: true });
                const selectButton = toolbarComponent.shadowRoot.querySelector(selectors.select);
                expect(selectButton).toBeNull();
            });

            it('Displays the undo redo group in Base Mode', () => {
                const undoRedoGroup = toolbarComponent.shadowRoot.querySelector(selectors.undoRedo);
                expect(undoRedoGroup).not.toBeNull();
            });

            it('Does not display Duplicate Button in Base Mode', () => {
                const duplicateButton = toolbarComponent.shadowRoot.querySelector(selectors.duplicate);
                expect(duplicateButton).toBeNull();
            });

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('Does not display Cut Button in Base Mode', () => {
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
            //     expect(cutButton).toBeNull();
            // });

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
                toolbarComponent = createComponentUnderTest({
                    isCutCopyDisabled: true,
                    isSelectionMode: true,
                    isAutoLayoutCanvas: true
                });
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

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('Displays the Cut Button with right configuration when in Selection Mode', () => {
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
            //     expect(cutButton).not.toBeNull();
            //     expect(cutButton.alternativeText).toBe(LABELS.cutAltText);
            //     expect(cutButton.title).toBe(LABELS.cutTitle);
            //     expect(cutButton.disabled).toBeTruthy();
            //     expect(cutButton.iconName).toBe('utility:cut');
            // });

            // TODO: Enable this test back when we add support for Cutting of multiple elements
            // it('The cut button should be enabled when isCutCopyDisabled is false', () => {
            //     toolbarComponent = createComponentUnderTest({ isCutCopyDisabled: false, isSelectionMode: true });
            //     const cutButton = toolbarComponent.shadowRoot.querySelector(selectors.cut);
            //     expect(cutButton.disabled).toBeFalsy();
            // });

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

            it('Click on the Copy Button should fire the CopyOnCanvasEvent', () => {
                const eventCallback = jest.fn();
                toolbarComponent.addEventListener(CopyOnCanvasEvent.EVENT_NAME, eventCallback);
                toolbarComponent.shadowRoot.querySelector(selectors.copy).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });

    describe('Canvas Mode Toggling', () => {
        it('Displays the Canvas Mode Toggle with right configuration when in Auto-Layout Mode', () => {
            const toolbarComponent = createComponentUnderTest({ isAutoLayoutCanvas: true, showCanvasModeToggle: true });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            const canvasModeToggleButton = canvasModeToggle.querySelector('lightning-input');

            expect(canvasModeToggleButton).not.toBeNull();
            expect(canvasModeToggleButton.type).toBe('toggle');
            expect(canvasModeToggleButton.messageToggleActive).toBe('');
            expect(canvasModeToggleButton.messageToggleInactive).toBe('');
            expect(canvasModeToggleButton.label).toBe(LABELS.canvasModeToggleLabel);
            expect(canvasModeToggleButton.checked).toBeTruthy();
        });

        it('Displays the Canvas Mode Toggle with right configuration when in Free-Form Mode', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeToggle: true
            });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            const canvasModeToggleButton = canvasModeToggle.querySelector('lightning-input');

            expect(canvasModeToggleButton).not.toBeNull();
            expect(canvasModeToggleButton.type).toBe('toggle');
            expect(canvasModeToggleButton.messageToggleActive).toBe('');
            expect(canvasModeToggleButton.messageToggleInactive).toBe('');
            expect(canvasModeToggleButton.label).toBe(LABELS.canvasModeToggleLabel);
            expect(canvasModeToggleButton.checked).toBeFalsy();
        });

        it('Should not display Canvas Mode Toggle when showCanvasModeToggle is false and mode is Auto-Layout', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: true,
                showCanvasModeToggle: false
            });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            expect(canvasModeToggle).toBeNull();
        });

        it('Should not display Canvas Mode Toggle when showCanvasModeToggle is false and mode is Free-Form', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeToggle: false
            });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            expect(canvasModeToggle).toBeNull();
        });

        it('When in Auto-Layout mode, clicking on the mode toggle button should fire ToggleCanvasModeEvent event and have right configuration', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: true,
                showCanvasModeToggle: true
            });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            const canvasModeToggleButton = canvasModeToggle.querySelector('lightning-input');

            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(ToggleCanvasModeEvent.EVENT_NAME, eventCallback);
            change(canvasModeToggleButton);
            expect(eventCallback).toHaveBeenCalled();
            expect(canvasModeToggleButton.checked).toBeFalsy();
        });

        it('When in Free-Form, clicking on the mode toggle button should fire ToggleCanvasModeEvent event and have right configuration', () => {
            const toolbarComponent = createComponentUnderTest({
                isAutoLayoutCanvas: false,
                showCanvasModeToggle: true
            });
            const canvasModeToggle = toolbarComponent.shadowRoot.querySelector(selectors.canvasModeToggle);
            const canvasModeToggleButton = canvasModeToggle.querySelector('lightning-input');

            const eventCallback = jest.fn();
            toolbarComponent.addEventListener(ToggleCanvasModeEvent.EVENT_NAME, eventCallback);
            change(canvasModeToggleButton, true);
            expect(eventCallback).toHaveBeenCalled();
            expect(canvasModeToggleButton.checked).toBeFalsy();
        });
    });
});
