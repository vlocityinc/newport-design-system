export type EventType = string;
export interface PubSubEvent {
    eventType: EventType;
    payload: { [key: string]: any };
}

export const Unsubscribe = jest.fn();

const mockSubscribeToEvent = jest.fn(() => {
    return Unsubscribe;
});
const mockPublishEvent = jest.fn();

export class SimplePubSub {
    subscribeToEvent = mockSubscribeToEvent;
    publishEvent = mockPublishEvent;
}
