// @ts-nocheck
// eslint-disable-next-line lwc-core/no-interop-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { SaveFlowEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { invokeModalWithComponents } from 'builder_platform_interaction/sharedUtils';
import {
    getPropertyEditorConfig,
    hidePopover,
    invokeCreateEditFlowTestEditor,
    invokeDebugEditor,
    invokeFlowTestManager,
    invokeKeyboardHelpDialog,
    invokeNewFlowModal,
    invokePropertyEditor,
    isPopoverOpen,
    showHover,
    showPopover
} from '../builderUtils';
import { LABELS } from '../builderUtilsLabels';

const mockPackage = 'foo';
const mockComponent = 'bar';
const UI_CREATE_PANEL = 'ui:createPanel';

let mockCreateComponentCallbackStatus = 'SUCCESS';
let mockPanelValidity = true;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, sharedUtils, { invokeModalWithComponents: jest.fn() });
});

jest.mock('builder_platform_interaction/elementConfig', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementConfig');
    return Object.assign({}, actual, {
        getConfigForElementType: jest.fn((type) => {
            const config = actual.getConfigForElementType(type);
            config.descriptor = `${mockPackage}:${mockComponent}`;
            return config;
        }),
        getConfigForElement: jest.fn((element) => {
            const config = actual.getConfigForElement(element);
            config.descriptor = `${mockPackage}:${mockComponent}`;
            return config;
        })
    });
});

jest.mock('aura', () => {
    return {
        dispatchGlobalEvent: jest.fn().mockImplementation((name, attributes) => {
            attributes.onCreate({
                close: () => {},
                isValid: () => {
                    return mockPanelValidity;
                },
                get: () => {
                    return [
                        {
                            get: () => {},
                            set: () => {}
                        }
                    ];
                },
                set: () => {}
            });
        }),
        createComponent: jest.fn().mockImplementation(async (cmpName, attr, callback) => {
            const newComponent = {
                getElement: () => {}
            };
            callback([newComponent], mockCreateComponentCallbackStatus, null);
        }),
        renderComponent: jest.fn().mockImplementation(() => {})
    };
});

const EDIT_MODE = 'editelement',
    ADD_MODE = 'addelement';

const getAttributes = (mode) => ({
    mode,
    node: {
        guid: 'd9e45a91-1dae-4acc-a0a8-69e0b316abe2',
        name: {
            value: 'record delete',
            error: null
        },
        description: {
            value: 'not a very good description I know',
            error: null
        },
        label: {
            value: 'record_delete',
            error: null
        },
        locationX: 356,
        locationY: 130,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: true
        },
        inputReference: {
            value: '',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        filters: [
            {
                rowIndex: '81effde1-9e6f-4ff7-b879-bfd65538c509',
                leftHandSide: {
                    value: 'Account.BillingCity',
                    error: null
                },
                rightHandSide: {
                    value: 'CA',
                    error: null
                },
                rightHandSideDataType: {
                    value: 'String',
                    error: null
                },
                operator: {
                    value: 'EqualTo',
                    error: null
                }
            }
        ],
        maxConnections: 2,
        availableConnections: [
            {
                type: 'FAULT'
            }
        ],
        elementType: ELEMENT_TYPE.RECORD_DELETE,
        dataType: {
            value: 'Boolean',
            error: null
        }
    },
    nodeUpdate: jest.fn(),
    editResourceCallback: jest.fn()
});

