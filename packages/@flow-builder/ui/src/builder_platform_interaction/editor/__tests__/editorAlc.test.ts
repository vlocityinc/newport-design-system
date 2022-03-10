// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import {
    ClosePropertyEditorEvent,
    EditElementEvent,
    SelectNodeEvent,
    ToggleSelectionModeEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { Decision1, Decision2, orchestratorFlowUIModel } from 'mock/storeDataOrchestrator';
import Editor from '../editor';

jest.mock('builder_platform_interaction/alcCanvas', () => require('builder_platform_interaction_mocks/alcCanvas'));

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));
jest.mock('builder_platform_interaction/sharedUtils', () =>
    jest.requireActual('builder_platform_interaction_mocks/sharedUtils')
);

jest.mock('builder_platform_interaction/preloadLib', () => {
    return {
        loadAllSupportedFeatures: jest.fn(),
        loadFieldsForComplexTypesInFlow: jest.fn(),
        loadParametersForInvocableApexActionsInFlowFromMetadata: jest.fn(),
        loadOnStart: jest.fn().mockResolvedValue({}),
        loadOnProcessTypeChange: jest.fn().mockImplementation(() => {
            return {
                loadActionsPromise: Promise.resolve({}),
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

const createComponentUnderTest = (
    props = {
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
    }
) => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS
};

describe('auto-layout', () => {
    beforeAll(() => {
        Store.setMockState(orchestratorFlowUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('use auto layout canvas', () => {
        let editorComponent;
        beforeEach(async () => {
            editorComponent = createComponentUnderTest();
            const editElementEvent = new EditElementEvent(Decision1.guid);
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
            await alcCanvasContainer.dispatchEvent(editElementEvent);
            await Promise.resolve();
        });
        it('has the AlcCanvasContainer visible', () => {
            const alcCanvasContainer = editorComponent.shadowRoot.querySelector(selectors.ALC_BUILDER_CONTAINER);
            expect(alcCanvasContainer).not.toBeNull();
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
                const event = new ToggleSelectionModeEvent();
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
    });
});
