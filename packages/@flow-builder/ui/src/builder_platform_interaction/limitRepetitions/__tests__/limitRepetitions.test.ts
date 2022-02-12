import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import LimitRepetitions from 'builder_platform_interaction/limitRepetitions';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';

/**
 * Executing jest test
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/limitRepetitions/__tests__/limitRepetitions.test.ts
 */

jest.mock('builder_platform_interaction/processTypeLib');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const initInputVaraibles = [
    { name: 'trackingID', value: '', valueDataType: '' },
    { name: 'inputOffers', value: '', valueDataType: '' },
    { name: 'lookBackDays', value: '', valueDataType: '' },
    { name: 'maxReaction', value: '', valueDataType: '' },
    { name: 'reactionType', value: '', valueDataType: '' }
];

const createComponentUnderTest = ({ inputVariables = initInputVaraibles } = {}) => {
    const element = createElement('builder_platform_interaction-limit-repetititons', {
        is: LimitRepetitions
    });
    Object.assign(element, { inputVariables });
    setDocumentBodyChildren(element);
    return element;
};

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

describe('limit repetitions component', () => {
    let limitRepetitions;
    let inputCollection;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        isLookupTraversalSupported.mockImplementation(() => true);
    });
    afterAll(() => {
        Store.resetStore();
    });

    beforeEach(() => {
        limitRepetitions = createComponentUnderTest();
        inputCollection = getInputCollection(limitRepetitions);
    });

    it('should display Limit Repetition Editor', () => {
        expect(limitRepetitions).not.toBeNull();
    });

    it('should display input collection resource combobox', () => {
        expect(inputCollection).not.toBeNull();
    });

    it('should have empty value with input collection resource combobox', () => {
        const ferovResourcePicker = getFerovResourcePicker(inputCollection);
        expect(ferovResourcePicker.value).toEqual('');
    });
});