describe('builderUtils', () => {
    describe('Property Editor Config', () => {
        describe('Editor mode (edit, add) correctly returned', () => {
            const modePropertyNestedPath = 'attr.bodyComponent.attr.mode';
            test('Edit mode', () => {
                const actualResult = getPropertyEditorConfig(EDIT_MODE, getAttributes(EDIT_MODE));
                expect(actualResult).toHaveProperty(modePropertyNestedPath, EDIT_MODE);
            });
            test('Edit mode w editResourceCallback', () => {
                const actualResult = getPropertyEditorConfig(EDIT_MODE, getAttributes(EDIT_MODE));
                expect(actualResult.attr).toHaveProperty('editResourceCallback');
            });
            test('Add mode', () => {
                const actualResult = getPropertyEditorConfig(ADD_MODE, getAttributes(ADD_MODE));
                expect(actualResult).toHaveProperty(modePropertyNestedPath, ADD_MODE);
            });
            it('sets className based on descriptor', () => {
                const params = getAttributes(ADD_MODE);
                const actualResult = getPropertyEditorConfig(ADD_MODE, params);
                expect(actualResult.attr.bodyComponent.className).toEqual(`${mockPackage}/${mockComponent}`);
            });
            test('if autoFocus is included in the attr object, it will be included in the panelConfig that results', () => {
                const attr = getAttributes(ADD_MODE);
                attr.autoFocus = false;
                const { panelConfig } = getPropertyEditorConfig(ADD_MODE, attr);
                expect(panelConfig).toHaveProperty('autoFocus', false);
            });
        });
    });

    describe('Popover', () => {
        it('showPopover', () => {
            expect(isPopoverOpen()).toBe(false);
            showPopover(
                'builder_platform_interaction:statusIconSummary',
                {},
                {
                    referenceElement: null,
                    onClose: () => {}
                }
            );
            expect(isPopoverOpen()).toBe(true);
        });
    });

    describe('invokePropertyEditor', () => {
        const sampleAttributes = getAttributes(SaveFlowEvent.Type.SAVE);
        it('throws error if attributes is not passed to the function', () => {
            expect(() => {
                invokePropertyEditor('cmpNameOnly');
            }).toThrow();
        });
        it('throws error if attributes does not contain mode', () => {
            expect(() => {
                const missingModeAttributes = Object.assign({}, sampleAttributes);
                delete missingModeAttributes.mode;
                invokePropertyEditor('cmpNameOnly', missingModeAttributes);
            }).toThrow();
        });
        it('throws error if attributes does not contain node', () => {
            expect(() => {
                const missingModeAttributes = Object.assign({}, sampleAttributes);
                delete missingModeAttributes.node;
                invokePropertyEditor('cmpNameOnly', missingModeAttributes);
            }).toThrow();
        });
        it('throws error if attributes does not contain nodeUpdate', () => {
            expect(() => {
                const missingModeAttributes = Object.assign({}, sampleAttributes);
                delete missingModeAttributes.nodeUpdate;
                invokePropertyEditor('cmpNameOnly', missingModeAttributes);
            }).toThrow();
        });
        it('does not throw an error if attributes is complete', () => {
            expect(() => {
                const missingModeAttributes = Object.assign({}, sampleAttributes);
                invokePropertyEditor('cmpNameOnly', missingModeAttributes);
            }).not.toThrow();
        });
    });

    describe('invokeDebugEditor', () => {
        const sampleDebugEditorAttributes = {
            flowDevName: 'flowDevNameStr',
            flowId: 'flowIdStr',
            processType: 'processType',
            triggerType: 'triggerType',
            rerun: 'rerun',
            isCreateOrUpdate: 'isCreateOrUpdate',
            dollarRecordName: 'dollarRecordName',
            scheduledPathsList: 'scheduledPathsList',
            showScheduledPathComboBox: 'showScheduledPathComboBox'
        };
        it('throws error if attributes does not contain flowId', () => {
            expect(() => {
                const missingFlowIdAttributes = Object.assign({}, sampleDebugEditorAttributes);
                delete missingFlowIdAttributes.flowId;
                invokeDebugEditor(missingFlowIdAttributes);
            }).toThrow();
        });
        it('does not call dispatchGlobalEvent if popover is not showing', async () => {
            createComponent.mockClear();
            showPopover(
                'builder_platform_interaction:statusIconSummary',
                {},
                {
                    referenceElement: null,
                    onClose: () => {}
                }
            );
            invokeDebugEditor(sampleDebugEditorAttributes);
            expect(dispatchGlobalEvent).not.toHaveBeenCalled();
        });
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters', async () => {
            hidePopover();
            invokeDebugEditor(sampleDebugEditorAttributes);
            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderDebugEditor.headerTitle'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalFooter',
                expect.objectContaining({
                    buttons: {
                        buttonOneClass: '.test-debug-modal-footer-run-button',
                        buttonTwoClass: '.test-debug-modal-footer-cancel-button',
                        buttonOne: {
                            buttonLabel: 'FlowBuilderToolbar.runTitle',
                            buttonVariant: 'brand'
                        },
                        buttonTwo: {
                            buttonLabel: 'FlowBuilderCommonPropertyEditor.cancelButton',
                            buttonVariant: 'neutral',
                            buttonCallback: expect.anything(),
                            closeCallback: false
                        }
                    }
                }),
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:debugEditor',
                {
                    dollarRecordName: 'dollarRecordName',
                    flowId: 'flowIdStr',
                    flowName: 'flowDevNameStr',
                    isCreateOrUpdate: 'isCreateOrUpdate',
                    processType: 'processType',
                    rerun: 'rerun',
                    scheduledPathsList: 'scheduledPathsList',
                    showScheduledPathComboBox: 'showScheduledPathComboBox',
                    triggerType: 'triggerType'
                },
                expect.anything()
            );
            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
    });

    describe('invokeKeyboardHelpDialog', () => {
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters', async () => {
            invokeKeyboardHelpDialog();
            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderKeyboardInteractionLabels.keyboardShortcutListTitle'
                },
                expect.anything()
            );

            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:keyboardShortcutsListBody',
                {},
                expect.anything()
            );

            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalFooter',
                {
                    buttons: {
                        buttonOne: {
                            buttonLabel: 'FlowBuilderAlertModal.okayButtonLabel',
                            buttonVariant: 'brand'
                        }
                    }
                },
                expect.anything()
            );

            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
    });

    describe('invokeCreateEditFlowTestEditor', () => {
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters for Create Test with Create Trigger', async () => {
            const sampleFlowTestAttributes = {
                createOrEdit: 'create test',
                triggerSaveType: 'Create'
            };
            invokeCreateEditFlowTestEditor(sampleFlowTestAttributes);
            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderCreateTestEditor.flowTestCreateHeader'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:flowTestFooter',
                expect.objectContaining({
                    flowTestButtons: {
                        flowTestButtonOne: {
                            buttonLabel: 'FlowBuilderCreateTestEditor.flowTestCreateButton',
                            buttonVariant: 'brand',
                            buttonCallback: expect.anything()
                        },
                        flowTestButtonTwo: {
                            buttonLabel: 'FlowBuilderCommonPropertyEditor.cancelButton',
                            buttonVariant: 'neutral',
                            buttonCallback: expect.anything(),
                            closeCallback: false
                        }
                    }
                }),
                expect.anything()
            );
            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters for Edit Test with Create Trigger', async () => {
            const sampleFlowTestAttributes = {
                createOrEdit: 'edit test',
                triggerSaveType: 'Create'
            };
            invokeCreateEditFlowTestEditor(sampleFlowTestAttributes);
            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderCreateTestEditor.flowTestEditHeader'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:flowTestFooter',
                expect.objectContaining({
                    flowTestButtons: {
                        flowTestButtonOne: {
                            buttonLabel: 'FlowBuilderCreateTestEditor.flowTestSaveButton',
                            buttonVariant: 'brand',
                            buttonCallback: expect.anything()
                        },
                        flowTestButtonTwo: {
                            buttonLabel: 'FlowBuilderCommonPropertyEditor.cancelButton',
                            buttonVariant: 'neutral',
                            buttonCallback: expect.anything(),
                            closeCallback: false
                        }
                    }
                }),
                expect.anything()
            );
            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
    });

    describe('invokeNewFlowModal', () => {
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters', async () => {
            await invokeNewFlowModal(
                ELEMENT_TYPE.SCREEN_FIELD,
                {
                    showRecommended: true,
                    showAll: true
                },
                jest.fn(),
                jest.fn()
            );

            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderNewFlowModal.headerTitle'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:newFlowModalBody',
                {
                    showRecommended: true,
                    showAll: true,
                    builderType: 'SCREEN_FIELD'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalFooter',
                {
                    buttons: {
                        buttonOne: {
                            buttonLabel: LABELS.createButtonLabel,
                            buttonVariant: 'brand'
                        }
                    }
                },
                expect.anything()
            );
            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
    });

    describe('showHover', () => {
        const sampleAttributes = getAttributes(SaveFlowEvent.Type.SAVE);
        const samplePanelConfig = {
            titleForModal: 'FlowBuilderElementConfig.variableSingularLabel',
            flavor: 'small',
            bodyClass: 'slds-p-around_medium',
            isValid: jest.fn()
        };
        it('calls dispatchGlobalEvent w/ expected parameters when given standard parameters', () => {
            showHover('cmpName', sampleAttributes, 'hoverId', samplePanelConfig);

            expect(dispatchGlobalEvent).toHaveBeenCalledWith(
                UI_CREATE_PANEL,
                expect.objectContaining({
                    onCreate: expect.anything(),
                    onDestroy: expect.anything(),
                    panelConfig: {
                        body: expect.anything(),
                        bodyClass: 'slds-p-around_medium',
                        flavor: 'small',
                        isValid: expect.anything(),
                        titleForModal: 'FlowBuilderElementConfig.variableSingularLabel'
                    },
                    panelType: 'hoverPanel',
                    visible: true
                })
            );
        });
        it('calls dispatchGlobalEvent w/ expected parameters when given standard parameters and panel.isValid = false', () => {
            mockPanelValidity = false;
            showHover('cmpName', sampleAttributes, 'hoverId', samplePanelConfig);
            expect(dispatchGlobalEvent).toHaveBeenCalledWith(
                UI_CREATE_PANEL,
                expect.objectContaining({
                    onCreate: expect.anything(),
                    onDestroy: expect.anything(),
                    panelConfig: {
                        body: expect.anything(),
                        bodyClass: 'slds-p-around_medium',
                        flavor: 'small',
                        isValid: expect.anything(),
                        titleForModal: 'FlowBuilderElementConfig.variableSingularLabel'
                    },
                    panelType: 'hoverPanel',
                    visible: true
                })
            );
            mockPanelValidity = true;
        });
        it('dispatchGlobalEvent to NOT called when createComponent callback status is not SUCCESS ', () => {
            mockCreateComponentCallbackStatus = 'NOTCOOL';
            showHover('cmpName', sampleAttributes, 'hoverId', samplePanelConfig);
            expect(dispatchGlobalEvent).not.toHaveBeenCalled();
            mockCreateComponentCallbackStatus = 'SUCCESS';
        });
    });

    describe('invokeFlowTestManager', () => {
        it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters', async () => {
            invokeFlowTestManager(jest.fn());

            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalHeader',
                {
                    headerTitle: 'FlowBuilderTestEditor.flowTestHeader'
                },
                expect.anything()
            );
            expect(createComponent).toHaveBeenCalledWith(
                'builder_platform_interaction:modalFooter',
                {
                    buttons: {
                        buttonOneClass: '.flow-test-modal-footer-run-button',
                        buttonTwoClass: '.flow-test-modal-footer-cancel-button',
                        buttonOne: {
                            buttonLabel: 'FlowBuilderTestEditor.flowTestRunTest',
                            buttonVariant: 'brand'
                        },
                        buttonTwo: {
                            buttonLabel: 'FlowBuilderTestEditor.flowTestCancel',
                            buttonVariant: 'neutral',
                            buttonCallback: hidePopover,
                            closeCallback: false
                        }
                    }
                },
                expect.anything()
            );
            expect(invokeModalWithComponents).toHaveBeenCalled();
        });
    });
});
