// @ts-nocheck
import { createElement } from 'lwc';
import StageStepEditor from '../stageStepEditor';
import { stageStepReducer } from '../stageStepReducer';
import {
    ComboboxStateChangedEvent,
    DeleteConditionEvent,
    ItemSelectedEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateNodeEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { mockActions } from 'mock/calloutData';
import { Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getOtherItemsInOrchestratedStage } from 'builder_platform_interaction/elementFactory';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';

jest.mock('../stageStepReducer', () => {
    return {
        stageStepReducer: jest.fn((item) => {
            return item;
        })
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockActionsPromise = Promise.resolve(mockActions);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn(() => {
            return mockActionsPromise;
        })
    };
});

const mockInputParameters = [
    { name: { value: 'ip1' }, value: { value: 'ip1Value' }, rowIndex: 'ip1Guid' },
    { name: { value: 'appProcessInstanceId' }, rowIndex: 'appProcessInstanceIdGuid' },
    { name: { value: 'appProcessStepInstanceId' }, rowIndex: 'appProcessStepInstanceIdGuid' },
    { name: { value: 'actionInput__recordId' }, rowIndex: 'actionInput__recordIdGuid' },
    {
        name: { value: 'actionInput__stepDescription' },
        value: { value: 'step description' },
        rowIndex: 'actionInput__stepDescriptionGuid'
    },
    {
        name: { value: 'actionInput__stepLabel' },
        value: { value: 'step_label' },
        rowIndex: 'actionInput__stepLabelGuid'
    }
];
const mockActionDetails = {
    parameters: mockInputParameters
};

const mockActionsDetailsPromise = Promise.resolve(mockActionDetails);

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        fetchDetailsForInvocableAction: jest.fn(() => {
            return mockActionsDetailsPromise;
        })
    };
});
jest.mock('builder_platform_interaction/elementFactory', () => {
    const elementFactory = Object.assign({}, jest.requireActual('builder_platform_interaction/elementFactory'));

    elementFactory.getOtherItemsInOrchestratedStage = jest.fn(() => {
        return [
            {
                label: 'otherItem',
                name: 'otherItemName',
                guid: 'otherItemName'
            }
        ];
    });

    return elementFactory;
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-stepped-stage-item-editor', {
        is: StageStepEditor
    });
    el.node = node;
    el.processType = 'someProcessType';
    document.body.appendChild(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    ENTRY_CRITERIA_RADIO: 'lightning-radio-group',
    ENTRY_CRITERIA_ITEM: 'builder_platform_interaction-combobox',
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
    ACTOR_SELECTOR: 'builder_platform_interaction-ferov-resource-picker'
};

