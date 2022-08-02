// @ts-nocheck
import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import {
    AlcSelectionEvent,
    IncomingGoToStubClickEvent,
    PasteOnCanvasEvent,
    UpdateAutolayoutCanvasModeEvent
} from 'builder_platform_interaction/alcEvents';
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import {
    ClosePropertyEditorEvent,
    CopyOnCanvasEvent,
    CopySingleElementEvent,
    CutElementsEvent,
    EditElementEvent,
    NewDebugFlowEvent,
    SelectNodeEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { keyboardInteractionUtils } from 'builder_platform_interaction_mocks/sharedUtils';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import {
    assignment1,
    assignment2,
    assignment3,
    assignment4,
    assignment5,
    decision1,
    decision2,
    end1,
    flowForCutPasteUIModel,
    X1,
    X1_0,
    X2,
    X2_0
} from 'mock/storeDataFlowForCutPaste';
import { Decision1, Decision2, orchestratorFlowUIModel } from 'mock/storeDataOrchestrator';
import {
    actionPostToChatter,
    assign,
    createAccountFromAnAccount,
    createAccountManualOutput,
    decision,
    recordTriggeredFlowUIModel,
    updateTriggeringRecord
} from 'mock/storeDataRecordTriggered';

const { Keys } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/alcCanvas', () => require('builder_platform_interaction_mocks/alcCanvas'));

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));
jest.mock('builder_platform_interaction/sharedUtils', () =>
    jest.requireActual('builder_platform_interaction_mocks/sharedUtils')
);

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        ...jest.requireActual('builder_platform_interaction_mocks/sobjectLib'),
        getEntity: jest.fn(() => {
            return {};
        })
    };
});

jest.mock('builder_platform_interaction/preloadLib', () => {
    return {
        loadAllSupportedFeatures: jest.fn(),
        loadFieldsForComplexTypesInFlow: jest.fn(),
        loadParametersForInvocableApexActionsInFlowFromMetadata: jest.fn(),
        loadOnStart: jest.fn().mockResolvedValue({}),
        loadOnProcessTypeChange: jest.fn().mockImplementation(() => {
            return {
                loadStandardActionsPromise: Promise.resolve({}),
                loadDynamicActionsPromise: Promise.resolve({}),
                loadPeripheralMetadataPromise: Promise.resolve({}),
                loadPalettePromise: Promise.resolve({})
            };
        }),
        loadOperatorsAndRulesOnTriggerTypeChange: jest.fn(),
        initializeLoader: jest.fn(),
        loadVersioningData: jest.fn(),
        loadFlowTests: jest.fn().mockResolvedValue({})
    };
});

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: jest.fn().mockResolvedValue({}),
        fetch: actual.fetch,
        setAuraFetch: actual.setAuraFetch,
        setAuraGetCallback: actual.setAuraGetCallback
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');
    return {
        getLHSTypes: jest.fn(),
        getOperators: jest.fn().mockReturnValue(['Assign', 'Add']),
        getRHSTypes: jest.fn(),
        getDataType: actual.getDataType,
        transformOperatorsForCombobox: jest.fn().mockImplementation((values) =>
            values.map((value) => ({
                label: 'some label',
                value
            }))
        ),
        getRulesForElementType: jest.fn(),
        elementToParam: actual.elementToParam,
        isCollectionRequired: jest.fn().mockReturnValue(false).mockName('isCollectionRequired'),
        RULE_OPERATOR: actual.RULE_OPERATOR,
        RULE_TYPES: actual.RULE_TYPES,
        PARAM_PROPERTY: actual.PARAM_PROPERTY
    };
});

const defaultOptions = {
    builderType: 'FlowBuilder',
    builderConfig: {
        supportedProcessTypes: ['Orchestrator'],
        usePanelForPropertyEditor: false,
        componentConfigs: {
            editMode: {
                leftPanelConfig: { showLeftPanel: true },
                rightPanelConfig: { showDebugPanel: false },
                toolbarConfig: {
                    showCanvasModeToggle: true
                }
            }
        }
    }
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-editor', defaultOptions, overrideOptions);
};

const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS
};

