import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_PROPS } from 'builder_platform_interaction/limitRepetitionsLib';
import { LABELS } from '../limitRepetitionSettingsLabels';

/**
 * Executing jest test｀
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/limitRepetitionSettings/__tests__/limitRepetitionSettings.test.ts
 */

const DEFAULT_OPTIONS = {
    maxReaction: 1,
    lookBackDays: 90,
    reactionType: 'ALL'
};

const createComponentUnderTest = async (overrideOptions?) =>
    createComponent(INTERACTION_COMPONENTS_SELECTORS.LIMIT_REPETITION_SETTINGS, DEFAULT_OPTIONS, overrideOptions);

const getInputFields = (settingsComponent) => {
    return settingsComponent.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
};

const getComboboxFields = (settingsComponent) => {
    return settingsComponent.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX);
};

describe('Limit Repetition Settings Component', () => {
    describe('component initialize', () => {
        let component;

        beforeEach(async () => {
            component = await createComponentUnderTest();
        });

        it('should render the settings component', () => {
            expect(component).toBeDefined();
        });

        it('should render all input fields', () => {
            const inputFields = getInputFields(component);
            expect(inputFields).toBeDefined();
            expect(inputFields).toHaveLength(2);
        });

        it('should render maxReaction input field', () => {
            const inputFields = getInputFields(component);
            expect(inputFields[0].name).toEqual(ELEMENT_PROPS.maxReaction.name);
            expect(inputFields[0].label).toEqual(LABELS.maxReaction);
        });

        it('should render lookBackDays input field', () => {
            const inputFields = getInputFields(component);
            expect(inputFields[1].name).toEqual(ELEMENT_PROPS.lookBackDays.name);
            expect(inputFields[1].label).toEqual(LABELS.lookBackDays);
        });

        it('should render reactionType combobox field', async () => {
            const comboboxFields = getComboboxFields(component);
            expect(comboboxFields).toBeDefined();
            expect(comboboxFields).toHaveLength(1);
            expect(comboboxFields[0].name).toEqual(ELEMENT_PROPS.reactionType.name);
            expect(comboboxFields[0].label).toEqual(LABELS.reactionType);
        });
    });

    describe('handle input value changes', () => {
        let component;

        beforeEach(async () => {
            component = await createComponentUnderTest();
        });

        it('should handle reactionType changes', async () => {
            const comboboxFields = await getComboboxFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            comboboxFields[0].value = 'REJECTED';
            comboboxFields[0].dispatchEvent(new Event('change'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 'REJECTED',
                    propertyName: ELEMENT_PROPS.reactionType.name,
                    error: null
                })
            );
        });

        it('should handle maxReaction value change', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[0].value = 3;
            inputFields[0].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 3,
                    propertyName: ELEMENT_PROPS.maxReaction.name,
                    error: null
                })
            );
        });

        it('should not update maxReaction with an invalid value', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[0].value = 'abc';
            inputFields[0].dispatchEvent(new Event('blur'));

            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('should handle lookBackDays value change', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[1].value = 60;
            inputFields[1].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 60,
                    propertyName: ELEMENT_PROPS.lookBackDays.name,
                    error: null
                })
            );
        });

        it('should not update lookBackDays with an invalid value', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[1].value = 'abc';
            inputFields[1].dispatchEvent(new Event('blur'));

            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
});