describe('StageStepEditor', () => {
    const nodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryConditions: [],
        action: {
            actionName: {
                value: 'someActionName'
            },
            actionType: {
                value: 'someActionType'
            }
        },
        actor: { value: 'orchestrator@salesforce.com' },
        inputParameters: mockInputParameters
    };

    let editor;

    beforeAll(() => {
        Store.setMockState({
            properties: {},
            elements: {}
        });
    });

    beforeEach(() => {
        editor = createComponentUnderTest(nodeParams);
    });

    describe('node', () => {
        it('sets selectedEntryCriteria by default', () => {
            const entryConditionsRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);
            expect(entryConditionsRadio.value).toEqual('on_stage_start');
        });

        it('Label Description Component', () => {
            const labelDescription = editor.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION);
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label).toBe(nodeParams.label);
            expect(labelDescription.devName).toBe(nodeParams.name);
            expect(labelDescription.description).toBe(nodeParams.description);
        });

        it('initializes the entry criteria item combobox menu data', () => {
            editor = createComponentUnderTest({
                name: 'someName',
                label: 'someLabel',
                description: 'someDescription',
                entryConditions: [{ leftHandSide: { value: 'nonexistentItem' } }],
                inputParameters: []
            });

            const entryConditionsItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryConditionsItem.menuData[0].type).toEqual('option-card');
            expect(entryConditionsItem.menuData[0].dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
            expect(entryConditionsItem.menuData[0].text).toEqual(getOtherItemsInOrchestratedStage()[0].label);
            expect(entryConditionsItem.menuData[0].displayText).toEqual(getOtherItemsInOrchestratedStage()[0].label);
            expect(entryConditionsItem.menuData[0].value).toEqual(getOtherItemsInOrchestratedStage()[0].name);

            expect(entryConditionsItem.value).toEqual('');
        });

        it('sets entry criteria item selected', () => {
            editor = createComponentUnderTest({
                name: 'someName',
                label: 'someLabel',
                description: 'someDescription',
                entryConditions: [{ leftHandSide: { value: 'otherItemName' } }]
            });

            const entryConditionsItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryConditionsItem.value).toEqual(entryConditionsItem.menuData[0]);
        });
    });

    describe('input parameters', () => {
        it('are retrieved via fetchDetailsForInvocableAction', () => {
            expect(fetchDetailsForInvocableAction).toHaveBeenCalledWith({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: nodeParams.action.actionType.value,
                actionName: nodeParams.action.actionName.value,
                inputParameters: [],
                outputParameters: []
            });

            expect(stageStepReducer).toHaveBeenCalledWith(
                nodeParams,
                new CustomEvent(MERGE_WITH_PARAMETERS, {
                    detail: {
                        parameters: mockInputParameters
                    }
                })
            );
        });

        describe('list config', () => {
            it('filters out app process internal input variables', () => {
                const parameterList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);
                expect(parameterList.inputs).toHaveLength(1);
                expect(parameterList.inputs[0]).toEqual(nodeParams.inputParameters[0]);
            });
        });
    });

    describe('actions', () => {
        it('fetched on connectedCallback', () => {
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
                flowProcessType: editor.processType
            });
        });

        it('list set from available actions', () => {
            const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
            expect(actionSelector.invocableActions).toEqual(mockActions);
        });
    });

    describe('event handlers', () => {
        it('handles the property changed event and updates', async () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            const labelDescription = editor.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION);
            labelDescription.dispatchEvent(event);

            expect(stageStepReducer.mock.calls[0][0]).toEqual(nodeParams);
        });

        describe('handleStepStartChanged', () => {
            it('deletes entry criteria item if changing to ON_STAGE_START', () => {
                const entryConditionsRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);

                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_stage_start'
                    }
                });

                entryConditionsRadio.dispatchEvent(event);

                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new DeleteConditionEvent(nodeParams.guid, 0));
            });

            it('does not deletes entry criteria item if changing to ON_STEP_COMPLETE', () => {
                const entryConditionsRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);

                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_step_complete'
                    }
                });

                entryConditionsRadio.dispatchEvent(event);

                expect(stageStepReducer).not.toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteConditionEvent(nodeParams.guid, 0)
                );
            });
        });

        it('handleEntryCriteriaItemChanged updates entry criteria', () => {
            const params = {
                guid: 'someGuid',
                name: 'someName',
                label: 'someLabel',
                description: 'someDescription',
                entryConditions: [{ leftHandSide: { value: 'nonexistentItem' } }],
                inputParameters: []
            };

            editor = createComponentUnderTest(params);

            const devName = 'someOtherItem';

            const itemCombobox = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            const comboboxEvent = new ComboboxStateChangedEvent({ value: devName });
            itemCombobox.dispatchEvent(comboboxEvent);

            const event = new UpdateConditionEvent(params.guid, 0, {
                leftValueReference: devName,
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'Completed'
                }
            });

            expect(stageStepReducer).toHaveBeenCalledWith(params, event);
        });

        describe('handleParameterPropertyChangedEvent', () => {
            it('updates input parameter on change', () => {
                const paramList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);

                const updateEvent = new UpdateParameterItemEvent(
                    true,
                    mockInputParameters[0].rowIndex,
                    'someName',
                    'someNewValue'
                );
                paramList.dispatchEvent(updateEvent);

                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, updateEvent);
            });

            it('does not update input parameter if value is the same', () => {
                const paramList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);

                const updateEvent = new UpdateParameterItemEvent(
                    true,
                    mockInputParameters[0].rowIndex,
                    'someName',
                    mockInputParameters[0].value.value
                );
                paramList.dispatchEvent(updateEvent);

                expect(stageStepReducer).not.toHaveBeenCalledWith(nodeParams, updateEvent);
            });
        });

        describe('actor selection', () => {
            it('sets combobox config correctly', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                expect(actorSelector).toBeDefined();
                expect(actorSelector.propertyEditorElementType).toBe('STAGE_STEP');
                expect(actorSelector.elementParam).toEqual({ collection: false, dataType: 'String' });
                expect(actorSelector.comboboxConfig).toEqual({
                    allowSObjectFields: true,
                    disabled: false,
                    enableFieldDrilldown: true,
                    errorMessage: undefined,
                    fieldLevelHelp: undefined,
                    label: 'FlowBuilderStageStepEditor.actorSelectorLabel',
                    literalsAllowed: true,
                    placeholder: 'FlowBuilderStageStepEditor.actorSelectorPlaceholder',
                    required: true,
                    type: 'String',
                    variant: 'standard'
                });
                expect(actorSelector.rules).toEqual([]);
                expect(actorSelector.errorMessage).toBe(undefined);
                expect(actorSelector.value).toBe('orchestrator@salesforce.com');
            });

            it('node should be updated on combobox state changed', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                const comboboxEvent = new ComboboxStateChangedEvent(null, '{!$User.username}', 'Some error', false);
                actorSelector.dispatchEvent(comboboxEvent);
                const updateNodeEvent = new UpdateNodeEvent(nodeParams);
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, updateNodeEvent);
            });

            it('node should be updated on item selected', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                const itemSelectedEvent = new ItemSelectedEvent({
                    displayText: '{!$User.username}',
                    error: 'Some error'
                });
                actorSelector.dispatchEvent(itemSelectedEvent);
                const updateNodeEvent = new UpdateNodeEvent(nodeParams);
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, updateNodeEvent);
            });
        });
    });
});
