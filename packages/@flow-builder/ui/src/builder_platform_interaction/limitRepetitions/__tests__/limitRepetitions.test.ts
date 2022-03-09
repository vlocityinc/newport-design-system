import { createComponent, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import {
    CollectionReferenceChangedEvent,
    ConfigurationEditorChangeEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { ELEMENT_PROPS } from 'builder_platform_interaction/limitRepetitionsLib';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';

/**
 * Executing jest test
 * yarn jest packages/@flow-builder/ui/src/builder_platform_interaction/limitRepetitions/__tests__/limitRepetitions.test.ts
 */

jest.mock('builder_platform_interaction/processTypeLib');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const DEFAULT_OPTIONS = {
    inputVariables: [
        { name: 'recordId', value: '', valueDataType: '' },
        { name: 'inputRecommendations', value: '', valueDataType: '' },
        { name: 'withinDays', value: '', valueDataType: '' },
        { name: 'maxResponses', value: '', valueDataType: '' },
        { name: 'responseTypeToLimit', value: '', valueDataType: '' }
    ]
};

const createComponentUnderTest = async (overrideOptions?) =>
    createComponent(INTERACTION_COMPONENTS_SELECTORS.LIMIT_REPETITIONS, DEFAULT_OPTIONS, overrideOptions);

const getInputCollection = (limitRepetitions) =>
    limitRepetitions.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.INPUT_COLLECTION);

const getFerovResourcePicker = (inputCollection) =>
    inputCollection.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);

const getBaseResourcePicker = (ferovResourcePicker) =>
    ferovResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER);

const getCombobox = (inputCollection) => {
    const baseResourcePicker = getBaseResourcePicker(getFerovResourcePicker(inputCollection));
    return new ComboboxTestComponent(
        baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX)
    );
};

const getReactionSettingsCmp = (limitRepetitionCmp) =>
    limitRepetitionCmp.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LIMIT_REPETITION_SETTINGS);

describe('limit repetitions component', () => {
    let limitRepetitionCmp;
    let inputCollection;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        isLookupTraversalSupported.mockImplementation(() => true);
    });

    afterAll(() => {
        Store.resetStore();
    });

    describe('Component Init', () => {
        beforeEach(async () => {
            limitRepetitionCmp = await createComponentUnderTest();
            inputCollection = await getInputCollection(limitRepetitionCmp);
        });

        it('should display Limit Repetition Editor', () => {
            expect(limitRepetitionCmp).not.toBeNull();
        });

        it('should display input collection resource combobox', () => {
            expect(inputCollection).not.toBeNull();
        });

        it('should have empty value with input collection resource combobox', () => {
            const ferovResourcePicker = getFerovResourcePicker(inputCollection);
            expect(ferovResourcePicker.value).toEqual('');
        });
    });

    describe('handle event changes', () => {
        let limitRepetitionCmp;
        let reactionSettingsCmp;

        const optionsOverride = {
            inputVariables: [
                { name: 'recordId', value: 'recordId', valueDataType: 'reference' },
                { name: 'inputRecommendations', value: 'getRecs', valueDataType: 'reference' },
                { name: 'withinDays', value: '60', valueDataType: 'Number' },
                { name: 'maxResponses', value: '5', valueDataType: 'Number' },
                { name: 'responseTypeToLimit', value: 'ACCEPTED', valueDataType: 'String' }
            ]
        };

        beforeEach(async () => {
            limitRepetitionCmp = await createComponentUnderTest(optionsOverride);
            reactionSettingsCmp = await getReactionSettingsCmp(limitRepetitionCmp);
            inputCollection = await getInputCollection(limitRepetitionCmp);
        });

        it('should update input collection reference', () => {
            const valueChangedEvent = new CollectionReferenceChangedEvent('test-12345', null);
            const eventCallback = jest.fn();

            limitRepetitionCmp.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, eventCallback);
            inputCollection.dispatchEvent(valueChangedEvent);

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                name: ELEMENT_PROPS.inputRecommendations.name,
                newValue: 'test-12345',
                newValueDataType: ELEMENT_PROPS.inputRecommendations.dataType
            });
        });

        it('should update responseTypeToLimit field with a new selection', () => {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.responseTypeToLimit.name, 'REJECTED');
            const eventCallback = jest.fn();

            limitRepetitionCmp.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, eventCallback);
            reactionSettingsCmp.dispatchEvent(event);

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                name: ELEMENT_PROPS.responseTypeToLimit.name,
                newValue: 'REJECTED',
                newValueDataType: ELEMENT_PROPS.responseTypeToLimit.dataType
            });
        });

        it('should update maxResponses field with a new value', () => {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.maxResponses.name, 3);
            const eventCallback = jest.fn();

            limitRepetitionCmp.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, eventCallback);
            reactionSettingsCmp.dispatchEvent(event);

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                name: ELEMENT_PROPS.maxResponses.name,
                newValue: 3,
                newValueDataType: ELEMENT_PROPS.maxResponses.dataType
            });
        });

        it('should update withinDays field with a new value', () => {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.withinDays.name, 60);
            const eventCallback = jest.fn();

            limitRepetitionCmp.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, eventCallback);
            reactionSettingsCmp.dispatchEvent(event);

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                name: ELEMENT_PROPS.withinDays.name,
                newValue: 60,
                newValueDataType: ELEMENT_PROPS.withinDays.dataType
            });
        });
    });
});
