import contextRecordEditor from '../contextRecordEditor';
import { createElement } from 'lwc';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    RecordFilterTypeChangedEvent,
    ConfigurationEditorChangeEvent,
    UpdateNodeEvent
} from 'builder_platform_interaction/events';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import * as store from 'mock/storeData';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasBeforeSaveEnabled: jest.fn()
    });
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getChildrenItemsPromise: actual.getChildrenItemsPromise,
        filterMatches: actual.filterMatches
    };
});
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-context-record-editor', {
        is: contextRecordEditor
    });

    Object.assign(el, { node });

    document.body.appendChild(el);
    return el;
}

const getEntityResourcePicker = contextEditor => {
    return contextEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
};

const getRecordFilter = contextEditor => {
    return contextEditor.shadowRoot.querySelector(SELECTORS.RECORD_FILTER);
};

const getCustomPropertyEditor = contextEditor => {
    return contextEditor.shadowRoot.querySelector(SELECTORS.CUSTOM_PROPERTY_EDITOR);
};

const defaultValueItem = { item: { value: 'guid1', displayText: 'var 1' } };
const getComboboxStateChangedEvent = (detail = defaultValueItem) => {
    return new CustomEvent('comboboxstatechanged', {
        detail
    });
};

const filterElement = {
    leftHandSide: { value: 'Account.Id', error: null },
    operator: { value: 'EqualTo', error: null },
    rightHandSide: { value: '{!myFormula1}', error: null },
    rightHandSideDataType: { value: 'reference', error: null },
    rightHandSideGuid: { value: 'FORMULA_8', error: null }
};

