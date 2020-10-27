// @ts-nocheck
import { createElement } from 'lwc';
import SteppedStageItemEditor from '../steppedStageItemEditor';
import { steppedStageItemReducer } from '../steppedStageItemReducer';
import {
    ComboboxStateChangedEvent,
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction/events';
import { mockSubflows } from 'mock/calloutData';
import { Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getOtherItemsInSteppedStage } from 'builder_platform_interaction/elementFactory';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

jest.mock('../steppedStageItemReducer', () => {
    return {
        steppedStageItemReducer: jest.fn()
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockSubflowsPromise = Promise.resolve(mockSubflows);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn(() => {
            return mockSubflowsPromise;
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
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector'
};

describe('SteppedStageItemEditor', () => {
    const nodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryCriteria: []
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
                entryCriteria: [{ leftHandSide: { value: 'nonexistentItem' } }]
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

    describe('subflows', () => {
        it('fetched on connectedCallback', () => {
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
                flowProcessType: editor.processType
            });
        });

        it('list set from available subflows', () => {
            const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
            expect(actionSelector.invocableActions).toEqual(mockSubflows);
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

                expect(steppedStageItemReducer).not.toHaveBeenCalled();
            });
        });

        it('handleEntryCriteriaItemChanged updates entry criteria', () => {
            const params = {
                guid: 'someGuid',
                name: 'someName',
                label: 'someLabel',
                description: 'someDescription',
                entryCriteria: [{ leftHandSide: { value: 'nonexistentItem' } }]
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
    });
});
