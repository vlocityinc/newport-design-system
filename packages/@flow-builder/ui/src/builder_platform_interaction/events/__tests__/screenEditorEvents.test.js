import { createScreenNodeSelectedEvent } from 'builder_platform_interaction/events';

describe('Screen Editor Event', () => {
    describe('Constructor', () => {
        it('should create an event with a getter returning the property value', () => {
            const evt = createScreenNodeSelectedEvent({
                key1: 'value1',
                key2: 'value2'
            });
            expect(evt.screenElement.key1).toBe('value1');
            expect(evt.screenElement.key2).toBe('value2');
        });
    });
});
