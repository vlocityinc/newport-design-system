// @ts-nocheck
import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { createElement } from 'lwc';
import DateWaitEditor from '../dateWaitEditor';

function createComponentForTest(dateWaitInfo) {
    const el = createElement('builder_platform_interaction-date-wait-editor', {
        is: DateWaitEditor
    });
    Object.assign(el, { dateWaitInfo });
    setDocumentBodyChildren(el);
    return el;
}

const selectors = {
    RESUME_DATE_INPUT: 'lightning-input.resumeDate',
    RESUME_TIME_INPUT: 'lightning-input.resumeTime',
    TIME_ZONE_INPUT: 'builder_platform_interaction-time-zone-picker'
};

const newDateWait = () => ({
    name: { value: 'dateWait123', error: null },
    label: { value: 'dateWait123', error: null },
    description: 'the date wait description',
    elementType: 'Wait',
    elementSubtype: 'DateWait',
    guid: 'f5d62829-c0cf-4116-855f-89c5e53a3985',
    isCanvasElement: true,
    supportsBranching: false,
    defaultConnectorLabel: { value: 'Default Path' },
    locationX: 0,
    locationY: 0,
    timeZoneId: 'America/Argentina/Buenos_Aires',
    waitEvents: [
        {
            guid: '20fa0760-8012-479a-ac56-43f11fcef7d7',
            label: 'Pause Configuration 1 of dateWait123',
            name: 'Pause_Configuration_1_of_dateWait123',
            conditions: [],
            conditionLogic: { value: 'no_conditions', error: null },
            inputParameters: [],
            outputParameters: {},
            resumeDate: '2022-08-26',
            resumeTime: '01:00:00.000'
        }
    ],
    isNew: true
});

describe('date-wait-editor', () => {
    let dateWaitEditor;
    const configurationEditorChangeEventSpy = jest.fn().mockName('configurationEditorChangeEventSpy');

    beforeEach(() => {
        dateWaitEditor = createComponentForTest(newDateWait());
        window.addEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, configurationEditorChangeEventSpy);
    });

    afterEach(() => {
        window.removeEventListener(ConfigurationEditorChangeEvent.EVENT_NAME, configurationEditorChangeEventSpy);
    });

    it('should contain dateWaitEditor', () => {
        expect(dateWaitEditor).not.toBeNull();
    });

    it('should have resumeDate picker', () => {
        const resumeDateInput = query(dateWaitEditor, selectors.RESUME_DATE_INPUT);
        expect(resumeDateInput).not.toBeNull();
    });

    it('should have resumeTime picker', () => {
        const resumeTimeInput = query(dateWaitEditor, selectors.RESUME_TIME_INPUT);
        expect(resumeTimeInput).not.toBeNull();
    });

    it('should have timeZone picker', () => {
        const timeZoneInput = query(dateWaitEditor, selectors.TIME_ZONE_INPUT);
        expect(timeZoneInput).not.toBeNull();
    });

    it('should trigger waitEvent changed when resumeDate updated', () => {
        const resumeDateInput = query(dateWaitEditor, selectors.RESUME_DATE_INPUT);
        resumeDateInput.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: '2022-08-30' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when resumeTime updated', () => {
        const resumeTimeInput = query(dateWaitEditor, selectors.RESUME_TIME_INPUT);
        resumeTimeInput.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: '00:00:00.000Z' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });

    it('should trigger waitEvent changed when timeZone updated', () => {
        const timeZoneInput = query(dateWaitEditor, selectors.TIME_ZONE_INPUT);
        timeZoneInput.dispatchEvent(
            new CustomEvent('valuechanged', {
                detail: { value: 'America/Argentina/Buenos_Aires' }
            })
        );
        expect(configurationEditorChangeEventSpy).toHaveBeenCalled();
    });
});
