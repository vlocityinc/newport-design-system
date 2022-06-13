import getTimeZones from '@salesforce/apex/interaction.FlowBuilderController.getTimeZones';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { createElement } from 'lwc';
import TimeZonePicker from '../timeZonePicker';
import { LABELS } from '../timeZonePickerLabels';

const setupComponentUnderTest = (...props) => {
    const element = createElement('builder_platform_interaction-time-zone-picker', {
        is: TimeZonePicker
    });
    Object.assign(element, ...props);
    setDocumentBodyChildren(element);
    return element;
};

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

describe('time-zone-picker', () => {
    it('contains a lightning-combobox to display timezones', async () => {
        const timeZonePicker = setupComponentUnderTest({});
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
        const timeZonePicker = setupComponentUnderTest({});
        getTimeZones.emit(timeZoneMockData);
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.options).toEqual(expectedOptions);
    });

    it('sets an empty list of options when it fails to fetch data', async () => {
        const expectedOptions = [];
        const timeZonePicker = setupComponentUnderTest({});
        getTimeZones.error('some error');
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.options).toEqual(expectedOptions);
    });

    it('sets the initial time zone value on the base component', async () => {
        const expectedValue = 'Europe/Monaco';
        const timeZonePicker = setupComponentUnderTest({ value: expectedValue });
        getTimeZones.emit(timeZoneMockData);
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.value).toEqual(expectedValue);
    });

    it('dispatches a ValueChangedEvent when a new value is selected', async () => {
        const timeZonePicker = setupComponentUnderTest({});
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
        const timeZonePicker = setupComponentUnderTest({ value: 'Asia/Aden' });
        await ticks(1);
        const baseCombobox = timeZonePicker.shadowRoot.querySelector(selectors.LIGHTNING_COMBOBOX);
        expect(baseCombobox.label).toEqual(LABELS.timeZoneLabel);
    });
});
