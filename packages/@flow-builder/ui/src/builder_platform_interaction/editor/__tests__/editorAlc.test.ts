// @ts-nocheck
import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import {
    AlcSelectionEvent,
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
                expect(handler.mock.calls[0][0].detail.variant).toBe('success');
            });
        });
    });
});
