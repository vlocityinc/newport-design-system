// @ts-nocheck
import { createElement } from 'lwc';
import SteppedStageItemEditor from '../steppedStageItemEditor';
import { steppedStageItemReducer } from '../steppedStageItemReducer';
import {
    ComboboxStateChangedEvent,
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { mockActions } from 'mock/calloutData';
import { Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getOtherItemsInSteppedStage } from 'builder_platform_interaction/elementFactory';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';

jest.mock('../steppedStageItemReducer', () => {
    return {
        steppedStageItemReducer: jest.fn((item) => {
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
    { name: { value: 'appProcessStepInstanceId' }, rowIndex: 'appProcessStepInstanceIdGuid' }
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

    elementFactory.getOtherItemsInSteppedStage = jest.fn(() => {
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
        is: SteppedStageItemEditor
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
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list'
};

describe('SteppedStageItemEditor', () => {
    const nodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryCriteria: [],
        action: {
            actionName: {
                value: 'someActionName'
            },
            actionType: {
                value: 'someActionType'
            }
        },
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
            const entryCriteriaRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);
            expect(entryCriteriaRadio.value).toEqual('on_stage_start');
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
                entryCriteria: [{ leftHandSide: { value: 'nonexistentItem' } }],
                inputParameters: []
            });

            const entryCriteriaItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryCriteriaItem.menuData[0].type).toEqual('option-card');
            expect(entryCriteriaItem.menuData[0].dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
            expect(entryCriteriaItem.menuData[0].text).toEqual(getOtherItemsInSteppedStage()[0].label);
            expect(entryCriteriaItem.menuData[0].displayText).toEqual(getOtherItemsInSteppedStage()[0].label);
            expect(entryCriteriaItem.menuData[0].value).toEqual(getOtherItemsInSteppedStage()[0].name);

            expect(entryCriteriaItem.value).toEqual('');
        });

        it('sets entry criteria item selected', () => {
            editor = createComponentUnderTest({
                name: 'someName',
                label: 'someLabel',
                description: 'someDescription',
                entryCriteria: [{ leftHandSide: { value: 'otherItemName' } }]
            });

            const entryCriteriaItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryCriteriaItem.value).toEqual(entryCriteriaItem.menuData[0]);
        });
    });

    describe('input parameters', () => {
        it('are retrieved via fetchDetailsForInvocableAction', () => {
            expect(fetchDetailsForInvocableAction).toHaveBeenCalledWith({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: nodeParams.action.actionType.value,
                actionName: nodeParams.action.actionName.value
            });

            expect(steppedStageItemReducer).toHaveBeenCalledWith(
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

            expect(steppedStageItemReducer.mock.calls[0][0]).toEqual(nodeParams);
        });

        describe('handleStepStartChanged', () => {
            it('deletes entry criteria item if changing to ON_STAGE_START', () => {
                const entryCriteriaRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);

                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_stage_start'
                    }
                });

                entryCriteriaRadio.dispatchEvent(event);

                expect(steppedStageItemReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteConditionEvent(nodeParams.guid, 0)
                );
            });

            it('does not deletes entry criteria item if changing to ON_STEP_COMPLETE', () => {
                const entryCriteriaRadio = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_RADIO);

                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_step_complete'
                    }
                });

                entryCriteriaRadio.dispatchEvent(event);

                expect(steppedStageItemReducer).not.toHaveBeenCalledWith(
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
                entryCriteria: [{ leftHandSide: { value: 'nonexistentItem' } }],
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

            expect(steppedStageItemReducer).toHaveBeenCalledWith(params, event);
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

                expect(steppedStageItemReducer).toHaveBeenCalledWith(nodeParams, updateEvent);
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

                expect(steppedStageItemReducer).not.toHaveBeenCalledWith(nodeParams, updateEvent);
            });
        });
    });
});
