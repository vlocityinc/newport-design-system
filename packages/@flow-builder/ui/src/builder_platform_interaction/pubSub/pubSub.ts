// @ts-nocheck
import { PubSub, SimplePubSub, PubSubEvent, Unsubscribe } from 'builder_framework/pub-sub';
import { AlertErrorHandler } from 'builder_framework/error-handler';
import { InstrumentationServiceImpl } from 'builder_framework/instrumentation';

export class FlowPubSub {
    private static pubSub: PubSub;

    constructor() {
        const instrumentationService = new InstrumentationServiceImpl();
        const errorHandler = new AlertErrorHandler();
        this.pubSub = new SimplePubSub(instrumentationService, errorHandler);
    }

    publish(eventType: string, payload: { [key: string]: any }): void {
        const pubSubEvent: PubSubEvent = {
            eventType,
            payload
        };
        this.pubSub.publishEvent(pubSubEvent);
    }

    subscribe(eventType: string, callback: [(event: PubSubEvent) => void]): Unsubscribe {
        return this.pubSub.subscribeToEvent(eventType, callback);
    }
}

export const pubSub: FlowPubSub = new FlowPubSub();
