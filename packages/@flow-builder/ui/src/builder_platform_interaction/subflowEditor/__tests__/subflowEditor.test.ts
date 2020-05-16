// @ts-nocheck
import { createElement } from 'lwc';
import SubflowEditor from '../subflowEditor';
import { mockSubflows } from 'mock/calloutData';
import { mockSubflowVariables } from 'mock/calloutData';
import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent,
    UpdateNodeEvent,
    PropertyChangedEvent,
    UseAdvancedOptionsSelectionChangedEvent,
    UpdateParameterItemEvent,
    DeleteParameterItemEvent
} from 'builder_platform_interaction/events';
import { untilNoFailure, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const createComponentUnderTest = (node, { isNewMode = false } = {}) => {
    const el = createElement('builder_platform_interaction-subflow-editor', {
        is: SubflowEditor
    });
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

let mockSubflowVariablesPromise = Promise.resolve(mockSubflowVariables);
let mockSubflowsPromise = Promise.resolve(mockSubflows);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_SUBFLOWS:
                    return mockSubflowsPromise;
                case SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES:
                    return mockSubflowVariablesPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

jest.mock('builder_platform_interaction/subflowsLib', () => {
    return {
        fetchFlowInputOutputVariables: jest.fn().mockImplementation(() => mockSubflowVariablesPromise)
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function() {
        return {
            properties: {
                processType: 'flow',
                definitionId: '300xx000000bpCbAAI'
            },
            elements: {}
        };
    };
    const getStore = function() {
        return {
            getCurrentState
        };
    };

    const storeLib = require('builder_platform_interaction_mocks/storeLib');

    return Object.assign({}, storeLib, {
        Store: {
            getStore
        }
    });
});

const subflowNode = {
    guid: '024b2345-97d2-4e67-952b-6cd326a54570',
    name: {
        value: 'subflowCall2',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: 'subflowCall2',
        error: null
    },
    locationX: 561,
    locationY: 190,
    isCanvasElement: true,
    connectorCount: 1,
    config: {
        isSelected: true
    },
    flowName: {
        value: 'mynamespace__subflow',
        error: null
    },
    inputAssignments: [
        {
            rowIndex: 'fb1782fd-1434-41dc-89ff-675f209be855',
            name: {
                value: 'inputNumberVariable',
                error: null
            },
            value: {
                value: '3',
                error: null
            },
            valueDataType: 'Number'
        }
    ],
    outputAssignments: [
        {
            rowIndex: '84499160-72eb-4c03-baa7-ee5641f80477',
            name: {
                value: 'outputNumberVariable',
                error: null
            },
            value: {
                value: '4e1bdeca-511b-4741-80cb-65ce67aa8a59',
                error: null
            },
            valueDataType: 'reference'
        }
    ],
    availableConnections: [],
    maxConnections: 1,
    elementType: ELEMENT_TYPE.SUBFLOW
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor'
};

const getBaseCalloutEditor = subflowEditor => {
    return subflowEditor.shadowRoot.querySelector(selectors.baseCalloutEditor);
};

describe('subflow-editor', () => {
    let subflowEditor;
    afterEach(() => {
        mockSubflowsPromise = Promise.resolve(mockSubflows);
        mockSubflowVariablesPromise = Promise.resolve(mockSubflowVariables);
    });
    it('should display a subtitle including the subflow label', async () => {
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        await mockSubflowsPromise;
        await mockSubflowVariablesPromise;
        const baseCalloutEditor = getBaseCalloutEditor(subflowEditor);
        expect(baseCalloutEditor.subtitle).toBe('FlowBuilderSubflowEditor.subtitle(my subflow)');
    });
    it('should display a subtitle using unique name if we cannot get the subflow label', async () => {
        mockSubflowsPromise = Promise.reject();
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        await mockSubflowsPromise.catch(() => {
            const baseCalloutEditor = getBaseCalloutEditor(subflowEditor);
            expect(baseCalloutEditor.subtitle).toBe('FlowBuilderSubflowEditor.subtitle(mynamespace__subflow)');
        });
    });
    it('property changed event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        subflowEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new PropertyChangedEvent('description', 'new desc', null);
        getBaseCalloutEditor(subflowEditor).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: subflowEditor.getNode() }
            })
        );
    });
    it('update parameter event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        subflowEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new UpdateParameterItemEvent(
            true,
            'fb1782fd-1434-41dc-89ff-675f209be855',
            'inputNumberVariable',
            '5',
            'Number',
            null
        );
        getBaseCalloutEditor(subflowEditor).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: subflowEditor.getNode() }
            })
        );
    });
    it('delete parameter event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        subflowEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);

        const event = new DeleteParameterItemEvent(true, 'fb1782fd-1434-41dc-89ff-675f209be855', 'inputNumberVariable');
        getBaseCalloutEditor(subflowEditor).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: subflowEditor.getNode() }
            })
        );
    });
    it('use advanced options selection change event dispatches an UpdateNodeEvent', async () => {
        expect.assertions(1);
        subflowEditor = createComponentUnderTest(subflowNode, {
            isNewMode: false
        });
        const updateNodeCallback = jest.fn();
        subflowEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

        await ticks(1);
        const event = new UseAdvancedOptionsSelectionChangedEvent(true);
        getBaseCalloutEditor(subflowEditor).dispatchEvent(event);
        expect(updateNodeCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: { node: subflowEditor.getNode() }
            })
        );
    });
    describe('Edit existing subflow', () => {
        it('should dispatch a ClosePropertyEditorEvent if we cannot get the input/output variables', async () => {
            mockSubflowVariablesPromise = Promise.reject();
            subflowEditor = createComponentUnderTest(subflowNode, {
                isNewMode: false
            });
            const eventCallback = jest.fn();
            document.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
            await mockSubflowsPromise;
            await mockSubflowVariablesPromise.catch(() => {
                document.removeEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
                expect(eventCallback).toHaveBeenCalled();
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the flow label', async () => {
            const eventCallback = jest.fn();
            document.addEventListener(SetPropertyEditorTitleEvent.EVENT_NAME, eventCallback);
            subflowEditor = createComponentUnderTest(subflowNode, {
                isNewMode: false
            });
            await untilNoFailure(() => {
                expect(eventCallback).toHaveBeenCalledTimes(2);
                expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                    'FlowBuilderSubflowEditor.editPropertyEditorTitle(mynamespace__subflow)'
                );
                expect(eventCallback.mock.calls[1][0].detail.title).toBe(
                    'FlowBuilderSubflowEditor.editPropertyEditorTitle(my subflow)'
                );
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the flow unique name if we cannot get the flow label', async () => {
            mockSubflowsPromise = Promise.reject();
            const eventCallback = jest.fn();
            document.addEventListener(SetPropertyEditorTitleEvent.EVENT_NAME, eventCallback);
            subflowEditor = createComponentUnderTest(subflowNode, {
                isNewMode: false
            });
            await ticks(10);
            expect(eventCallback).toHaveBeenCalledTimes(1);
            expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                'FlowBuilderSubflowEditor.editPropertyEditorTitle(mynamespace__subflow)'
            );
        });
    });
    describe('New subflow node', () => {
        it('should dispatch a CannotRetrieveCalloutParametersEvent if we cannot get the input/output variables', async () => {
            mockSubflowVariablesPromise = Promise.reject();
            subflowEditor = createComponentUnderTest(subflowNode, {
                isNewMode: true
            });
            const eventCallback = jest.fn();
            document.addEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
            await mockSubflowsPromise;
            await mockSubflowVariablesPromise.catch(() => {
                document.removeEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
});