describe('context-record-editor', () => {
    let scheduledNewStartElement,
        beforeSaveNewStartElement,
        scheduledNewStartElementWithFilters,
        scheduledNewStartElementWithoutFilters,
        scheduledJourneyStartElement;
    beforeEach(() => {
        scheduledNewStartElement = () => ({
            description: { value: '', error: null },
            elementType: 'START_ELEMENT',
            guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
            isCanvasElement: true,
            label: { value: '', error: null },
            name: { value: '', error: null },
            object: { value: 'Account', error: null },
            objectIndex: { value: 'guid', error: null },
            filterType: {},
            filters: [],
            frequency: { value: 'Once', error: null },
            startDate: undefined,
            startTime: undefined,
            triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED, error: null }
        });
        beforeSaveNewStartElement = () => ({
            description: { value: '', error: null },
            elementType: 'START_ELEMENT',
            guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
            isCanvasElement: true,
            label: { value: '', error: null },
            name: { value: '', error: null },
            object: { value: 'Account', error: null },
            objectIndex: { value: 'guid', error: null },
            filterType: {},
            filters: [],
            frequency: undefined,
            startDate: undefined,
            startTime: undefined,
            recordTriggerType: { value: 'Update', error: null },
            triggerType: { value: FLOW_TRIGGER_TYPE.BEFORE_SAVE, error: null }
        });
        scheduledNewStartElementWithFilters = () => ({
            description: { value: '', error: null },
            elementType: 'START_ELEMENT',
            guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
            isCanvasElement: true,
            label: { value: '', error: null },
            name: { value: '', error: null },
            object: { value: 'Account', error: null },
            objectIndex: { value: 'guid', error: null },
            filterType: RECORD_FILTER_CRITERIA.ALL,
            filters: [
                {
                    rowIndex: 'a0e8a02d-60fb-4481-8165-10a01fe7031c',
                    leftHandSide: {
                        value: '',
                        error: null
                    },
                    rightHandSide: {
                        value: '',
                        error: null
                    },
                    rightHandSideDataType: {
                        value: '',
                        error: null
                    },
                    operator: {
                        value: '',
                        error: null
                    }
                }
            ],
            frequency: { value: 'Once', error: null },
            startDate: undefined,
            startTime: undefined,
            triggerType: { value: 'Scheduled', error: null }
        });
        scheduledNewStartElementWithoutFilters = () => ({
            description: { value: '', error: null },
            elementType: 'START_ELEMENT',
            guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
            isCanvasElement: true,
            label: { value: '', error: null },
            name: { value: '', error: null },
            object: { value: 'Account', error: null },
            objectIndex: { value: 'guid', error: null },
            filterType: RECORD_FILTER_CRITERIA.NONE,
            filters: [],
            frequency: { value: 'Once', error: null },
            startDate: undefined,
            startTime: undefined,
            triggerType: { value: 'Scheduled', error: null }
        });
        scheduledJourneyStartElement = () => ({
            description: { value: '', error: null },
            elementType: 'START_ELEMENT',
            guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
            isCanvasElement: true,
            label: { value: '', error: null },
            name: { value: '', error: null },
            object: { value: 'Audience', error: null },
            objectIndex: { value: 'guid', error: null },
            filterType: RECORD_FILTER_CRITERIA.NONE,
            filters: [],
            frequency: { value: 'Once', error: null },
            startDate: undefined,
            startTime: undefined,
            triggerType: { value: 'ScheduledJourney', error: null }
        });
    });

    it('entity picker (object) value should be "Account" for scheduled', () => {
        const contextEditor = createComponentForTest(scheduledNewStartElement());
        expect(getEntityResourcePicker(contextEditor).value).toBe('Account');
    });

    it('entity picker (object) value should be "Account" for beforeSave', () => {
        const contextEditor = createComponentForTest(beforeSaveNewStartElement());
        expect(getEntityResourcePicker(contextEditor).value).toBe('Account');
    });

    it('record filter type should be "none" ', () => {
        const contextEditor = createComponentForTest(scheduledNewStartElementWithoutFilters());
        expect(getRecordFilter(contextEditor).filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
    });

    it('record filter type should be "all" ', () => {
        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
        const contextEditor = createComponentForTest(scheduledNewStartElementWithFilters());
        expect(getRecordFilter(contextEditor).filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
    });

    describe('handle events', () => {
        let contextEditor, entityResourcePicker;
        beforeEach(() => {
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
            contextEditor = createComponentForTest(scheduledNewStartElementWithFilters());
        });
        it('handles "entityResourcePicker" value changed event', async () => {
            entityResourcePicker = getEntityResourcePicker(contextEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            await ticks(1);
            expect(entityResourcePicker.value).toBe('guid1');
        });
        it('handle UpdateRecordFilterEvent should update the filter element', async () => {
            const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
            getRecordFilter(contextEditor).dispatchEvent(updateRecordFilterEvent);
            await ticks(1);
            expect(contextEditor.node.filters[0]).toMatchObject(filterElement);
        });
        it('handle AddRecordFilterEvent should add a filter element', async () => {
            const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(contextEditor).dispatchEvent(addRecordFilterEvent);
            await ticks(1);
            expect(contextEditor.node.filters).toHaveLength(2);
        });
        it('handle record filter type Change event', async () => {
            const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(contextEditor).dispatchEvent(recordFilterTypeChangedEvent);
            await ticks(1);
            expect(contextEditor.node.filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
        });
        it('record filter fire DeleteRecordFilterEvent', async () => {
            const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(contextEditor).dispatchEvent(deleteRecordFilterEvent);
            await ticks(1);
            expect(contextEditor.node.filters).toHaveLength(0);
        });
    });

    describe('handle UpdateNodeEvent dispatch', () => {
        let contextEditor;
        beforeEach(() => {
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
            contextEditor = createComponentForTest(scheduledNewStartElementWithFilters());
        });
        it('handle "entityResourcePicker" value changed event should dispatch an UpdateNodeEvent', async () => {
            contextEditor.node = beforeSaveNewStartElement();
            const updateNodeCallback = jest.fn();
            contextEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            getEntityResourcePicker(contextEditor).dispatchEvent(getComboboxStateChangedEvent());
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: contextEditor.node }
                })
            );
        });
        it('handle UpdateRecordFilterEvent should dispatch an UpdateNodeEvent', async () => {
            contextEditor.node = scheduledNewStartElementWithFilters();
            const updateNodeCallback = jest.fn();
            contextEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
            getRecordFilter(contextEditor).dispatchEvent(updateRecordFilterEvent);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: contextEditor.node }
                })
            );
        });
        it('handle AddRecordFilterEvent should dispatch an UpdateNodeEvent', async () => {
            contextEditor.node = scheduledNewStartElementWithoutFilters();
            const updateNodeCallback = jest.fn();
            contextEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            const addRecordFilterEvent = new AddRecordFilterEvent();
            getRecordFilter(contextEditor).dispatchEvent(addRecordFilterEvent);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: contextEditor.node }
                })
            );
        });
        it('handle RecordFilterTypeChangedEvent should dispatch an UpdateNodeEvent', async () => {
            contextEditor.node = scheduledNewStartElementWithFilters();
            const updateNodeCallback = jest.fn();
            contextEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(contextEditor).dispatchEvent(recordFilterTypeChangedEvent);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: contextEditor.node }
                })
            );
        });
        it('handle DeleteRecordFilterEvent should dispatch an UpdateNodeEvent', async () => {
            contextEditor.node = scheduledNewStartElementWithFilters();
            const updateNodeCallback = jest.fn();
            contextEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0);
            getRecordFilter(contextEditor).dispatchEvent(deleteRecordFilterEvent);
            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: contextEditor.node }
                })
            );
        });
    });

    describe('custom property editor', () => {
        let getTriggerMock, contextEditor;
        beforeEach(() => {
            getTriggerMock = jest
                .spyOn(jest.requireActual('builder_platform_interaction/triggerTypeLib'), 'getTriggerTypeInfo')
                .mockImplementation(() => {
                    return Promise.resolve({ configurationEditor: 'cpeComponent' });
                });
            contextEditor = createComponentForTest(scheduledJourneyStartElement());
        });
        afterEach(() => {
            getTriggerMock.mockRestore();
        });
        it('should render the custom property editor component if the trigger supports it', () => {
            expect(getCustomPropertyEditor(contextEditor)).not.toBeNull();
        });
        it('should not render the entity picker if the custom property editor component is rendered', () => {
            expect(getEntityResourcePicker(contextEditor)).toBeNull();
        });
        it('should not render the record filter list if the custom property editor component is rendered', () => {
            expect(getRecordFilter(contextEditor)).toBeNull();
        });
        it('should fire and handle the ConfigurationEditorChangeEvent correctly', async () => {
            const cpeChangeEvent = new ConfigurationEditorChangeEvent('objectContainer', 'foo'); // This is using the numerical rowIndex not the property rowIndex
            getCustomPropertyEditor(contextEditor).dispatchEvent(cpeChangeEvent);
            await ticks(1);
            expect(contextEditor.node.objectContainer.value).toBe('foo');
        });
        it("should validate using the custom property editor component's validate method", () => {
            const mockValidatefunction = jest.fn(() => {
                return ['error1'];
            });
            getCustomPropertyEditor(contextEditor).validate = mockValidatefunction;
            const errors = contextEditor.validate();
            expect(mockValidatefunction).toHaveBeenCalled();
            expect(errors).toContain('error1');
        });
    });
});