describe('auto-layout', () => {
    it('exits selection mode when the debug button is clicked', async () => {
        Store.setMockState({
            ...recordTriggeredFlowUIModel,
            properties: { ...recordTriggeredFlowUIModel.properties, isAutoLayoutCanvas: true }
        });
        const editorComponent = await createComponentUnderTest();
        const event = new UpdateAutolayoutCanvasModeEvent(AutoLayoutCanvasMode.SELECTION);
        const toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);

        toolbar.dispatchEvent(event);
        await ticks(1);
        expect(toolbar.autolayoutCanvasMode).toBe(AutoLayoutCanvasMode.SELECTION);

        toolbar.dispatchEvent(new NewDebugFlowEvent());
        await ticks(1);
        expect(toolbar.autolayoutCanvasMode).toBe(AutoLayoutCanvasMode.DEFAULT);

        Store.resetStore();
    });

    it('exits selection mode when the escape key is pressed', async () => {
        Store.setMockState({
            ...recordTriggeredFlowUIModel,
            properties: { ...recordTriggeredFlowUIModel.properties, isAutoLayoutCanvas: true }
        });
        const editorComponent = await createComponentUnderTest();
        const toggleModeEvent = new UpdateAutolayoutCanvasModeEvent(AutoLayoutCanvasMode.SELECTION);
        const escapeEvent = new KeyboardEvent('keydown', { key: Keys.Escape, bubbles: true });
        const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

        alcCanvasContainer.dispatchEvent(toggleModeEvent);
        await ticks(1);
        expect(alcCanvasContainer.autolayoutCanvasMode).toBe(AutoLayoutCanvasMode.SELECTION);

        alcCanvasContainer.dispatchEvent(escapeEvent);
        await ticks(1);
        expect(alcCanvasContainer.autolayoutCanvasMode).toBe(AutoLayoutCanvasMode.DEFAULT);

        Store.resetStore();
    });

    describe('use auto layout canvas', () => {
        beforeAll(() => {
            Store.setMockState(orchestratorFlowUIModel);
        });
        afterAll(() => {
            Store.resetStore();
        });

        let editorComponent;
        beforeEach(async () => {
            editorComponent = await createComponentUnderTest();
            const editElementEvent = new EditElementEvent(Decision1.guid);
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
            await alcCanvasContainer.dispatchEvent(editElementEvent);
            await Promise.resolve();
        });
        it('has the AlcCanvasContainer visible', () => {
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
            expect(alcCanvasContainer).not.toBeNull();
        });
        it('Checks if editor properly calls LeftPanel.navigateToResourceDetails', async () => {
            const leftPanel = editorComponent.shadowRoot.querySelector(selectors.LEFT_PANEL);
            expect(leftPanel).not.toBeNull();
            const toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);
            const leftPanelToggle = toolbar.shadowRoot.querySelector('.test-toolbar-left-panel-toggle');
            leftPanelToggle.click();
            await ticks(2);
            expect(leftPanel.classList).toContain('left-panel-show');
            expect(leftPanel.classList).not.toContain('left-panel-hide');
            const spy = jest.spyOn(leftPanel, 'navigateToResourceDetails');
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
            const incomingStubClickEvent = new IncomingGoToStubClickEvent('elementGuid');
            alcCanvasContainer.dispatchEvent(incomingStubClickEvent);
            expect(spy).toHaveBeenCalledWith('elementGuid', true);
        });
        describe('in left panel', () => {
            let leftPanel, toolbar, leftPanelToggle;
            beforeEach(async () => {
                leftPanel = editorComponent.shadowRoot.querySelector(selectors.LEFT_PANEL);
                expect(leftPanel).not.toBeNull();
                toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);
                leftPanelToggle = toolbar.shadowRoot.querySelector('.test-toolbar-left-panel-toggle');
            });
            it('is hidden by default', async () => {
                expect(leftPanel.classList).toContain('left-panel-hide');
                expect(leftPanel.classList).not.toContain('left-panel-show');
            });
            it('tabindex should be -1 when it is hidden', () => {
                expect(leftPanel.getAttribute('tabIndex')).toEqual('-1');
            });
            it('tabindex should be 0 when it is displayed', async () => {
                leftPanelToggle.click();
                await ticks(2);
                expect(leftPanel.getAttribute('tabIndex')).toEqual('0');
            });
            it('tabindex should be -1 after clicking left panel toggle and then clicking close button', async () => {
                leftPanelToggle.click();
                const closeButton = leftPanel.shadowRoot.querySelector('.close-button');
                closeButton.click();
                await ticks(2);
                expect(leftPanel.getAttribute('tabIndex')).toEqual('-1');
            });
            it('should be present after clicking left panel toggle', async () => {
                leftPanelToggle.click();
                await ticks(2);
                expect(leftPanel.classList).toContain('left-panel-show');
                expect(leftPanel.classList).not.toContain('left-panel-hide');
            });
            it('should be hidden after clicking left panel toggle and then clicking close button', async () => {
                leftPanelToggle.click();
                const closeButton = leftPanel.shadowRoot.querySelector('.close-button');
                closeButton.click();
                await ticks(2);
                expect(leftPanel.classList).toContain('left-panel-hide');
                expect(leftPanel.classList).not.toContain('left-panel-show');
            });
        });
        describe('in right panel', () => {
            let rightPanel;
            beforeEach(async () => {
                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                expect(rightPanel).not.toBeNull();
            });
            it('closes the property editor when alcCanvas fire close property editor event', async () => {
                const event = new ClosePropertyEditorEvent();
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
                alcCanvasContainer.dispatchEvent(event);

                await ticks(1);
                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                expect(rightPanel).toBeNull();
            });

            it('closes the property editor on when toolbar fires toggle selection mode event', async () => {
                const event = new UpdateAutolayoutCanvasModeEvent(AutoLayoutCanvasMode.SELECTION);
                const toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);
                toolbar.dispatchEvent(event);

                await ticks(1);
                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                expect(rightPanel).toBeNull();
            });

            it('closes and reopens the property editor when another element is clicked', async () => {
                // TODO: Right now the property editor closing and opening seems to happen in one tick,
                // and thus the close never actually happens
                // Need to refactor the test to make sure the property editor panel closes before
                // it opens for new element when the following story is being implemented
                // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000078hChIAI/view
                const event = new SelectNodeEvent(Decision2.guid, undefined, false);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
                alcCanvasContainer.dispatchEvent(event);
                await ticks(1);

                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                const propertyEditorPanel = rightPanel.querySelector(selectors.PROPERTY_EDITOR_PANEL);
                expect(propertyEditorPanel.element.guid).toEqual(Decision2.guid);
            });

            it('should not close the property editor when currently selected element is clicked', async () => {
                const event = new SelectNodeEvent(Decision1.guid, undefined, true);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
                alcCanvasContainer.dispatchEvent(event);
                await ticks(1);

                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                const propertyEditorPanel = rightPanel.querySelector(selectors.PROPERTY_EDITOR_PANEL);
                expect(propertyEditorPanel.element.guid).toEqual(Decision1.guid);
            });
            it('should call focusOnNode on return focus event', async () => {
                const mockFocus = jest.fn();
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(
                    'builder_platform_interaction-alc-canvas-container'
                );
                alcCanvasContainer.focusOnNode = mockFocus;

                rightPanel = editorComponent.shadowRoot.querySelector(selectors.RIGHT);
                const propertyEditorPanel = rightPanel.querySelector(selectors.PROPERTY_EDITOR_PANEL);
                const returnFocusOnElement = new CustomEvent('returnfocus', { detail: { elementGuid: 'elementGuid' } });
                propertyEditorPanel.dispatchEvent(returnFocusOnElement);

                await ticks(1);
                expect(mockFocus).toHaveBeenCalledWith('elementGuid');
            });
        });

        describe('auto-layout post notifications', () => {
            beforeAll(() => {
                Store.setMockState({
                    ...recordTriggeredFlowUIModel,
                    properties: { ...recordTriggeredFlowUIModel.properties, isAutoLayoutCanvas: true }
                });
            });
            afterAll(() => {
                Store.resetStore();
            });

            it('fires a show toast event when copying a single element', async () => {
                const editorComponent = await createComponentUnderTest();
                const copySingleElementEvent = new CopySingleElementEvent(assign.guid);

                await ticks(1);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

                // Mock handler for toast event
                const handler = jest.fn();
                // Add event listener to catch toast event
                editorComponent.addEventListener(ShowToastEventName, handler);
                await alcCanvasContainer.dispatchEvent(copySingleElementEvent);

                // Check if toast event has been fired
                await ticks(1);
                expect(handler).toHaveBeenCalledTimes(1);
                expect(handler.mock.calls[0][0].detail.mode).toBe('pester');
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });

            it('fires a show toast event when cutting a single element', async () => {
                const editorComponent = await createComponentUnderTest();
                const cutElementsEvent = new CutElementsEvent([assign.guid]);

                await ticks(1);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

                // Mock handler for toast event
                const handler = jest.fn();
                // Add event listener to catch toast event
                editorComponent.addEventListener(ShowToastEventName, handler);
                await alcCanvasContainer.dispatchEvent(cutElementsEvent);

                // Check if toast event has been fired
                await ticks(1);
                expect(handler).toHaveBeenCalledTimes(1);
                expect(handler.mock.calls[0][0].detail.mode).toBe('pester');
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });

            it('fires a show toast event when pasting a single element', async () => {
                const editorComponent = await createComponentUnderTest();
                const copySingleElementEvent = new CopySingleElementEvent(assign.guid);
                const pasteOnCanvasEvent = new PasteOnCanvasEvent();

                await ticks(1);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

                // Mock handler for toast event
                const handler = jest.fn();
                // Add event listener to catch toast events
                editorComponent.addEventListener(ShowToastEventName, handler);
                alcCanvasContainer.dispatchEvent(copySingleElementEvent);
                alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);

                // Check if toast event has been fired twice (copy and paste)
                await ticks(1);
                expect(handler).toHaveBeenCalledTimes(2);
                expect(handler.mock.calls[0][0].detail.mode).toBe('pester');
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });

            it('fires a show toast event when copying multiple elements', async () => {
                assign.config.isSelected = true;
                actionPostToChatter.config.isSelected = true;

                const editorComponent = await createComponentUnderTest();
                const alcSelectionEvent = new AlcSelectionEvent(
                    [assign.guid],
                    [],
                    [
                        actionPostToChatter.guid,
                        assign.guid,
                        decision.guid,
                        createAccountFromAnAccount.guid,
                        createAccountManualOutput.guid,
                        updateTriggeringRecord.guid
                    ],
                    actionPostToChatter.guid,
                    false
                );
                const copyOnCanvasEvent = new CopyOnCanvasEvent();

                await ticks(1);
                const toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

                // Mock handler for toast event
                const handler = jest.fn();
                // Add event listener to catch toast event
                editorComponent.addEventListener(ShowToastEventName, handler);

                alcCanvasContainer.dispatchEvent(alcSelectionEvent);
                toolbar.dispatchEvent(copyOnCanvasEvent);
                // Check if toast event has been fired once
                await ticks(1);
                expect(handler).toHaveBeenCalledTimes(1);
                expect(handler.mock.calls[0][0].detail.mode).toBe('pester');
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });

            it('fires a show toast event when pasting multiple elements', async () => {
                assign.config.isSelected = true;
                actionPostToChatter.config.isSelected = true;

                const editorComponent = await createComponentUnderTest();
                const alcSelectionEvent = new AlcSelectionEvent(
                    [assign.guid],
                    [],
                    [
                        actionPostToChatter.guid,
                        assign.guid,
                        decision.guid,
                        createAccountFromAnAccount.guid,
                        createAccountManualOutput.guid,
                        updateTriggeringRecord.guid
                    ],
                    actionPostToChatter.guid,
                    false
                );
                const copyOnCanvasEvent = new CopyOnCanvasEvent();
                const pasteOnCanvasEvent = new PasteOnCanvasEvent();

                const toolbar = editorComponent.shadowRoot.querySelector(selectors.TOOLBAR);
                const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

                // Mock handler for toast event
                const handler = jest.fn();
                // Add event listener to catch toast event
                editorComponent.addEventListener(ShowToastEventName, handler);

                alcCanvasContainer.dispatchEvent(alcSelectionEvent);
                toolbar.dispatchEvent(copyOnCanvasEvent);
                alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);
                // Check if toast event has been fired twice (once when copying, once when pasting)
                await ticks(1);
                expect(handler).toHaveBeenCalledTimes(2);
                expect(handler.mock.calls[0][0].detail.mode).toBe('pester');
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });
        });
    });
    describe('cut and paste', () => {
        beforeAll(() => {
            Store.setMockState(flowForCutPasteUIModel);
        });
        afterAll(() => {
            Store.resetStore();
        });
        it('of a simple element to the bottom of the flow', async () => {
            const expectedPasteAction = {
                payload: {
                    bottomCutOrCopiedGuid: assignment1.guid,
                    canvasElementGuidMap: { '2a06bca1-8acc-431f-a602-8440fd343af6': assignment1.guid },
                    childElementGuidMap: {},
                    childIndexToKeep: undefined,
                    cutOrCopiedCanvasElements: { '2a06bca1-8acc-431f-a602-8440fd343af6': assignment1 },
                    cutOrCopiedChildElements: {},
                    selectedElements: [assignment1],
                    source: { guid: assignment5.guid },
                    topCutOrCopiedGuid: assignment1.guid
                },
                type: 'PASTE_CUT_ELEMENT_ON_FIXED_CANVAS'
            };
            const editorComponent = await createComponentUnderTest();
            const cutElementsEvent = new CutElementsEvent([assignment1.guid]);
            const pasteOnCanvasEvent = new PasteOnCanvasEvent({ guid: assignment5.guid }, { isCutPaste: true });

            const spy = Store.getStore().dispatch;
            await ticks(1);
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

            // dispatching cut and then paste
            alcCanvasContainer.dispatchEvent(cutElementsEvent);
            await ticks(1);
            alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);

            // check that the correct paste action and payload were dispatched
            await ticks(1);
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(expectedPasteAction);
        });

        it('of a whole decision element', async () => {
            const expectedPasteAction = {
                payload: {
                    bottomCutOrCopiedGuid: decision1.guid,
                    canvasElementGuidMap: {
                        'cd26c02a-a6cf-4682-845b-a6de4e65bbdb': decision1.guid,
                        'bf9dd006-2532-45fb-b5a0-703b227ea2f1': assignment2.guid,
                        'cec5841b-465a-41d7-a918-7e40b788a017': decision2.guid,
                        'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc': assignment3.guid,
                        'f0d1ca98-ff56-452f-bb65-2f7f3891202d': assignment4.guid
                    },
                    childElementGuidMap: {
                        '1054e601-1a92-4b9e-90ef-b4b8b73d476f': X2.guid,
                        '2e677de1-8d08-4c47-b245-63f22a0dac17': X1.guid,
                        '32f64b96-4fd4-4644-887b-62ca9e04dba5': X2_0.guid,
                        '823b6e62-9de2-484a-82f1-c65298231591': X1_0.guid
                    },
                    childIndexToKeep: undefined,
                    cutOrCopiedCanvasElements: {
                        'cd26c02a-a6cf-4682-845b-a6de4e65bbdb': decision1,
                        'bf9dd006-2532-45fb-b5a0-703b227ea2f1': assignment2,
                        'cec5841b-465a-41d7-a918-7e40b788a017': decision2,
                        'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc': assignment3,
                        'f0d1ca98-ff56-452f-bb65-2f7f3891202d': assignment4
                    },
                    cutOrCopiedChildElements: {
                        '1054e601-1a92-4b9e-90ef-b4b8b73d476f': X2,
                        '2e677de1-8d08-4c47-b245-63f22a0dac17': X1,
                        '32f64b96-4fd4-4644-887b-62ca9e04dba5': X2_0,
                        '823b6e62-9de2-484a-82f1-c65298231591': X1_0
                    },
                    selectedElements: [decision1],
                    source: { guid: assignment5.guid },
                    topCutOrCopiedGuid: decision1.guid
                },
                type: 'PASTE_CUT_ELEMENT_ON_FIXED_CANVAS'
            };
            const editorComponent = await createComponentUnderTest();
            const cutElementsEvent = new CutElementsEvent([
                decision1.guid,
                decision2.guid,
                assignment2.guid,
                end1.guid,
                assignment3.guid,
                assignment4.guid
            ]);
            const pasteOnCanvasEvent = new PasteOnCanvasEvent({ guid: assignment5.guid }, { isCutPaste: true });

            const spy = Store.getStore().dispatch;
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

            // dispatching cut and then paste
            alcCanvasContainer.dispatchEvent(cutElementsEvent);
            await ticks(1);
            alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);

            // check that the correct paste action and payload were dispatched
            await ticks(1);
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(expectedPasteAction);
        });
        it('of a decision element while keeping a branch', async () => {
            const expectedPasteAction = {
                payload: {
                    bottomCutOrCopiedGuid: decision1.guid,
                    canvasElementGuidMap: {
                        'cd26c02a-a6cf-4682-845b-a6de4e65bbdb': decision1.guid,
                        'f0d1ca98-ff56-452f-bb65-2f7f3891202d': assignment4.guid
                    },
                    childElementGuidMap: {
                        '1054e601-1a92-4b9e-90ef-b4b8b73d476f': X2.guid,
                        '2e677de1-8d08-4c47-b245-63f22a0dac17': X1.guid
                    },
                    childIndexToKeep: 0,
                    cutOrCopiedCanvasElements: {
                        'cd26c02a-a6cf-4682-845b-a6de4e65bbdb': decision1,
                        'f0d1ca98-ff56-452f-bb65-2f7f3891202d': assignment4
                    },
                    cutOrCopiedChildElements: {
                        '1054e601-1a92-4b9e-90ef-b4b8b73d476f': X2,
                        '2e677de1-8d08-4c47-b245-63f22a0dac17': X1
                    },
                    selectedElements: [decision1],
                    source: { guid: assignment5.guid },
                    topCutOrCopiedGuid: decision1.guid
                },
                type: 'PASTE_CUT_ELEMENT_ON_FIXED_CANVAS'
            };
            const editorComponent = await createComponentUnderTest();
            const cutElementsEvent = new CutElementsEvent([decision1.guid, assignment4.guid]);
            const pasteOnCanvasEvent = new PasteOnCanvasEvent(
                { guid: assignment5.guid },
                { childIndexToKeep: 0, isCutPaste: true }
            );

            const spy = Store.getStore().dispatch;
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

            // dispatching cut and then paste
            alcCanvasContainer.dispatchEvent(cutElementsEvent);
            await ticks(1);
            alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);

            // check that the correct paste action and payload were dispatched
            await ticks(1);
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(expectedPasteAction);
        });
        it('of a decision element while keeping a terminated branch', async () => {
            const expectedPasteAction = {
                payload: {
                    bottomCutOrCopiedGuid: assignment3.guid,
                    canvasElementGuidMap: {
                        'cec5841b-465a-41d7-a918-7e40b788a017': decision2.guid,
                        'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc': assignment3.guid
                    },
                    childElementGuidMap: {
                        '32f64b96-4fd4-4644-887b-62ca9e04dba5': X2_0.guid,
                        '823b6e62-9de2-484a-82f1-c65298231591': X1_0.guid
                    },
                    childIndexToKeep: 0,
                    cutOrCopiedCanvasElements: {
                        'cec5841b-465a-41d7-a918-7e40b788a017': decision2,
                        'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc': assignment3
                    },
                    cutOrCopiedChildElements: {
                        '32f64b96-4fd4-4644-887b-62ca9e04dba5': X2_0,
                        '823b6e62-9de2-484a-82f1-c65298231591': X1_0
                    },
                    selectedElements: [decision2],
                    source: { guid: assignment5.guid },
                    topCutOrCopiedGuid: decision2.guid
                },
                type: 'PASTE_CUT_ELEMENT_ON_FIXED_CANVAS'
            };
            const editorComponent = await createComponentUnderTest();
            const cutElementsEvent = new CutElementsEvent([decision2.guid, assignment3.guid]);
            const pasteOnCanvasEvent = new PasteOnCanvasEvent(
                { guid: assignment5.guid },
                { childIndexToKeep: 0, isCutPaste: true }
            );

            const spy = Store.getStore().dispatch;
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);

            // dispatching cut and then paste
            alcCanvasContainer.dispatchEvent(cutElementsEvent);
            await ticks(1);
            alcCanvasContainer.dispatchEvent(pasteOnCanvasEvent);

            // check that the correct paste action and payload were dispatched
            await ticks(1);
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(expectedPasteAction);
        });
    });
});
