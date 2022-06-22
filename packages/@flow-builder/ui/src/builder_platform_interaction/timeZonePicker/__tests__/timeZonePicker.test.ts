import getDefaultTimeZone from '@salesforce/apex/interaction.FlowBuilderController.getDefaultTimeZone';
import getTimeZones from '@salesforce/apex/interaction.FlowBuilderController.getTimeZones';
import { createComponent, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { LABELS } from '../timeZonePickerLabels';

const setupComponentUnderTest = async (props) =>
    createComponent('builder_platform_interaction-time-zone-picker', props);

const selectors = {
    LIGHTNING_COMBOBOX: 'lightning-combobox'
};

const timeZoneMockData = [
    {
        apiValue: 'Asia/Aden',
        display: '(GMT+03:00) hora estándar de Arabia (Asia/Aden)',
        name: 'Asia/Aden',
        intValue: 286
    },
    {
        apiValue: 'America/Los_Angeles',
        display: '(GMT-07:00) hora de verano del Pacífico (America/Los_Angeles)',
        name: 'America/Los_Angeles',
        intValue: 12
    },
    {
        apiValue: 'Europe/Monaco',
        display: '(GMT+02:00) hora de verano de Europa central (Europe/Monaco)',
        name: 'Europe/Monaco',
        intValue: 370
    }
];

const defaultTimeZone = {
    apiValue: 'America/Los_Angeles',
    display: '(GMT-07:00) hora de verano del Pacífico (America/Los_Angeles)',
    name: 'America/Los_Angeles',
    intValue: 12
};

describe('time-zone-picker', () => {
    it('contains a lightning-combobox to display timezones', async () => {
        const timeZonePicker = await setupComponentUnderTest({});
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox).toBeDefined();
    });

    it('sets the options based on the fetched time zone data', async () => {
        const expectedOptions = [
            { value: 'Asia/Aden', label: '(GMT+03:00) hora estándar de Arabia (Asia/Aden)' },
            { value: 'America/Los_Angeles', label: '(GMT-07:00) hora de verano del Pacífico (America/Los_Angeles)' },
            { value: 'Europe/Monaco', label: '(GMT+02:00) hora de verano de Europa central (Europe/Monaco)' }
        ];
        const timeZonePicker = await setupComponentUnderTest({});
        getTimeZones.emit(timeZoneMockData);
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.options).toEqual(expectedOptions);
    });

    it('sets an empty list of options when it fails to fetch data', async () => {
        const expectedOptions = [];
        const timeZonePicker = await setupComponentUnderTest({});
        getTimeZones.error('some error');
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.options).toEqual(expectedOptions);
    });

    it('sets the initial time zone value on the base component', async () => {
        const expectedValue = 'Europe/Monaco';
        const timeZonePicker = await setupComponentUnderTest({ value: expectedValue });
        getTimeZones.emit(timeZoneMockData);
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.value).toEqual(expectedValue);
    });

    it('dispatches a ValueChangedEvent when a new value is selected', async () => {
        const timeZonePicker = await setupComponentUnderTest({});
        getTimeZones.emit(timeZoneMockData);
        await ticks(1);

        const valueChangedSpy = jest.fn().mockName('valueChangedSpy');
        timeZonePicker.addEventListener(ValueChangedEvent.EVENT_NAME, valueChangedSpy);

        const mockChange = new CustomEvent('change', {
            detail: { value: 'America/Los_Angeles' }
        });
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        baseCombobox.dispatchEvent(mockChange);

        expect(valueChangedSpy).toHaveBeenCalledTimes(1);
    });

    it('sets the label on the base combobox', async () => {
        const timeZonePicker = await setupComponentUnderTest({ value: 'Asia/Aden' });
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.label).toEqual(LABELS.timeZoneLabel);
    });

    it('dispatches a change event with the default time zone api value when the initial value is not set', async () => {
        // purposely not set an itial value
        const timeZonePicker = await setupComponentUnderTest({});

        const valueChangedSpy = jest.fn().mockName('valueChangedSpy');
        timeZonePicker.addEventListener(ValueChangedEvent.EVENT_NAME, valueChangedSpy);

        getDefaultTimeZone.emit(defaultTimeZone);
        await ticks(1);

        expect(valueChangedSpy.mock.calls[0][0].detail.value).toEqual(defaultTimeZone.apiValue);
    });

    it('does not dispatch a change event with the default time zone when the intial value is set', async () => {
        // setting an initial value
        const timeZonePicker = await setupComponentUnderTest({ value: 'Asia/Aden' });

        const valueChangedSpy = jest.fn().mockName('valueChangedSpy');
        timeZonePicker.addEventListener(ValueChangedEvent.EVENT_NAME, valueChangedSpy);

        getDefaultTimeZone.emit(defaultTimeZone);
        await ticks(1);

        expect(valueChangedSpy).not.toHaveBeenCalled();
    });
});
