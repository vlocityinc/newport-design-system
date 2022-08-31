// @ts-nocheck
import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { createElement } from 'lwc';
import { SCHEDULED_PATH_OFFSET_UNIT } from '../../flowMetadata/flowMetadata';
import DurationWaitEditor from '../durationWaitEditor';

function createComponentForTest(durationWaitInfo) {
    const el = createElement('builder_platform_interaction-duration-wait-editor', {
        is: DurationWaitEditor
    });
    Object.assign(el, { durationWaitInfo });
    setDocumentBodyChildren(el);
    return el;
}

const selectors = {
    DURATION_INPUT: 'builder_platform_interaction-counter',
    DURATION_UNIT_INPUT: 'lightning-combobox.durationUnit',
    EXTEND_UNTIL_INPUT: 'lightning-input.extendUntil',
    RESUME_TIME_INPUT: 'lightning-input.resumeTime',
    TIME_ZONE_INPUT: 'builder_platform_interaction-time-zone-picker'
};

const newDurationWait = () => ({
    name: { value: 'theDurationWait', error: null },
    label: { value: 'theDurationWait', error: null },
    description: 'the duration wait description',
    elementType: 'Wait',
    elementSubtype: 'DurationWait',
    guid: 'a-duration-wait-guid',
    isCanvasElement: true,
    supportsBranching: false,
    defaultConnectorLabel: { value: 'Default Path' },
    locationX: 0,
    locationY: 0,
    timeZoneId: 'America/Argentina/Buenos_Aires',
    waitEvents: [
        {
            guid: 'a-wait-event-guid',
            label: 'Pause Configuration 1 of theDurationWait',
            name: 'Pause_Configuration_1_of_theDurationWait',
            duration: 4,
            durationUnit: 'Days',
            conditions: [],
            conditionLogic: { value: 'no_conditions', error: null },
            inputParameters: [],
            outputParameters: {},
            resumeTime: null
        }
    ],
    isNew: true
});

const newDurationWaitWithExtendUntil = () => ({
    name: { value: 'theDurationWait', error: null },
    label: { value: 'theDurationWait', error: null },
    description: 'the duration wait description',
    elementType: 'Wait',
    elementSubtype: 'DurationWait',
    guid: 'a-duration-wait-guid',
    isCanvasElement: true,
    supportsBranching: false,
    defaultConnectorLabel: { value: 'Default Path' },
    locationX: 0,
    locationY: 0,
    timeZoneId: 'America/Argentina/Buenos_Aires',
    waitEvents: [
        {
            guid: 'a-wait-event-guid',
            label: 'Pause Configuration 1 of theDurationWait',
            name: 'Pause_Configuration_1_of_theDurationWait',
            duration: 4,
            durationUnit: 'Days',
            conditions: [],
            conditionLogic: { value: 'no_conditions', error: null },
            inputParameters: [],
            outputParameters: {},
            resumeTime: '12:34:56.789'
        }
    ],
    isNew: true
});

describe('duration-wait-editor', () => {
    let durationWaitEditor;
    const configurationEditorChangeEventSpy = jest.fn().mockName('configurationEditorChangeEventSpy');

    beforeEach(() => {
        durationWaitEditor = createComponentForTest(newDurationWait());
        window.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, configurationEditorChangeEventSpy);
    });

    afterEach(() => {
        window.removeEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, configurationEditorChangeEventSpy);
    });

    it('should contain durationWaitEditor', () => {
        expect(durationWaitEditor).not.toBeNull();
    });

    it('should have duration counter', () => {
        const durationInput = query(durationWaitEditor, selectors.DURATION_INPUT);
        expect(durationInput).not.toBeNull();
    });

    it('should have duration unit combobox', () => {
        const durationUnitInput = query(durationWaitEditor, selectors.DURATION_UNIT_INPUT);
        expect(durationUnitInput).not.toBeNull();
    });

    it('should have extend until checkbox', () => {
        const extendUntilInput = query(durationWaitEditor, selectors.EXTEND_UNTIL_INPUT);
        expect(extendUntilInput).not.toBeNull();
    });

    it('should not have resumeTime picker unless extendUntil checked', () => {
        const resumeTimeInput = query(durationWaitEditor, selectors.RESUME_TIME_INPUT);
        expect(resumeTimeInput).toBeNull();

        const durationWaitEditorWithExtendUntil = createComponentForTest(newDurationWaitWithExtendUntil());
        const resumeTimeInputExtendUntil = query(durationWaitEditorWithExtendUntil, selectors.RESUME_TIME_INPUT);
        expect(resumeTimeInputExtendUntil).not.toBeNull();
    });

    it('should not have timeZone picker unless extendUntil checked', () => {
        const timeZoneInput = query(durationWaitEditor, selectors.TIME_ZONE_INPUT);
        expect(timeZoneInput).toBeNull();

        const durationWaitEditorWithExtendUntil = createComponentForTest(newDurationWaitWithExtendUntil());
        const timeZoneInputExtendUntil = query(durationWaitEditorWithExtendUntil, selectors.TIME_ZONE_INPUT);
        expect(timeZoneInputExtendUntil).not.toBeNull();
    });

    it('should trigger waitEvent changed when duration updated', () => {
        const durationInput = query(durationWaitEditor, selectors.DURATION_INPUT);
        durationInput.dispatchEvent(
            new CustomEvent('valuechanged', {
                detail: { value: '5' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when duration unit updated', () => {
        const durationUnitInput = query(durationWaitEditor, selectors.DURATION_UNIT_INPUT);
        durationUnitInput.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: SCHEDULED_PATH_OFFSET_UNIT.HOURS }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when resumeTime updated', () => {
        const durationWaitEditorWithExtendUntil = createComponentForTest(newDurationWaitWithExtendUntil());
        const resumeTimeInput = query(durationWaitEditorWithExtendUntil, selectors.RESUME_TIME_INPUT);
        resumeTimeInput.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: '00:00:00.000Z' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when timeZone updated', () => {
        const durationWaitEditorWithExtendUntil = createComponentForTest(newDurationWaitWithExtendUntil());
        const timeZoneInput = query(durationWaitEditorWithExtendUntil, selectors.TIME_ZONE_INPUT);
        timeZoneInput.dispatchEvent(
            new CustomEvent('valuechanged', {
                detail: { value: 'America/Argentina/Buenos_Aires' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });
});
