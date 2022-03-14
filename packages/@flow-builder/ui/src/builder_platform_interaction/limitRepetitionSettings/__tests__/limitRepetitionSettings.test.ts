import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { DEFAULT_INPUT_VALUE, ELEMENT_PROPS } from 'builder_platform_interaction/limitRepetitionsLib';
import { LABELS } from '../limitRepetitionSettingsLabels';

/**
 * Executing jest test｀
 * yarn jest packages/@flow-builder/ui/src/builder_platform_interaction/limitRepetitionSettings/__tests__/limitRepetitionSettings.test.ts
 */

const createComponentUnderTest = async (overrideOptions?) =>
    createComponent(INTERACTION_COMPONENTS_SELECTORS.LIMIT_REPETITION_SETTINGS, DEFAULT_INPUT_VALUE, overrideOptions);

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

        it('should render maxResponses input field', () => {
            const inputFields = getInputFields(component);
            expect(inputFields[0].name).toEqual(ELEMENT_PROPS.maxResponses.name);
            expect(inputFields[0].label).toEqual(LABELS.maxResponses);
        });

        it('should render withinDays input field', () => {
            const inputFields = getInputFields(component);
            expect(inputFields[1].name).toEqual(ELEMENT_PROPS.withinDays.name);
            expect(inputFields[1].label).toEqual(LABELS.withinDays);
        });

        it('should render responseTypeToLimit combobox field', () => {
            const comboboxFields = getComboboxFields(component);
            expect(comboboxFields).toBeDefined();
            expect(comboboxFields).toHaveLength(1);
            expect(comboboxFields[0].name).toEqual(ELEMENT_PROPS.responseTypeToLimit.name);
            expect(comboboxFields[0].label).toEqual(LABELS.responseTypeToLimit);
        });

        it('contains correct options in responseTypeToLimit', () => {
            const responseTypeCombobox = getComboboxFields(component)[0];
            expect(responseTypeCombobox.options).toHaveLength(3);
            expect(responseTypeCombobox.options[0].label).toBe('LimitRepetitions.acceptedOrRejected');
            expect(responseTypeCombobox.options[1].label).toBe('LimitRepetitions.accepted');
            expect(responseTypeCombobox.options[2].label).toBe('LimitRepetitions.rejected');
        });
    });

    describe('handle input value changes', () => {
        let component;

        beforeEach(async () => {
            component = await createComponentUnderTest();
        });

        it('should handle responseTypeToLimit changes', async () => {
            const comboboxFields = await getComboboxFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            comboboxFields[0].value = 'REJECTED';
            comboboxFields[0].dispatchEvent(new Event('change'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 'REJECTED',
                    propertyName: ELEMENT_PROPS.responseTypeToLimit.name,
                    error: null
                })
            );
        });

        it('should handle maxResponses value change', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[0].value = 3;
            inputFields[0].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 3,
                    propertyName: ELEMENT_PROPS.maxResponses.name,
                    error: null
                })
            );
        });

        it('should not update maxResponses with an invalid value', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[0].value = 'abc';
            inputFields[0].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
        });

        it('should handle withinDays value change', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[1].value = 60;
            inputFields[1].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual(
                expect.objectContaining({
                    value: 60,
                    propertyName: ELEMENT_PROPS.withinDays.name,
                    error: null
                })
            );
        });

        it('should not update withinDays with an invalid value', async () => {
            const inputFields = await getInputFields(component);
            const eventCallback = jest.fn();

            component.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputFields[1].value = 'abc';
            inputFields[1].dispatchEvent(new Event('blur'));

            expect(eventCallback).toHaveBeenCalled();
        });
    });
});
