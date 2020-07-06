// @ts-nocheck
import { pubSub } from '../pubSub';
import { SimplePubSub, EventType, PubSubEvent, Unsubscribe } from 'builder_framework/pubSub';

describe('pub sub', () => {
    const simplePubSub = new SimplePubSub();
    it('multiple subscriptions to 1 event', () => {
        expect.assertions(6);
        const eventType1: EventType = 'test1';
        const testFunc1 = jest.fn();
        const testFunc2 = jest.fn();
        pubSub.subscribe(eventType1, testFunc1);
        pubSub.subscribe(eventType1, testFunc2);
        expect(simplePubSub.subscribeToEvent.mock.calls[0][0]).toBe(eventType1);
        expect(simplePubSub.subscribeToEvent.mock.calls[0][1]).toBe(testFunc1);
        expect(simplePubSub.subscribeToEvent.mock.results[0].value).toBe(Unsubscribe);
        expect(simplePubSub.subscribeToEvent.mock.calls[1][0]).toBe(eventType1);
        expect(simplePubSub.subscribeToEvent.mock.calls[1][1]).toBe(testFunc2);
        expect(simplePubSub.subscribeToEvent.mock.results[1].value).toBe(Unsubscribe);
    });
    it('multiple subscriptions and publish events', () => {
        expect.assertions(9);
        const eventType1: EventType = 'test1';
        const eventType2: EventType = 'test2';
        const testFunc1 = jest.fn();
        const testFunc2 = jest.fn();
        pubSub.subscribe(eventType1, testFunc1);
        pubSub.subscribe(eventType2, testFunc2);
        expect(simplePubSub.subscribeToEvent.mock.calls[0][0]).toBe(eventType1);
        expect(simplePubSub.subscribeToEvent.mock.calls[0][1]).toBe(testFunc1);
        expect(simplePubSub.subscribeToEvent.mock.results[0].value).toBe(Unsubscribe);
        expect(simplePubSub.subscribeToEvent.mock.calls[1][0]).toBe(eventType2);
        expect(simplePubSub.subscribeToEvent.mock.calls[1][1]).toBe(testFunc2);
        expect(simplePubSub.subscribeToEvent.mock.results[1].value).toBe(Unsubscribe);
        const payload1 = { id: '45' };
        const payload2 = { hello: 'test' };
        pubSub.publish(eventType1, payload1);
        const pubSubEvent1: PubSubEvent = {
            eventType: eventType1,
            payload: payload1
        };
        const pubSubEvent2: PubSubEvent = {
            eventType: eventType1,
            payload: payload2
        };
        const pubSubEvent3: PubSubEvent = {
            eventType: eventType2,
            payload: payload2
        };
        expect(simplePubSub.publishEvent).toHaveBeenCalledWith(pubSubEvent1);
        pubSub.publish(eventType1, payload2);
        expect(simplePubSub.publishEvent).toHaveBeenCalledWith(pubSubEvent2);
        pubSub.publish(eventType2, payload2);
        expect(simplePubSub.publishEvent).toHaveBeenCalledWith(pubSubEvent3);
    });
});
