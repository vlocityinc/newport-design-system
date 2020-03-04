import { createElement } from 'lwc';

import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    RecordFilterTypeChangedEvent
} from 'builder_platform_interaction/events';
import StartEditor from '../contextRecordEditor';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import * as store from 'mock/storeData';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/contextLib', () => {
    return { orgHasBeforeSaveEnabled: jest.fn() };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = require.requireActual('builder_platform_interaction/expressionUtils');
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
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    SECHEDULE_SECTION: '.scheduleSection',
    SAVE_TYPE_SECTION: 'lightning-radio-group.recordCreateOrUpdate',
    TRIGGER_TYPE_INPUT: 'lightning-radio-group.triggerType',
    START_DATE_INPUT: 'lightning-input.startDate',
    START_TIME_INPUT: 'lightning-input.startTime',
    FREQUENCY_INPUT: 'lightning-combobox.frequency',
    RECORD_FILTER: 'builder_platform_interaction-record-filter'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-start-editor', {
        is: StartEditor
    });

    Object.assign(el, { node });

    document.body.appendChild(el);
    return el;
}

const getEntityResourcePicker = startEditor => {
    return startEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
};

const getRecordFilter = startEditor => {
    return startEditor.shadowRoot.querySelector(SELECTORS.RECORD_FILTER);
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

const scheduledNewStartElement = () => ({
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

const beforeSaveNewStartElement = () => ({
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

const scheduledNewStartElementWithFilters = () => ({
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

const scheduledNewStartElementWithoutFilters = () => ({
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

describe('start-editor', () => {
    it('entity picker (object) value should be "Account" for scheduled', () => {
        const startElement = createComponentForTest(scheduledNewStartElement());
        expect(getEntityResourcePicker(startElement).value).toBe('Account');
    });

    it('entity picker (object) value should be "Account" for beforeSave', () => {
        const startElement = createComponentForTest(beforeSaveNewStartElement());
        expect(getEntityResourcePicker(startElement).value).toBe('Account');
    });

    it('record filter type should be "none" ', () => {
        const startElement = createComponentForTest(scheduledNewStartElementWithoutFilters());
        expect(getRecordFilter(startElement).filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
    });

    it('record filter type should be "all" ', () => {
        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
        const startElement = createComponentForTest(scheduledNewStartElementWithFilters());
        expect(getRecordFilter(startElement).filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
    });

    describe('handle events', () => {
        let startElement, entityResourcePicker;
        beforeEach(() => {
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
            startElement = createComponentForTest(scheduledNewStartElementWithFilters());
        });
        it('handles "entityResourcePicker" value changed event', async () => {
            entityResourcePicker = getEntityResourcePicker(startElement);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            await ticks(1);
            expect(entityResourcePicker.value).toBe('guid1');
        });
        it('handle UpdateRecordFilterEvent should update the filter element', async () => {
            const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
            getRecordFilter(startElement).dispatchEvent(updateRecordFilterEvent);
            await ticks(1);
            expect(startElement.node.filters[0]).toMatchObject(filterElement);
        });
        it('handle AddRecordFilterEvent should add a filter element', async () => {
            const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(startElement).dispatchEvent(addRecordFilterEvent);
            await ticks(1);
            expect(startElement.node.filters).toHaveLength(2);
        });
        it('handle record filter type Change event', async () => {
            const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(RECORD_FILTER_CRITERIA.ALL);
            getRecordFilter(startElement).dispatchEvent(recordFilterTypeChangedEvent);
            await ticks(1);
            expect(startElement.node.filterType).toBe(RECORD_FILTER_CRITERIA.ALL);
        });
        it('record filter fire DeleteRecordFilterEvent', async () => {
            const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(startElement).dispatchEvent(deleteRecordFilterEvent);
            await ticks(1);
            expect(startElement.node.filters).toHaveLength(0);
        });
    });
});
