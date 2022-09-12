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
    OFFSET_INPUT: 'builder_platform_interaction-counter',
    OFFSET_UNIT_INPUT: 'lightning-combobox.offsetUnit',
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
            conditions: [],
            conditionLogic: { value: 'no_conditions', error: null },
            inputParameters: [],
            offset: 4,
            offsetUnit: 'Days',
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
            conditions: [],
            conditionLogic: { value: 'no_conditions', error: null },
            inputParameters: [],
            offset: 4,
            offsetUnit: 'Days',
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

    it('should have offset counter', () => {
        const offsetInput = query(durationWaitEditor, selectors.OFFSET_INPUT);
        expect(offsetInput).not.toBeNull();
    });

    it('should have offset unit combobox', () => {
        const offsetUnitInput = query(durationWaitEditor, selectors.OFFSET_UNIT_INPUT);
        expect(offsetUnitInput).not.toBeNull();
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

    it('should trigger waitEvent changed when offset updated', () => {
        const offsetInput = query(durationWaitEditor, selectors.OFFSET_INPUT);
        offsetInput.dispatchEvent(
            new CustomEvent('valuechanged', {
                detail: { value: '5' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when offset unit updated', () => {
        const offsetUnitInput = query(durationWaitEditor, selectors.OFFSET_UNIT_INPUT);
        offsetUnitInput.dispatchEvent(
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
