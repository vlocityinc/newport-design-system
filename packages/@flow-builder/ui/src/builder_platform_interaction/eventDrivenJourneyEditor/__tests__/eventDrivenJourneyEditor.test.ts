import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createElement } from 'lwc';
import eventDrivenJourneyEditor from '../eventDrivenJourneyEditor';
const SELECTORS = {
    INPUT: 'lightning-input',
    JOURNEY: 'builder_platform_interaction-event-driven-journey-editor'
};

function createComponentForTest(node) {
    const el = createElement(SELECTORS.JOURNEY, {
        is: eventDrivenJourneyEditor
    });
    Object.assign(el, { node });
    setDocumentBodyChildren(el);
    return el;
}

const objectStartElement = () => ({
    description: { value: '', error: null },
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    object: { value: 'Account', error: null },
    triggerType: { value: FLOW_TRIGGER_TYPE.EVENT_DRIVEN_JOURNEY, error: null }
});

describe('Event journey component', () => {
    let startElement;
    beforeEach(() => {
        startElement = objectStartElement();
    });
    it('type should be text, required field and Account value', async () => {
        await ticks(1);
        const eventJourney = createComponentForTest(startElement);
        const input = eventJourney.shadowRoot.querySelector(SELECTORS.INPUT);
        expect(input.type).toEqual('text');
        expect(input.value).toEqual('Account');
        expect(input.required).toBeTruthy();
    });
});
