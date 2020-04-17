import platformEventEditor from '../platformEventEditor';
import { createElement } from 'lwc';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getEventTypes } from 'builder_platform_interaction/sobjectLib';
import * as store from 'mock/storeData';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEventTypes: jest.fn(),
        getInputParametersForEventType: jest.fn().mockName('getInputParametersForEventType')
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEventTypesMenuDataManagedSetup: actual.getEventTypesMenuDataManagedSetup
    };
});
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
getEventTypes.mockReturnValue([]);

const SELECTORS = {
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-platform-event-editor', {
        is: platformEventEditor
    });

    Object.assign(el, { node });

    document.body.appendChild(el);
    return el;
}

const getEntityResourcePicker = platformEditor => {
    return platformEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
};

const defaultValueItem = { item: { value: 'guid1', displayText: 'var 1' } };
const getComboboxStateChangedEvent = (detail = defaultValueItem) => {
    return new CustomEvent('comboboxstatechanged', {
        detail
    });
};

const scheduledNewStartElement = event => ({
    description: { value: '', error: null },
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    object: { value: event, error: null },
    objectIndex: { value: 'guid', error: null },
    filterType: {},
    filters: [],
    frequency: undefined,
    startDate: undefined,
    startTime: undefined,
    triggerType: { value: FLOW_TRIGGER_TYPE.PLATFORM_EVENT, error: null }
});

describe('platform-event-editor', () => {
    it('entity picker (object) value should be "BatchApexErrorEvent"', () => {
        const platformEditor = createComponentForTest(scheduledNewStartElement('BatchApexErrorEvent'));
        expect(getEntityResourcePicker(platformEditor).value).toBe('BatchApexErrorEvent');
    });

    it('entity picker (object) value should be null', () => {
        const platformEditor = createComponentForTest(scheduledNewStartElement());
        expect(getEntityResourcePicker(platformEditor).value).toBeUndefined();
    });

    describe('handle events', () => {
        let platformEditor, entityResourcePicker;
        beforeEach(() => {
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
            platformEditor = createComponentForTest(scheduledNewStartElement());
        });

        it('handles "entityResourcePicker" value changed event', async () => {
            entityResourcePicker = getEntityResourcePicker(platformEditor);
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            await ticks(1);
            expect(entityResourcePicker.value).toBe('guid1');
        });
    });
});
